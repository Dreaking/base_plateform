#!/usr/bin/python
# -*- coding: utf8 -*-
#Author:ZZZ

import web
import time

from route import route
from output import *
from database import *

@route('/community/reply/add')
class CommunityReplyAdd:
    def POST(self):
        input = web.input(post_id = None , content =  None)

        if input.post_id == None or input.content == None:
            return output(110)

        try:
            input.post_id = int(input.post_id)
        except:
            return output(111)

        if not web.ctx.session.has_key('user_id'):
            return output(411)
        if web.ctx.session['user_type'] not in (2, 3, 4, 5):
            return output(410)

        user_id =  web.ctx.session['user_id']
        db = getDb()

        userinfo = db.select('userinfo' , vars={'user_id':user_id} ,where="user_id=$user_id")

        if len(userinfo)==0:
             return output(423)

        post = db.select('post' , vars={'post_id':input.post_id} , where = "post_id=$post_id")

        if len(post)==0:
            return output(465)

        db.insert('reply' , user_id = user_id , post_id = input.post_id ,content = input.content,
                  add_time = int(time.mktime(time.localtime())))

        return output(200)
