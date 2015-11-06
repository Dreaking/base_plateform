#!/usr/bin/python
#-*- coding: utf8 -*-

import web

from route import route
from database import *
from output import output
from encrypt import *

@route('/favicon\.ico')
class Favicon:
    def GET(self):
        return open('static/favicon.ico', 'rb').read() 

