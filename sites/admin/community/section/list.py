#!/usr/bin/python
# -*- coding: utf8 -*-
#author:raunicorn

from database import *
from route import route
from output import *


@route('/admin/community/section/list')
class AdminCommunitySectionList:
    def GET(self):
        return AdminCommunitySectionList.getSectionList()
    def POST(self):
        return AdminCommunitySectionList.getSectionList()

    @staticmethod
    def getSectionList():
        session=web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type']!=0:
            return output(410)
        db=getDb()
        results = db.select('section')
        sectionList=[]
        for i in results:
            sectionList.append({'section_id':i.section_id,'section_name':i.section_name,'view_count':i.view_count})

        for i in sectionList:
            count = db.select('post', vars = {'id':i['section_id']},
                              where = "section_id=$id", what = 'count(*) as num')[0].num
            i['post_count'] = count
        return output(200,sectionList)