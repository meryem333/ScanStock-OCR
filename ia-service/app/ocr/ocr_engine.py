"""
Wrapper OCR.

COMPROMIS TECHNIQUE (voir README.md) :
PaddleOCR s'installe correctement via pip (paddlepaddle + paddleocr), mais il
télécharge ses modèles de détection/reconnaissance depuis un serveur externe
au premier appel. Dans l'environnement de développement de ce service, ce
téléchargement est bloqué par la politique réseau (pas d'accès aux serveurs
d'hébergement des modèles Paddle), ce qui rend PaddleOCR inutilisable tel
quel ici.

-> Moteur par défaut : Tesseract (via pytesseract), qui fonctionne
   entièrement hors-ligne une fois le paquet système `tesseract-ocr`
   installé.
-> Le chemin PaddleOCR reste implémenté et activable via la variable
   d'environnement OCR_ENGINE=paddle, pour le jour où l'équipe déploiera sur
   une machine avec accès réseau (ou avec les modèles pré-téléchargés et
   montés en volume / committés).

Dans les deux cas, la fonction publique reste : extract_text(image) -> str
"""
from __future__ import annotations

import numpy as np

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

_paddle_ocr_instance = None  # instancié une seule fois (lazy singleton)


def _get_tesseract_text(image: np.ndarray) -> str:
    import pytesseract

    if settings.TESSERACT_CMD:
        pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD

    # --psm 6 : bloc de texte uniforme, adapté à une feuille de charge/tableau
    # --oem 1 : force le moteur LSTM (réseau de neurones, plus précis que le
    #           moteur historique par pattern-matching, surtout sur du texte
    #           imprimé dense). Gain mesuré empiriquement : sensiblement plus
    #           de valeurs numériques (quantités/prix) correctement reconnues
    #           sur un vrai bon de livraison tabulaire.
    config = "--psm 6 --oem 1"
    text = pytesseract.image_to_string(image, lang=settings.TESSERACT_LANG, config=config)
    return text.strip()


def _get_paddle_text(image: np.ndarray) -> str:
    """
    Chemin PaddleOCR. Nécessite que les modèles soient accessibles
    (réseau ou cache local). Non utilisé par défaut - voir docstring du module.
    """
    global _paddle_ocr_instance

    from paddleocr import PaddleOCR  # import local : dépendance optionnelle

    if _paddle_ocr_instance is None:
        _paddle_ocr_instance = PaddleOCR(use_textline_orientation=True, lang="fr")

    result = _paddle_ocr_instance.predict(image)
    lines: list[str] = []
    for page in result:
        rec_texts = page.get("rec_texts", []) if isinstance(page, dict) else []
        lines.extend(rec_texts)
    return "\n".join(lines)


def extract_text(image: np.ndarray) -> str:
    """
    Extrait le texte brut d'une image déjà prétraitée.

    Le moteur utilisé dépend de settings.OCR_ENGINE ("tesseract" par défaut,
    "paddle" si explicitement configuré et disponible). En cas d'échec du
    moteur configuré, on retombe automatiquement sur Tesseract pour ne
    jamais faire planter l'endpoint.
    """
    engine = settings.OCR_ENGINE.lower()

    if engine == "paddle":
        try:
            return _get_paddle_text(image)
        except Exception as exc:  # noqa: BLE001 - fallback volontairement large
            logger.warning(
                "PaddleOCR indisponible (%s), fallback automatique sur Tesseract", exc
            )
            return _get_tesseract_text(image)

    return _get_tesseract_text(image)