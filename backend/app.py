from src import create_app, socketio

app = create_app()

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5001, debug=True, async_mode='eventlet')
