#!/usr/bin/python
# -*- coding: utf8 -*-
#author:raunicorn

import web
from database import *
from output import *
from route import route

@route('/admin/community/post/list')
class AdminCommunityReplyList:
    def POST(self):
        input=web.input(section_id = None, page_num = None, page_size = None)
        if input.section_id == None or input.page_num == None or input.page_size == None:
            return output(110)
        try:
            input.section_id = int(input.section_id)
            input.page_num = int(input.page_num)
            input.page_size = int(input.page_size)
        except:
            return output(111)

        if input.page_size <= 0 or input.page_num <= 0:
            return output(112)

        session=web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1):
            return output(410)

        db=getDb()
        post_list = []
        if len(db.select('section',vars={'id':input.section_id},where='section_id=$id')) == 0:
            return output(465)

        count = db.select('post', vars = {'id':input.section_id}, where = "section_id=$id",
                          what = "count(*) as num")[0].num
        results = db.select('post', vars = {'id':input.section_id, 'start': (input.page_num - 1) * input.page_size,
                                            'count': input.page_size},
                            where = "section_id=$id",
                            limit = "$start,$count",
                            order = 'add_time desc, post_id desc')
        for i in results:
            post_list.append({'post_id':i.post_id,'content':i.content,'user_id':i.user_id,
                              'title':i.title, 'add_time':i.add_time})
        for i in post_list:
            results = db.select('userinfo', vars = {'id':i['user_id']}, where = "user_id=$id")
            i['nickname'] = results[0].nickname
        return output(200,{'post_count':count, 'page_num':input.page_num, 'page_size':input.page_size,
                           'post_list':post_list})
