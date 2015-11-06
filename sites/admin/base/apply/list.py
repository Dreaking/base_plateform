#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from output import output
from route import route
from database import *

@route('/activity/apply/list')
class ActivityApplyList:
    def POST(self):
        return ActivityApplyList.getApplyList()
    def GET(self):
        return ActivityApplyList.getApplyList()

    @staticmethod
    def getApplyList():
        input = web.input(activity_id = None)
        try:
            if input.activity_id != None:
                input.activity_id = int(input.activity_id)
        except:
            return output(111)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1):
            return output(410)

        db = getDb()
        if input.activity_id != None:
            if len(db.select('notice', vars = {'id':input.activity_id},
                                    where = "notice_id=$id and type='activity'")) == 0:
                return output(460)

            results = db.select('apply', vars = {'id':input.activity_id},
                                where = "activity_id=$id", order = "apply_id desc")
        else:
            results = db.select('apply', order = "apply_id desc")

        apply_list = []
        for i in results:
            apply_list.append({'apply_id':i.apply_id, 'user_id':i.user_id, 'activity_id':i.activity_id})

        for i in apply_list:
            i['name'] = db.select('userinfo', vars = {'id':i['user_id']},
                             where = "user_id=$id", what = "name")[0].name
            i['team_id'] = db.select('user', vars = {'id':i['user_id']},
                             where = "user_id=$id", what = "team_id")[0].team_id
            if i['team_id'] != None:
                i['team_name'] = db.select('team', vars = {'id':i['team_id']}, where = "team_id")[0].team_name
            else:
                i['team_name'] = None
            i['title'] = db.select('notice', vars = {'id':i['activity_id']},
                              where = "notice_id=$id")[0].title
            i.pop('user_id')
        return output(200, apply_list)



