#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web
import time

from route import route
from output import output
from database import *

@route('/admin/goods/add')
class InfoNoticeAdd:
    def POST(self):
        input = web.input(goods_name = None, goods_price = None)
        if input.goods_name == None or input.goods_price == None:
            return output(110)
        try:
            input.goods_price = float(input.goods_price)
        except:
            return output(111)

        if input.goods_price <= 0:
            return output(112)
        input.goods_name = input.goods_name.strip()
        length = len(input.goods_name)
        if length > 20 or length < 1:
            return output(112)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (0, 1):
            return output(410)

        db = getDb()
        try:
            db.insert('goods', good_name = input.goods_name, price = input.goods_price)
        except:
            return output(700)

        return output(200)
