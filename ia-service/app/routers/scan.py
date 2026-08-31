"""Endpoint principal : réception d'une image, extraction du texte OCR brut."""
from __future__ import annotations

import shutil
import tempfile
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.core.logging import get_logger
from app.ocr.ocr_engine import extract_text
from app.preprocessing.image_cleaner import preprocess_image

logger = get_logger(__name__)
router = APIRouter(tags=["scan"])

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/bmp", "image/tiff"}


@router.post("/process-image")
async def process_image(file: UploadFile = File(...)) -> dict:
    """
    Reçoit une image, applique preprocess_image -> extract_text,
    et retourne le texte OCR brut. La structuration en produits/quantités
    est faite en aval (voir app/llm/, scope de l'équipe extraction).
    """
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail=f"Type de fichier non supporté : {file.content_type}")

    suffix = Path(file.filename or "upload.jpg").suffix or ".jpg"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        preprocessed = preprocess_image(tmp_path)
        raw_text = extract_text(preprocessed)
        return {"status": "success", "raw_ocr_text": raw_text}
    except ValueError as exc:
        return {"status": "error", "raw_ocr_text": "", "warnings": [str(exc)]}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Erreur interne : {exc}") from exc
    finally:
        Path(tmp_path).unlink(missing_ok=True)


@router.get("/health")
async def health() -> dict:
    return {"status": "ok"}