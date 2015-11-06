#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web
import base64

from route import route
from output import output
from database import *

@route('/base/description/edit')
class BaseDescriptionEdit:
    def POST(self):
        input = web.input(content = None, logo_file = None)
        if input.content == None or input.logo_file == None:
            return output(110)

        if len(input.content) == 0:
            return output(112)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1):
            return output(410)

        db = getDb()
        try:
            db.update('base_desc', where = "id=1",
                      description = input.content, logo = input.logo_file)
        except:
            return output(700)

        return output(200)

