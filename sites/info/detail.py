#!/usr/bin/python
# -*- coding: utf8 -*-

import web

from database import *
from route import route
from output import output

@route('/info/notice/detail/get')
class InfoNoticeDetailGet:
    def POST(self):
        input = web.input(notice_id = None)
        result = InfoNoticeDetailGet.verifyNoticeId(input.notice_id)
        if result['status'] != 200:
            return output(result['status'])
        else:
            result.pop('status')
            return output(200, result)

    def GET(self):
        input = web.input(notice_id = None)
        result = InfoNoticeDetailGet.verifyNoticeId(input.notice_id)
        if result['status'] != 200:
            return output(result['status'])
        else:
            result.pop('status')
            return output(200, result)


    @staticmethod
    def verifyNoticeId(notice_id):
        if notice_id == None:
            return {'status' : 110}
        try:
            notice_id = int(notice_id)
        except:
            return {'status' : 111}

        db = getDb()
        result = db.select('notice', vars = {'id' : notice_id}, where = "notice_id=$id")
        if len(result) == 1:
            result = result[0]
            return {'status':200, 'title':result.title,
                    'id':result.notice_id,'content':result.content,
                    'add_time':result.add_time,
                    'is_activity':True if result.type == 'activity' else False}
        else:
            return {'status' : 460}