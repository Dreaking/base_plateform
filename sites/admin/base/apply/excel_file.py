#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web
import base64

from route import route
from output import output
from database import *

@route('/excel/file/(.*)')
class ExcelFileGet:
    def GET(self, filename):
        db = getDb()
        result = db.select('excelfile', vars = {'name':filename}, where = "filename=$name", what = 'data')
        if len(result) == 0:
            raise web.notfound()

        data = result[0].data
        data = base64.b64decode(data)
        try:
            db.delete('excelfile', vars = {'name':filename}, where = "filename=$name")
        except:
            pass
        return data