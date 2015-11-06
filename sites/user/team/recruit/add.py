#!/usr/bin/python
# -*- coding: utf8 -*-
#Author : zzz

from route import route
from database import *
from output import *
import web
import time

@route('/team/recruit/add')
class TeamRecruitAdd:
    def POST(self):
        input = web.input(title = None , recruit_num = None , content = None)
        #缺少必填参数
        if input.title== None or input.recruit_num == None or input.content == None:
            return output(110)
        try:
            recruit_num = int(input.recruit_num)
        except:
            return output(111)

        if recruit_num < 0:
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
        try :
            db.insert('recruit' ,recruit_title = input.title , team_id = session['team_id'] ,
                      recruit_count = recruit_num ,content = input.content,
                      add_time = int(time.mktime(time.localtime())))
            return output(200)
        except:
            return output(700)

