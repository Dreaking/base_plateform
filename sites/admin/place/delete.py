#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web
import time

from route import route
from output import output
from database import *

@route('/admin/place/delete')
class AdminPlaceDelete:
    def POST(self):
        input = web.input(place_id = None)
        if input.place_id == None:
            return output(110)
        try:
            input.place_id = int(input.place_id)
        except:
            return output(111)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1):
            return output(410)

        db = getDb()

        try:
            db.delete('place', vars = {'id':input.place_id}, where = "place_id=$id")
        except:
            return output(700)

        return output(200)
