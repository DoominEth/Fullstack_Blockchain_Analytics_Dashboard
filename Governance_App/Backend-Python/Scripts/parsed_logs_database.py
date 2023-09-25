import pandas as pd

def setup_logs_table(cursor, name):
    """Set up the logs table with a specific name using the provided cursor."""
    table_name = f"parsed_logs_{name}"

    # Create the logs table
    cursor.execute(f"""
    CREATE TABLE IF NOT EXISTS {table_name} (
        block_number INTEGER NOT NULL,
        transaction_index INTEGER NOT NULL,
        log_index INTEGER NOT NULL,
        transaction_hash TEXT NOT NULL,
        contract_address TEXT NOT NULL,
        topic0 TEXT,
        topic1 TEXT,
        topic2 TEXT,
        topic3 TEXT,
        data TEXT
    )
    """)

def save_dataframe_to_db(df, cursor, name):
    """Save the dataframe to the logs table with a specific name using the provided cursor."""
    table_name = f"parsed_logs_{name}"
    
    for index, row in df.iterrows():
        values = tuple(row)
        cursor.execute(f"""
        INSERT INTO {table_name} 
        (block_number, transaction_index, log_index, transaction_hash, contract_address, topic0, topic1, topic2, topic3, data)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, values)

def save_to_database(cursor, df, name):
    """Ensure the table exists, then save the dataframe to the database."""
    setup_logs_table(cursor, name)
    save_dataframe_to_db(df, cursor, name)

def get_all_logs_by_name(cursor, name):
    """Fetch all records from a specific logs table using a given cursor and return a DataFrame."""
    table_name = f"parsed_logs_{name}"
    cursor.execute(f"SELECT * FROM {table_name}")
    column_names = [desc[0] for desc in cursor.description]  # Fetch column names
    records = cursor.fetchall()
    
    # Convert records to DataFrame
    df = pd.DataFrame(records, columns=column_names)
    return df
