import webview
import threading
import time
import sys
from app import create_app

app = create_app()

def start_server():
    # Запускаем сервер Flask
    app.run(host='127.0.0.1', port=5000, debug=False, use_reloader=False)

if __name__ == '__main__':
    # Запуск сервера в отдельном потоке
    t = threading.Thread(target=start_server, daemon=True)
    t.start()

    # Ждем чуть дольше, чтобы сервер успел подняться
    time.sleep(3)

    # Запускаем окно приложения
    # debug=True позволит тебе нажать правой кнопкой в окне и выбрать "Inspect" (Исследовать)
    window = webview.create_window('FITCORE CRM', 'http://127.0.0.1:5000', 
                          width=1200, height=800, background_color='#050505')
    webview.start(debug=True)