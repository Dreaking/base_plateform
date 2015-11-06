#!/usr/bin/python
# -*- coding: utf8 -*-

import web

from route import route
from output import *
from database import *

@route('/user/team/member/list')
class UserTeamMemberList:
    def POST(self):
        return UserTeamMemberList.getMemberList()
    def GET(self):
        return UserTeamMemberList.getMemberList()

    @staticmethod
    def getMemberList():
        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (2, 3, 4):
            return output(410)

        team_id = session['team_id']
        db = getDb()
        results = db.select('user', vars = {'id':team_id}, where = "team_id=$id",
                            what = 'user_id, type')
        member_list = []
        for i in results:
            member_list.append({'user_id':i.user_id, 'type':int(i.type) - 2})
        for i in member_list:
            i['name'] = db.select('userinfo', vars = {'id':i['user_id']},
                                  where = 'user_id=$id', what = 'name')[0].name
        return output(200, member_list)
