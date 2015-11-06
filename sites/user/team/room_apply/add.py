#!/usr/bin/python
# -*- coding: utf8 -*-
# Author :zzz

import web
import time
import base64

from route import route
from output import *
from database import *

@route('/team/room/apply/add')
class TeamRoomApplyAdd:
    def POST(self):
        input = web.input(place_name = None, start_time = None, end_time = None)
        if input.place_name == None or input.start_time == None or input.end_time == None:
            return output(110)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (2, 3, 4):
            return output(410)

        db = getDb()
        team_name = db.select('team', vars = {'id': session['team_id']}, where = "team_id=$id",
                              what = "team_name")[0].team_name
        try:
            db.insert('room_apply', team_name = team_name, user_id = session['user_id'],
                      place_name = input.place_name, begin_time = input.start_time,
                      end_time = input.end_time, status = 'ongoing',
                      add_time = int(time.mktime(time.localtime())))
            return output(200)
        except:
            return output(700)
