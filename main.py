from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

SPOONAC_API_KEY = os.getenv("SPOONAC_API_KEY")

# Comma-separated list of allowed frontend origins, e.g.
# ALLOWED_ORIGINS="https://fridge-to-food.pages.dev,https://example.com"
_default_origins = "http://127.0.0.1:5500,http://localhost:5500,http://127.0.0.1:8000,http://localhost:8000"
ALLOWED_ORIGINS = [
    o.strip() for o in os.getenv("ALLOWED_ORIGINS", _default_origins).split(",") if o.strip()
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health():
    return {"status": "ok"}

@app.get("/recipes")
async def get_recipes(ingredient: str):
    url = f"https://api.spoonacular.com/recipes/findByIngredients?ingredients={ingredient}&apiKey={SPOONAC_API_KEY}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.json()
