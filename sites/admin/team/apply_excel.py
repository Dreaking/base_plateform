#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web
import base64

from route import route
from output import output
from database import *

@route('/admin/team/apply/excel/get')
class TeamApplyExcelGet:
    def GET(self):
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
        if session['user_type'] not in (0, 1):
            return output(410)

        db = getDb()
        results = db.select('application', vars = {'id':input.application_id},
                            where = "application_id=$id", what = "excel_file")
        if len(results) == 0:
            return output(469)

        return output(200, {'content': results[0].excel_file})
