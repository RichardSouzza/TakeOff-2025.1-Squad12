from os import getenv

import pyodbc
from dotenv import load_dotenv


load_dotenv()

DB_HOST     = getenv("DB_HOST") or ""
DB_USER     = getenv("DB_USER") or ""
DB_PASSWORD = getenv("DB_PASSWORD") or ""
DB_NAME     = getenv("DB_NAME") or ""

conn_str = (
    f"DRIVER={{ODBC Driver 17 for SQL Server}};"
    f"SERVER={DB_HOST};"
    f"DATABASE={DB_NAME};"
    f"UID={DB_USER};"
    f"PWD={DB_PASSWORD};"
    "TrustServerCertificate=yes;"
)

