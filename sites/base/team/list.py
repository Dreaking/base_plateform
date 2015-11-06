#!/usr/bin/python
# -*- coding: utf8 -*-
#author ch_oosy
import web

from database import *
from output import *
from route import route

@route('/base/team/list')
class BaseTeamList:
    def GET(self):
        return BaseTeamList.getTeamList()

    def POST(self):
        return BaseTeamList.getTeamList()

    @staticmethod
    def getTeamList():
        db = getDb()
        results = db.select('team',order = "team_id desc",
                            what = 'team_id,team_name,school_id')
        team_list =[]
        for i in results:
            team_list.append({"team_id":i.team_id,"team_name":i.team_name,"school_id":i.school_id})

        for i in team_list:
            results = db.select('school', vars = {'id':i['school_id']}, where = "school_id=$id",
                                what = "school_name")
            i['school_name'] = results[0].school_name
            i.pop('school_id')
        return output(200,team_list)