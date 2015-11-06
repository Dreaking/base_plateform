#!/usr/bin/python
# -*- coding: utf8 -*-
#author: farseer810

from route import route
from output import *
from database import *

@route('/payment/type/list')
class PaymentTypeList:
    def POST(self):
        return PaymentTypeList.getPaymentTypeList()
    def GET(self):
        return PaymentTypeList.getPaymentTypeList()

    @staticmethod
    def getPaymentTypeList():
        db = getDb()
        results = db.select('payment_type')
        payment_type_list = results[0].data
        return output(200, payment_type_list)