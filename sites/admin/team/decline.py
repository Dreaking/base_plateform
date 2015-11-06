#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from route import route
from output import output
from database import *

@route('/admin/team/apply/decline')
class TeamApplyDecline:
    def POST(self):
        input = web.input(application_id = None)
        if input.application_id == None:
            return output(110)
        try:
            input.application_id = int(input.application_id)
        except:
            return output(111)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] != 0:
            return output(410)

        db = getDb()
        if len(db.select('application', vars = {'id':input.application_id},
                         where = "application_id=$id and status='ongoing'")) == 0:
            return output(469)

        try:
            db.update('application', vars = {'id':input.application_id}, where = "application_id=$id",
                      status = 'rejected')
        except:
            return output(700)

        return output(200)
