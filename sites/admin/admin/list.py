#!/usr/bin/python
# -*- coding: utf8 -*-
#author ch_oosy
import web

from database import *
from output import *

from route import route

@route('/admin/admin/list')
class AdminListAdmin:
    def POST(self):
        return AdminListAdmin.getAdmin_list()
    def GET(self):
        return AdminListAdmin.getAdmin_list()

    @staticmethod
    def getAdmin_list():
        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] != 0:
            return output(410)
        db = getDb()
        getUser_id = db.select("user",vars ={"type":'1'},
                                where = "type=$type",
                                what = "user_id,login_name")
        admin_second_list =[]
        for i in getUser_id:
            getUser_info =db.select("userinfo",vars={"user_id":i.user_id},
                                    order = "school_id desc",
                                    where = "user_id=$user_id",
                                    what = "phone,name,school_id,major_id")
            results=getUser_info[0]
            getSchool_info =db.select("school",vars={"school_id":results.school_id},
                                      where ="school_id=$school_id",
                                      what ="school_name")
            getMajor_info =db.select("major",vars={"major_id":results.major_id},
                                     where ="major_id=$major_id",
                                     what = "major_name")
            admin_second_list.append({"user_id":i.user_id,
                                      'login_name':i.login_name,
                                      "name":results.name,
                                      "school_name":getSchool_info[0].school_name,
                                      "major_name":getMajor_info[0].major_name,
                                      'phone':results.phone})
        return output(200,admin_second_list)
