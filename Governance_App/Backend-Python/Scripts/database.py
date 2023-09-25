import os
import psycopg2
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# PostgreSQL configuration
db_config = {
    "user": os.environ["PG_USER"],
    "password": os.environ["PG_PASSWORD"],
    "host": os.environ["PG_HOST"],
    "port": os.environ["PG_PORT"],
    "dbname": os.environ["PG_DATABASE"],
}

def connect_to_db():
    """Establish and return a connection to the PostgreSQL database."""
    conn = psycopg2.connect(**db_config)
    return conn

def setup_database():
    """Set up the required tables."""
    conn = connect_to_db()
    cursor = conn.cursor()

    # Create tables
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS contract_addresses (
        contract_address TEXT PRIMARY KEY
    )
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS events (
        contract_address TEXT REFERENCES contract_addresses(contract_address),
        event_name TEXT NOT NULL,
        event_and_params TEXT NOT NULL,
        event_signature TEXT NOT NULL,
        event_input TEXT,
        event_output TEXT
    )
    """)
    
    conn.commit()
    cursor.close()
    conn.close()
