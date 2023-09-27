# utils/database/connection.py
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

def get_connection():
    """Establish and return a connection to the PostgreSQL database."""
    try:
        conn = psycopg2.connect(**db_config)
        #print("Database Connected Successfully!")  
        return conn
    except Exception as e:
        print(f"An error occurred while connecting to the database: {e}")
        raise
    
