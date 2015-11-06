#!/usr/bin/python
# -*- coding: utf8 -*-

import web

from database import *
from route import route
from output import *

@route('/team/recruit/detail')
class TeamRecruitDetail:
    def POST(self):
        input = web.input(recruit_id = None)
        if input.recruit_id == None:
            return output(110)
        try:
            input.recruit_id = int(input.recruit_id)
        except:
            return output(111)

        db = getDb()
        results = db.select('recruit', vars = {'id':input.recruit_id},
                         where = "recruit_id=$id")
        if len(results) == 0:
            return output(468)
        results = results[0]

        info = {'recruit_id':results.recruit_id, 'title':results.recruit_title,
                                 'team_id':results.team_id,
                                'recruit_num':results.recruit_count,
                                 'add_time':results.add_time, 'content':results.content}
        info['team_name'] = db.select('team', vars = {'id':info['team_id']},
                                                  where = "team_id=$id",
                                                  what = "team_name")[0].team_name

        return output(200, info)
