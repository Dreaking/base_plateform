#!/usr/bin/python
# -*- coding: utf8 -*-

import web
from database import *
from output import *
from route import route

@route('/community/section/delete')
class CommunitySectionDelete:
    def POST(self):
        input=web.input(section_id = None)
        if input.section_id == None:
            return output(110)
        try:
            input.section_id = int(input.section_id)
        except:
            return output(111)

        session=web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1):
            return output(410)

        db=getDb()
        result=db.select('section',vars={'section_id':input.section_id},where='section_id=$section_id')
        if len(result)==0:
            return output(465)
        try:
            db.delete('section',vars={'section_id':input.section_id},where='section_id=$section_id')
            return output(200)
        except:
            return output(700)