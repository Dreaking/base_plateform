#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

from route import route
from output import *
from database import *

@route('/school/name/list')
class SchoolList:
    def POST(self):
        return SchoolList.getSchoolList()
    def GET(self):
        return SchoolList.getSchoolList()

    @staticmethod
    def getSchoolList():
        db = getDb()
        results = db.select('school')
        school_list = []
        for i in results:
            school_list.append({'school_id':i.school_id, 'school_name':i.school_name})
        return output(200, school_list)