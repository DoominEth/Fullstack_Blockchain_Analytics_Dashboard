# utils/database/database.py
from .connection import get_connection

def get_data_from_db():
    setup_database()
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM data")
    data = cur.fetchone()
    conn.close()
    return data

def save_data_to_db(data):
    conn = get_connection()
    cur = conn.cursor()
    query = """
    INSERT INTO data (randomnumber1, randomnumber2, randomletter1, randomletter2)
    VALUES (%s, %s, %s, %s)
    """
    cur.execute(query, (data))
    conn.commit()
    conn.close()

def setup_database():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS data (
        id SERIAL PRIMARY KEY,
        randomnumber1 INT,
        randomnumber2 INT,
        randomletter1 TEXT,
        randomletter2 TEXT
    )
    """)
    conn.commit()
    cursor.close()
    conn.close()
