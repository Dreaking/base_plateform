#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from route import route
from output import output
from database import *

@route('/admin/team/settle/edit')
class TeamSettleEdit:
    def POST(self):
        input = web.input(team_id = None, type = None)
        if input.team_id == None or input.type == None:
            return output(110)

        try:
            input.team_id = int(input.team_id)
            input.type = int(input.type)
        except:
            return output(111)

        if input.type not in (0, 1):
            return output(112)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] != 0:
            return output(410)

        db = getDb()
        if len(db.select('team', vars = {'id':input.team_id}, where = "team_id=$id")) == 0:
            return output(464)

        try:

            db.update('team', vars = {'id':input.team_id}, where = "team_id=$id",
                    is_settled = 'true' if input.type == 1 else 'false')
        except:
            return output(700)

        return output(200)