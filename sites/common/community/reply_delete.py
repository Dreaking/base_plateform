#!/usr/bin/python
# -*- coding: utf8 -*-
# Author:ZZZ

from route import route
from output import *
from database import *
import web


from output import *
@route('/community/reply/delete')
class CommunityReplyDelete:
    def POST(self):
        # 判断用户
        if not web.ctx.session.has_key('user_id'):
            return output(411)

        input = web.input(reply_id = None )

        #缺少参数
        if input.reply_id == None:
            return output(110)

        #参数错误
        try:
            input.reply_id = int(input.reply_id)
        except:
            return output(111)


        db = getDb()
        result =  db.select('reply' , vars = {'reply_id':input.reply_id} , where = "reply_id=$reply_id")


        #reply_id 不存在
        if len(result) == 0:
            return output(467)

        #判断用户的type 能否执行操作
        type = web.ctx.session['user_type']

        #管理员
        if type == 0 or type == 1:

            try:
                db.delete('reply' , vars = {'reply_id':input.reply_id} , where = "reply_id=reply_id" )
                return output(200)
            except:
                return output(700)

        #其他权限
        else :

            #user_id 是 发回复人的id  ； poster_id 发帖人的id

            result = result[0]

            user_id = result.user_id
            #上面的result和下面的不一样

            post_id = result.post_id
            result =  db.select('post' , vars = {'post_id':post_id} , where = "post_id=$post_id")

            if len(result) == 0:
                return output(466)

            poster_id = result[0].user_id

            #只有本人的贴 ， 或则本人的回复可以删。
            if web.ctx.session['user_id'] != poster_id or web.ctx.session['user_id'] != user_id:
                return output(410)
            try:
                db.delete('reply' , vars = {'reply_id':input.reply_id} , where = "reply_id=$reply_id" )
                return output(200)
            except:
                return output(700)
        pass