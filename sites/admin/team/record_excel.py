#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web
import xlwt
import xlrd
import time
import random
import base64
import StringIO

from output import output
from route import route
from database import *

@route('/admin/account/record/excel/export')
class AdminAccountRecordExcelExport:
    def POST(self):
        input = web.input(team_id = None, start_date = None, end_date = None)
        if input.team_id == None:
            return output(110)
        if input.start_date != None and input.end_date == None:
            return output(110)
        if input.start_date == None and input.end_date != None:
            return output(110)
        try:
            input.team_id = int(input.team_id)
            if input.start_date != None:
                input.start_date = int(input.start_date)
            if input.end_date != None:
                input.end_date = int(input.end_date)
        except:
            return output(111)

        if input.start_date != None and input.end_date != None and input.start_date >= input.end_date:
            return output(112)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1):
            return output(410)

        db = getDb()
        if len(db.select('team', vars = {'id': input.team_id}, where = "team_id=$id", what = "team_id")) == 0:
            return output(464)

        record_list = []
        vars = {'id':input.team_id}
        if input.start_date == None:
            where = "team_id=$id"
        else:
            vars['start'] = input.start_date
            vars['end'] = input.end_date
            where = 'team_id=$id and add_time>=$start and add_time<=$end'

        results = db.select('payment', vars = vars, where = where,
                            order = "add_time desc, payment_id desc")
        for i in results:
            add_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(i.add_time))
            record_list.append({'payment_id':i.payment_id, 'reason':i.reason, 'amount':i.amount,
                                'count':i.num, 'add_time':add_time, 'layout_two_id':i.layout_two_id})
        for i in record_list:
            layout_two = db.select('layout_two', vars = {'id':i['layout_two_id']}, where = 'id=$id',
                                   what = 'parent_id,name')[0]
            i['layout_one_id'] = layout_two.parent_id
            i['layout_two_name'] = layout_two.name
            i['layout_one_name'] = db.select('layout_one', vars = {'id':layout_two.parent_id},
                                             where = "id=$id", what = 'name')[0].name

        excel_file = xlwt.Workbook()
        sheet = excel_file.add_sheet('record_list')
        li = [u'id', u'描述', u'一级类型名', u'二级类型名', u'金额', u'数量', u'添加时间']
        col_name = ['payment_id', 'reason', 'layout_one_name', 'layout_two_name',
                    'amount', 'count', 'add_time']
        for col, data in enumerate(li):
            sheet.write(0, col, data)

        for row, data in enumerate(record_list):
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
