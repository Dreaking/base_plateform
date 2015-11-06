#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from route import route
from output import output
from database import *

@route('/admin/info/notice/list')
class AdminInfoNoticeList:
    def POST(self):
        input = web.input(type = None)
        if input.type == None:
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

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1):
            return output(410)

        db = getDb()
        notice_list = []
        results = db.select('notice', vars = {'type':input.type}, where = "type=$type",
                            order = 'add_time desc, notice_id desc')
        for i in results:
            notice_list.append({'notice_id':i.notice_id, 'content':i.content, 'title':i.title, 'add_time':i.add_time})

        return output(200, notice_list)