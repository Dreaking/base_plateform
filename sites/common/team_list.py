#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

from route import route
from output import *
from database import *

@route('/team/name/list')
class TeamList:
    def POST(self):
        return TeamList.getTeamList()
    def GET(self):
        return TeamList.getTeamList()

    @staticmethod
    def getTeamList():
        db = getDb()
        results = db.select('team')
        team_list = []
        for i in results:
            team_list.append({'team_id':i.team_id, 'team_name':i.team_name})
        return output(200, team_list)