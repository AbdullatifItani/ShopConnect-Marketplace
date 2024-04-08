from flask import request, jsonify
from ..model.user import User, user_schema

def createUserInfo(db):
    try:
        user_id = request.json.get("user_id")
        username = request.json.get("username")

        if not user_id or not username:
            return jsonify({"error": "User ID or username is missing"}), 400

        user = User(user_id, username, None, None)
        db.session.add(user)
        db.session.commit()

        return jsonify(user_schema.dump(user)), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
