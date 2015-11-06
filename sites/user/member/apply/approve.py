#!/usr/bin/python
# -*- coding: utf8 -*-

import web

from route import route
from database import *
from output import output

@route('/team/recruit/request/approve')
class TeamRecruitRequestApprove:
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
        result = db.select('request', vars = vars, where = where, what = 'user_id,recruit_id')
        if len(result) == 0:
            return output(471)

        t = db.transaction()
        try:
            result = result[0]
            team_id = db.select('recruit', vars = {'id':result.recruit_id},
                                where = 'recruit_id=$id', what = 'team_id')[0].team_id
            user_id = result.user_id
            db.update('request', vars = vars, where = where, status='approved')
            db.update('user', vars = {'id':user_id}, where = "user_id=$id", team_id = team_id,
                      type = '4')
            db.delete('request', vars = {'id':user_id}, where = "user_id=$id and status='ongoing'")
            t.commit()
        except:
            t.rollback()
            return output(700)
        return output(200)
