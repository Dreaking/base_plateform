#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from route import route
from output import output
from database import *

@route('/admin/team/apply/approve')
class TeamApplyApprove:
    def POST(self):
        input = web.input(application_id = None)
        if input.application_id == None:
            return output(110)
        try:
            input.application_id = int(input.application_id)
        except:
            return output(111)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] != 0:
            return output(410)

        db = getDb()
        user_id = db.select('application', vars = {'id':input.application_id},
                         where = "application_id=$id and status='ongoing'")
        if len(user_id) == 0:
            return output(469)
        user_id = user_id[0]
        team_name = user_id.new_team_name
        user_id = user_id.user_id

        t = db.transaction()
        try:
            db.update('application', vars = {'id':input.application_id}, where = "application_id=$id",
                      status = 'approved')
            school_id = db.select('userinfo', vars = {'id':user_id},
                                  where = "user_id=$id", what = "school_id")[0].school_id
            team_id = db.insert('team', team_name = team_name, school_id = school_id,
                                balance = 0, manager_id = user_id, is_settled = 'false')
            db.update('user', vars = {'id': user_id}, where = "user_id=$id", type = '2', team_id = team_id)
            t.commit()
        except:
            t.rollback()
            return output(700)

        return output(200)
