#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web
import time

from output import output
from route import route
from database import *

@route('/team/account/increase')
class TeamAccountIncrease:
    def POST(self):
        input = web.input(team_id = None, amount = None, reason = None, layout_two_id = None)
        if input.team_id == None or input.amount == None or input.reason == None:
            return output(110)

        try:
            input.team_id = int(input.team_id)
            input.amount = float(input.amount)
            input.layout_two_id = int(input.layout_two_id)
        except:
            return output(111)

        input.reason = input.reason.strip()
        if len(input.reason) == 0:
            return output(112)

        if input.amount <= 0:
            return output(112)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1):
            return output(410)

        db = getDb()
        results = db.select('team', vars = {'id':input.team_id}, where = "team_id=$id")
        if len(results) == 0:
            return output(464)
        results = db.select('layout_two', vars = {'id':input.layout_two_id},
                            where = "id=$id and (type='all' or type='payment')", what = "parent_id")
        if len(results) == 0:
            return output(475)
        type = db.select('layout_one', vars = {'id':results[0].parent_id},
                            where = "id=$id", what = 'type')[0].type
        if type == 'decrement':
            return output(475)

        t = db.transaction()
        try:
            sql = "update team set balance=balance+$amount where team_id=$id"
            db.query(sql, vars = {'id':input.team_id, 'amount': input.amount})
            db.insert('payment', reason = input.reason, amount = input.amount, team_id = input.team_id,
                      add_time = int(time.mktime(time.localtime())),
                      layout_two_id = input.layout_two_id, num = 1)
            t.commit()
        except:
            t.rollback()
            return output(700)

        return output(200)