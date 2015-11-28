#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from output import output
from route import route
from database import *

@route('/admin/layout/one/add')
class AdminLayoutOneAdd:
    def POST(self):
        input = web.input(name = None, type = None)
        if input.name == None or input.type == None:
            return output(110)
        try:
            input.type = int(input.type)
        except:
            return output(111)
        if input.type not in (0, 1):
            return output(112)

        if input.type == 0:
            input.type = 'increment'
        else:
            input.type = 'decrement'

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1):
            return output(410)

        db = getDb()
        try:
            db.insert('layout_one', name = input.name, type = input.type)
        except:
            return output(700)
        return output(200)