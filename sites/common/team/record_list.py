#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from output import output
from route import route
from database import *

@route('/account/record/list')
class UserTeamRecordList:
    def POST(self):
        input = web.input(team_id = None, start_date = None, end_date = None,
                          page_num = None, page_size = None)
        if input.page_num == None or input.page_size == None:
            return output(110)
        if input.start_date != None and input.end_date == None:
            return output(110)
        if input.start_date == None and input.end_date != None:
            return output(110)
        try:
            if input.team_id != None:
                input.team_id = int(input.team_id)
            input.page_num = int(input.page_num)
            input.page_size = int(input.page_size)
            if input.start_date != None:
                input.start_date = int(input.start_date)
            if input.end_date != None:
                input.end_date = int(input.end_date)
        except:
            return output(111)

        if input.start_date != None and input.end_date != None and input.start_date >= input.end_date:
            return output(112)
        if input.page_num <= 0 or input.page_size <= 0:
            return output(112)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1, 2, 3, 4):
            return output(410)

        if session['user_type'] in (0, 1) and input.team_id == None:
            return output(110)

        if session['user_type'] not in (0, 1):
            input.team_id = session['team_id']

        db = getDb()
        if len(db.select('team', vars = {'id': input.team_id}, where = "team_id=$id", what = "team_id")) == 0:
            return output(464)

        record_list = []
        vars = {'id':input.team_id, 'num':input.page_size * (input.page_num - 1), 'size':input.page_size}
        limit = "$num,$size"
        if input.start_date == None:
            where = "team_id=$id"
        else:
            vars['start'] = input.start_date
            vars['end'] = input.end_date
            where = 'team_id=$id and add_time>=$start and add_time<=$end'

        count = db.select('payment', vars = vars, where = where, what = "count(*) as num")[0].num
        results = db.select('payment', vars = vars, where = where, limit = limit,
                            order = "add_time desc, payment_id desc")
        for i in results:
            if i.type == 'admin-de':
                type = 1
            elif i.type == 'admin-in':
                type = 0
            else:
                type = 2
            record_list.append({'payment_id':i.payment_id, 'reason':i.reason, 'amount':i.amount,
                                'count':i.num, 'add_time':i.add_time, 'type':type})

        return output(200, {'record_count': count, 'page_num': input.page_num, 'page_size': input.page_size,
                            'record_list': record_list})

