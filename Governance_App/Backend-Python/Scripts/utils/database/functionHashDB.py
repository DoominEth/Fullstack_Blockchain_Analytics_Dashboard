import json
import pandas as pd
from utils.database.connection import get_connection  

def setup_functions_table(cursor):
    """Set up the functions table."""
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS functions (
        id SERIAL PRIMARY KEY,
        contract_address TEXT NOT NULL,
        function_name TEXT NOT NULL,
        function_and_params TEXT,
        function_signature TEXT NOT NULL,
        function_input TEXT NOT NULL,
        function_output TEXT
    )
    """)

def insert_function(cursor, contract_address, function_name, function_and_params, function_signature, function_input, function_output):
    try:
        cursor.execute("""
        INSERT INTO functions (contract_address, function_name, function_and_params, function_signature, function_input, function_output) 
        VALUES (%s, %s, %s, %s, %s, %s);
        """, (contract_address, function_name, function_and_params, function_signature, json.dumps(function_input), json.dumps(function_output)))
    except Exception as e:
        print(f"Error inserting function: {e}")


def contract_functions_exist(cursor, contract_address):
    cursor.execute("SELECT 1 FROM functions WHERE contract_address = %s LIMIT 1;", (contract_address,))
    return bool(cursor.fetchone())


def save_to_functions_database(cursor, contract_address, function_data, hashed_functions):
    if contract_functions_exist(cursor, contract_address):
        print(f"functions for contract address {contract_address} already exist. Skipping...")
        return

    for function, signature in zip(function_data, hashed_functions):
        insert_function(
            cursor,
            contract_address,
            function['name'],
            f"{function['name']}({','.join([inp['type'] for inp in function.get('inputs', [])])})",
            signature,
            function.get('inputs', []),
            function.get('outputs', [])
        )


def save_function_hash_to_database(contract_address, function_data, hased_functions):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            save_to_functions_database(cursor, contract_address, function_data, hased_functions)
            conn.commit()


def get_function_hash_by_contract_address(contract_address):
    
    with get_connection() as conn:
        with conn.cursor() as cursor:
            setup_functions_table(cursor)
            cursor.execute("SELECT * FROM functions WHERE contract_address = %s", (contract_address,))
            column_names = [desc[0] for desc in cursor.description]  # Fetch column names
            records = cursor.fetchall()

    df = pd.DataFrame(records, columns=column_names)
    return df
