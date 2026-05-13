import os
from flask import Flask, render_template, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

def create_app():
    app_path = os.path.dirname(os.path.abspath(__file__))
    app = Flask(__name__, 
                template_folder=os.path.join(app_path, 'templates'),
                static_folder=os.path.join(app_path, 'static'))
    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(app_path, '..', 'fitness.db')
    app.config['SECRET_KEY'] = 'fitcore-final-key'
    db.init_app(app)

    with app.app_context():
        from . import models
        db.create_all()
        if not models.User.query.filter_by(username='admin').first():
            admin = models.User(username='admin', password=generate_password_hash('admin123'), role='admin')
            db.session.add(admin)
            db.session.commit()

    @app.route('/')
    def index(): return render_template('index.html')

    @app.route('/register', methods=['POST'])
    def register():
        data = request.json
        from .models import User
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'status': 'error', 'msg': 'Логин занят'})
        db.session.add(User(username=data['username'], password=generate_password_hash(data['password'])))
        db.session.commit()
        return jsonify({'status': 'success'})

    @app.route('/login', methods=['POST'])
    def login():
        data = request.json
        from .models import User
        user = User.query.filter_by(username=data['username']).first()
        if user and check_password_hash(user.password, data['password']):
            session['user_id'] = user.id
            session['role'] = user.role
            return jsonify({'status': 'success'})
        return jsonify({'status': 'error', 'msg': 'Ошибка входа'})

    @app.route('/get_data')
    def get_data():
        if 'user_id' not in session: return jsonify({'status': 'unauthorized'})
        from .models import User, News, Workout
        user = User.query.get(session['user_id'])
        return jsonify({
            'username': user.username, 'role': user.role, 'visits': user.visits,
            'news': [{'title': n.title, 'text': n.text} for n in News.query.all()],
            'workouts': [{'title': w.title, 'time': w.time, 'trainer': w.trainer, 'day': w.day} for w in Workout.query.all()]
        })

    @app.route('/get_users')
    def get_users():
        if session.get('role') != 'admin': return jsonify({'status': 'error'}), 403
        from .models import User
        return jsonify([{'id': u.id, 'username': u.username, 'visits': u.visits} for u in User.query.filter_by(role='user').all()])

    @app.route('/add_visit/<int:user_id>', methods=['POST'])
    def add_visit(user_id):
        if session.get('role') != 'admin': return jsonify({'status': 'error'}), 403
        from .models import User
        u = User.query.get(user_id)
        if u: u.visits += 1; db.session.commit(); return jsonify({'status': 'success'})
        return jsonify({'status': 'error'}), 404

    @app.route('/add_workout', methods=['POST'])
    def add_workout():
        if session.get('role') != 'admin': return jsonify({'status': 'error'}), 403
        data = request.json
        from .models import Workout
        db.session.add(Workout(title=data['title'], time=data['time'], trainer=data['trainer'], day=data['day']))
        db.session.commit(); return jsonify({'status': 'success'})

    @app.route('/add_news', methods=['POST'])
    def add_news():
        if session.get('role') != 'admin': return jsonify({'status': 'error'}), 403
        data = request.json
        from .models import News
        db.session.add(News(title=data['title'], text=data['text']))
        db.session.commit(); return jsonify({'status': 'success'})

    @app.route('/logout')
    def logout(): session.clear(); return jsonify({'status': 'success'})

    return app