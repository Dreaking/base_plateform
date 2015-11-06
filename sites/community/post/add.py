#!/usr/bin/python
# -*- coding: utf8 -*-
#Author:ZZZ

from route import route
from output import *
from database import *
import web
import time

@route('/community/post/add')
class CommunityPostAdd:
    def POST(self):
        input = web.input(section_id  = None , title = None , content =  None)
        if input.section_id == None or input.title == None or input.content == None:
            return output(110)

        try:
            input.section_id = int(input.section_id)
        except:
            return output(111)

        if len(input.title)<1 or len(input.title) > 20:
            return output(112)


        if not web.ctx.session.has_key('user_id'):
            return output(411)
        user_id =  web.ctx.session['user_id']
        if web.ctx.session['user_type'] not in (2, 3, 4, 5):
            return output(410)


        db = getDb()

        userinfo = db.select('userinfo' , vars={'user_id':user_id} ,where="user_id=$user_id")

        if len(userinfo)==0:
            return output(423)

        db.insert('post' , user_id = user_id , section_id = input.section_id , title = input.title ,
                   content = input.content, add_time = int(time.mktime(time.localtime())))

        return output(200)








