#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web
import time

from output import output
from route import route
from database import *

@route('/team/account/decrease')
class TeamAccountDecrease:
    def POST(self):
        input = web.input(team_id = None, amount = None, reason = None)
        if input.team_id == None or input.amount == None or input.reason == None:
            return output(110)

        try:
            input.team_id = int(input.team_id)
            input.amount = float(input.amount)
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
        results = db.select('team', vars = {'id':input.team_id},
                            where = "team_id=$id", what = "balance")
        if len(results) == 0:
            return output(464)

        balance = results[0].balance
        if balance < input.amount:
            return output(482)

        t = db.transaction()
        try:
            sql = "update team set balance=balance-$amount where team_id=$id and balance>=$amount"
            db.query(sql, vars = {'id':input.team_id, 'amount': input.amount})
            db.insert('payment', reason = input.reason, amount = input.amount, team_id = input.team_id,
                      add_time = int(time.mktime(time.localtime())), type = 'admin-de', num = 1)
            t.commit()
        except:
            t.rollbakc()
            return output(700)

        return output(200)