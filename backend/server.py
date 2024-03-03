from flask import Flask, send_from_directory, render_template, request, jsonify, abort
from flask_cors import CORS
import os, signal, secrets, hashlib
from werkzeug.utils import secure_filename
import urllib.parse
from urllib.parse import unquote
import pandas as pd

from autogluon.tabular import TabularDataset, TabularPredictor

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

DATA_DIR = "data/"
PREDICTOR_DIR = "predictors/"


csv_data = pd.read_csv(DATA_DIR + "pres_data.csv")

predictor = TabularPredictor.load(PREDICTOR_DIR + "5")

columns = ["Timestamp", "From Bank", "Account",	"To Bank",	"Account.1", "Amount Received",	"Receiving Currency", "Amount Paid", "Payment Currency", "Payment Format", "Is Laundering"]
possible_fraud_trans = pd.DataFrame()


@app.route("/getData")
def get_data():
    res = possible_fraud_trans
    return res.to_dict('records')

@app.route("/getModelNames")
def get_model_names():
    return predictor.model_names()

@app.route("/getUserTrans")
def get_user_trans():
    res = csv_data[0:90]
    return res.to_dict('records')

@app.route('/postTrans', methods=['POST'])
def post_trans():
    model_name = unquote(request.args.get('model_name'))
    
    global possible_fraud_trans
    json_data = request.get_json()
    data = pd.DataFrame([json_data])

    # Make prediction
    # preds = predictor.predict(data, model="NeuralNetFastAI_BAG_L1/040ac038")
    preds = predictor.predict(data, model=model_name)
    # If fraud, add to possible_fraud_trans
    if preds[0]:
        possible_fraud_trans = pd.concat([possible_fraud_trans, data], ignore_index=True).drop_duplicates()
    
    print(model_name)
    if preds[0] == 1:
        print("Transaction is Fraudulent")
    elif preds[0] == 0:
        print("Transaction is not Fraudulent")
    
    print(possible_fraud_trans.head())
    return jsonify({"pred": str(preds[0]), "notifications": len(possible_fraud_trans)})

@app.route('/getNotificationCount')
def get_notification_count():
    return jsonify({"notifications": len(possible_fraud_trans)})

@app.route('/removePossibleFraudTrans', methods=['POST'])
def remove_possible_fraud_trans():
    global possible_fraud_trans
    json_data = request.get_json()
    data = pd.DataFrame([json_data])
    
    print(possible_fraud_trans.head())
    possible_fraud_trans = pd.concat([possible_fraud_trans, data], ignore_index=True).drop_duplicates(subset=columns[1:],keep=False)
    print(possible_fraud_trans.head())
    
    return jsonify({"notifications": len(possible_fraud_trans)})





@app.route("/getData/<path:index>")
def get_data_paginated(index):
    res = csv_data
    
    PAGE_SIZE = 10
    index = int(index)

    x = PAGE_SIZE * (index - 1)
    y = PAGE_SIZE * index
    res = res[x:y]

    return res.to_dict('records')


# Only fit for 1st presentation
@app.route("/getDatas/<path:index>")
def get_data_unpaginated(index):
    # csv_data = pd.read_csv("HI-Small_Trans.csv")
    res = csv_data.loc[csv_data['Is Laundering'] == 1]
    res = res[0:27]
    return res.to_dict('records')

@app.route("/getTransactionsByAccount/<path:index>")
def get_transactions_by_account(id):
    # res = csv_data.query("Account === @index | Account.1 === @index")

    # res = csv_data.query("Account == '{0}' or `Account.1` == '{0}'".format(index))
    res = csv_data.query("Account == '{0}'".format(str(id)))[0:5]

    return res.to_dict('records')


@app.route('/stopServer', methods=['GET'])
def stopServer():
    os.kill(os.getpid(), signal.SIGINT)
    return jsonify({ "success": True, "message": "Server is Shutting Down..." })


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8012)