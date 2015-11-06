#!/usr/bin/python
# -*- coding: utf8 -*-
#Author:ZZZ

from route import route
from database import *
from output import *
import web

@route('/community/post/detail/get')
class CommunityPostDetailGet:
    def POST(self):
        input = web.input(post_id = None)

        if input.post_id == None:
            return output(110)

        try:
            input.post_id = int(input.post_id)
        except:
            return output(111)

        db = getDb()
        result = db.select('post' , vars = {'post_id':input.post_id} ,where = "post_id=$post_id")

        if len(result)==0:
            return output(466)

        post = result[0]

        try:
            nickname = db.select('userinfo' ,vars = {'user_id':post.user_id} ,where = "user_id=$user_id" )[0].nickname
        except:
            nickname = "NULL"

        data = {'post_id':post.post_id , 'title':post.title , 'user_id':post.user_id ,'nickname':nickname ,
                'content':post.content , 'add_time':post.add_time}

        return output(200, data)