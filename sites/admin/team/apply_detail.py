#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from route import route
from output import output
from database import *

@route('/admin/team/apply/detail/get')
class TeamApplyDetailGet:
    def GET(self):
        return TeamApplyDetailGet.getTeamApplyDetailGet()
    def POST(self):
        return TeamApplyDetailGet.getTeamApplyDetailGet()

    @staticmethod
    def getTeamApplyDetailGet():
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
        results = db.select('application', vars = {'id':input.application_id},
                            where = "application_id=$id")
        if len(results) == 0:
            return output(469)


        results = results[0]
        detail = {}
        detail['team_name'] = results.new_team_name
        detail['operate_range'] = results.operate_range
        detail['manager_name'] = results.manager_name
        detail['guide_teacher'] = results.guide_teacher
        detail['class_name'] = results.class_name
        detail['project_desc'] = results.project_desc
        detail['team_desc'] = results.team_desc
        detail['apply_reason'] = results.apply_reason
        detail['user_list'] = results.user_list
        return output(200, detail)

