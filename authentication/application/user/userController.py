from datetime import datetime, timedelta
from flask import request,make_response
import jwt
import bcrypt
from app import db,JWT_SECRETKEY
from application.utilities.response import Response
from .userModel import User

user_arr = []
class LoginController:
    def login(self):
        user=None
        try:
            user=UserController().findUser()
        except LoginErr as msg:
            return Response.make(False,str(msg))
        except Exception:
            return Response.make(False,'OOps, Something wrong.')
        
        try:
            token=self.createToken(user)
            return self.setCookie(token)
        except:
            return Response.make('Failed to create access token')

    def createToken(self, user):
        token=jwt.encode(
            payload={
                'userId':user['usr_id'],
                'userName':user['usr_name'],
                'exp':datetime.utcnow() + timedelta(minutes=30)
            },
            key=JWT_SECRETKEY, algorithm='HS256')
        print(token)
        return token
    
    def setCookie(self, token):
        successLogin={'status':True, 'msg':'Login Success'}
        response=make_response(successLogin)
        response.set_cookie('x-auth-token', token)
        print(token)
        return response

    def logOut(self):
        resp = make_response({'status':True, 'msg':'Logout Success'})
        resp.delete_cookie('x-auth-token')
        return resp
    

class UserController:    
    def insertNewData(self):
        print("erererererererer")
        try:
            print(request.json)
            user = {
                "usr_id": len(user_arr) + 1,
                "usr_name": request.json.get('username'), 
                'usr_password':bcrypt.hashpw(
                    request.json.get('password').encode('utf-8'), 
                    bcrypt.gensalt()).decode('utf-8')
                    }
            user_arr.append(user)
            return Response.make(True, "User was added successfully!")
        except Exception as inst:
            return Response.make(False,str(inst))
    
    def findUser(self):
        for item in user_arr:
            if item["usr_name"] == request.json.get('username'):
                if  bcrypt.checkpw(
                    request.json.get('password').encode('utf-8'),
                    item['usr_password'].encode('utf-8')
                ):return item
            else:
                raise LoginErr('Permission denied, your password or username is incorrect.')

        raise LoginErr('User is not found')

    def verifyUser(self):
        token=request.cookies.get('x-auth-token')
        print(token)
        userData = jwt.decode(token, JWT_SECRETKEY, algorithms='HS256')
        
        return Response.make(True, "Valid", userData)
        
class DataHandler:
    
    def getUser(self, parameter):
        data=User.query.filter(
            User.usr_name==parameter.get('usr_name'),
            ).first()
        return data
     
    def insertNewData(self,parameter):
        objectToInsert=User(**parameter)
        db.session.add(objectToInsert)
        db.session.commit()

class LoginErr(Exception):
    """Custom Exception for login error"""