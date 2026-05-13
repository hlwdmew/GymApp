import sys
import os

# Добавляем текущую директорию в пути поиска Python
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

try:
    from app import create_app
    print("Успех! Модуль найден.")
    
    # Если нашел, давай сразу попробуем запустить
    import webview
    import threading

    app = create_app()
    def run():
        app.run(port=5000, debug=False, use_reloader=False)

    t = threading.Thread(target=run, daemon=True)
    t.start()
    
    webview.create_window('FITCORE CRM', 'http://127.0.0.1:5000', width=1200, height=800)
    webview.start()

except ImportError as e:
    print(f"Ошибка всё еще тут: {e}")
    print(f"Пути поиска Python: {sys.path[:3]}") # Покажет, где он ищет