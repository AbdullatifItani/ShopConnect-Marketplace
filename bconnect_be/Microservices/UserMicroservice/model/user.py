from ..app import db, ma


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, unique=True)
    bio_desc = db.Column(db.String(500), nullable = True)
    profile_pic = db.Column(db.BLOB, nullable = True)

    def __init__(self, user_id, bio_desc, profile_pic):
        self.user_id = user_id
        self.bio_desc = bio_desc
        self.profile_pic = profile_pic


class UserSchema(ma.Schema):
    class Meta:
        fields = ("id", "user_id", "bio_desc", "profile_pic")
        model = User


user_schema = UserSchema()
