from ..helper_functions import extract_auth_token, decode_token
from flask import abort, request, jsonify
from ..model.auth import Auth

def validate_token():
    try:
        token = extract_auth_token(request)
        
        if not token or token == "null":
            return jsonify({"message":"No Token Provided"}), 400
        user_id = decode_token(token)
        user = Auth.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({"message":"Invalid Token"}), 403

        username = user.username
        return jsonify({"user_id": user_id}), 200
    except Exception as e:
        return jsonify({"message": "Invalid Token"}), 403