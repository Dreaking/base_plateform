#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from route import route
from output import output
from database import *

@route('/admin/team/list')
class AdminTeamList:
    def POST(self):
        return AdminTeamList.getTeamList()

    def GET(self):
        return AdminTeamList.getTeamList()

    @staticmethod
    def getTeamList():
        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1):
            return output(410)

        db = getDb()
        results = db.select('team')
        team_list = []

        for i in results:
            team_list.append({'team_id':i.team_id, 'team_name':i.team_name,
                              'is_settled':True if i.is_settled == 'true' else False, 'user_id':i.manager_id})
        for i in team_list:
            userinfo = db.select('userinfo', vars = {'id':i['user_id']}, where = "user_id=$id",
                                   what = "phone,name")[0]
            i['phone'] = userinfo.phone
            i['manager_name'] = userinfo.name
        return output(200, team_list)