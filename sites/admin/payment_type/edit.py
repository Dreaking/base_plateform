#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web

from route import route
from output import output
from database import *

@route('/admin/payment/type/edit')
class AdminPaymentTypeEdit:
    def POST(self):
        input = web.input(payment_type_list = None)
        if input.payment_type_list == None:
            return output(110)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1):
            return output(410)

        db = getDb()
        try:
            db.update('payment_type', vars = {'id':1},
                      where = "id=$id", data = input.payment_type_list)
        except:
            return output(700)
        return output(200)
