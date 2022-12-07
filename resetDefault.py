from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
@app.route('/resetDefault')
def resetPlayerPoints():
    # connect to database
    import mysql.connector
    myDb = mysql.connector.connect(
        host='127.0.0.1',
        port=3306,
        database='flight_game',
        user='root',
        password='root',
        autocommit=True
    )
    myCursor = myDb.cursor()
    myCursor.execute("drop table if exists users;")
    myCursor.execute("create table users(name varchar(10),points float);")
    myCursor.execute("insert into users(name, points)values('A', 1.67),"
                     "('B', 1.43),('C', 1.25),('D', 1.11),('E', 1);")

if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=5000)