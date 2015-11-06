#!/usr/bin/python
# -*- coding: utf8 -*-
#author ch_oosy
import web
import re
from database import *
from output import *
from encrypt import *
from route import route

@route('/admin/password/change')
class AdminPasswordChange:
    def POST(self):
        return AdminPasswordChange.password_Alter()

    def GET(self):
        return AdminPasswordChange.password_Alter()
    @staticmethod
    def password_Alter():
        input=web.input(user_id=None,new_password=None)

        if input.user_id==None or input.new_password==None:
            return output(110)

        if len(input.new_password)<6 or len(input.new_password)>18:
            return output(130)

        if not re.compile(r'[0-9A-Za-z_]+').match(input.new_password):
            return output(131)

        try:
            input.user_id=int(input.user_id)
        except:
            return output(111)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] != 0:
            return output(410)

        db =getDb()
        results = db.select("user",vars ={"id":input.user_id},
                            where = "user_id=$id",
                            what = "type")
        if len(results)==0:
            return output(463)
        if results[0].type==0:
            return output(481)
        try:
            db.update("user",vars ={"id":input.user_id},
                      where ="user_id=$id",
                      password = encrypt(input.new_password))
        except:
            return output(700)

        return output(200)
