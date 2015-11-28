#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from output import output
from route import route
from database import *

@route('/admin/layout/two/edit')
class AdminLayoutTwoEdit:
    def POST(self):
        input = web.input(layout_two_id = None, name = None)
        if input.name == None or input.layout_two_id == None:
            return output(110)
        try:
            input.layout_two_id = int(input.layout_two_id)
        except:
            return output(111)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1):
            return output(410)

        db = getDb()
        try:
            db.update('layout_two', vars = {'id':input.layout_two_id}, where = "id=$id",
                      name = input.name)
        except:
            return output(700)

        return output(200)