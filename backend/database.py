from config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
from supabase import create_client
from typing import Optional

_supabase = None

def get_client():
    global _supabase
    if _supabase is None:
        _supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    return _supabase

def fetch_one(table: str, filters: dict) -> Optional[dict]:
    sb = get_client()
    query = sb.table(table).select("*")
    for key, value in filters.items():
        query = query.eq(key, value)
    result = query.limit(1).execute()
    return result.data[0] if result.data else None

def insert(table: str, data: dict) -> dict:
    sb = get_client()
    result = sb.table(table).insert(data).execute()
    return result.data[0] if result.data else data

def update(table: str, filters: dict, data: dict) -> dict:
    sb = get_client()
    query = sb.table(table).update(data)
    for key, value in filters.items():
        query = query.eq(key, value)
    result = query.execute()
    return result.data[0] if result.data else data
