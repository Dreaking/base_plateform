#!/usr/bin/python
# -*- coding: utf8 -*-

import web
import xlwt
import xlrd
import StringIO
import base64
import random
import time

from route import route
from output import output
from database import *

@route('/activity/apply/excel/get')
class ActivityApplyExcelGet:
    def POST(self):
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

        excel_file = xlwt.Workbook()
        sheet = excel_file.add_sheet('apply_list')
        li = [u'申请id', u'姓名', u'团队id', u'团队名', u'活动id', u'标题']
        col_name = ['apply_id', 'name', 'team_id', 'team_name', 'activity_id', 'title']
        for col, data in enumerate(li):
            sheet.write(0, col, data)

        for row, data in enumerate(apply_list):
            row += 1
            for col, name in enumerate(col_name):
                sheet.write(row, col, data[name])
        data = StringIO.StringIO()
        excel_file.save(data)
        data.seek(0)
        data = base64.b64encode(data.read())
        filename = str(int(time.mktime(time.localtime()))) + str(random.randint(100000, 999999)) + '.xls'
        while len(db.select('excelfile', vars = {'name':filename}, where = "filename=$name")) != 0:
            filename = str(int(time.mktime(time.localtime()))) + str(random.randint(100000, 999999)) + '.xls'
        try:
            db.insert('excelfile', filename = filename, data = data,
                      add_time = int(time.mktime(time.localtime())))
        except:
            return output(700)

        return output(200, {'file_url':'/excel/file/' + filename})

