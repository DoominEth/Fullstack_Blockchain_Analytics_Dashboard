import json
import pandas as pd
from utils.database.connection import get_connection  

def setup_events_table(cursor):
    """Set up the events table."""
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        contract_address TEXT NOT NULL,
        event_name TEXT NOT NULL,
        event_and_params TEXT,
        event_signature TEXT NOT NULL,
        event_input TEXT NOT NULL,
        event_output TEXT
    )
    """)

def insert_event(cursor, contract_address, event_name, event_and_params, event_signature, event_input, event_output=None):
    try:
        cursor.execute("""
        INSERT INTO events (contract_address, event_name, event_and_params, event_signature, event_input, event_output) 
        VALUES (%s, %s, %s, %s, %s, %s);
        """, (contract_address, event_name, event_and_params, event_signature, json.dumps(event_input), json.dumps(event_output)))
    except Exception as e:
        print(f"Error inserting event: {e}")


def contract_events_exist(cursor, contract_address):
    cursor.execute("SELECT 1 FROM events WHERE contract_address = %s LIMIT 1;", (contract_address,))
    return bool(cursor.fetchone())


def save_to_database(cursor, contract_address, event_data, hashed_events):
    if contract_events_exist(cursor, contract_address):
        print(f"Events for contract address {contract_address} already exist. Skipping...")
        return

    for event, signature in zip(event_data, hashed_events):
        insert_event(
            cursor,
            contract_address,
            event['name'],
            f"{event['name']}({','.join([inp['type'] for inp in event.get('inputs', [])])})",
            signature,
            event.get('inputs', []),
            event.get('outputs', [])
        )


def save_event_hash_to_database(contract_address, event_data, hased_events):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            save_to_database(cursor, contract_address, event_data, hased_events)
            conn.commit()


def get_event_hash_by_contract_address(contract_address):
    
    with get_connection() as conn:
        with conn.cursor() as cursor:
            setup_events_table(cursor)
            cursor.execute("SELECT * FROM events WHERE contract_address = %s", (contract_address,))
            column_names = [desc[0] for desc in cursor.description]  # Fetch column names
            records = cursor.fetchall()

    df = pd.DataFrame(records, columns=column_names)
    return df
