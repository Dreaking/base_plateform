#!/usr/bin/python
# -*- coding: utf8 -*-

import web

from database import *
from route import route
from output import output

@route('/user/team/member/delete')
class UserTeamMemberDelete:
    def POST(self):
        input = web.input(user_id = None)
        if input.user_id == None:
            return output(110)
        try:
            input.user_id = int(input.user_id)
        except:
            return output(111)
        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] != 2:
            return output(410)

        team_id = session['team_id']
        db = getDb()
        if len(db.select('user', vars = {'user_id':input.user_id, 'team_id':team_id},
                         where = 'user_id=$user_id and team_id=$team_id')) == 0:
            return output(463)

        try:
            db.update('user', vars = {'id':input.user_id}, where = 'user_id=$id', type='5',
                      team_id = None)
        except:
            return output(700)
        return output(200)