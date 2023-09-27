# api/routes.py
from flask import Blueprint, jsonify, request
from services.data_service import (
    get_data_service, 
    build_smart_contract_service, 
    hash_log_events_service, 
    parse_log_events_service
)
from utils.helpers.validation import ValidationError 


api_bp = Blueprint('api', __name__)

print("The API Blueprint: " , api_bp)

#Test to make sure each part is working
@api_bp.route('/datatest', methods=['GET'])
def get_data():
    print('Trying to get Data')
    data = get_data_service()
    return jsonify(data=data)


#Building Smart Contract Data
@api_bp.route('/build-smart-contract-data', methods=['POST'])
def build_smart_contract_data():
    contract_address = request.json.get('contract_address')
    start_block = request.json.get('start_block')
    end_block = request.json.get('end_block')

    print(contract_address)
    print(start_block)
    print(end_block)

    try:
        result_data = build_smart_contract_service(contract_address, start_block, end_block)
    except ValidationError as e:
        return jsonify(error=str(e)), 400

    # Check if result_data is not None, then return it as JSON.
    if result_data is not None:

        result_data = result_data.to_json(orient="records")  # Convert DataFrame to JSON

        return jsonify(data=result_data, status="Data built successfully")
    return jsonify(error="Unable to build data"), 500


@api_bp.route('/hash-log-events', methods=['POST'])
def hash_log_events():
    contract_address = request.json.get('contract_address')
    
    if not contract_address:
        return jsonify(error="Contract address is required"), 400

    try:
        result_data = hash_log_events_service(contract_address)
    except ValidationError as e:
        return jsonify(error=str(e)), 400

    if result_data is not None:
        result_data = result_data.to_json(orient="records")
        return jsonify(data=result_data, status="Data hashed successfully")
    
    return jsonify(error="Unable to hash data"), 500


@api_bp.route('/parse-log-events', methods=['POST'])
def parse_log_events_route():
    contract_address = request.json.get('contract_address')
    start_block = request.json.get('start_block')
    end_block = request.json.get('end_block')

    try:
        parsed_data = parse_log_events_service(contract_address, start_block, end_block)
    except ValidationError as e:
        return jsonify(error=str(e)), 400
    except Exception as e:
        return jsonify(error="Unable to parse log data"), 500

    if parsed_data is not None:
        result_data = parsed_data.to_json(orient="records")
        return jsonify(data=result_data, status="Data parsed successfully")

    return jsonify(error="No data parsed"), 404


#request 
# @api_bp.route('/api/blockchain-data', methods=['GET'])
# def blockchain_data():
#     datatype = request.args.get('datatype')
#     start_block = request.args.get('start_block', type=int)
#     end_block = request.args.get('end_block', type=int)
#     contract_address = request.args.get('contract_address')

#     #Missing Data check
#     if not (datatype and start_block and end_block and contract_address):
#         return jsonify(error="Missing or invalid parameters"), 400

#     data_df = blockchainData.get_blockchain_data(datatype, start_block, end_block, contract_address)

#     data_dict = data_df.to_dict(orient='records')  # Store the list of dictionaries
#     return jsonify(data=data_dict)