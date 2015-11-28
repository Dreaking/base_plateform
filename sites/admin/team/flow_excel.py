#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web
import xlwt
import xlrd
import StringIO
import base64
import time
import random

from output import output
from route import route
from database import *

@route('/team/flow/excel/export')
class TeamFlowExcelExport:
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

        flow_list = []
        vars = {'id':input.team_id}
        if input.start_date == None:
            where = "team_id=$id"
        else:
            vars['start'] = input.start_date
            vars['end'] = input.end_date
            where = 'team_id=$id and add_time>=$start and add_time<=$end'

        results = db.select('flow', vars = vars, where = where, order = "flow_id asc")
        for i in results:
            add_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(i.add_time))
            flow_list.append({'flow_id':i.flow_id, 'description':i.description, 'amount':i.amount,
                                'operator_name':i.operator_name, 'add_time':add_time,
                              'layout_two_id':i.layout_two_id})
        for i in flow_list:
            layout_two = db.select('layout_two', vars = {'id':i['layout_two_id']}, where = 'id=$id',
                                   what = 'parent_id,name')[0]
            i['layout_one_id'] = layout_two.parent_id
            i['layout_two_name'] = layout_two.name
            layout_one = db.select('layout_one', vars = {'id':layout_two.parent_id},
                                             where = "id=$id", what = 'name, type')[0]
            i['layout_one_name'] = layout_one.name
            i['layout_one_type'] = layout_one.type

        excel_file = xlwt.Workbook()
        sheet = excel_file.add_sheet('flow_list')
        li = [u'id', u'描述', u'一级类型名', u'二级类型名', u'操作人', u'金额', u'添加时间']
        col_name = ['flow_id', 'description', 'layout_one_name', 'layout_two_name',
                    'operator_name', 'amount', 'add_time']
        for col, data in enumerate(li):
            sheet.write(0, col, data)

        for row, data in enumerate(flow_list):
            row += 1
            for col, name in enumerate(col_name):
                sheet.write(row, col, data[name])

        total_expend = 0
        total_income = 0
        for i in flow_list:
            if i['layout_one_type'] == 'increment':
                total_income += i['amount']
            else:
                total_expend += i['amount']
        length = len(flow_list)
        sheet.write(length + 2, 0, u'总收入')
        sheet.write(length + 2, 1, total_income)
        sheet.write(length + 3, 0, u'总支出')
        sheet.write(length + 3, 1, total_expend)
        sheet.write(length + 4, 0, u'总利润')
        sheet.write(length + 4, 1, total_income - total_expend)

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




