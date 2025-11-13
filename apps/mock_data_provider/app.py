from typing import Optional
import sqlite3
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field

DB_PATH = Path(__file__).parent / "flights.db"


def init_db() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH.as_posix(), check_same_thread=False)
    try:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS flights (
                flight_number TEXT NOT NULL,
                date TEXT NOT NULL,
                delay INTEGER,
                PRIMARY KEY(flight_number, date)
            )
            """
        )
        conn.commit()
    finally:
        conn.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    yield
    # Shutdown
    # Add any cleanup code here if needed


app = FastAPI(title="Mock Data Provider - Flights", lifespan=lifespan)


class FlightIn(BaseModel):
    flight_number: str = Field(..., json_schema_extra={"example": "AA100"})
    date: str = Field(..., json_schema_extra={"example": "2025-11-13"})
    delay: Optional[int] = Field(None, json_schema_extra={"example": 15})


class FlightOut(FlightIn):
    pass


def get_connection() -> sqlite3.Connection:
    # Use check_same_thread=False to allow background threads (uvicorn) to use connection if needed.
    conn = sqlite3.connect(DB_PATH.as_posix(), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


@app.get("/")
def read_root():
    return {"status": "healthy", "message": "Mock Flight Data Provider is running"}


@app.get("/flight/{flight_number}/{date}", response_model=FlightOut)
def get_flight(flight_number: str, date: str):
    conn = get_connection()
    try:
        cur = conn.execute(
            "SELECT flight_number, date, delay FROM flights WHERE flight_number = ? AND date = ?",
            (flight_number, date),
        )
        row = cur.fetchone()
        if row is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Flight not found"
            )
        return FlightOut(**dict(row))
    finally:
        conn.close()


# use query parameters to filter by flight_number and/or date
@app.get("/flights", response_model=list[FlightOut])
def list_flights(flight_number: Optional[str] = None, date: Optional[str] = None):
    conn = get_connection()
    try:
        query = "SELECT flight_number, date, delay FROM flights"
        params = []
        conditions = []
        if flight_number is not None:
            conditions.append("flight_number = ?")
            params.append(flight_number)
        if date is not None:
            conditions.append("date = ?")
            params.append(date)
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        cur = conn.execute(query, params)
        rows = cur.fetchall()
        return [FlightOut(**dict(row)) for row in rows]
    finally:
        conn.close()


@app.post("/flight", response_model=FlightOut)
def upsert_flight(f: FlightIn):
    conn = get_connection()
    try:
        # INSERT OR REPLACE will upsert based on PK we declared.
        conn.execute(
            "INSERT OR REPLACE INTO flights (flight_number, date, delay) VALUES (?, ?, ?)",
            (f.flight_number, f.date, f.delay),
        )
        conn.commit()
        return f
    finally:
        conn.close()


@app.delete("/flight/{flight_number}/{date}", status_code=status.HTTP_204_NO_CONTENT)
def delete_flight(flight_number: str, date: str):
    conn = get_connection()
    try:
        cur = conn.execute(
            "DELETE FROM flights WHERE flight_number = ? AND date = ?",
            (flight_number, date),
        )
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Flight not found"
            )
        return None
    finally:
        conn.close()


# Minimal runnable entrypoint for local development
if __name__ == "__main__":
    import uvicorn

    # Run with: python apps/mock_data_provider/app.py
    uvicorn.run("app:app", host="127.0.0.1", port=8001, reload=True)
