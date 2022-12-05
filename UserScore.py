# Heejin - top5/GET and newgamescore/POST

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
         password='bori', #change
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
        print(data['username'], data['score'])

        sql = f"INSERT INTO users (name, points) VALUES (\"{data['username']}\",  \"{data['score']}\");"
        cursor = connection.cursor()
        cursor.execute( sql )
        result = cursor.fetchall()
        cursor.close()
        connection.commit()
        return json.dumps(result)


if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)





