#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

from route import route
from output import *
from database import *

@route('/school/major/list')
class SchoolMajorList:
    def POST(self):
        return SchoolMajorList.getSchoolMajorList()
    def GET(self):
        return SchoolMajorList.getSchoolMajorList()

    @staticmethod
    def getSchoolMajorList():
        db = getDb()
        results = db.select('school')
        school_list = []
        for i in results:
            school_list.append({'school_id':i.school_id, 'school_name':i.school_name, 'major_list':[]})
        for i in school_list:
            results = db.select('major', vars = {'id':i['school_id']}, where = "school_id=$id")
            for j in results:
                i['major_list'].append({'major_id':j.major_id, 'major_name':j.major_name})
        return output(200, school_list)