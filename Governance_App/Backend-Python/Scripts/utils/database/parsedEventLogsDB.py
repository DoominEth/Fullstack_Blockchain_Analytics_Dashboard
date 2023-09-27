import pandas as pd
from utils.database.connection import get_connection

def setup_logs_table(cursor):
    """Set up the logs table."""
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS parsed_event_logs (
        block_number INTEGER NOT NULL,
        transaction_index INTEGER NOT NULL,
        log_index INTEGER NOT NULL,
        transaction_hash TEXT NOT NULL,
        contract_address TEXT NOT NULL,
        topic0 TEXT,
        topic1 TEXT,
        topic2 TEXT,
        topic3 TEXT,
        data TEXT NOT NULL,
        UNIQUE (block_number, transaction_index, log_index) 
    )
    """)

def save_dataframe_to_db(df, cursor):
    """Save the dataframe to the parsed_event_logs table."""
    for index, row in df.iterrows():
        values = tuple(row)
        cursor.execute("""
        INSERT INTO parsed_event_logs
        (block_number, transaction_index, log_index, transaction_hash, contract_address, topic0, topic1, topic2, topic3, data)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (block_number, transaction_index, log_index) DO NOTHING
        """, values)

def save_parsed_event_logs_to_database(df):
    """Ensure the table exists, then save the dataframe to the database."""
    with get_connection() as conn:
        with conn.cursor() as cursor:
            setup_logs_table(cursor)
            save_dataframe_to_db(df, cursor)
            conn.commit()

def get_all_parsed_event_logs_by_address(contract_address, start_block, end_block):
    """Fetch all records from a parsed_event_logs table."""
    contract_address = contract_address.lower()
    start_block = int(start_block)
    end_block = int(end_block)

    with get_connection() as conn:
        with conn.cursor() as cursor:
            setup_logs_table(cursor)
            cursor.execute("""
            SELECT MIN(block_number), MAX(block_number) 
            FROM parsed_event_logs 
            WHERE contract_address = %s
            """, (contract_address,))
            min_block, max_block = cursor.fetchone()

            if min_block is None or max_block is None or min_block > start_block or max_block < end_block:
                print(f"Requested Data Outside of block range {start_block} to {end_block} in the database.")
                return None

            cursor.execute("""
            SELECT * 
            FROM parsed_event_logs 
            WHERE contract_address = %s 
            AND block_number BETWEEN %s AND %s
            """, (contract_address, start_block, end_block))
            column_names = [desc[0] for desc in cursor.description]
            records = cursor.fetchall()

    df = pd.DataFrame(records, columns=column_names)
    return df
