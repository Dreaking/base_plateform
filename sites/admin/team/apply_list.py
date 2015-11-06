#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from route import route
from output import output
from database import *

@route('/admin/team/apply/list')
class TeamApplyList:
    def GET(self):
        return TeamApplyList.getTeamApplyList()
    def POST(self):
        return TeamApplyList.getTeamApplyList()

    @staticmethod
    def getTeamApplyList():
        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] != 0:
            return output(410)

        db = getDb()
        results = db.select('application', where = "status='ongoing'",
                            order = "application_id desc")
        app_list = []
        for i in results:
            if i.status == 'ongoing':
                status = 0
            elif i.status == 'accepted':
                status = 1
            else:
                status = 2
            app_list.append({'application_id':i.application_id, 'user_id':i.user_id,
                             'new_team_name':i.new_team_name, 'add_time':i.add_time,
                             'status': status})

        for i in app_list:
            userinfo = db.select('userinfo', vars = {'id':i['user_id']},
                             where = "user_id=$id", what = "name, phone")[0]
            i['phone'] = userinfo.phone
            i['name'] = userinfo.name
        return output(200, app_list)
