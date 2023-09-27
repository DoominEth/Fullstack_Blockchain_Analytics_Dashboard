# services/data_service.py
from utils.database.database import get_data_from_db, save_data_to_db
from utils.algorithms.algorithms import generate_data
from utils.helpers.validation import (
    is_integer, 
    validate_contract_address,
    validate_block_numbers,
    ValidationError
)
from utils.database.logDB import save_logs_to_database, get_all_logs_by_address
from utils.helpers.getLogs import  get_blockchain_data_logs
from utils.config   import Config
from utils.algorithms.event_signatures import createSigFromEvents
from utils.database.eventHashDB import save_event_hash_to_database, get_event_hash_by_contract_address
from utils.algorithms.parse_event_signatures import parse_event_logs
from utils.database.parsedEventLogsDB import get_all_parsed_event_logs_by_address, save_parsed_event_logs_to_database
from utils.database.functionHashDB import save_function_hash_to_database , get_function_hash_by_contract_address
from utils.algorithms.smart_contract_references import detect_smart_contract_references
from utils.database.smartContractReferenceDB import save_contract_references_to_database, get_contract_references_by_contract_address


def get_data_service():
    data = get_data_from_db()
    if data is None:
        data = generate_data()
        save_data_to_db(data)
    return data

#Raw Smart Contract Logs
def build_smart_contract_service(contract_address, start_block, end_block):
    # Validation To do: move this to own function
    if not all([contract_address, start_block, end_block]):
        print("FAIL All fields")
        raise ValidationError("Missing parameters")

    if not all(map(is_integer, [start_block, end_block])):
        print("Fail Int")
        raise ValidationError("Start block and End block must be integers")

    validate_block_numbers(start_block, end_block)

    if not validate_contract_address(contract_address):
        print("Fail contract")
        raise ValidationError("Invalid contract address")

    #Check for data existence
    fetchedData = get_all_logs_by_address(contract_address,start_block,end_block)


    if fetchedData is None:
        #Create data
        logdata = get_blockchain_data_logs(contract_address,start_block,end_block)
        print("THE LOG DATA FOR THIS: ", logdata)

        if logdata.empty:
            print('WARNING: There is no log data between these blocks')

        #Save data
        save_logs_to_database(logdata)
        #Return Data
        return logdata

    #print("Hash Log Data: ", hash_logs)
    #print(fetchedData)
    #return data
    return fetchedData

def hash_log_events_service(contract_address):
    #Validate (add)

    #Check for data existence
    fetchedData = get_event_hash_by_contract_address(contract_address)

    print("FETCHED DATA HASH TABLE: ", type(fetchedData))


    if fetchedData.empty:
        print("THE DATA IS EMPTY!!!!!!!!!!!")
        #Create Data
        contract_instance = Config.contract_helper.createContract(contract_address)
        events = [item for item in contract_instance.abi if item['type'] == 'event']
        hashed_events = createSigFromEvents(events)
        #Save Data
        #print("HashedEvents" , hashed_events)
        #print("Event Names" , events)

        save_event_hash_to_database(contract_instance.address, events, hashed_events)
        fetchedData = get_event_hash_by_contract_address(contract_address)
        #Return Data
        return fetchedData
    #Return Data
    return fetchedData


def parse_log_events_service(contract_address, start_block, end_block):
    
    parsed_event_logs = get_all_parsed_event_logs_by_address(contract_address, start_block,end_block)

    if parsed_event_logs is None:
        print("THERE IS NO PARSED EVENT LOGS FOR THIS ADDRESS")

        event_logs = build_smart_contract_service(contract_address, start_block,end_block)
        hash_events = hash_log_events_service(contract_address)

        parsed_event_logs  = parse_event_logs(event_logs, hash_events)

        save_parsed_event_logs_to_database(parsed_event_logs)

        return parsed_event_logs

    return parsed_event_logs


def hash_functions_service(contract_address):
    #Validate (add)

    #Check for data existence
   fetchedData = get_function_hash_by_contract_address(contract_address)
   if fetchedData.empty:
        #Create Data
        contract_instance = Config.contract_helper.createContract(contract_address)
        functions = [item for item in contract_instance.abi if item['type'] == 'function']
        hashed_functions = createSigFromEvents(functions)
        #Save Data
        #print("Hashed Functions" , hashed_functions)
        #print("Function Names" , functions)
        save_function_hash_to_database(contract_instance.address, functions, hashed_functions)
        fetchedData = get_function_hash_by_contract_address(contract_address)
        return fetchedData
   #Return Data
   return fetchedData 

    
def contract_references_service(contract_address):
    
    #check if data exists
    referenceAddresses = get_contract_references_by_contract_address(contract_address)

    if referenceAddresses.empty:
        #create data
        contract_instance = Config.contract_helper.createContract(contract_address)
        childAddresses = detect_smart_contract_references(contract_instance)

        save_contract_references_to_database(contract_address, childAddresses)

        referenceAddresses = get_contract_references_by_contract_address(contract_address)

        print("Child Addresses: ", referenceAddresses)
        return referenceAddresses

    return referenceAddresses
    