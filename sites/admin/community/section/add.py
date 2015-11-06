#!/usr/bin/python
# -*- coding: utf8 -*-
#author:raunicorn

import web
from route import route
from database import *
from output import *
from web import *

@route('/community/section/add')
class CommunitySectionAdd:
    def POST(self):
        input=web.input(name = None)
        session=web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type']!=0:
            return output(410)
        if input.name==None:
            return output(110)
        if len(input.name.strip())>20:
            return output(112)
        db=getDb()
        try:
            section_id=db.insert('section',section_name=input.name,view_count=0)
            return output(200)
        except:
            return output(700)
