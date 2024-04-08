from flask import jsonify
from ..model.user import User, user_schema

def getUserInfo(user_id):
    try:
        if not user_id:
            return jsonify({"error": "User ID is missing in the request"}), 400
        
        user = User.query.filter_by(user_id=user_id).first()
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        
        return jsonify(user_schema.dump(user)), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400
