#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web
import time
import json

from output import output
from route import route
from database import *

@route('/team/account/batch/increase')
class TeamAccountBatchIncrease:
    def POST(self):
        input = web.input(team_ids = None, amount = None, reason = None)
        if input.team_ids == None or input.amount == None or input.reason == None:
            return output(110)

        try:
            input.team_ids = json.loads(input.team_ids)
            for i in range(0, len(input.team_ids)):
                input.team_ids[i] = int(input.team_ids[i])
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

        t = db.transaction()
        try:
            sql = "update team set balance=balance+$amount where team_id=$id"
            vars = {'amount': input.amount}
            for i in input.team_ids:
                vars['id'] = i
                db.query(sql, vars = {'id':input.team_id, 'amount': input.amount})
                db.insert('payment', reason = input.reason, amount = input.amount, team_id = input.team_id,
                      add_time = int(time.mktime(time.localtime())), type = 'admin-in', num = 1)
            t.commit()
        except:
            t.rollback()
            return output(700)

        return output(200)