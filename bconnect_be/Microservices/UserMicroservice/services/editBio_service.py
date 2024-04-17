from flask import abort, request, jsonify
import requests
from ..model.user import User
from ..helper_functions import extract_auth_token

def editBio(db):
    token = extract_auth_token(request)
    try:
        response = requests.get("http://localhost:8080/validate_token", headers = {'Authorization': f'Bearer {token}'})
        
        user_id = response.json().get("user_id")
    except requests.RequestException as e:
        return jsonify({"message" : "Unauthorized Request"}), 403
    except KeyError:
        return jsonify({"message" : "Unauthorized Request"}), 403
    except:
        return jsonify({"message" : "Bad Request"}), 400
    
    if "bio" not in request.json:
        return jsonify({"message" : "Bad Request"}), 400
        
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message" : "User not found"}), 404
        
        user.bio = request.json["bio"]
        db.session.commit()
        return jsonify({"message": "Bio updated successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message" : "Internal Server Error"}), 500
