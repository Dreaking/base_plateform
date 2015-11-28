#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web
import json
import time

from route import route
from output import output
from database import *
from encrypt import *
from sms import sendSMS

@route('/admin/team/apply/approve')
class TeamApplyApprove:
    def POST(self):
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
        if session['user_type'] != 0:
            return output(410)

        db = getDb()
        user_id = db.select('application', vars = {'id':input.application_id},
                         where = "application_id=$id and status='ongoing'")
        if len(user_id) == 0:
            return output(469)
        user_id = user_id[0]
        team_name = user_id.new_team_name
        user_list = json.loads(user_id.user_list)
        user_id = user_id.user_id


        t = db.transaction()
        try:
            db.update('application', vars = {'id':input.application_id}, where = "application_id=$id",
                      status = 'approved', add_time = int(time.mktime(time.localtime())))
            school_id = db.select('userinfo', vars = {'id':user_id},
                                  where = "user_id=$id", what = "school_id")[0].school_id
            team_id = db.insert('team', team_name = team_name, school_id = school_id,
                                balance = 0, manager_id = user_id, is_settled = 'false')
            db.update('user', vars = {'id': user_id}, where = "user_id=$id", type = '2', team_id = team_id)

            for user in user_list:
                try:
                    id = db.insert('user', login_name = user['mobile'], password = encrypt('123456'),
                                   type = '3', team_id = team_id)
                    db.insert('userinfo', user_id = id, name = user['name'], school_id = user['school_id'],
                              major_id = user['major_id'], nickname = u'次级负责人',
                              gender = 'male' if user['is_male'] == 1 else 'female', birthday = user['birthday'],
                              sid = user['sid'], grade = user['grade'], phone = user['mobile'],
                              id_type = user['id_type'], id_number = user['id_number'],
                              citizenship = user['citizenship'], education_degree = user['education_degree'],
                              nationality = user['nationality'], characters = user['characters'],
                              address = user['address'], email = user['email'],
                              address_detail = user['address_detail'], political_face = user['political_face'])
                except:
                    pass
            t.commit()
        except:
            t.rollback()
            return output(700)

        return output(200)
