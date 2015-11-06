#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from route import route
from output import output
from database import *

@route('/activity/apply/delete')
class ActivityApplyDelete:
    def POST(self):
        input = web.input(apply_id = None)
        if input.apply_id == None:
            return output(110)
        try:
            input.apply_id = int(input.apply_id)
        except:
            return output(111)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1):
            return output(410)

        db = getDb()
        vars = {'id':input.apply_id}
        where = "apply_id=$id"
        if len(db.select('apply', vars = vars, where = where)) == 0:
            return output(470)

        try:
            db.delete('apply', vars = vars, where = where)
        except:
            return output(700)

        return output(200)