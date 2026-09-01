"""
Client pour appeler le service IA (OCR) de l'équipe.
Étape 0 du pipeline : image -> texte OCR brut, via l'API du service ia-service/.
"""
from __future__ import annotations

import requests

URL_SERVICE_IA_PAR_DEFAUT = "http://127.0.0.1:8001/process-image"


def scanner_image(chemin_image: str, url: str = URL_SERVICE_IA_PAR_DEFAUT) -> dict:
    """
    Le service IA (uvicorn) doit être lancé avant d'appeler cette fonction.
    """
    with open(chemin_image, "rb") as f:
        fichiers = {"file": (chemin_image, f, "image/png")}
        reponse = requests.post(url, files=fichiers)

    reponse.raise_for_status()
    return reponse.json()