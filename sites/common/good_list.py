#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

from route import route
from output import *
from database import *

@route('/good/info/list')
class FoodList:
    def POST(self):
        return FoodList.getFoodList()
    def GET(self):
        return FoodList.getFoodList()

    @staticmethod
    def getFoodList():
        db = getDb()
        results = db.select('goods', order = "good_id desc")
        school_list = []
        for i in results:
            school_list.append({'good_id':i.good_id, 'good_name':i.good_name, 'price':i.price})
        return output(200, school_list)