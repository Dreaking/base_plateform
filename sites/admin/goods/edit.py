#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web
import time

from route import route
from output import output
from database import *

@route('/admin/goods/edit')
class InfoNoticeAdd:
    def POST(self):
        input = web.input(goods_id = None, goods_name = None, goods_price = None)
        if input.goods_id == None or (input.goods_name == None and input.goods_price == None):
            return output(110)
        try:
            input.goods_id = int(input.goods_id)
            if input.goods_price != None:
                input.goods_price = float(input.goods_price)
        except:
            return output(111)

        if input.goods_price != None and input.goods_price <= 0:
            return output(112)

        if input.goods_name != None:
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
            vars = {'id':input.goods_id}
            where = "good_id=$id"

            if len(db.select('goods', vars = vars, where = where)) == 0:
                return output(472)
            if input.goods_name == None:
                db.update('goods', vars = vars, where = where, price = input.goods_price)
            elif input.goods_price == None:
                db.update('goods', vars = vars, where = where, good_name = input.goods_name)
            else:
                db.update('goods', vars = vars, where = where, good_name = input.goods_name, price = input.goods_price)
        except:
            return output(700)

        return output(200)
