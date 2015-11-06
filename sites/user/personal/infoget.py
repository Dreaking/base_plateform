#!/usr/bin/python
# -*- coding: utf8 -*-
#author ch_oosy
import web

from database import *
from output import *

from route import route

@route('/user/info/get')
class UserInfoGet:
    def POST(self):
        return UserInfoGet.getUserInfo()
    def GET(self):
        return UserInfoGet.getUserInfo()

    @staticmethod
    def getUserInfo():
        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] == 0:
            return output(410)
        db = getDb()
        results = db.select('userinfo', vars = {'id':session['user_id']}, where = "user_id=$id")

        if len(results) == 0:
            return output(423)

        userinfo = results[0]

        return output(200,{'name':userinfo.name, 'school_id':userinfo.school_id, 'major_id':userinfo.major_id,
                           'nickname':userinfo.nickname, 'sid':userinfo.sid, 'email':userinfo.email,
                           'qq':userinfo.qq, 'phone':userinfo.phone,
                           'is_male':True if userinfo.gender == 'male' else False, 'birthday':userinfo.birthday})
