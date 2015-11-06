#!/usr/bin/python
# -*- coding: utf8 -*-
#author ch_oosy
from route import route
import web

from database import *
from output import *
@route('/admin/admin/delete')
class AdminDeleteAdmin:
    def POST(self):
        input = web.input(user_id = None)
        if input.user_id == None:
            return output(110)

        try:
            input.user_id = int(input.user_id)
        except:
            return output(111)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] != 0:
            return output(410)

        db = getDb()
        myvars = {'id':input.user_id}
        results = db.select("user",vars=myvars,where = "user_id=$id",what = "type")
        if len(results) == 0:
            return output(463)
        if results[0].type != '1':
                return output(470)

        t = db.transaction()
        try:
            db.delete('user', vars = myvars, where = "user_id=$id")
            db.delete("userinfo",vars =myvars,where ="user_id=$id")
            t.commit()
        except:
            t.rollback()
            return output(700)
        return output(200)

