#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from route import route
from output import output
from database import *

@route('/room/apply/approve')
class RoomApplyApprove:
    def POST(self):
        input = web.input(room_apply_id = None)
        if input.room_apply_id == None:
            return output(110)
        try:
            input.room_apply_id = int(input.room_apply_id)
        except:
            return output(111)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1):
            return output(410)

        db = getDb()
        if len(db.select('room_apply', vars = {'id': input.room_apply_id},
                         where = "room_apply_id=$id and status='ongoing'",
                         what = 'room_apply_id')) == 0:
            return output(473)

        try:
            db.update('room_apply', vars = {'id':input.room_apply_id}, where = "room_apply_id=$id",
                  status = 'approved')
        except:
            return output(700)

        return output(200)
