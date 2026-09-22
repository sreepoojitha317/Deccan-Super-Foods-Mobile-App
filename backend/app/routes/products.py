from fastapi import APIRouter
from app.database import supabase

router = APIRouter()


@router.get("/products")
def get_products():
    response = supabase.table("products").select("*").execute()

    return response.data