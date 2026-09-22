from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.products import router as products_router

app = FastAPI(
    title="Deccan Super Foods API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Deccan Super Foods API is running"
    }

app.include_router(
    products_router,
    prefix="/api"
)