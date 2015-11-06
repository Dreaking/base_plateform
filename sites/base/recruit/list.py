#!/usr/bin/python
# -*- coding: utf8 -*-
#author ch_oosy

import web

from route import route
from database import *
from output import *

@route('/base/recruit/list')

class BaseRecruitList:
    def POST(self):
        return BaseRecruitList.getRecruitList()
    def GET(self):
        return BaseRecruitList.getRecruitList()

    @staticmethod
    def getRecruitList():
        input = web.input(is_refresh = 0, recruit_count = 10, last_recruit_id = None)

        try:
            input.is_refresh = int(input.is_refresh)
            input.recruit_count = int(input.recruit_count)
            if input.last_recruit_id != None:
                input.last_recruit_id = int(input.last_recruit_id)
            if input.recruit_count <=0:
                return output(112)
        except:
            return output(111)

        if input.is_refresh == 0 and input.last_recruit_id == None:
            return output(110)

        db = getDb()
        if input.is_refresh != 0:
            results = db.select('recruit', vars = {'count' : input.recruit_count},
                                limit = "0, $count",
                                order = "recruit_id desc",
                                what = "recruit_id, recruit_title,team_id,add_time")
        else:
            results = db.select('recruit', vars = {'count' : input.recruit_count,
                                                  'last_id' : input.last_recruit_id},
                                where = "recruit_id<$last_id",
                                limit = "0, $count",
                                order = "recruit_id desc",
                                what = "recruit_id, recruit_title,team_id,add_time")
        recruit_list = []

        for i in results:
            recruit_list.append({'recruit_id' :i.recruit_id,'recruit_title': i.recruit_title,'team_id':i.team_id,
                                'add_time' : i.add_time})

        for i in recruit_list:
            i['team_name'] = db.select('team', vars = {'id': i['team_id']}, where = "team_id=$id",
                                       what = "team_name")[0].team_name
        return output(200, recruit_list)


