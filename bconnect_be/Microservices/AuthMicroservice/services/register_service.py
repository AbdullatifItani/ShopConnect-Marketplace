from flask import request, jsonify
import requests
from ..model.auth import Auth, auth_schema

def register(db):
    try:
        username = request.json["username"]
        email = request.json["email"]
        password = request.json["password"]
        
        if Auth.query.filter_by(username=username).first():
            return jsonify({"message": "Username taken"}), 400
        
        auth = Auth(username, email, password)
        db.session.add(auth)
        db.session.commit()
        
        user_id = auth.id
        
        response = requests.post("http://localhost:8082/createUserInfo", json={'user_id': user_id, 'username': username})
        
        if response.status_code != 201:
            db.session.rollback()
            return jsonify({"message": "Failed to create user information in the other microservice"}), 400
        
        return jsonify(auth_schema.dump(auth)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 400