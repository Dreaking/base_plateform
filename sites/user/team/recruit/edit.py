#!/usr/bin/python
# -*- coding: utf8 -*-
# Author : zzz

from route import route
from output import *
from database import *
import web
import time

@route('/team/recruit/edit')
class TeamRecruitEdit:
    def POST(self):
        input = web.input(recruit_id = None , title = None , recruit_num = None , content = None)
        if input.recruit_id == None or input.title == None  or input.recruit_num == None or input.content == None:
            return output(110)

        try :
            input.recruit_id = int(input.recruit_id)
            input.recruit_num = int(input.recruit_num)
        except:
            return output(111)

        if input.recruit_num < 0:
            return output(112)
        input.title = input.title.strip()
        if len(input.title) == 0:
            return output(112)


        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        #负责人的权限才可以
        if session['user_type'] not in (2, 3):
            return output(410)

        db = getDb()
        result = db.select('recruit' , vars = {'recruit_id':input.recruit_id} ,
                           where = "recruit_id=$recruit_id", what = "recruit_id")
        if len(result) == 0:
            return output(468)

        try:
            db.update('recruit' ,  vars = {'recruit_id':input.recruit_id} ,
                      where = "recruit_id=$recruit_id", recruit_title = input.title ,
                      recruit_count = input.recruit_num , content = input.content,
                      add_time = int(time.mktime(time.localtime())))
            return output(200)
        except:
            return output(700)



