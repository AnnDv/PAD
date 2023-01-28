from flask import Flask
import sqlalchemy
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Table, Column, Integer, String, MetaData
from flask_migrate import Migrate
import bcrypt

JWT_SECRETKEY=bcrypt.hashpw(b'itsAs3cr34tkeyforJWT', bcrypt.gensalt())

PORT = 8887

app=Flask(__name__)
POSTGRES={
    'user':'anadvorac',
    'pw':'1234',
    'db':'user_db',
    'host':'db',
    'port':'5432'
}

app.config['SQLALCHEMY_DATABASE_URI']='postgresql://%(user)s:%(pw)s@%(host)s:%(port)s/%(db)s'%POSTGRES
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=True
db= SQLAlchemy(app)
migrate=Migrate(app,db)


meta = MetaData()

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=8887)
