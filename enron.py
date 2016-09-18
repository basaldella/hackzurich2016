# A quick into to WSGI with Python: http://wsgi.tutorial.codepoint.net/intro
import re
import cgi
import json
import os
import sqlite3
import sys
import cgitb
import calendar

import datetime
cgitb.enable()

enron_db = '/mnt/storage/hex/projects/clnccr/polcon/www/enron.db'

query_documents_out = "SELECT from_, to_, subject, body, date, tfidf, null FROM emails WHERE custodian=? AND date=?"
query_fields = 'from', 'to', 'subject', 'body', 'date', 'words', 'spam'
query_count = "SELECT count(*) FROM emails"
query_documents_out_tfidf = "SELECT from_, to_, subject, body, date, words, spam FROM emails NATURAL JOIN tfidfs WHERE words NOT NULL AND custodian=? AND date=?"
query_documents_out_tfidf_no_date = "SELECT from_, to_, subject, body, date, words, spam FROM emails NATURAL JOIN tfidfs WHERE words NOT NULL AND custodian=?"

#def cal_date(date, format_='%d %b %Y'):
#    """Turn date to a tuple of timestamps."""
#    dt = datetime.datetime.strptime(date, format_)
#    d = datetime.timedelta(days=1)
#    return [calendar.timegm(dt.timetuple()), calendar.timegm((dt + d).timetuple())]

def documents_count(params, start_response):
    conn = sqlite3.connect(enron_db)
    c = conn.cursor()
    try:
        c.execute(query_count)
        out = c.fetchall()
    finally:
        conn.close()
    status = '200 OK'
    out = json.dumps(out)
    response_headers = [('Content-type', 'application/json'),
                        ('Access-Control-Allow-Origin', '*'),
                        ('Content-Length', str(len(out)))]
    start_response(status, response_headers)
    return out

def documents_out(custodian, date, tfidf):
    conn = sqlite3.connect(enron_db)
    c = conn.cursor()
    try:
        if date:
            q = query_documents_out_tfidf if tfidf else query_documents_out
            args = custodian, date
        else:
            q = query_documents_out_tfidf_no_date
            args = (custodian,)
        c.execute(q, args)
        out = [dict(zip(query_fields, e)) for e in c.fetchall()]
    finally:
        conn.close()
    return out

def get_emails(params, start_response):
    """Get emails for a custodian, date, and folder as json."""
    custodian = params.getfirst('custodian')
    date = params.getfirst('date')
    tfidf = params.getfirst('tfidf')
    out = json.dumps(documents_out(custodian, date, tfidf))
    status = '200 OK'
    response_headers = [('Content-type', 'application/json'),
                        ('Access-Control-Allow-Origin', '*'),
                        ('Content-Length', str(len(out)))]
    start_response(status, response_headers)
    return [out]

def not_found(params, start_response):
    """Not found response."""
    status = '404 NOT FOUND'
    start_response(status, [('Content-Type', 'text/plain'),
                            ('Access-Control-Allow-Origin', '*'),
                            ('Content-Length', '15')])
    return ['Page Not Found!']
    return [db_html]

# regexes that map values of `path' parameter to functions
urls = [(re.compile('^count$'), documents_count),
        (re.compile('^emails'), get_emails)
    ]

def application(environ, start_response):
    """Main WSGI application. Dispatches the current request to
    the functions above."""
    params = cgi.FieldStorage(fp=environ['wsgi.input'], environ=environ)
    path = params.getfirst('p', default='')
    callback = not_found
    for regex, cllbck in urls:
        if re.match(regex, path):
            callback = cllbck
    return callback(params, start_response)