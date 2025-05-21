from os import getenv

from dotenv import load_dotenv
from sqlmodel import create_engine


load_dotenv()

SQL_DB_HOST     = getenv("SQL_DB_HOST") or ""
SQL_DB_USER     = getenv("SQL_DB_USER") or ""
SQL_DB_PASSWORD = getenv("SQL_DB_PASSWORD") or ""
SQL_DB_NAME     = getenv("SQL_DB_NAME") or ""

PG_DB_HOST     = getenv("PG_DB_HOST") or ""
PG_DB_USER     = getenv("PG_DB_USER") or ""
PG_DB_PASSWORD = getenv("PG_DB_PASSWORD") or ""
PG_DB_NAME     = getenv("PG_DB_NAME") or ""
PG_DB_PORT     = getenv("PG_DB_PORT") or ""

sql_connection_str = (
    f"DRIVER={{ODBC Driver 17 for SQL Server}};"
    f"SERVER={SQL_DB_HOST};"
    f"DATABASE={SQL_DB_NAME};"
    f"UID={SQL_DB_USER};"
    f"PWD={SQL_DB_PASSWORD};"
    "TrustServerCertificate=yes;"
)

pg_connection_str = f"postgres://{PG_DB_USER}:{PG_DB_PASSWORD}@{PG_DB_HOST}{PG_DB_PORT}/{PG_DB_NAME}?sslmode=require"

engine = create_engine(pg_connection_str)
