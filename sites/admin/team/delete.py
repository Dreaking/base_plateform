#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from route import route
from output import output
from database import *

#TODO: unfinished
@route('/admin/team/delete')
class AdminTeamDelete:
    def POST(self):
        input = web.input(team_id = None)
        if input.team_id == None:
            return output(110)

        try:
            input.team_id = int(input.team_id)
        except:
            return output(111)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] != 0:
            return output(410)

        db = getDb()
        if len(db.select('team', vars = {'id':input.team_id}, where = "team_id=$id")) == 0:
            return output(464)

        recruit_id_list = []
        for i in db.select('recruit', vars = {'id':input.team_id}, where = "team_id=$id", what = "recruit_id"):
            recruit_id_list.append(i.recruit_id)
        t = db.trasaction()
        try:
            myvars = {'id':input.team_id}
            db.delete('team', vars = myvars, where = "team_id=$id")
            db.delete('recruit', vars = myvars, where = "team_id=$id")
            for i in recruit_id_list:
                db.delete('request', vars = {'id':i}, where = "recruit_id=$id")
            db.update('user', vars = myvars, where = "team_id=$id", team_id = None, type = '5')
            t.commit()
        except:
            t.rollback()
            return output(700)
        return output(200)
