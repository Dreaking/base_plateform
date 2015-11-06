#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

import web
import json
import time

from output import output
from route import route
from database import *

@route('/user/goods/purchase')
class UserGoodsPurchase:
    def POST(self):
        input = web.input(goods_list = None)
        if input.goods_list == 0:
            return output(110)
        try:
            input.goods_list = json.loads(input.goods_list)
        except:
            return output(111)

        try:
            for i in input.goods_list:
                i['goods_id'] = int(i['goods_id'])
                i['count'] = int(i['count'])
                if i['count'] <= 0:
                    return output(112)
        except:
            return output(112)

        session = web.ctx.session
        if not session.has_key('user_id'):
            return output(411)
        if session['user_type'] not in (2, 3):
            return output(410)
        team_id = session['team_id']

        db = getDb()
        total = 0
        for i in input.goods_list:
            good_info = db.select('goods', vars = {'id':i['goods_id']}, where = "good_id=$id",
                                  what = 'price, good_name')
            if len(good_info) == 0:
                return output(474)
            good_info = good_info[0]
            i['price'] = good_info.price
            i['name'] = good_info.good_name
            total += i['price'] * i['count']

        balance = db.select('team', vars = {'id':team_id}, where = "team_id=$id",
                            what = 'balance')[0].balance
        if balance < total:
            return output(482)

        t = db.transaction()
        try:
            sql = "update team set balance=balance-$amount where team_id=$id and balance>=$amount"
            db.query(sql, vars = {'id':team_id, 'amount': total})
            for i in input.goods_list:
                reason = "%s * %d" % (i['name'], i['count'])
                db.insert('payment', reason = reason, amount = i['count'] * i['price'], team_id = team_id,
                      add_time = int(time.mktime(time.localtime())), type = 'shopping', num = i['count'])
            t.commit()
        except:
            t.rollbakc()
            return output(700)

        return output(200)


        return output(200)

