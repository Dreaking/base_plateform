#!/usr/bin/python
# -*- coding: utf8 -*-
#author ch_oosy
import web

from database import *
from output import *
from route import route
import re
@route('/user/info/set')
class UserInfoSet:
    def POST(self):
        return UserInfoSet.UserInfo_Set()
    @staticmethod
    def UserInfo_Set():
        input =web.input(name=None,nickname=None,school_id=None,major_id=None,
                         sid=None,qq=None,is_male=None,email=None,birthday=None)
        if input.name==None or input.nickname==None or input.school_id==None or input.major_id==None or input.is_male==None:
            return output(110)
        try:
            input.school_id=int(input.school_id)
            input.major_id =int(input.major_id)
            input.is_male  =int(input.is_male)
            if input.is_male not in (0,1):
                return output(112)
        except:
            return output(111)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] == 0:
            return output(410)

        if input.sid!=None:
            if not re.compile(r'^[0-9_]+$').match(input.sid):
                return output(112)
        if input.qq!=None:
            if not re.compile(r'^[1-9][0-9]+$').match(input.qq) or len(input.qq)>11:
                return output(112)
        if input.birthday!=None:
            if not re.compile(r'^[0-9]{4}-(0[1-9])|(1[0-2])-((0[1-9])|([1-2][0-9])|(3[0-1]))$').match(input.birthday):
                return output(112)
            date =re.split('-',input.birthday)
            try:
                year =int(date[0])
                month=int(date[1])
                day =int(date[2])
                if day ==0:
                    return output(112)
            except:
                return output(111)
            if month in (1,3,5,7,8,10,12):
                if day>31:
                    return output(112)
            if month in(4,6,9,11):
                if day>30:
                    return output(112)
            if month==2:
                if year%400==0 or (year%4==0 and year%100!=0):
                    if day>29:
                        return output(112)
                else:
                    if day>28:
                        return output(112)
        if input.is_male==1:
            sex = "male"
        else:
            sex = "female"
        db=getDb()
        user_id=session['user_id']


        if len(db.select("school",vars ={"id":input.school_id},where="school_id=$id"))==0:
            return output(461)
        if len(db.select("major",vars ={"id":input.major_id, 'school_id':input.school_id},
                         where ="major_id=$id and school_id=$school_id"))==0:
            return output(462)

        try:
            if len(db.select('userinfo', vars ={"user_id":user_id},
                             where = "user_id=$user_id", what = "user_id")) == 0:
                db.insert("userinfo", user_id = user_id, name=input.name,nickname =input.nickname,
                          school_id=input.school_id, major_id =input.major_id,gender=sex,
                          birthday=input.birthday,qq=input.qq, sid =input.sid,email=input.email,
                          phone = session['login_name'])
            else:
                db.update("userinfo",vars ={"user_id":user_id},
                        where = "user_id=$user_id",
                        name=input.name,nickname =input.nickname,school_id=input.school_id,
                        major_id =input.major_id,gender=sex,birthday=input.birthday,qq=input.qq,
                        sid =input.sid,email=input.email, phone = session['login_name'])
        except:
            return output(700)
        return output(200)
