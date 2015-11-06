#!/usr/bin/python
# -*- coding: utf8 -*-
import web

from database import *
from output import *
from route import route

@route('/admin/team/member/list')
class AdminTeamMemberList:
    def POST(self):
        return AdminTeamMemberList.getTeamMemberList()

    def GET(self):
        return AdminTeamMemberList.getTeamMemberList()
    @staticmethod
    def getTeamMemberList():
        input=web.input(team_id=None,type=None)
        try:
            if input.team_id != None:
                input.team_id = int(input.team_id)
            if input.type != None:
                input.type = int(input.type)
        except:
            return output(111)

        if input.type not in (0, 1, 2):
            return output(112)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1):
            return output(410)

        db = getDb()

        if input.team_id != None:
            if len(db.select('team', vars = {'id':input.team_id}, where = "team_id=$id")) == 0:
                return output(464)

        what = "user_id,type,team_id"
        if input.team_id == None and input.type == None:
            results = db.select('user')
        else:
            if input.type != None:
                input.type = str(input.type + 2)
            if input.team_id != None and input.type == None:
                vars = {'id':input.team_id}
                where = "team_id=$id"
            elif input.team_id != None and input.type != None:
                vars = {'id':input.team_id, 'type':input.type}
                where = "team_id=$id and type=$type"
            else:
                vars = {'type':input.type}
                where = "type=$type"
            results = db.select('user', vars = vars, where = where)

        member_list = []
        for i in results:
            member_list.append({'user_id':i.user_id, 'team_id':i.team_id, 'type':int(i.type) - 2})

        for i in member_list:
            userinfo = db.select('userinfo', vars = {'id':i['user_id']}, where = "user_id=$id",
                             what = "name,school_id,major_id")[0]
            i['name'] = userinfo.name
            i['school_name'] = db.select('school', vars = {'id':userinfo.school_id},
                                         where = "school_id=$id", what = "school_name")[0].school_name
            i['major_name'] = db.select('major', vars = {'id':userinfo.major_id},
                                         where = "major_id=$id", what = "major_name")[0].major_name
            i['team_name'] = db.select('team', vars = {'id':i['team_id']},
                                         where = "team_id=$id", what = "team_name")[0].team_name
        return output(200, member_list)
