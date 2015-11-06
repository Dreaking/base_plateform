#!/usr/bin/python
# -*- coding: utf8 -*-

import web
import base64

from route import route
from output import *
from database import *

@route('/base64/encode')
class Base64Encode:
    def POST(self):
        input = web.input(img_file = {})
        if input.img_file == {}:
            return output(110)
        try:
            return output(200, {'content':base64.b64encode(input.img_file.file.read())})
        except:
            return output(700)
