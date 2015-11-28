#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from output import output
from route import route
from database import *

@route('/place/apply/list')
class TeamFlowList:
    def POST(self):
        return TeamFlowList.getApplyList()
    def GET(self):
        return TeamFlowList.getApplyList()

    @staticmethod
    def getApplyList():
        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)

        db = getDb()
        apply_list = []
        if session['user_type'] in (0, 1):
            results = db.select('room_apply', where = "status='ongoing'",
                            order = 'add_time desc, room_apply_id desc')
        else:
            results = db.select('room_apply', order = 'add_time desc, room_apply_id desc')
        for i in results:
            if i.status == 'ongoing':
                status = 0
            elif i.status == 'approved':
                status = 1
            else:
                status = 2
            apply_list.append({'room_apply_id':i.room_apply_id, 'team_name': i.team_name,
                               'user_id': i.user_id, 'place_id': i.place_id,
                               'begin_time': i.begin_time,
                               'end_time': i.end_time, 'add_time': i.add_time, 'status': status})

        for i in apply_list:
            name = db.select('userinfo', vars = {'id':i['user_id']}, where = 'user_id=$id',
                             what = 'name')[0].name
            i['name'] = name
            i['place_name'] = db.select('place', vars = {'id':i['place_id']}, where = "place_id=$id",
                                        what = 'place_name')[0].place_name
        return output(200, apply_list)



