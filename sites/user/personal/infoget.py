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
        school_id = userinfo.school_id
        major_id = userinfo.major_id
        userinfo = {'name':userinfo.name, 'id_type':userinfo.id_type, 'id_number':userinfo.id_number,
                    'education_degree':userinfo.education_degree, 'citizenship':userinfo.citizenship,
                    'nationality':userinfo.nationality, 'characters':userinfo.characters,
                    'address':userinfo.address, 'address_detail':userinfo.address_detail,
                    'phone':userinfo.phone, 'grade':userinfo.grade, 'political_face':userinfo.political_face,
                    'school_id':userinfo.school_id, 'major_id':userinfo.major_id, 'sid':userinfo.sid,
                    'email':userinfo.email, 'birthday':userinfo.birthday, 'nickname':userinfo.nickname,
                    'is_male': True if userinfo.gender == 'male' else False}
        userinfo['school_name'] = db.select('school', vars = {'id':school_id}, where = "school_id=$id",
                            what = 'school_name')[0].school_name
        userinfo['major_name'] = db.select('major', vars = {'id':major_id}, where = "major_id=$id",
                            what = 'major_name')[0].major_name

        return output(200, userinfo)
