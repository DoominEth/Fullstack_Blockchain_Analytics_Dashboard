import json
import pandas as pd

def insert_contract_address(cursor, contract_address):
    try:
        cursor.execute("INSERT INTO contract_addresses (contract_address) VALUES (%s) ON CONFLICT (contract_address) DO NOTHING;", (contract_address,))
    except Exception as e:
        print(f"Error inserting contract address: {e}")

def insert_event(cursor, contract_address, event_name, event_and_params, event_signature, event_input, event_output=None): #Events have no output, to be removed
    try:
        cursor.execute("""
        INSERT INTO events (contract_address, event_name, event_and_params, event_signature, event_input, event_output) 
        VALUES (%s, %s, %s, %s, %s, %s);
        """, (contract_address, event_name, event_and_params, event_signature, event_input, event_output))
    except Exception as e:
        print(f"Error inserting event: {e}")

def contract_events_exist(cursor, contract_address):
    cursor.execute("SELECT 1 FROM events WHERE contract_address = %s LIMIT 1;", (contract_address,))
    return bool(cursor.fetchone())


def save_to_database(cursor, contract_address, events, tetherEvents):
    # Check if events for contract_address already exist
    if contract_events_exist(cursor, contract_address):
        print(f"Events for contract address {contract_address} already exist. Skipping...")
        return
    
    # Insert the contract address
    insert_contract_address(cursor, contract_address)

    # Insert each event
    for event, signature in zip(events, tetherEvents):
        insert_event(
            cursor,
            contract_address,
            event['name'],
            f"{event['name']}({','.join([inp['type'] for inp in event.get('inputs', [])])})",
            signature,
            json.dumps(event.get('inputs', [])),
            json.dumps(event.get('outputs', []))
        )

def get_events_by_contract_address(cursor, contract_address):
    """Fetch records based on the contract_address using a given cursor and return a DataFrame."""
    cursor.execute("SELECT * FROM events WHERE contract_address = %s", (contract_address,))
    column_names = [desc[0] for desc in cursor.description]  # Fetch column names
    records = cursor.fetchall()
    
    # Convert records to DataFrame
    df = pd.DataFrame(records, columns=column_names)
    return df