#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from route import route
from output import *
from database import *

@route('/major/name/list')
class MajorList:
    def POST(self):
        return MajorList.getMajorList()
    def GET(self):
        return MajorList.getMajorList()

    @staticmethod
    def getMajorList():
        input = web.input(school_id = None)
        if input.school_id == None:
            return output(110)
        try:
            input.school_id = int(input.school_id)
        except:
            return output(111)

        db = getDb()
        vars = {'id':input.school_id}
        where = "school_id=$id"
        if len(db.select('school', vars = vars, where = where)) == 0:
            return output(461)

        results = db.select('major', vars = vars, where = where)
        major_list = []
        for i in results:
            major_list.append({'major_id':i.major_id, 'major_name':i.major_name})
        return output(200, major_list)