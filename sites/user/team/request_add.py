#!/usr/bin/python
# -*- coding: utf8 -*-
# Author :zzz

import web
import time
import base64

from route import route
from output import *
from database import *

@route('/team/request/add')
class teamRequestAdd:
    def POST(self):
        input = web.input(team_name = None, material = None, excel_file = None)
        if input.team_name == None or input.material == None or input.excel_file == None:
            return output(110)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] != 5:
            return output(410)

        db = getDb()
        if len(db.select('userinfo', vars = {'id':session['user_id']}, where = "user_id=$id")) == 0:
            return output(423)

        result = db.select('team' , vars = {'team_name':input.team_name} ,
                           where = "team_name=$team_name", what = "team_id")
        result2 = db.select('application' , vars = {'team_name':input.team_name} ,
                            where = "new_team_name=$team_name", what = "application_id")
        #已经申请了的和已经成立的团队都不冲突
        if len(result) != 0 or len(result2) != 0:
            return output(440)#团队名存在

        try:
            db.insert('application' ,user_id = session['user_id'] ,new_team_name = input.team_name ,
                      status = 'ongoing', add_time = int(time.mktime(time.localtime())),
                      materials = input.material, excel_file = input.excel_file)
            return output(200)
        except:
            return output(700)
