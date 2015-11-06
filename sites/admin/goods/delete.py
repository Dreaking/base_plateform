#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web
import time

from route import route
from output import output
from database import *

@route('/admin/goods/delete')
class InfoNoticeAdd:
    def POST(self):
        input = web.input(good_id = None)
        if input.good_id == None:
            return output(110)
        try:
            input.good_id = int(input.good_id)
        except:
            return output(111)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1):
            return output(410)

        db = getDb()


        try:
            db.delete('goods', vars = {'id':input.good_id}, where = "good_id=$id")
        except:
            return output(700)

        return output(200)
