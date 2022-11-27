from app import app
from flask import request
from application.user.userController import LoginController, UserController
from application.utilities.auth import  Auth
from application.utilities.response import Response
from app import PORT

auth=Auth()

@app.post('/login')
def login():
    return LoginController().login()

@app.get('/logout')
@auth.middleware
def logOut():
    return LoginController().logOut()


@app.post('/newuser')
def newUser():
    return UserController().insertNewData()

@app.get('/verifyuser')
@auth.middleware
def verifyUser():
    return UserController().verifyUser()

@app.get('/verifytoken')
@auth.middleware
def verifyToken():
    return Response.make(True, "Token is valid")

@app.get('/status')
def getStaus():
    return Response.status(True, PORT, ['/login', '/logout', '/newuser', '/verifyuser', '/verifytoken'])