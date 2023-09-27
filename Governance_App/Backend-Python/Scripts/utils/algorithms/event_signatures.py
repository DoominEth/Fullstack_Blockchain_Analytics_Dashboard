from eth_utils import keccak
import json

def format_events(input_list):
    formatted_events = []
    for event in input_list:
        event_name = event.get('name', '')
        input_types = [inp['type'] for inp in event.get('inputs', [])]
        formatted_event = f"{event_name}({','.join(input_types)})"
        formatted_events.append(formatted_event)
    return formatted_events

def hash_events(events):
    hashed_events = []
    for event in events:
        input_string = event
        hashed_event = keccak(text=input_string).hex()
        hashed_events.append('0x' + hashed_event)
    return hashed_events

def createSigFromEvents(contract_events):
    formatted_events = format_events(contract_events)
    sigList = hash_events(formatted_events)
    return sigList
