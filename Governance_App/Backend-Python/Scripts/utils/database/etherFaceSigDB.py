import pandas as pd
from utils.database.connection import get_connection

def setup_signatures_table(cursor):
    """Set up the signatures table."""
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS signatures (
        id SERIAL PRIMARY KEY,
        keyword TEXT NOT NULL,
        name TEXT NOT NULL,
        hash TEXT NOT NULL
    )
    """)

def insert_signature(cursor, keyword, name, hash):
    setup_signatures_table(cursor)
    try:
        cursor.execute("""
        INSERT INTO signatures (keyword, name, hash) 
        VALUES (%s, %s, %s);
        """, (keyword, name, hash))
    except Exception as e:
        print(f"Error inserting signature: {e}")

def signature_exists(cursor, name):
    setup_signatures_table(cursor)
    cursor.execute("SELECT 1 FROM signatures WHERE name = %s LIMIT 1;", (name,))
    return bool(cursor.fetchone())

def save_to_database(cursor, df):
    setup_signatures_table(cursor)
    for index, row in df.iterrows():
        if not signature_exists(cursor, row['name']):
            insert_signature(
                cursor,
                row['keyword'],
                row['name'],
                row['hash']
            )

def save_df_to_etherface_database(df):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            save_to_database(cursor, df)
            conn.commit()

def get_signatures_by_keyword(keyword):
    with get_connection() as conn:
        with conn.cursor() as cursor:
            setup_signatures_table(cursor)
            cursor.execute("SELECT * FROM signatures WHERE keyword = %s", (keyword,))
            column_names = [desc[0] for desc in cursor.description]  # Fetch column names
            records = cursor.fetchall()

    df = pd.DataFrame(records, columns=column_names)
    return df
