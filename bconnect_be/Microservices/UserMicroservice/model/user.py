from ..app import db, ma
import AuthMicroservice.app


class User(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey(AuthMicroservice.app.Auth.id), primary_key=True)
    username = db.Column(db.String(30), unique=True)
    bio = db.Column(db.String(500), nullable = True)
    profile_pic = db.Column(db.LargeBinary, nullable = True)

    def __init__(self, user_id, username, bio, profile_pic):
        self.user_id = user_id
        self.username = username
        self.bio = bio
        self.profile_pic = profile_pic


class UserSchema(ma.Schema):
    class Meta:
        fields = ("user_id", "username", "bio")
        model = User


user_schema = UserSchema()
