from flask import abort, request, jsonify
import requests
from ..helper_functions import extract_auth_token
from ..model.user import User
import base64

def uploadProfilePic(db):
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
    
    if "profile_pic" not in request.files:
        abort(400)
        
    try:
        user = User.query.get(user_id)

        if not user:
            abort(404)
        
        profile_pic = request.files["profile_pic"]
        profile_pic_data = profile_pic.read()
        encoded_image = base64.b64encode(profile_pic_data)
        user.profile_pic = encoded_image
        db.session.commit()
        return jsonify({"message": "Profile picture updated successfully."}), 201
    except:
        db.session.rollback()
        abort(500)