from utils.database.eventHashDB import save_event_hash_to_database, get_event_hash_by_contract_address
from utils.config   import Config
from utils.algorithms.event_signatures import createSigFromEvents, hash_events

def hash_log_events(contract_address):
    fetchedData = get_event_hash_by_contract_address(contract_address)

    if fetchedData.empty:
        contract_instance = Config.contract_helper.createContract(contract_address)
        if contract_instance is None:
            return None
        
        events = [item for item in contract_instance.abi if item['type'] == 'event']
        hashed_events = createSigFromEvents(events)

        save_event_hash_to_database(contract_instance.address, events, hashed_events)
        fetchedData = get_event_hash_by_contract_address(contract_address)
        return fetchedData
    return fetchedData