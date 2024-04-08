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
        abort(403)
    except KeyError:
        abort(403)
    except:
        abort(400)
    
    if "bio" not in request.json:
        abort(400)
        
    try:
        user = User.query.get(user_id)

        if not user:
            abort(404)
        
        user.bio = request.json["bio"]
        db.session.commit()
        return jsonify({"message": "Bio updated successfully."}), 201
    except:
        db.session.rollback()
        abort(500)
