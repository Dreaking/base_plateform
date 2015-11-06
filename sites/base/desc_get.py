#!/usr/bin/python
# -*- coding: utf8 -*-
#author ch_oosy
import web

from database import *
from output import *
from route import route

@route('/base/description/get')
class BaseDescGet:
    def GET(self):
        return output(200, BaseDescGet.getBaseContent())

    def POST(self):
        return output(200, BaseDescGet.getBaseContent())

    @staticmethod
    def getBaseContent():
        db=getDb()
        return {'content':db.select('base_desc',where = 'id=1',what = 'description')[0].description}

