from flask import Flask, request, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from .db_config import DB_CONFIG
import requests

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = DB_CONFIG
CORS(app)
db = SQLAlchemy(app)
ma = Marshmallow(app)

from .model.user import User, user_schema

@app.route('/getUserInfo', methods=['GET'])
def getUserInfo():
    token = extract_auth_token(request)
    try:
        response = requests.get("http://localhost:8080/authentication", headers = {'Authorization': f'Bearer {token}'})
        user = response.json()
        userInfo = User.query.filter_by(user_id=user["id"]).first()
    except:
        abort(403)

    return jsonify({"username": user["username"],
                    "bio":userInfo.bio_desc,
                    "profilePic":userInfo.profile_pic}), 200
    
   
@app.route('/createUserInfo', methods=['POST'])
def createUserInfo():
    user_id = request.json["user_id"]
    user = User(user_id, None, None)
    db.session.add(user)
    db.session.commit()
    return jsonify(user_schema.dump(user)), 201

@app.route('/editBio', methods=['POST'])
def editBio():
    token = extract_auth_token(request)
    response = requests.get("http://localhost:8080/authentication", headers = {'Authorization': f'Bearer {token}'})
    user = response.json()
    bio = request.json["bio"]
    user2 = User.query.filter_by(user_id=user["id"]).first()
    user2.bio_desc = bio
    db.session.commit()
    return jsonify({"message":"success"}),201

    


def extract_auth_token(authenticated_request):
    auth_header = authenticated_request.headers.get('Authorization')
    if auth_header:
        return auth_header.split(" ")[1]
    else:
        return None

@app.route('/editBioDesc', methods=['POST'])
def editBioDesc():
    token = extract_auth_token(request)
    try:
        response = requests.get("http://localhost:8080/authentication", headers = {'Authorization': f'Bearer {token}'})
        user_id = response.json().get("success")
    except:
        abort(403)
    
    if "bio_desc" not in request.json:
        abort(400)
        
    try:
        user = User.query.get(user_id)
        if user:
            user.bio_desc = request.json["bio_desc"]
            db.session.commit()
            return jsonify({"message": "Bio description updated successfully"}), 200
        else:
            abort(404)
    except Exception as e:
        abort(500)
    
@app.route('/editProfilePicture', methods=['POST'])
def create_user():
    token = extract_auth_token(request)
    try:
        response = requests.get("http://localhost:8080/authentication", headers = {'Authorization': f'Bearer {token}'})
        user_id = response.json().get("success")
    except:
        abort(403)
    
    if "profile_pic" not in request.json:
        abort(400)
        
    try:
        user = User.query.get(user_id)
        if user:
            user.profile_pic = request.json["profile_pic"]
            db.session.commit()
            return jsonify({"message": "Profile picture updated successfully"}), 200
        else:
            abort(404)
    except Exception as e:
        abort(500)
    
if __name__ == "__main__":
    app.run(port=8082)