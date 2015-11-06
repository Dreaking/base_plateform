#!/usr/bin/python
#-*- coding: utf-8 -*-
import base64
import datetime
import urllib2
import hashlib
import json

#云之讯帐号 account id
accountSid = '031aed139f8f8d8178367ef4b1526be5'
#云之讯帐号 accountToken
accountToken = '1ba4290c22a3f9151b4420d8635ed0d6'
#云之讯 应用id
appId = '5a08c24be8944ef9bb81e45b32e9d1c0'
#云之讯短信 模版id
templateId = '13385'

HOST = "https://api.ucpaas.com"
PORT = ""
SOFTVER = "2014-06-30"
JSON = "json"
XML = "xml"



def getSig(accountSid,accountToken,timestamp):
    sig = accountSid + accountToken + timestamp
    m = hashlib.md5()
    m.update(sig)
    return m.hexdigest().upper()

def urlOpen(req,data=None):
    try:
        res = urllib2.urlopen(req,data)
        data = res.read()
        res.close()
    except urllib2.HTTPError, error:
        data = error.read()
        error.close()
    return data

def getAuth(accountSid,timestamp):
    src = accountSid + ":" + timestamp
    return base64.encodestring(src).strip()

def createHttpReq(req,url,accountSid,timestamp,responseMode,body):
    req.add_header("Authorization", getAuth(accountSid,timestamp))
    if responseMode:
        req.add_header("Accept","application/"+responseMode)
        req.add_header("Content-Type","application/"+responseMode+";charset=utf-8")
    if body:
        req.add_header("Content-Length",len(body))
        req.add_data(body)
    return req

def templateSMS(accountSid,accountToken,appId,toNumbers,templateId,param,isUseJson=True):
    now = datetime.datetime.now()
    timestamp = now.strftime("%Y%m%d%H%M%S")
    signature = getSig(accountSid,accountToken,timestamp)
    url = HOST + ":" + PORT + "/" + SOFTVER + "/Accounts/" + accountSid + "/Messages/templateSMS?sig=" + signature
    
    if isUseJson == True:
        body = '{"templateSMS":{ "appId":"%s","to":"%s","templateId":"%s","param":"%s"}}'%(appId,toNumbers,
                                                                                           templateId,param)
        responseMode = JSON
    else:
        body = "<?xml version='1.0' encoding='utf-8'?>\
			<templateSMS>\
				<appId>%s</appId>\
				<to>%s</to>\
				<templateId>%s</templateId>\
				<param>%s</param>\
			</templateSMS>\
			"%(appId,toNumbers,templateId,param)
        responseMode = XML
		
    req = urllib2.Request(url)
    return urlOpen(createHttpReq(req,url,accountSid,timestamp,responseMode,body))

def sendSMS(phone_number, params):
    respCode = json.loads(templateSMS(accountSid, accountToken, appId, phone_number, templateId, params))
    respCode = respCode['resp']['respCode']

    #发送成功
    if respCode == '000000':
        return 0
    #手机号不存在
    if respCode in {'100015', '100008', '100010', '105102', '105106'}:
        return 1
    #发送失败
    return 2

