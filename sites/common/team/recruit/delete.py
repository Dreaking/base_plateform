#!/usr/bin/python
# -*- coding: utf8 -*-

import web

from database import *
from route import route
from output import *

@route('/team/recruit/delete')
class TeamRecruitDelete:
    def POST(self):
        input = web.input(recruit_id = None)
        if input.recruit_id == None:
            return output(110)
        try:
            input.recruit_id = int(input.recruit_id)
        except:
            return output(111)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1, 2, 3):
            return output(410)

        db = getDb()
        team_id = db.select('recruit', vars = {'id':input.recruit_id},
                         where = "recruit_id=$id", what = "team_id")
        if len(team_id) == 0:
            return output(468)

        team_id = team_id[0].team_id
        if session['user_type'] in (2, 3) and team_id != session['team_id']:
            return output(410)

        try:
            db.delete('recruit', vars = {'id':input.recruit_id},
                      where = "recruit_id=$id")
        except:
            return output(700)

        return output(200)
