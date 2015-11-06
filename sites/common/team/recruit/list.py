#!/usr/bin/python
# -*- coding: utf8 -*-

import web

from database import *
from route import route
from output import *

@route('/team/recruit/list')
class TeamRecruitList:
    def POST(self):
        input = web.input(team_id = None, page_num = None, page_size = None)
        if input.page_num == None or input.page_size == None:
            return output(110)
        try:
            input.page_num = int(input.page_num)
            input.page_size = int(input.page_size)
            if input.team_id != None:
                input.team_id = int(input.team_id)
        except:
            return output(111)

        if input.page_num <= 0 or input.page_size <= 0:
            return output(112)

        session = web.ctx.session
        if session.has_key('user_type') and (session['user_type'] in (2, 3)):
            if input.team_id == None:
                input.team_id = session['team_id']

        db = getDb()
        order = 'add_time desc,recruit_id desc'
        vars = {'start':(input.page_num - 1) * input.page_size,
                'count': input.page_size}
        limit = "$start,$count"
        if input.team_id == None:
            count = db.select('recruit', vars = vars, what = "count(*) as num")[0].num
            results = db.select('recruit', vars = vars, order = order, limit = limit)
        else:
            vars['id'] = input.team_id
            count = db.select('recruit', vars = vars, where = "team_id=$id", what = "count(*) as num")[0].num
            results = db.select('recruit', vars = vars, where = 'team_id=$id',
                                order = order, limit = limit)

        recruit_list = []
        for i in results:
            recruit_list.append({'recruit_id':i.recruit_id, 'title':i.recruit_title,
                                 'team_id':i.team_id, 'recruit_num':i.recruit_count,
                                 'add_time':i.add_time, 'content':i.content})

        for i in recruit_list:
            i['team_name'] = db.select('team', vars = {'id':i['team_id']},
                                                  where = "team_id=$id",
                                                  what = "team_name")[0].team_name

        return output(200, {'recruit_count': count, 'page_num': input.page_num, 'page_size': input.page_size,
                            'recruit_list': recruit_list})

