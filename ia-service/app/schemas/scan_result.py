"""
Modèles Pydantic décrivant le contrat de sortie de l'API /process-image.

Ce contrat est celui attendu par le backend Symfony pour mettre à jour le
stock (Scan / ScanItem). Toute évolution de ce fichier doit être communiquée
à l'équipe backend.
"""
from __future__ import annotations

from enum import Enum

from pydantic import BaseModel, Field, field_validator


class ScanStatus(str, Enum):
    SUCCESS = "success"
    ERROR = "error"


class ProductItem(BaseModel):
    """Un produit détecté sur la feuille de charge."""

    name: str = Field(..., min_length=1, description="Nom du produit, normalisé")
    quantity: int = Field(..., ge=0, description="Quantité détectée")
    unit_price: float | None = Field(
        default=None, ge=0, description="Prix unitaire si détecté, sinon null"
    )
    raw_ocr_text: str = Field(
        ..., description="Texte brut OCR ayant servi à extraire cette ligne"
    )

    @field_validator("name")
    @classmethod
    def name_must_not_be_blank(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("le nom du produit ne peut pas être vide")
        return v


class ScanResult(BaseModel):
    """Réponse complète renvoyée par POST /process-image."""

    status: ScanStatus
    confidence: float = Field(
        ..., ge=0.0, le=1.0, description="Score de confiance global (0 à 1)"
    )
    products: list[ProductItem] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)

    model_config = {
        "json_schema_extra": {
            "example": {
                "status": "success",
                "confidence": 0.87,
                "products": [
                    {
                        "name": "Farine T55 1kg",
                        "quantity": 12,
                        "unit_price": 1.35,
                        "raw_ocr_text": "Farine T55 1kg  x12  1.35",
                    }
                ],
                "warnings": ["Ligne 4 illisible, ignorée"],
            }
        }
    }
