#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from route import route
from database import *
from output import output

@route('/base/team/logo/get')
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

        if len(db.select('team', vars = {'id':input.team_id}, where = "team_id=$id")) == 0:
            return output(464)

        teaminfo = db.select('teaminfo', vars = {'id':input.team_id},
                             where = "team_id=$id", what = "logo_base64")
        if len(teaminfo) == 0:
            data = None
        else:
            data = teaminfo[0].logo_base64
        return output(200, {'team_id':input.team_id,  'content':teaminfo.logo_base64})
