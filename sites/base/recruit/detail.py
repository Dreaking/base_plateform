#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from route import route
from database import *
from output import output

@route('/base/recruit/detail/get')
class BaseRecruitDetailGet:
    def POST(self):
        input = web.input(recruit_id = None)

        if input.recruit_id == None:
            return output(110)
        try:
            input.recruit_id = int(input.recruit_id)
        except:
            return output(111)

        db = getDb()
        recruit_info = db.select('recruit', vars = {'id':input.recruit_id}, where = "recruit_id=$id")
        if len(recruit_info) == 0:
            return output(468)

        recruit_info = recruit_info[0]
        team_name = db.select('team', vars = {'id':recruit_info.team_id},
                              where = "team_id=$id", what = "team_name")[0].team_name
        return output(200, {'id':recruit_info.recruit_id, 'title':recruit_info.recruit_title,
                            'content':recruit_info.content, 'recruit_num':recruit_info.recruit_count,
                            'add_time':recruit_info.add_time, 'team_id':recruit_info.team_id,
                            'team_name':team_name})
