'''
# Heejin - top5/GET and newgamescore/POST
import requests
from flask import Flask, request
from flask_cors import CORS
import json

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

import mysql.connector
connection = mysql.connector.connect(
         host='127.0.0.1',
         port= 3306,
         database='flight_game',
         user='root',
         password='root', #change
         autocommit=True
)

@app.route('/top5Players', methods = ['GET', 'POST'])
def top5Players():
    if request.method == 'GET':
        sql = "SELECT name, points, row_number() over(order by points desc) FROM users limit 5;"  #period1 (flight game db > users table)
        cursor = connection.cursor()
        cursor.execute(sql)
        result = cursor.fetchall()
        return result

    if request.method == 'POST':
        data = request.get_json()
        sql = f"INSERT INTO users (name, points) VALUES (\"{data['username']}\",  \"{data['score']}\");"
        cursor = connection.cursor()
        cursor.execute( sql )
        result = cursor.fetchall()
        return json.dumps(result)

@app.route('/resetDefault')
def resetPlayerPoints():
    myCursor = connection.cursor()
    myCursor.execute("drop table if exists users;")
    myCursor.execute("create table users(name varchar(10),points float);")
    myCursor.execute("insert into users(name, points)values('A', 5),"
                     "('B', 4),('C', 3),('D', 2),('E', 1);")
    return None


@app.route('/<cityId>')
def weather(cityId):
    complete_api_link = f"https://api.openweathermap.org/data/2.5/weather?id={cityId}&appid=b318472dc4571e2480bc555a091e5bb6"
    api_link = requests.get(complete_api_link).json()
    return json.dumps(api_link)

if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)
'''

# FOR PYTHONANYWHERE server
# Heejin - top5/GET and newgamescore/POST
import requests
from flask import Flask, request
from flask_cors import CORS
import json

app = Flask(__name__)
cors = CORS(app)

app.config["DEBUG"] = True
import mysql.connector
connection = mysql.connector.connect(
         host='mongpt.mysql.pythonanywhere-services.com',
         #port= 3306,
         database='mongpt$flight_game',
         user='mongpt',
         password='xxxxxx',
         autocommit=True
)

@app.route('/top5Players', methods = ['GET', 'POST'])
def top5Players():
    if request.method == 'GET':
        sql = "SELECT name, points FROM users order by points desc limit 5;"  #period1 (flight game db > users table)
        cursor = connection.cursor()
        cursor.execute(sql)
        result = cursor.fetchall()
        return json.dumps(result)

    if request.method == 'POST':
        data = request.get_json()
        sql = f"INSERT INTO users (name, points) VALUES (\"{data['username']}\",  \"{data['score']}\");"
        cursor = connection.cursor()
        cursor.execute( sql )
        result = cursor.fetchall()
        return json.dumps(result)

@app.route('/resetDefault')
def resetPlayerPoints():
    myCursor = connection.cursor()
    myCursor.execute("drop table if exists users;")
    myCursor.execute("create table users(name varchar(10),points float);")
    myCursor.execute("insert into users(name, points)values('A', 5),"
                     "('B', 4),('C', 3),('D', 2),('E', 1);")
    result = myCursor.fetchall()
    return json.dumps(result)


@app.route('/<cityId>')
def weather(cityId):
    complete_api_link = f"https://api.openweathermap.org/data/2.5/weather?id={cityId}&appid=b318472dc4571e2480bc555a091e5bb6"
    api_link = requests.get(complete_api_link).json()
    return json.dumps(api_link)
