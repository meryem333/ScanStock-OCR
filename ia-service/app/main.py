"""Point d'entrée du service IA ScanStock-AI."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import setup_logging
from app.routers import scan

setup_logging()

app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "Service interne d'OCR + structuration IA pour ScanStock-AI. "
        "Reçoit une image de feuille de charge et retourne un JSON structuré "
        "consommé par le backend Symfony."
    ),
    version="0.1.0",
)

# CORS permissif pour l'instant : ce service n'est appelé que par le backend
# Symfony en interne, pas directement par le navigateur.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan.router)


@app.get("/")
async def root() -> dict:
    return {"service": settings.APP_NAME, "docs": "/docs"}
