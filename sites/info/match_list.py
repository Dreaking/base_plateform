#!/usr/bin/python
# -*- coding: utf8 -*-
#author:raunicorn

import web

from database import *
from route import route
from output import *

@route('/info/match/list')
class InfoMatchList:
    def POST(self):
        input = web.input(is_refresh = 0, notice_count = 10, last_notice_id = None)

        try:
            input.is_refresh = int(input.is_refresh)
            input.notice_count = int(input.notice_count)
            if input.last_notice_id != None:
                input.last_notice_id = int(input.last_notice_id)
        except:
            #返回类型错误 状态码
            return output(111)

        if input.is_refresh == 0 and input.last_notice_id == None:
            #返回缺少必填参数 状态码
            return output(110)

        if input.notice_count <= 0:
            #返回参数值非法 状态码
            return output(112)

        db = getDb()
        if input.is_refresh != 0:
            results = db.select('notice', vars = {'count' : input.notice_count},
                                where = "type='match'",
                                limit = "0, $count",
                                order = "add_time desc",
                                what = "notice_id, title, add_time")
        else:
            results = db.select('notice', vars = {'count' : input.notice_count,
                                                  'last_id' : input.last_notice_id},
                                where = "type='match' and notice_id<$last_id",
                                limit = "0, $count",
                                order = "add_time desc,notice_id desc",
                                what = "notice_id, title, add_time")
        notice_list = []
        for i in results:
            notice_list.append({'notice_id' : i.notice_id, 'title' : i.title, 'add_time' : i.add_time})
        return output(200, notice_list)
