def register_socket_routes(socketio):
    from .stock_socket import register_stock_socket
    register_stock_socket(socketio)
