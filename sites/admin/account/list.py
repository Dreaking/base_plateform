#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from output import output
from route import route
from database import *

@route('/team/account/list')
class TeamAccountList:
    def POST(self):
        return TeamAccountList.getTeamAccountList()
    def GET(self):
        return TeamAccountList.getTeamAccountList()

    @staticmethod
    def getTeamAccountList():
        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1):
            return output(410)

        db = getDb()
        results = db.select('team', what = "team_id, team_name, balance")

        balance_list = []
        for i in results:
            balance_list.append({'team_id':i.team_id, 'team_name':i.team_name, 'balance':i.balance})

        return output(200, balance_list)

