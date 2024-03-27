from flask import Flask, request, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_bcrypt import Bcrypt
import jwt
import datetime
import requests
from .db_config import DB_CONFIG

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = DB_CONFIG
CORS(app)
db = SQLAlchemy(app)
ma = Marshmallow(app)
bcrypt = Bcrypt(app)

from .model.auth import Auth, auth_schema

SECRET_KEY = "b'|\xe7\xbfU3`\xc4\xec\xa7\xa9zf:}\xb5\xc7\xb9\x139^3@Dv'"


def create_token(user_id):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=4),
        'iat': datetime.datetime.utcnow(),
        'sub': user_id
    }
    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm='HS256'
    )


def extract_auth_token(authenticated_request):
    auth_header = authenticated_request.headers.get('Authorization')
    if auth_header:
        return auth_header.split(" ")[1]
    else:
        return None


def decode_token(token):
    payload = jwt.decode(token, SECRET_KEY, 'HS256')
    return payload['sub']

@app.route('/authentication', methods=['GET'])
def authentication():
    token = extract_auth_token(request)
    if not token:
        abort(403)
    else:
        try:
            user_id = decode_token(token)
            
            return jsonify({"success": user_id})
        except:
            abort(403)


@app.route('/login', methods=['POST'])
def login():
    if "user_name" not in request.json or "password" not in request.json:
        abort(400)
    username = request.json["user_name"]
    password = request.json["password"]
    user = Auth.query.filter_by(user_name=username).first()
    if not user:
        abort(403)
    if not bcrypt.check_password_hash(user.hashed_password, password):
        abort(403)
    token = create_token(user.id)
    return jsonify({"token": token}), 200


@app.route('/createuser', methods=['POST'])
def create_user():
    print(request.json)
    try:
        user_name = request.json["user_name"]
        email = request.json["email"]
        password = request.json["password"]

        auth = Auth(user_name, email, password)
        db.session.add(auth)
        db.session.commit()
        user_id = Auth.query.filter_by(user_name=user_name).first().id
        requests.post("http://localhost:8082/createUserInfo", json={'user_id': user_id})
        return jsonify(auth_schema.dump(auth)), 201
    except:
        return jsonify({"message": "Username taken"}), 400
    
if __name__ == "__main__":
    # Specify the port using the port parameter
    app.run(port=8080)