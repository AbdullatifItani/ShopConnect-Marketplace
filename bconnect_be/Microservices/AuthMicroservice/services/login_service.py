from flask import request, abort, jsonify
from ..helper_functions import create_token
from ..model.auth import Auth
import cryptography

def login(bcrypt):
    try:
        if "username" not in request.json or "password" not in request.json:
            abort(400)

        username = request.json["username"]
        password = request.json["password"]

        user = Auth.query.filter_by(username=username).first()
        if not user:
            return jsonify({"message":"Incorrect Username or Password"}), 403

        if not bcrypt.check_password_hash(user.hashed_password, password):
            return jsonify({"message":"Incorrect Username or Password"}), 403
        
        token = create_token(user.id)
        
        return jsonify({"token": token, "user_id": user.id}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400