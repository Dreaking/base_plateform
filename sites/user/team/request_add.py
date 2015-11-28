#!/usr/bin/python
# -*- coding: utf8 -*-
# Author :zzz

import web
import time
import json
import re

from route import route
from output import *
from database import *

def isContainAllKeys(dic, key_list):
    for i in key_list:
        if not dic.has_key(i):
            return False
    return True

def judgeBirthday(birthday):
    pattern = r'^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$'
    if not re.compile(pattern).match(birthday):
        return False
    date = re.split('-', birthday)
    try:
        year = int(date[0])
        month = int(date[1])
        day = int(date[2])
        month_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        if month not in range(1, 13):
            return False
        if month == 2:
            if year % 400 == 0 or (year % 100 != 0 and year % 4 == 0):
                if day > 29:
                    return False
            else:
                if day > 28:
                    return False
        if day > month_days[month - 1]:
            return False
        return True
    except:
        return False

def judgeGender(is_male):
    try:
        is_male = int(is_male)
    except:
        return False
    if is_male in (0, 1):
        return True
    else:
        return False

@route('/team/request/add')
class TeamRequestAdd:
    def POST(self):
        input = web.input(team_name = None, operate_range = None, manager_name = None,
                          guide_teacher = None, class_name = None, phone = None,
                          project_desc = None, team_desc = None, apply_reason = None,
                          user_list = None)
        if (input.team_name == None or input.operate_range == None or input.manager_name == None or
            input.guide_teacher == None or input.class_name == None or input.phone == None or
            input.user_list == None or input.project_desc == None or input.team_desc == None or
            input.apply_reason == None):
            return output(110)

        try:
            input.user_list = json.loads(input.user_list)
            key_list = ['id_type', 'id_number', 'name', 'is_male', 'birthday', 'education_degree',
                        'citizenship', 'nationality', 'characters', 'address', 'address_detail',
                        'mobile', 'grade', 'sid', 'email', 'political_face', 'school_id', 'major_id']
            db = getDb()
            for user in input.user_list:
                if not isContainAllKeys(user, key_list):
                    return output(112)
                if len(user['mobile']) != 11 or (not re.compile(r'^[1-9][0-9]+$').match(user['mobile'])):
                    return output(112)
                if not judgeBirthday(user['birthday']):
                    return output(112)
                if not judgeGender(user['is_male']):
                    return output(112)
                else:
                    user['is_male'] = int(user['is_male'])
                if not re.compile(r'^[0-9_]+$').match(user['sid']):
                    return output(112)
                try:
                    user['grade'] = int(user['grade'])
                except:
                    return output(112)
                try:
                    user['school_id'] = int(user['school_id'])
                    user['major_id'] = int(user['major_id'])
                except:
                    return output(112)
                if len(db.select("school",vars ={"id":user['school_id']},where="school_id=$id"))==0:
                    return output(112)
                if len(db.select("major",vars ={"id":user['major_id'], 'school_id':user['school_id']},
                         where ="major_id=$id and school_id=$school_id"))==0:
                    return output(112)
        except:
            return output(112)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] != 5:
            return output(410)

        if len(db.select('userinfo', vars = {'id':session['user_id']}, where = "user_id=$id")) == 0:
            return output(423)

        result = db.select('team' , vars = {'team_name':input.team_name} ,
                           where = "team_name=$team_name", what = "team_id")
        result2 = db.select('application' , vars = {'team_name':input.team_name} ,
                            where = "new_team_name=$team_name and (status='ongoing' or status='approved')",
                            what = "application_id")
        #已经申请了的和已经成立的团队都不冲突
        if len(result) != 0 or len(result2) != 0:
            return output(440)#团队名存在

        try:
            db.insert('application' ,user_id = session['user_id'] ,new_team_name = input.team_name ,
                      status = 'ongoing', add_time = int(time.mktime(time.localtime())),
                      operate_range = input.operate_range, manager_name = input.manager_name,
                      guide_teacher = input.guide_teacher, class_name = input.class_name,
                      project_desc = input.project_desc, team_desc = input.team_desc,
                      apply_reason = input.apply_reason,
                      phone = input.phone, user_list = json.dumps(input.user_list))
            return output(200)
        except:
            return output(700)
