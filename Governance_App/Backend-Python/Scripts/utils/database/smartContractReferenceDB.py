from utils.database.connection import get_connection
import pandas as pd

def setup_references_table(cursor):
    """Set up the references table."""
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS contract_references (
        id SERIAL PRIMARY KEY,
        contract_address TEXT NOT NULL,
        name TEXT NOT NULL,
        address TEXT NOT NULL
    )
    """)

def insert_reference(cursor, contract_address, name, address):
    try:
        cursor.execute("""
        INSERT INTO contract_references (contract_address, name, address) 
        VALUES (%s, %s, %s);
        """, (contract_address, name, address))
    except Exception as e:
        print(f"Error inserting reference: {e}")

def contract_references_exist(cursor, contract_address):
    cursor.execute("SELECT 1 FROM contract_references WHERE contract_address = %s LIMIT 1;", (contract_address,))
    return bool(cursor.fetchone())

def save_references_to_database(cursor, contract_address, references):
    if contract_references_exist(cursor, contract_address):
        print(f"References for contract address {contract_address} already exist. Skipping...")
        return

    for reference in references:
        insert_reference(
            cursor,
            contract_address,
            reference['name'],
            reference['address']
        )

def save_contract_references_to_database(contract_address, references):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            setup_references_table(cursor)
            save_references_to_database(cursor, contract_address, references)
            conn.commit()

def get_contract_references_by_contract_address(contract_address):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            setup_references_table(cursor)
            cursor.execute("SELECT * FROM contract_references WHERE contract_address = %s", (contract_address,))
            column_names = [desc[0] for desc in cursor.description]
            records = cursor.fetchall()

    df = pd.DataFrame(records, columns=column_names)
    return df

