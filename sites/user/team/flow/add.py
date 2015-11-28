#!/usr/bin/python
# -*- coding: utf8 -*-

from route import route
from output import *
from database import *

import web
import time

@route('/team/flow/add')
class TeamFlowAdd:
    def POST(self):
        input = web.input(description = None, amount = None, layout_two_id = None)
        if input.description == None or input.amount == None or input.layout_two_id == None:
            return output(110)
        try:
            input.amount = float(input.amount)
            input.layout_two_id = int(input.layout_two_id)
        except:
            return output(111)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (2, 3):
            return output(410)
        team_id = session['team_id']

        db = getDb()
        results = db.select('layout_two', vars = {'id':input.layout_two_id},
                            where = "id=$id and (type='all' or type='flow')", what = "parent_id")
        if len(results) == 0:
            return output(475)
        operator_name = db.select('userinfo', vars = {'id':session['user_id']},
                                  where = "user_id=$id", what = 'name')[0].name
        try:
            db.insert('flow', operator_name = operator_name, description = input.description,
                      amount = input.amount, team_id = session['team_id'],
                      layout_two_id = input.layout_two_id,
                      add_time = int(time.mktime(time.localtime())))
        except:
            return output(700)
        return output(200)
