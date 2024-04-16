from flask import request, abort, jsonify
from ..helper_functions import extract_auth_token, decode_token
from ..model.auth import Auth, auth_schema
import datetime

def reset_pass(db, bcrypt):
    body = request.json
    try:
        token = extract_auth_token(request)
        if not token or token == "null":
            return jsonify({"message":"No Token Provided"}), 400
        user_id, exp, reset = decode_token(token)
        
        user = Auth.query.filter_by(id=user_id).first()
        if not (user and reset) or datetime.datetime.utcnow().timestamp() >= exp:
            return jsonify({"message":"Invalid Token"}), 403
        
    except Exception as e:
        return jsonify({"message":"Invalid Token"}), 403
    
    password = body["password"]

    try:
        user.hashed_password = bcrypt.generate_password_hash(password)
        db.session.commit()
    except:
        return jsonify({"message":"Internal Server Error"}), 500
    
    return jsonify({"message":"Password was reset successfully"}), 200