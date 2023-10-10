#from utils.database.eventHashDB import save_event_hash_to_database, get_event_hash_by_contract_address
from utils.database.eventLabelDB import get_unique_label_names, get_all_event_labels_by_label_name
from utils.helpers.service_helpers import hash_log_events
def smart_contract_labeler(contract_address):
    all_labels = get_unique_label_names()
    contract_hash = hash_log_events(contract_address)

    stop = False

    if contract_hash is None:
        return None, stop

    #contract_hash = get_event_hash_by_contract_address(contract_address)

    matching_labels = []
    stop_on_match_results = [] 
    
    for label in all_labels:
        label_event_labels = get_all_event_labels_by_label_name(label)
        label_event_labels_filtered = label_event_labels[label_event_labels['include'] == True]

        matching_count = 0
        for event_label in label_event_labels_filtered['event_signature']:
            #print('Event Label ', event_label)
            if contract_hash['event_signature'].isin([event_label]).any():
                #print("MATCHING EVENT LABEL: ,", event_label)
                matching_count += 1
        
        percentage_match_for_current_label = label_event_labels['percentage_match'].iloc[0] / 100

        if len(label_event_labels_filtered) == 0:
            continue

        matchingDecimal = matching_count / len(label_event_labels_filtered) 
        if matchingDecimal >= percentage_match_for_current_label:
            matching_labels.append(label)
            stop_on_match_results.append(label_event_labels['stop_on_match'].iloc[0])
    


    stop = any(stop_on_match_results)
    print("Stop inside the Label: ", stop)


    return matching_labels, stop
