#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from output import output
from route import route
from database import *

@route('/admin/layout/one/delete')
class AdminLayoutOneDelete:
    def POST(self):
        input = web.input(layout_one_id = None)
        if input.layout_one_id == None:
            return output(110)
        try:
            input.layout_one_id = int(input.layout_one_id)
        except:
            return output(111)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1):
            return output(410)

        db = getDb()
        try:
            db.delete('layout_one', vars = {'id':input.layout_one_id}, where = 'id=$id')
            db.delete('layout_two', vars = {'id':input.layout_one_id}, where = 'parent_id=$id')
        except:
            return output(700)
        return output(200)