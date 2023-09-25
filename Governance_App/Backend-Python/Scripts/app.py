from flask import Flask, jsonify, request  # Added request import here
from flask_cors import CORS  
import pandas as pd
import numpy as np
import sys
import blockchainData
import database
import os
from web3 import Web3
from database_event_signature import save_to_database as save_signature_to_database, get_events_by_contract_address  
from event_signature_logic import createSigFromEvents
from dotenv import load_dotenv
from web3Contract import web3Contract
from log_event_database import save_to_database, get_all_logs_by_name
from parsed_logs_logic import build_parsed_data
from parsed_logs_database import save_to_database as save_parsed_data

load_dotenv()



print("Python interpreter path:", sys.executable)

app = Flask(__name__)
CORS(app)

#Connect to DB
database.setup_database()
conn = database.connect_to_db()
cursor = conn.cursor()

#Web3 Set up
INFURA_ENDPOINT = os.environ.get("INFURA_ENDPOINT")
web3 =  Web3(Web3.HTTPProvider(INFURA_ENDPOINT))

#Etherscan
ETHERSCAN_API = os.environ.get("ETHERSCAN_API")
contract_helper = web3Contract(web3, ETHERSCAN_API)

tether = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
gauge_controller = '0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB'



### BUILD SMART CONTRACT DATA ###
### RAW LOGS ###

contract_instance = contract_helper.createContract(tether)

tetherLog = blockchainData.get_blockchain_data_logs("logs", 17000000, 17000025, tether)
save_to_database(cursor, tetherLog, tether)
conn.commit()

### Event Log Signatures ###
events = [item for item in contract_instance.abi if item['type'] == 'event']
hashed_events = createSigFromEvents(events)
save_signature_to_database(cursor, contract_instance.address, events, hashed_events)
conn.commit()

parsedDF = build_parsed_data(cursor, tether)
#print(build_parsed_data(cursor,tether))
#print(parsedDF)
save_parsed_data(cursor, parsedDF, tether)
conn.commit()
### END BUILD SMART CONTRACT DATA ###


@app.route('/api/build-smart-contract-data', methods=['POST'])
def build_smart_contract_data():
    start_block = request.json.get('start_block')
    end_block = request.json.get('end_block')
    contract_address = request.json.get('contract_address')

    print(start_block)
    print(end_block)
    print(contract_address)


### API call to build contract ###
def build_smart_contract_data(start_block, end_block, contract_address):
    contract_instance = contract_helper.createContract(contract_address)

    # RAW LOGS
    contract_log = blockchainData.get_blockchain_data_logs("logs", start_block, end_block, contract_address)
    save_to_database(cursor, contract_log, contract_address)
    conn.commit()

    # Event Log Signatures
    events = [item for item in contract_instance.abi if item['type'] == 'event']
    hashed_events = createSigFromEvents(events)
    save_signature_to_database(cursor, contract_instance.address, events, hashed_events)
    conn.commit()

    parsedDF = build_parsed_data(cursor, contract_address)
    save_parsed_data(cursor, parsedDF, contract_address)
    conn.commit()

@app.route('/api/build-smart-contract-data', methods=['POST'])
def api_build_smart_contract_data():
    # Get parameters from the request
    start_block = request.json.get('start_block')
    end_block = request.json.get('end_block')
    contract_address = request.json.get('contract_address')

    # Validate the parameters
    if not all([start_block, end_block, contract_address]):
        return jsonify(error="Missing or invalid parameters"), 400

    build_smart_contract_data(start_block, end_block, contract_address)
    
    return jsonify(status="Data built successfully")


@app.route('/api/data', methods=['GET'])
def get_data():
    # Create a DataFrame with random data
    df = pd.DataFrame({
        'x': np.random.randint(0, 100, 10),
        'y': np.random.randint(0, 100, 10)
    })
    
    # Convert DataFrame to JSON
    data_json = df.to_json(orient='records')
    
    return jsonify(data=data_json)

@app.route('/api/blockchain-data', methods=['GET'])
def blockchain_data():
    datatype = request.args.get('datatype')
    start_block = request.args.get('start_block', type=int)
    end_block = request.args.get('end_block', type=int)
    contract_address = request.args.get('contract_address')

    #Missing Data check
    if not (datatype and start_block and end_block and contract_address):
        return jsonify(error="Missing or invalid parameters"), 400

    data_df = blockchainData.get_blockchain_data(datatype, start_block, end_block, contract_address)

    data_dict = data_df.to_dict(orient='records')  # Store the list of dictionaries
    return jsonify(data=data_dict)


if __name__ == '__main__':
    app.run(port=5000)
