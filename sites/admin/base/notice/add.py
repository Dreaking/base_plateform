#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web
import time

from route import route
from output import output
from database import *

@route('/info/notice/add')
class InfoNoticeAdd:
    def POST(self):
        input = web.input(title = None, content = None, type = None)
        if input.title == None or input.content == None or input.type == None:
            return output(110)
        try:
            input.type = int(input.type)
        except:
            return output(111)

        if input.type not in (0, 1, 2):
            return output(112)

        if input.type == 0:
            input.type = 'base'
        elif input.type == 1:
            input.type = 'match'
        else:
            input.type = 'activity'

        input.title = input.title.strip()
        if len(input.title) == 0:
            return output(112)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1):
            return output(410)

        db = getDb()
        try:
            db.insert('notice', title = input.title, content = input.content, type = input.type,
                      add_time = int(time.mktime(time.localtime())))
        except:
            return output(700)

        return output(200)
