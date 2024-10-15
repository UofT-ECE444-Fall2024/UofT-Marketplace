from flask import jsonify, current_app


@current_app.route('/')
def home():
    return jsonify({"message": "Hello World!"})
