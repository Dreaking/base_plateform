#!/usr/bin/python
# -*- coding: utf8 -*-
#Author:ZZZ

from route import route
from output import *
from database import *

@route('/user/community/section/list')
class UserCommunitySectionList:
    def POST(self):
        return UserCommunitySectionList.getSectionList()
    def GET(self):
        return UserCommunitySectionList.getSectionList()

    @staticmethod
    def getSectionList():
        db = getDb()
        result = db.select('section')

        if len(result) == 0:
            return output(200)

        data = []
        try:
            for i in result:
                data.append({"section_id":i.section_id,"section_name":i.section_name})
            for i in data:
                count = db.select('post', vars = {'id':i['section_id']}, where = "section_id=$id",
                                   what = "count(*) as num")[0].num
                i['post_count'] = count
        except:
            return output(700)

        return output(200,data)
