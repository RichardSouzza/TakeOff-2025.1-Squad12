from os import getenv

import pymssql
from dotenv import load_dotenv


load_dotenv()

DB_HOST     = getenv("DB_HOST") or ""
DB_USER     = getenv("DB_USER") or ""
DB_PASSWORD = getenv("DB_PASSWORD") or ""
DB_NAME     = getenv("DB_NAME") or ""

conn = pymssql.connect(
    server=DB_HOST,
    user=DB_USER,
    password=DB_PASSWORD,
    database=DB_NAME,
    tds_version=r"7.0"
)

cursor = conn.cursor(as_dict=True)

