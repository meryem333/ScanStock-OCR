"""
Configuration centrale du service IA.

Toutes les valeurs sont surchargeables via un fichier .env (voir .env.example)
ou des variables d'environnement classiques.
"""
from __future__ import annotations

import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # Nom du service (utile dans les logs)
    APP_NAME: str = "ScanStock-AI - Service IA"

    # Moteur OCR : "tesseract" (par défaut, fonctionne hors-ligne) ou
    # "paddle" (nécessite un accès réseau aux modèles PaddleOCR, ou des
    # modèles pré-téléchargés localement — voir README.md).
    OCR_ENGINE: str = os.getenv("OCR_ENGINE", "tesseract")

    # Langue(s) Tesseract, ex: "fra", "fra+eng"
    TESSERACT_LANG: str = os.getenv("TESSERACT_LANG", "fra+eng")

    # Chemin vers le binaire tesseract si non trouvé automatiquement
    TESSERACT_CMD: str | None = os.getenv("TESSERACT_CMD")

    # --- LLM (structuration du texte OCR en JSON) ---
    # Tant qu'aucune clé API n'est fournie par l'équipe, structure_text()
    # renvoie un JSON mocké. Dès qu'une clé est disponible, renseigner
    # LLM_API_KEY et LLM_PROVIDER pour activer le vrai appel (à implémenter
    # dans llm_client.py, cf. TODO dans le fichier).
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "mock")
    LLM_API_KEY: str | None = os.getenv("LLM_API_KEY")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gpt-4o-mini")

    # Niveau de log
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")


settings = Settings()
