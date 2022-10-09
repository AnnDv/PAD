from app import app
from flask import request
from application.user.userController import LoginController, UserController
from application.utilities.auth import  Auth

auth=Auth()

@app.post('/login')
def login():
    return LoginController().login()

@app.get('/logout')
def logOut():
    return LoginController().logOut()


@app.post('/newuser')
def newUser():
    return UserController().insertNewData()