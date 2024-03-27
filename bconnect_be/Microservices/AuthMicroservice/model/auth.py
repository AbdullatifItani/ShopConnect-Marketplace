from ..app import db, ma, bcrypt


class Auth(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(30), unique=True)
    email = db.Column(db.String(50), unique = True)
    hashed_password = db.Column(db.String(128))

    def __init__(self, user_name, email, password):
        super(Auth, self).__init__(user_name=user_name)
        super(Auth, self).__init__(email=email)
        self.hashed_password = bcrypt.generate_password_hash(password)


class AuthSchema(ma.Schema):
    class Meta:
        fields = ("id", "user_name", "email")
        model = Auth


auth_schema = AuthSchema()
