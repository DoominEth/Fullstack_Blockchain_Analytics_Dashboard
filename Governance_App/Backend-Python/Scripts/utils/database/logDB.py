import pandas as pd
from utils.database.connection import get_connection

def setup_logs_table(cursor):
    """Set up the logs table."""
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS logs (
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
    """Save the dataframe to the logs table."""
    for index, row in df.iterrows():
        values = tuple(row)
        cursor.execute("""
        INSERT INTO logs
        (block_number, transaction_index, log_index, transaction_hash, contract_address, topic0, topic1, topic2, topic3, data)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (block_number, transaction_index, log_index) DO NOTHING
        """, values)

def save_logs_to_database(df):
    """Ensure the table exists, then save the dataframe to the database."""
    with get_connection() as conn:
        with conn.cursor() as cursor:
            setup_logs_table(cursor)
            save_dataframe_to_db(df, cursor)
            conn.commit()

def get_all_logs_by_address(contract_address, start_block, end_block):
    """Fetch all records from a logs table."""

    contract_address = contract_address.lower()
    start_block = int(start_block)
    end_block = int(end_block)

    data_exists = is_data_in_db(contract_address, start_block,end_block)


    if not data_exists:
        print(f"Requested Data Outside of block range {start_block} to {end_block} in the database.")
        return None

    print("DATA BEING LOADED FROM DB")

    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(f"""
            SELECT * FROM logs 
            WHERE contract_address = '{contract_address}' 
            AND block_number > {start_block} 
            AND block_number < {end_block}
            """)
            column_names = [desc[0] for desc in cursor.description]
            records = cursor.fetchall()
    
    # Convert records to DataFrame
    df = pd.DataFrame(records, columns=column_names)
    return df

def is_data_in_db(contract_address, start_block, end_block):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT MIN(block_number), MAX(block_number) FROM logs WHERE contract_address = %s", (contract_address,))
            result = cursor.fetchone()

            # If fetchone returns a tuple like (min_block, max_block)
            min_block, max_block = result

            # Handle the case when no result is returned by the query
            if min_block is None or max_block is None:
                return False

            print("RESULT: ", result)

            print("MIN BLOCK: ", min_block)
            print("MAX BLOCK: ", max_block)


            if min_block <= start_block and max_block >= end_block:
                return True
    return False

