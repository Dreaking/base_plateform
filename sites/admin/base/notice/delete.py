#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from route import route
from output import output
from database import *

@route('/info/notice/delete')
class InfoNoticeDelete:
    def POST(self):
        input = web.input(notice_id = None)
        if input.notice_id == None:
            return output(110)
        try:
            input.notice_id = int(input.notice_id)
        except:
            return output(111)

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
            db.delete('notice', vars = vars, where = where)
        except:
            return output(700)
        return output(200)