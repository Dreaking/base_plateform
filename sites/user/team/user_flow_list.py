#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from output import output
from route import route
from database import *

@route('/user/team/flow/list')
class UserTeamFlowList:
    def POST(self):
        input = web.input(is_refresh = None, flow_count = 10, last_flow_id = None)
        try:
            input.is_refresh = int(input.is_refresh)
            input.flow_count = int(input.flow_count)
            if input.last_flow_id != None:
                input.last_flow_id = int(input.last_flow_id)
        except:
            #返回类型错误 状态码
            return output(111)

        if input.is_refresh == 0 and input.last_flow_id == None:
            #返回缺少必填参数 状态码
            return output(110)

        if input.flow_count <= 0:
            #返回参数值非法 状态码
            return output(112)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (2, 3, 4):
            return output(410)

        db = getDb()
        flow_list = []
        order = "add_time desc, flow_id desc"
        limit = '0,$count'
        if input.is_refresh == 0:
            vars = {'id':session['team_id'], 'count':input.flow_count, 'last_id':input.last_flow_id}
            where = 'team_id=$id and flow_id<$last_id'
            results = db.select('flow', vars = vars, where = where,
                            order = order)
        else:
            vars = {'id':session['team_id'], 'count':input.flow_count}
            where = 'team_id=$id'
            results = db.select('flow', vars = vars, where = where,
                            order = order)

        for i in results:
            flow_list.append({'flow_id':i.flow_id, 'description':i.description, 'amount':i.amount,
                                'operator_name':i.operator_name, 'add_time':i.add_time,
                              'layout_two_id':i.layout_two_id})
        for i in flow_list:
            layout_two = db.select('layout_two', vars = {'id':i['layout_two_id']}, where = 'id=$id',
                                   what = 'parent_id,name')[0]
            i['layout_one_id'] = layout_two.parent_id
            i['layout_two_name'] = layout_two.name
            i['layout_one_name'] = db.select('layout_one', vars = {'id':layout_two.parent_id},
                                             where = "id=$id", what = 'name')[0].name
        return output(200, flow_list)

