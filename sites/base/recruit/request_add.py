#!/usr/bin/python
# -*- coding: utf8 -*-

import web
import time

from route import route
from database import *
from output import output

@route('/team/recruit/request/add')
class TeamRecruitRequestAdd:
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
        if session['user_type'] != 5:
            return output(410)

        db = getDb()
        if len(db.select('recruit', vars = {'id':input.recruit_id}, where = "recruit_id=$id")) == 0:
            return output(468)

        try:
            db.insert('request', user_id = session['user_id'], recruit_id = input.recruit_id,
                      status = 'ongoing', add_time = int(time.mktime(time.localtime())))
        except:
            return output(700)

        return output(200)
