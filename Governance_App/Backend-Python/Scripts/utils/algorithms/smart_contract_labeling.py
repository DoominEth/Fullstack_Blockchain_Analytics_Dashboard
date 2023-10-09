#from utils.database.eventHashDB import save_event_hash_to_database, get_event_hash_by_contract_address
from utils.database.eventLabelDB import get_unique_label_names, get_all_event_labels_by_label_name
from utils.helpers.service_helpers import hash_log_events
def smart_contract_labeler(contract_address):
    all_labels = get_unique_label_names()
    contract_hash = hash_log_events(contract_address)

    if contract_hash is None:
        return None

    #contract_hash = get_event_hash_by_contract_address(contract_address)

    matching_labels = []
    
    for label in all_labels:
        label_event_labels = get_all_event_labels_by_label_name(label)
        
        matching_count = 0
        for event_label in label_event_labels['event_signature']:
            #print('Event Label ', event_label)
            if contract_hash['event_signature'].isin([event_label]).any():
                #print("MATCHING EVENT LABEL: ,", event_label)
                matching_count += 1
        
        if matching_count / len(label_event_labels) >= 0.2:  # Hard coded to be removed
            matching_labels.append(label)
    
    return matching_labels
