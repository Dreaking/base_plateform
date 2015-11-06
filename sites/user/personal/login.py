#!/usr/bin/python
#-*- coding: utf8 -*-

import web

from route import route
from database import *
from output import output
from encrypt import *

@route('/user/login')
class UserLogin:
    def POST(self):
        input = web.input(username = None, password = None)
        if input.username == None or input.password == None:
            return output(110)

        db = getDb()
        results = db.select('user', vars = {'username':input.username}, where = "login_name=$username")
        if len(results) == 0:
            return output(422)
        user = results[0]
        if user.type == '6':
            return output(422)
        if user.password != encrypt(input.password):
            return output(430)

        session = web.ctx.session
        session['user_id'] = user.user_id
        session['login_name'] = user.login_name
        session['user_type'] = int(user.type)
        session['team_id'] = user.team_id

        return output(200, {'type':int(user.type)})

