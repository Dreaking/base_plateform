#!/usr/bin/python
# -*- coding: utf8 -*-
#author : ZZZ

import web
import re
import time

from route import route
from output import *
from database import *



@route('/activity/apply/add')
class ActivityApplyAdd:
    def POST(self):
        input = web.input(activity_id = None)
        if input.activity_id == None:
            return output(110)
        try:
            input.activity_id = int(input.activity_id)
        except:
            return output(111)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (2, 3, 4):
            return output(410)

        db = getDb()
        if len(db.select('userinfo', vars = {'id':session['user_id']}, where = "user_id=$id")) == 0:
            return output(423)

        if len(db.select('notice', vars = {'id' : input.activity_id},
                         where = "notice_id=$id and type='activity'")) == 0:
            return output(460)

        try:
            if len(db.select('apply', vars = {'user_id':session['user_id'], 'activity_id':input.activity_id},
                             where = "user_id=$user_id and activity_id=$activity_id")) == 0:
                db.insert('apply' , activity_id = input.activity_id,
                            user_id = session['user_id'],
                            add_time = int(time.mktime(time.localtime())))
        except:
            return output(700)

        return output(200)