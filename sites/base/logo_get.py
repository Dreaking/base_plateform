#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web
import base64

from route import route
from database import *
from output import output

@route('/base/logo/get')
class BaseLogoGet:
    def GET(self):
        db=getDb()
        logo = db.select('base_desc',where = 'id=1',what = 'logo')[0].logo
        if logo == None:
            return web.notfound()
        return output(200, {'content':logo})
