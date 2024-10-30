from flask import Flask, jsonify
import sqlite3
from pathlib import Path
from flask_sqlalchemy import SQLAlchemy

basedir = Path(__file__).resolve().parent

# Database config/setup
DATABASE = "flaskr.db"
SQLALCHEMY_DATABASE_URI = f'sqlite:///{Path(basedir).joinpath(DATABASE)}'
SQLALCHEMY_TRACK_MODIFICATIONS = False

# create and initialize a new Flask app
app = Flask(__name__)
# load the config
app.config.from_object(__name__)
# init sqlalchemy
db = SQLAlchemy(app)

from app import models

@app.route('/')
def home():
    return jsonify({"message": "Hello World!"})
