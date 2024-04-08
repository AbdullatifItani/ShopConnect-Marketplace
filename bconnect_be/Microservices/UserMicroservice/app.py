from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from .db_config import DB_CONFIG


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DB_CONFIG
CORS(app)
db = SQLAlchemy(app)
ma = Marshmallow(app)


from .services import editBio_service, getProfilePic_service, getUserInfo_service, createUserInfo_service, uploadProfilePic_service


@app.route('/getUserInfo/<int:user_id>', methods=['GET'])
def getUserInfo(user_id):
    return getUserInfo_service.getUserInfo(user_id)

@app.route('/getProfilePic/<int:user_id>', methods=['GET'])
def getProfilePic(user_id):
    return getProfilePic_service.getProfilePic(user_id)
       
   
@app.route('/createUserInfo', methods=['POST'])
def createUserInfo():
    return createUserInfo_service.createUserInfo(db)


@app.route('/editBio', methods=['POST'])
def editBioDesc():
    return editBio_service.editBio(db)


@app.route('/uploadProfilePic', methods=['POST'])
def uploadProfilePic():
    return uploadProfilePic_service.uploadProfilePic(db)

    
if __name__ == "__main__":
    app.run(port=8082)