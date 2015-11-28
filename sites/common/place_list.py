#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

from route import route
from output import *
from database import *

@route('/place/name/list')
class PlaceList:
    def POST(self):
        return PlaceList.getPlaceList()
    def GET(self):
        return PlaceList.getPlaceList()

    @staticmethod
    def getPlaceList():
        db = getDb()
        results = db.select('place')
        place_list = []
        for i in results:
            place_list.append({'id':i.place_id, 'name':i.place_name})
        return output(200, place_list)