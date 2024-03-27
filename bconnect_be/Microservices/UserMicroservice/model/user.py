from ..app import db, ma


class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    bio_desc = db.Column(db.String(500), nullable = True)
    profile_pic = db.Column(db.BLOB, nullable = True)

    def __init__(self, user_id, bio_desc, profile_pic):
        super(User, self).__init__(user_id=user_id)
        super(User, self).__init__(bio_desc=bio_desc)
        super(User, self).__init__(profile_pic=profile_pic)


class UserSchema(ma.Schema):
    class Meta:
        fields = ("user_id", "bio_desc", "profile_pic")
        model = User


user_schema = UserSchema()
