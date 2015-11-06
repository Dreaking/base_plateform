#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from route import route
from database import *
from output import output

@route('/base/team/detail/get')
class BaseTeamDetailGet:
    def POST(self):
        input = web.input(team_id = None)
        session = web.ctx.session
        if session.has_key('user_id'):
            if input.team_id == None and session['user_type'] in (2, 3, 4):
                input.team_id = session['team_id']
        if input.team_id == None:
            return output(110)
        try:
            input.team_id = int(input.team_id)
        except:
            return output(111)

        db = getDb()
        team_info = db.select('team', vars = {'id':input.team_id}, where = "team_id=$id")

        if len(team_info) == 0:
            return output(464)

        team = team_info[0]
        team_info = db.select('teaminfo', vars = {'id':input.team_id}, where = "team_id=$id")
        if len(team_info) == 0:
            description = None
            project_desc = None
            logo_base64 = None
        else:
            team_info = team_info[0]
            description = team_info.description
            project_desc = team_info.project_desc
            logo_base64 = team_info.logo_base64
        return output(200, {'team_id':team.team_id, 'team_name':team.team_name,
                            'description':description,
                            'project_description':project_desc,
                            'logo_base64':logo_base64})
