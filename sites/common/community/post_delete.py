#!/usr/bin/python
# -*- coding: utf8 -*-
# Author:ZZZ

import web
from route import route
from output import *
from database import *

@route('/community/post/delete')
class CommunityPostDelete:
    def POST(self):
        if not web.ctx.session.has_key('user_id'):
            return output(411)

        input = web.input(post_id = None )

        if input.post_id == None:
            return output(110)

        try:
            input.post_id = int(input.post_id)
        except:
            return output(111)

        db = getDb()
        result =  db.select('post' , vars = {'post_id':input.post_id} , where = "post_id=$post_id")

        if len(result) == 0:
            return output(466)

        #判断用户的type 能否执行操作


        type = web.ctx.session['user_type']
        #管理员
        if type == 0 or type == 1:
            t = db.transaction()
            try:
                db.delete('post' , vars = {'post_id':input.post_id} , where = "post_id=$post_id" )
                db.delete('reply' , vars = {'post_id':input.post_id} , where = "post_id=$post_id" )
            except:
                t.rollback()
                return output(700)
            else:
                t.commit()
                return output(200)

        #其他权限
        else :
            user_id = result[0].user_id
            #非本人
            if web.ctx.session['user_id'] != user_id:
                return output(410)

            t = db.transaction()
            try:
                db.delete('post' , vars = {'post_id':input.post_id} , where = "post_id=$post_id" )
                db.delete('reply' , vars = {'post_id':input.post_id} , where = "post_id=$post_id" )
            except:
                t.rollback()
                return output(700)
            else:
                t.commit()
                return output(200)


