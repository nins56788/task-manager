import json
import urllib.request
import urllib.error

base='http://127.0.0.1:5000/api/auth'
register_payload = {'username': 'debugsave4', 'email': 'debugsave4@example.com', 'password': '123456', 'first_name': 'Debug', 'last_name': 'Save'}
req = urllib.request.Request(base + '/register', data=json.dumps(register_payload).encode(), headers={'Content-Type': 'application/json'}, method='POST')
with urllib.request.urlopen(req) as r:
    body = r.read().decode()
    token = json.loads(body)['access_token']
    print('REGISTER', r.status, body)

payload = {'title': 'Debug task', 'description': 'x', 'category': 'work', 'priority': 'high', 'estimated_hours': 1, 'due_date': '2026-05-30T12:30', 'tags': 'test'}
req2 = urllib.request.Request('http://127.0.0.1:5000/api/tasks/', data=json.dumps(payload).encode(), headers={'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token}, method='POST')
try:
    with urllib.request.urlopen(req2) as r2:
        print('TASK', r2.status, r2.read().decode())
except urllib.error.HTTPError as e:
    print('TASK ERR', e.code, e.read().decode())
