from flask import Flask, jsonify, request  # Added request import here
from flask_cors import CORS  
import pandas as pd
import numpy as np
import sys
import blockchainData

print("Python interpreter path:", sys.executable)

app = Flask(__name__)
CORS(app)

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
