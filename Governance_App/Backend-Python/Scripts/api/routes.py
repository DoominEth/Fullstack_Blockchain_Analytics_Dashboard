# api/routes.py
from flask import Blueprint, jsonify, request
from services.data_service import (
    get_data_service, 
    build_smart_contract_service, 
    hash_log_events_service, 
    parse_log_events_service,
    hash_functions_service,
    build_event_label_service,
    contract_references_service,
    get_unique_label_names_service,
    test_function_service,
    get_label_info_by_names_service,
    update_label_data_service,
    etherface_service
)
from utils.helpers.validation import ValidationError 
from utils.config import Web3

api_bp = Blueprint('api', __name__)

print("The API Blueprint: " , api_bp)

#Test to make sure each part is working
@api_bp.route('/datatest', methods=['GET'])
def get_data():
    #print('Trying to get Data')
    data = get_data_service()
    return jsonify(data=data)


#Building Smart Contract Data
@api_bp.route('/build-smart-contract-data', methods=['POST'])
def build_smart_contract_data():
    contract_address = request.json.get('contract_address')
    start_block = request.json.get('start_block')
    end_block = request.json.get('end_block')

    contract_address= Web3.toChecksumAddress(contract_address)
    #print(contract_address)
    #print(start_block)
    #print(end_block)

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
    contract_address= Web3.toChecksumAddress(contract_address)
    
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

    contract_address= Web3.toChecksumAddress(contract_address)

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

@api_bp.route('/hash-functions', methods=['POST'])
def hash_functions():
    contract_address = request.json.get('contract_address')
    contract_address= Web3.toChecksumAddress(contract_address)

    if not contract_address:
        return jsonify(error="Contract address is required"), 400

    try:
        result_data = hash_functions_service(contract_address)
    except ValidationError as e:
        return jsonify(error=str(e)), 400

    if result_data is not None:
        result_data = result_data.to_json(orient="records")
        return jsonify(data=result_data, status="Data hashed successfully")
    
    return jsonify(error="Unable to hash data"), 500

@api_bp.route('/contract-references', methods=['POST'])
def contract_references_route():
    contract_address = request.json.get('contract_address')
    contract_address= Web3.toChecksumAddress(contract_address)
    if not contract_address:
        return jsonify(error="Contract address is required"), 400

    try:
        # Call the contract_references service and get the result.
        result = contract_references_service(contract_address)
    except Exception as e:  # Catch exceptions raised by contract_references
        return jsonify(error=str(e)), 400
    
    if result is not None:
        # If the result is not None, return it as JSON.
        result_data = result.to_json(orient="records")
        return jsonify(data=result_data, status="Data fetched successfully")
    
    return jsonify(error="Unable to fetch data"), 500



@api_bp.route('/build-event-labels-from-github', methods=['POST'])  
def build_event_labels_from_github():  
    searchTerm = request.json.get('searchTerm')
    labelName = request.json.get('labelName')

    searchTerm= Web3.toChecksumAddress(searchTerm)

    try:
        result_data = build_event_label_service(searchTerm, labelName)  
    except ValidationError as e:
        return jsonify(error=str(e)), 400

    if result_data is not None:
        result_data = result_data.to_json(orient="records")
        return jsonify(data=result_data, status="Label data built successfully")
    return jsonify(error="Unable to build data"), 500



@api_bp.route('/get-unique-label-names', methods=['GET'])
def get_unique_label_names_route():
    label_names = get_unique_label_names_service()
    return jsonify(label_names=label_names)


@api_bp.route('/test-function', methods=['POST'])
def test_function_route():
    searchTerm = request.json.get('searchTerm')

    searchTerm= Web3.toChecksumAddress(searchTerm)

    testdata = test_function_service(searchTerm)
    return testdata
    if testdata is not None:
        testdata = testdata.to_json(orient="records")  
        return jsonify(data=testdata, status="Data fetched successfully")
    return jsonify(error="Unable to fetch data"), 500



@api_bp.route('/get-label-info-by-name', methods=['GET'])
def get_label_by_name_route():
    label_name = request.args.get('labelName')

    try:
        label_info = get_label_info_by_names_service(label_name)
    except Exception as e:  
        return jsonify(error=str(e)), 400

    if label_info is not None:
        label_info = label_info.to_json(orient="records")
        return jsonify(data=label_info, status="Label info retrieved successfully")
    
    return jsonify(error="Unable to retrieve label info"), 500


@api_bp.route('/update-label-data', methods=['POST'])
def update_label_data_route():
    data = request.json

    try:
        result = update_label_data_service(data)
        return jsonify(status=result)
    except Exception as e:
        return jsonify(error=str(e)), 400
    

@api_bp.route('/get-signature-by-keyword', methods=['GET'])
def get_signature_by_keyword_route():
    print("Inside Get Sig!!!")
    keyword = request.args.get('keyword')

    print("ROUTE KEYWORD: ", keyword)
    try:
        signature_info = etherface_service(keyword)
    except Exception as e:
        return jsonify(error=str(e)), 400

    if signature_info is not None:
        signature_info = signature_info.to_json(orient="records")
        return jsonify(data=signature_info, status="Signature info retrieved successfully")

    return jsonify(error="Unable to retrieve signature info"), 500



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