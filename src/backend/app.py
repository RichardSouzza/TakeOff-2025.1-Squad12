from os import getenv

from dotenv import load_dotenv
from fastapi import FastAPI


load_dotenv()

DB_HOST     = getenv("DB_HOST") or ""
DB_USER     = getenv("DB_USER") or ""
DB_PASSWORD = getenv("DB_PASSWORD") or ""
DB_NAME     = getenv("DB_NAME") or ""
DB_URL = f"jdbc:postgresql://{DB_HOST}:5432/{DB_NAME}"

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}

