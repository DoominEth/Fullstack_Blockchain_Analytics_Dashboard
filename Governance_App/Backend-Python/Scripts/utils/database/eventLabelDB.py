import pandas as pd
from utils.database.connection import get_connection

def setup_event_labels_table(cursor):
    """Set up the event_labels table."""
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS event_labels (
        event_name TEXT NOT NULL,
        event_and_params TEXT NOT NULL,
        event_signature TEXT NOT NULL,
        github_url TEXT NOT NULL,
        label_name TEXT NOT NULL,        
        UNIQUE (github_url, label_name, event_name)
    )
    """)

def save_dataframe_to_db(df, cursor):
    """Save the dataframe to the event_labels table."""
    for index, row in df.iterrows():
        values = tuple(row)
        cursor.execute("""
        INSERT INTO event_labels
        (event_name, event_and_params, event_signature, github_url, label_name)
        VALUES (%s, %s, %s, %s, %s)  -- Updated the placeholders to account for the new column
        ON CONFLICT (github_url, label_name, event_name) DO NOTHING
        """, values)


def save_event_labels_to_database(df):
    """Ensure the table exists, then save the dataframe to the database."""
    with get_connection() as conn:
        with conn.cursor() as cursor:
            setup_event_labels_table(cursor)  
            save_dataframe_to_db(df, cursor)
            conn.commit()

def get_all_event_labels_by_label_name(label_name):
    """Fetch all records from the event_labels table for a given label name."""
    with get_connection() as conn:
        with conn.cursor() as cursor:
            setup_event_labels_table(cursor)  
            cursor.execute("""
            SELECT * FROM event_labels 
            WHERE label_name = %s
            """, (label_name,))
            column_names = [desc[0] for desc in cursor.description]
            records = cursor.fetchall()
    
    df = pd.DataFrame(records, columns=column_names)
    return df

def get_all_event_labels_by_github_url(github_url):
    """Fetch all records from the event_labels table for a given GitHub URL."""
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("""
            SELECT * FROM event_labels 
            WHERE github_url = %s
            """, (github_url,))
            column_names = [desc[0] for desc in cursor.description]
            records = cursor.fetchall()
    
    # Convert records to DataFrame
    df = pd.DataFrame(records, columns=column_names)
    return df

def get_unique_label_names():
    with get_connection() as conn:
        with conn.cursor() as cursor:
            setup_event_labels_table(cursor)  
            cursor.execute("""
            SELECT DISTINCT label_name FROM event_labels
            """)
            records = cursor.fetchall()
    
    return [record[0] for record in records]
