#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from output import output
from route import route
from database import *

@route('/admin/layout/two/add')
class AdminLayoutTwoAdd:
    def POST(self):
        input = web.input(parent_id = None, name = None, type = None)
        if input.name == None or input.type == None or input.parent_id == None:
            return output(110)
        try:
            input.type = int(input.type)
            input.parent_id = int(input.parent_id)
        except:
            return output(111)
        if input.type not in (0, 1, 2):
            return output(112)
        if input.type == 0:
            input.type = 'all'
        elif input.type == 1:
            input.type = 'payment'
        else:
            input.type = 'flow'

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1):
            return output(410)

        db = getDb()
        results = db.select('layout_one', vars = {'id':input.parent_id}, where = "id=$id")
        if len(results) == 0:
            return output(700)

        try:
            db.insert('layout_two', parent_id = input.parent_id, name = input.name, type = input.type)
        except:
            return output(700)

        return output(200)