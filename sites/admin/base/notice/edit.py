#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web
import time

from route import route
from output import output
from database import *

@route('/info/notice/edit')
class InfoNoticeEdit:
    def POST(self):
        input = web.input(title = None, content = None, notice_id = None)
        if input.title == None or input.content == None or input.notice_id == None:
            return output(110)
        try:
            input.notice_id = int(input.notice_id)
        except:
            return output(111)

        input.title = input.title.strip()
        if len(input.title) == 0:
            return output(112)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1):
            return output(410)

        db = getDb()
        vars = {'id':input.notice_id}
        where = "notice_id=$id"
        if len(db.select('notice', vars = vars, where = where)) == 0:
            return output(460)
        try:
            db.update('notice', vars = vars, where = where, title = input.title,
                      content = input.content, add_time = int(time.mktime(time.localtime())))
        except:
            return output(700)

        return output(200)