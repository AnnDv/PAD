from app import db

class User(db.Model):
    __tablename__ = "user"
    usr_id = db.Column(db.Integer(), primary_key=True)
    usr_name = db.Column(db.String(150),unique=True)
    usr_password= db.Column(db.String(250))


# db.create_all()
