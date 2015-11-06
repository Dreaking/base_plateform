#!/usr/bin/python
# -*- coding: utf8 -*-

import web

from route import route
from database import *
from output import output

@route('/team/recruit/request/decline')
class TeamRecruitRequestDecline:
    def POST(self):
        input = web.input(request_id = None)
        if input.request_id == None:
            return output(110)
        try:
            input.request_id = int(input.request_id)
        except:
            return output(111)
        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (2, 3):
            return output(410)

        db = getDb()
        vars = {'id':input.request_id}
        where = "request_id=$id"
        if len(db.select('request', vars = vars, where = where, what = 'request_id')) == 0:
            return output(471)

        try:
            db.update('request', vars = vars, where = where, status='rejected')
        except:
            return output(700)
        return output(200)