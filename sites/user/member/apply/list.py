#!/usr/bin/python
# -*- coding: utf8 -*-

from route import route
from output import *
from database import *

@route('/team/recruit/request/list')
class TeamRecruitRequestList:
    def POST(self):
        return TeamRecruitRequestList.getRequestList()
    def GET(self):
        return TeamRecruitRequestList.getRequestList()

    @staticmethod
    def getRequestList():
        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (2, 3):
            return output(410)

        team_id = session['team_id']
        where = ("recruit.recruit_id=request.recruit_id and recruit.team_id=$id and " +
                "request.status='ongoing'")
        what = ("request.recruit_id as recruit_id, request.user_id as user_id, " +
                "request.add_time as add_time, request.status as status," +
                'request.request_id as request_id')
        db = getDb()
        results = db.select('recruit,request', vars = {'id': team_id},
                            where = where,
                            what = what,
                            order = 'add_time desc')
        request_list = []
        for i in results:
            if i.status == 'ongoing':
                status = 0
            elif i.status == 'approved':
                status = 1
            else:
                status = 2
            request_list.append({'request_id':i.request_id, 'recruit_id':i.recruit_id,
                                 'user_id':i.user_id, 'status':status, 'add_time':i.add_time})
        for i in request_list:
            userinfo = db.select('userinfo', vars = {'id':i['user_id']}, where = "user_id=$id",
                                 what = "name, phone, qq")[0]
            title = db.select('recruit', vars = {'id':i['recruit_id']}, where = "recruit_id=$id",
                              what = 'recruit_title')[0].recruit_title
            i['title'] = title
            i['name'] = userinfo.name
            i['qq'] = userinfo.qq
            i['phone'] = userinfo.phone
        return output(200, request_list)