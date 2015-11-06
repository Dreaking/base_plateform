#!/usr/bin/python
# -*- coding: utf8 -*-
#Author:ZZZ

from route import route
from output import *
from database import *
import web

@route('/user/post/list')
class CommunityPostList:
    def POST(self):
        return CommunityPostList.getPostList()
    def GET(self):
        return CommunityPostList.getPostList()

    @staticmethod
    def getPostList():
        input = web.input(is_refresh = None, post_count = 10, last_post_id = None)
        if input.is_refresh == None:
            return output(110)

        try:
            input.is_refresh = int(input.is_refresh)
            input.post_count = int(input.post_count)
            if input.last_post_id != None:
                input.last_post_id = int(input.last_post_id)
        except:
            return output(111)

        if input.is_refresh == 0 and input.last_post_id == None:
            return output(110)

        if input.post_count <= 0:
            return output(112)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (2, 3, 4, 5):
            return output(410)

        db = getDb()

        # != 0 是第一次
        if input.is_refresh != 0:
            results = db.select('post', vars = {'post_count' : input.post_count,
                                                'id': session['user_id']},
                                where = "user_id=$id",
                                limit = "0, $post_count",
                                order = "add_time desc",)
        # == 0 是继续加载
        else:
            vars = {'post_count':input.post_count, 'last_id':input.last_post_id, 'id': session['user_id']}
            where = "post_id<$last_id and user_id=$id"
            results = db.select('post',vars = vars, where = where, limit = "0, $post_count", order = "post_id desc")

        post_list = []
        for i in results:
            try:
                nickname = db.select('userinfo' ,vars = {'user_id':i.user_id} ,where = "user_id=$user_id" )[0].nickname
            except:
                nickname = None
            section_name = db.select('section', vars = {'id':i.section_id}, where = "section_id=$id")[0].section_name
            count = db.select('reply', vars = {'id':i.post_id}, where = "post_id=$id", what = "count(*) as num")[0].num
            post_list.append({'post_id' : i.post_id, 'title' : i.title, 'user_id' :i.user_id , 'nickname':nickname,
                              'add_time':i.add_time, 'section_name':section_name, 'reply_count':count})
        return output(200, post_list)