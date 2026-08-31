"""
Prétraitement d'image avant OCR.

Pipeline : niveaux de gris -> réduction du bruit -> correction d'inclinaison
(deskew) -> amélioration du contraste (CLAHE) -> binarisation adaptative.

Chaque étape est isolée dans sa propre fonction pour rester testable
indépendamment, et `preprocess_image` orchestre l'ensemble.
"""
from __future__ import annotations

import cv2
import numpy as np

from app.core.logging import get_logger

logger = get_logger(__name__)


def to_grayscale(image: np.ndarray) -> np.ndarray:
    if len(image.shape) == 2:
        return image
    return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)


def denoise(image: np.ndarray) -> np.ndarray:
    """Réduction du bruit tout en préservant les contours du texte."""
    return cv2.fastNlMeansDenoising(image, h=10, templateWindowSize=7, searchWindowSize=21)


def deskew(image: np.ndarray) -> np.ndarray:
    """
    Corrige l'inclinaison de l'image (photo prise de travers).

    Méthode : on binarise temporairement, on récupère les pixels non-nuls,
    puis on calcule l'angle minimal du rectangle englobant (minAreaRect).
    """
    inverted = cv2.bitwise_not(image)
    thresh = cv2.threshold(inverted, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]

    coords = np.column_stack(np.where(thresh > 0))
    if coords.shape[0] < 10:
        # Pas assez de pixels pour estimer un angle fiable : on ne touche à rien
        logger.debug("deskew: trop peu de pixels détectés, image inchangée")
        return image

    angle = cv2.minAreaRect(coords)[-1]

    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle

    # Si l'angle est négligeable, ne pas introduire de flou de rotation inutile
    if abs(angle) < 0.3:
        return image

    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    rotation_matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(
        image,
        rotation_matrix,
        (w, h),
        flags=cv2.INTER_CUBIC,
        borderMode=cv2.BORDER_REPLICATE,
    )
    logger.debug("deskew: rotation appliquée de %.2f degrés", angle)
    return rotated


def enhance_contrast(image: np.ndarray) -> np.ndarray:
    """Amélioration du contraste local via CLAHE (meilleur que l'égalisation globale)."""
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    return clahe.apply(image)


def adaptive_binarize(image: np.ndarray) -> np.ndarray:
    """Binarisation adaptative (robuste aux variations d'éclairage sur la feuille)."""
    return cv2.adaptiveThreshold(
        image,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        blockSize=31,
        C=15,
    )


def preprocess_image(image_path: str) -> np.ndarray:
    """
    Charge une image depuis le disque et applique le pipeline complet de
    nettoyage. Retourne une image binarisée (np.ndarray, 1 canal) prête
    pour l'OCR.
    """
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Impossible de lire l'image : {image_path}")

    gray = to_grayscale(image)
    denoised = denoise(gray)
    straightened = deskew(denoised)
    contrasted = enhance_contrast(straightened)
    binarized = adaptive_binarize(contrasted)

    logger.info("preprocess_image: pipeline terminé pour %s", image_path)
    return binarized
