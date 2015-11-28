#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web
import time

from route import route
from output import output
from database import *

@route('/admin/place/add')
class InfoNoticeAdd:
    def POST(self):
        input = web.input(place_name = None)
        if input.place_name == None:
            return output(110)

        input.place_name = input.place_name.strip()
        length = len(input.place_name)
        if length > 20 or length < 1:
            return output(112)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1):
            return output(410)

        db = getDb()
        try:
            db.insert('place', place_name = input.place_name)
        except:
            return output(700)

        return output(200)
