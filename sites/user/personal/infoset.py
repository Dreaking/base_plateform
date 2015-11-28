#!/usr/bin/python
# -*- coding: utf8 -*-
#author ch_oosy
import web

from database import *
from output import *
from route import route
import re

def judgeBirthday(birthday):
    pattern = r'^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
    if not re.compile(pattern).match(birthday):
        return False
    date = re.split('-', birthday)
    try:
        year = int(date[0])
        month = int(date[1])
        day = int(date[2])
        month_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        if month not in range(1, 13):
            return False
        if month == 2:
            if year % 400 == 0 or (year % 100 != 0 and year % 4 == 0):
                if day > 29:
                    return False
            else:
                if day > 28:
                    return False
        if day > month_days[month - 1]:
            return False
        return True
    except:
        return False

@route('/user/info/set')
class UserInfoSet:
    def POST(self):
        return UserInfoSet.UserInfo_Set()
    @staticmethod
    def UserInfo_Set():
        input =web.input(id_type = None, id_number = None, name = None, education_degree = None,
                         citizenship = None, nationality = None, characters = None, address = None,
                         address_detail = None, phone = None, grade = None, political_face = None,
                         school_id = None, major_id = None, sid = None, is_male = None,
                         email = None, birthday = None, nickname = None)
        if(input.name == None or input.nickname == None or input.school_id == None or
                   input.major_id == None or input.is_male == None):
            return output(110)
        try:
            input.school_id=int(input.school_id)
            input.major_id =int(input.major_id)
            input.is_male  =int(input.is_male)
            if input.is_male not in (0,1):
                return output(112)
            if input.grade != None:
                input.grade = int(input.grade)
        except:
            return output(111)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] == 0:
            return output(410)

        args = {'name':input.name, 'school_id':input.school_id, 'major_id':input.major_id,
                'nickname':input.nickname}
        if input.sid!=None:
            if not re.compile(r'^[0-9_]+$').match(input.sid):
                return output(112)
            args['sid'] = input.sid

        if input.birthday != None:
            if not judgeBirthday(input.birthday):
                return output(112)
            args['birthday'] = input.birthday
        if input.id_type != None:
            args['id_type'] = input.id_type
        if input.id_number != None:
            args['id_number'] = input.id_number
        if input.education_degree != None:
            args['education_degree'] = input.education_degree
        if input.citizenship != None:
            args['citizenship'] = input.citizenship
        if input.nationality != None:
            args['nationality'] = input.nationality
        if input.characters != None:
            args['characters'] = input.characters
        if input.address != None:
            args['address'] = input.address
        if input.address_detail != None:
            args['address_detail'] = input.address_detail
        if input.email != None:
            args['email'] = input.email
        if input.phone != None:
            args['phone'] = input.phone
        if input.political_face != None:
            args['political_face'] = input.political_face
        if input.grade != None:
            args['grade'] = input.grade
        if input.is_male==1:
            args['gender'] = 'male'
        else:
            args['gender'] = 'female'
        db=getDb()
        user_id=session['user_id']


        if len(db.select("school",vars ={"id":input.school_id},where="school_id=$id"))==0:
            return output(461)
        if len(db.select("major",vars ={"id":input.major_id, 'school_id':input.school_id},
                         where ="major_id=$id and school_id=$school_id"))==0:
            return output(462)

        try:
            vars = {"user_id":user_id}
            where = "user_id=$user_id"
            if len(db.select('userinfo', vars =vars,
                             where = where, what = "user_id")) == 0:
                args['user_id'] = user_id
                db.insert("userinfo", **args)
            else:
                args['vars'] = vars
                args['where'] = where
                db.update("userinfo",**args)
        except:
            return output(700)
        return output(200)
