#!/usr/bin/python3

import pymysql

con=pymysql.connect('localhost','root',
    None,
    'sus_finance',charset='utf8',
   use_unicode=True
)
