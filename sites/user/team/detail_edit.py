#!/usr/bin/python
# -*- coding: utf8 -*-

from route import route
from output import *
from database import *

import web

@route('/team/detail/edit')
class TeamDetailEdit:
    def POST(self):
        input = web.input(team_logo = None, description = None, project_description = None)
        if(input.team_logo == None or input.description == None or
                   input.project_description == None):
            return output(110)
        if len(input.team_logo) == 0 or len(input.description) == 0:
            return output(112)
        if len(input.project_description) == 0:
            return output(112)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        #负责人的权限才可以
        if session['user_type'] not in (2, 3):
            return output(410)

        team_id = session['team_id']
        db = getDb()
        try:
            vars = {'id':team_id}
            where = "team_id=$id"
            if len(db.select('teaminfo', vars = vars, where = where, what = "team_id")) == 0:
                db.insert('teaminfo', team_id = team_id, logo_base64 = input.team_logo,
                          description = input.description,
                          project_desc = input.project_description)
            else:
                db.update('teaminfo', vars = vars, where = where,
                          logo_base64 = input.team_logo,
                          description = input.description,
                          project_desc = input.project_description)
        except Exception,e:
            print e
            return output(700)
        return output(200)
