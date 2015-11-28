#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web
import base64
import xlwt
import xlrd
import time
import StringIO
import random

from route import route
from output import output
from database import *

@route('/admin/team/apply/excel/get')
class TeamApplyExcelGet:
    def GET(self):
        input = web.input(application_id = None)
        if input.application_id == None:
            return output(110)

        try:
            input.application_id = int(input.application_id)
        except:
            return output(111)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1):
            return output(410)

        db = getDb()
        results = db.select('application', vars = {'id':input.application_id},
                            where = "application_id=$id", what = "new_team_name")
        if len(results) == 0:
            return output(469)
        results = results[0].new_team_name
        team_id = db.select('team', vars = {'name':results}, where = "team_name=$name", what = "team_id")[0].team_id
        results = db .select('user', vars = {'team_id':team_id}, where = "team_id=$team_id", what = "user_id,type")
        user_list = []
        for i in results:
            user_list.append({'user_id':i.user_id, 'type':i.type})
        for i in user_list:
            userinfo = db.select('userinfo', vars = {'id':i['user_id']}, where = "user_id=$id")[0]
            school_id = userinfo.school_id
            major_id = userinfo.major_id
            userinfo = {'name':userinfo.name, 'id_type':userinfo.id_type, 'id_number':userinfo.id_number,
                    'education_degree':userinfo.education_degree, 'citizenship':userinfo.citizenship,
                    'nationality':userinfo.nationality, 'characters':userinfo.characters,
                    'address':userinfo.address, 'address_detail':userinfo.address_detail,
                    'phone':userinfo.phone, 'grade':userinfo.grade, 'political_face':userinfo.political_face,
                    'school_id':userinfo.school_id, 'major_id':userinfo.major_id, 'sid':userinfo.sid,
                    'email':userinfo.email, 'birthday':userinfo.birthday, 'nickname':userinfo.nickname,
                    'is_male': True if userinfo.gender == 'male' else False}
            if userinfo['is_male'] == True:
                userinfo['gender'] = u'男'
            else:
                userinfo['gender'] = u'女'
            userinfo['school_name'] = db.select('school', vars = {'id':school_id}, where = "school_id=$id",
                            what = 'school_name')[0].school_name
            userinfo['major_name'] = db.select('major', vars = {'id':major_id}, where = "major_id=$id",
                            what = 'major_name')[0].major_name
            for j in userinfo:
                i[j] = userinfo[j]
            if i['type'] == 2:
                i['type'] = u'主要负责人'
            elif i['type'] == 3:
                i['type'] = u'次要负责人'
            else:
                i['type'] = u'普通成员'

        excel_file = xlwt.Workbook()
        sheet = excel_file.add_sheet('request_list')
        li = [u'用户id', u'姓名', u'性别', u'学号', u'学院', u'专业', u'年级', u'职务', u'联系电话',
              u'生日', u'email', u'地址', u'具体地址', u'证件类型', u'证件号码',
              u'受教育程度', u'国籍', u'民族', u'户口性质', u'政治面貌']
        col_name = ['user_id', 'name', 'gender', 'sid', 'school_name', 'major_name', 'grade', 'type', 'phone',
                    'birthday', 'email', 'address', 'address_detail', 'id_type', 'id_number',
                    'education_degree', 'citizenship', 'nationality', 'characters', 'political_face']
        for col, data in enumerate(li):
            sheet.write(0, col, data)

        for row, data in enumerate(user_list):
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
