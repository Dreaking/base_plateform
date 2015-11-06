#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from output import output
from route import route
from database import *

@route('/user/account/record/list')
class UserTeamRecordList:
    def POST(self):
        input = web.input(start_date = None, end_date = None, is_refresh = None,
                          record_count = None, last_record_id = None)
        if input.start_date != None and input.end_date == None:
            return output(110)
        if input.start_date == None and input.end_date != None:
            return output(110)
        if input.is_refresh == None:
            return output(110)
        try:
            input.is_refresh = int(input.is_refresh)
            if input.record_count != None:
                input.record_count = int(input.record_count)
            if input.last_record_id != None:
                input.last_record_id = int(input.last_record_id)
            if input.start_date != None:
                input.start_date = int(input.start_date)
            if input.end_date != None:
                input.end_date = int(input.end_date)
        except:
            return output(111)

        if input.record_count <= 0:
            return output(112)

        if input.is_refresh == 0 and input.last_record_id == None:
            return output(110)

        if input.record_count <= 0:
            return output(112)

        if input.start_date != None and input.start_date >= input.end_date:
            return output(112)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (2, 3, 4):
            return output(410)

        db = getDb()

        record_list = []
        vars = {'id':session['team_id']}
        if input.start_date == None:
            where = "team_id=$id"
        else:
            vars['start'] = input.start_date
            vars['end'] = input.end_date
            where = 'team_id=$id and add_time>=$start and add_time<=$end'
        order = "add_time desc, payment_id desc"
        limit = "0,%d" % (input.record_count,)
        if input.is_refresh == 0:
            vars['last'] = input.last_record_id
            where += ' and payment_id<$last'

        results = db.select('payment', vars = vars, where = where, order = order, limit = limit)
        for i in results:
            if i.type == 'admin-de':
                type = 1
            elif i.type == 'admin-in':
                type = 0
            else:
                type = 2
            record_list.append({'payment_id':i.payment_id, 'reason':i.reason, 'amount':i.amount,
                                'count':i.num, 'add_time':i.add_time, 'type':type})

        amount = db.select('team', vars = {'id': session['team_id']}, where = "team_id=$id",
                           what = "balance")[0].balance

        return output(200, {'balance': amount, 'record_list': record_list})

