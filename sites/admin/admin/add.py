#!/usr/bin/python
# -*- coding: utf8 -*-
#author ch_oosy
import web

from database import *
from output import *

from route import route
import re
from encrypt import *
@route('/admin/admin/add')
class AdminAddAdmin:
    def POST(self):
        input = web.input(login_name = None,name = None,school_id = None,
                          major_id = None ,password = None, phone = None)
        if (input.login_name ==None or input.name==None or input.school_id==None or
                        input.password==None or input.major_id==None or input.phone == None):
            return output(110)

        try:
            input.school_id =int(input.school_id)
            input.major_id  =int(input.major_id)
        except:
            return output(111)

        if len(input.name)<1 or len(input.name)>20:
            return output(112)
        if len(input.password) < 6 or len(input.password) > 16:
            return output(130)
        if not re.compile(r'[0-9A-Za-z_]+').match(input.password):
            return output(131)
        if len(input.login_name) < 6 or len(input.login_name) > 16:
            return output(132)
        if not re.compile(r'[0-9A-Za-z_]+').match(input.login_name):
            return output(133)
        if not re.compile(r'^[1-9][0-9]{10}$').match(input.phone):
            return output(120)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] != 0:
            return output(410)

        db =getDb()
        if len(db.select('user', vars = {'name':input.login_name}, where = "login_name=$name")) != 0:
            return output(420)

        if len(db.select('school', vars = {'id':input.school_id}, where = "school_id=$id")) == 0:
            return output(461)

        results = db.select('major', vars = {'id':input.major_id}, where = "major_id=$id", what = "school_id")
        if len(results) == 0 or results[0].school_id != input.school_id:
            return output(462)


        t = db.transaction()
        try:
            user_id = db.insert("user",login_name = input.login_name,password = encrypt(input.password),
                      type = '1')
            db.insert("userinfo",user_id = user_id,name=input.name, school_id=input.school_id,
                      major_id=input.major_id, phone = input.phone, gender = 'male', nickname = 'admin')
            t.commit()
        except:
            t.rollback()
            return output(700)
        return output(200)

