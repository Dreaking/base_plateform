#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from route import route
from output import *
from database import *

@route('/layout/all/list')
class LayoutAllList:
    def POST(self):
        return LayoutAllList.getLayoutList()
    def GET(self):
        return LayoutAllList.getLayoutList()

    @staticmethod
    def getLayoutList():
        db = getDb()
        layout_list = []
        results = db.select('layout_one')
        for i in results:
            if i.type == 'increment':
                type = 0
            else:
                type = 1
            layout_list.append({'layout_one_id':i.id, 'name':i.name, 'type':type})
        for i in layout_list:
            where = 'parent_id=$id'
            vars = {'id':i['layout_one_id']}
            results = db.select('layout_two', where = where, vars = vars)
            sub_list = []
            for j in results:
                if j.type == 'all':
                    type = 0
                elif j.type == 'payment':
                    type = 1
                else:
                    type = 2
                sub_list.append({'layout_two_id':j.id, 'name':j.name, 'type':type})
            i['sub_list'] = sub_list

        return output(200, layout_list)

@route('/layout/payment/list')
class LayoutPaymentList:
    def POST(self):
        return LayoutPaymentList.getLayoutList()
    def GET(self):
        return LayoutPaymentList.getLayoutList()

    @staticmethod
    def getLayoutList():
        db = getDb()
        layout_list = []
        results = db.select('layout_one')
        for i in results:
            if i.type == 'increment':
                type = 0
            else:
                type = 1
            layout_list.append({'layout_one_id':i.id, 'name':i.name, 'type':type})
        for i in layout_list:
            where = "parent_id=$id and (type='payment' or type='all')"
            vars = {'id':i['layout_one_id']}
            results = db.select('layout_two', where = where, vars = vars)
            sub_list = []
            for j in results:
                if j.type == 'all':
                    type = 0
                elif j.type == 'payment':
                    type = 1
                else:
                    type = 2
                sub_list.append({'layout_two_id':j.id, 'name':j.name, 'type':type})
            i['sub_list'] = sub_list

        return output(200, layout_list)

@route('/layout/flow/list')
class LayoutFlowList:
    def POST(self):
        return LayoutFlowList.getLayoutList()
    def GET(self):
        return LayoutFlowList.getLayoutList()

    @staticmethod
    def getLayoutList():
        db = getDb()
        layout_list = []
        results = db.select('layout_one')
        for i in results:
            if i.type == 'increment':
                type = 0
            else:
                type = 1
            layout_list.append({'layout_one_id':i.id, 'name':i.name, 'type':type})
        for i in layout_list:
            where = "parent_id=$id and (type='flow' or type='all')"
            vars = {'id':i['layout_one_id']}
            results = db.select('layout_two', where = where, vars = vars)
            sub_list = []
            for j in results:
                if j.type == 'all':
                    type = 0
                elif j.type == 'payment':
                    type = 1
                else:
                    type = 2
                sub_list.append({'layout_two_id':j.id, 'name':j.name, 'type':type})
            i['sub_list'] = sub_list

        return output(200, layout_list)