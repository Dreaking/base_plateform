#!/usr/bin/python
# -*- coding: utf8 -*-
#Author:zzz

from route import route
from output import *
from database import *
import web

@route('/user/reply/list')
class CommunityReplyList:
    def POST(self):
        return CommunityReplyList.getReplyList()
    def GET(self):
        return CommunityReplyList.getReplyList()

    @staticmethod
    def getReplyList():
        input = web.input(is_refresh = 0, reply_count = 10, last_reply_id = None)
        if input.post_id == None:
            return output(110)
        try:
            input.post_id = int(input.post_id)
            input.is_refresh = int(input.is_refresh)
            input.reply_count = int(input.reply_count)
            if input.last_reply_id != None:
                input.last_reply_id = int(input.last_reply_id)
        except:
            #返回类型错误 状态码
            return output(111)



        if input.is_refresh == 0 and input.last_reply_id == None:
            return output(110)

        if input.reply_count <= 0:
            #返回参数值非法 状态码
            return output(112)

        db = getDb()
        #post_id 不存在
        post = db.select('post' , vars = {'post_id':input.post_id} , where = "post_id=$post_id")
        if len(post) == 0:
            return output(466)

        if input.is_refresh != 0:
            results = db.select('reply', vars = {'post_id' : input.post_id ,
                                                 'reply_count' : input.reply_count},
                                where = "post_id=$post_id",
                                limit = "0, $reply_count",
                                order = "reply_id desc",)
        else:
            results = db.select('reply',vars = {'post_id' : input.post_id ,
                                                'reply_count' : input.reply_count,
                                                'last_id':input.last_reply_id
                                                },
                                where = "post_id=$post_id and reply_id<$last_id",
                                limit = "0, $reply_count",
                                order = "reply_id desc",)

        reply_list = []
        for i in results:
            try:
                nickname = db.select('userinfo' ,vars = {'user_id':i.user_id} ,
                                     where = "user_id=$user_id" )[0].nickname
            except:
                nickname = None
            reply_list.append({'reply_id' : i.reply_id, 'content' : i.content, 'user_id' :i.user_id ,
                               'nickname':nickname ,'add_time':i.add_time})
        return output(200, reply_list)
