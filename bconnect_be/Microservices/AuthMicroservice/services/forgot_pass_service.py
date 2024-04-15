from flask import request, abort, jsonify
from ..helper_functions import create_token
from ..model.auth import Auth, auth_schema
import datetime

def forgot_pass(email):
    try:
        user = Auth.query.filter_by(email=email).first()
        if not user:
            return jsonify({"message":f"Invalid Email"}), 404
    except Exception as e:
        return jsonify({"message":f"Invalid Email"}), 400

    try:
        token = create_token(user.id, [0, 300], True)
    except:
        return jsonify({"message":"Internal Server Error"}), 500
    
    # TODO: SEND EMAIL
    print(token)
    
    return jsonify({"message":"Email Sent Successfully"}), 200