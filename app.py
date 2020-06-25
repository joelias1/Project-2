from flask import Flask, jsonify
import numpy as np
from sqlalchemy import create_engine, func
import psycopg2
from sqlalchemy.orm import Session
from sqlalchemy.ext.automap import automap_base
from bson.json_util import dumps


# def connect_db():
db_string = 'postgresql+psycopg2://postgres:&MF28wsac@localhost:5432/Mass_Shootings'
engine = create_engine(db_string)
# Base = automap_base()
# Base.prepare(engine, reflect=True)
# shootings = Base.classes.Mass_Shootings
    # return engine.connect()

app = Flask(__name__)

@app.route('/hello')
def hello():
    return "Hello World!"

@app.route("/")
def home():
    # session = Session(engine)
    # results = session.query(shootings.case).all()
    # print (results)
    # session.close()
    # return jsonify(results)
    print("Connecting...")
    engine.connect()

    print("Querying...")
    session = Session(engine)
    postgreSQL_select_Query = "* from test_data"
    results = session.query(postgreSQL_select_Query).all()
    print(results)
    # engine.execute(results)
    # records = engine.execute(postgreSQL_select_Query)
    try:
        for row in results:
            print("case = ", row[0], "\n")
    except:
        print ("Error while fetching data from PostgreSQL:")
    else:
        return dumps(results)
    if(engine):
        # engine.close()
        #print("PostgreSQL connection is closed.")
        return dumps(results)

@app.route("/columns")
def columns():
    print("Connecting...")
    engine.connect()
    return str(dir(engine))
    #return (str(engine.table_names))

if __name__ == "__main__":
    app.run(debug=True)