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
    """
    Réduction du bruit tout en préservant les contours du texte.

    ATTENTION : sur des documents à texte dense et petite police (tableaux
    multi-colonnes, factures), ce débruitage a tendance à flouter les
    détails fins des caractères et à DÉGRADER la précision de l'OCR (mesuré
    empiriquement : ~20% de nombres décimaux corrects en moins sur un vrai
    bon de livraison). Cette fonction reste disponible et utile pour des
    photos réellement bruitées/grainées (faible luminosité, vieux scanner),
    mais n'est plus appliquée par défaut dans `preprocess_image` — voir le
    paramètre `apply_denoise`.
    """
    return cv2.fastNlMeansDenoising(image, h=10, templateWindowSize=7, searchWindowSize=21)


def deskew(image: np.ndarray, max_correction_degrees: float = 15.0) -> np.ndarray:
    """
    Corrige l'inclinaison de l'image (photo prise de travers).

    Méthode : on binarise temporairement, on récupère les pixels non-nuls,
    puis on calcule l'angle minimal du rectangle englobant (minAreaRect).

    IMPORTANT : sur les documents contenant un grand tableau dense (colonnes
    de prix, codes-barres, etc.), minAreaRect peut se caler sur la forme
    globale du tableau plutôt que sur l'orientation réelle du texte, et
    renvoyer un angle proche de 90°. Une vraie photo prise "de travers"
    dépasse rarement 15° d'inclinaison : au-delà, on considère l'angle
    calculé comme non fiable et on ne touche pas à l'image plutôt que de
    risquer une rotation erronée à 90°.
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

    # Angle jugé non fiable (probable faux positif sur un tableau dense) :
    # on n'applique aucune rotation plutôt que de risquer de tourner l'image
    # de travers.
    if abs(angle) > max_correction_degrees:
        logger.warning(
            "deskew: angle calculé (%.1f°) hors plage fiable (>%.0f°), "
            "image laissée inchangée pour éviter une rotation erronée",
            angle,
            max_correction_degrees,
        )
        return image

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


def upscale_if_small(image: np.ndarray, min_width: int = 1400, factor: float = 4.0) -> np.ndarray:
    """
    Agrandit l'image si elle est petite/basse résolution.

    Sur les documents à texte dense et petite police (tableaux avec beaucoup
    de colonnes, codes-barres, prix...), une résolution trop faible fait
    perdre à l'OCR les détails fins des caractères. On agrandit donc l'image
    (interpolation cubique) quand sa largeur est en-dessous de `min_width`.

    `factor=4.0` par défaut : mesuré empiriquement sur un vrai bon de
    livraison (tableau dense, ~684px de large à l'origine), un facteur x4
    donne nettement plus de nombres/prix correctement reconnus par l'OCR
    qu'un facteur x2 (43 vs 31 valeurs décimales correctes sur le même
    document de test).
    """
    h, w = image.shape[:2]
    if w >= min_width:
        return image
    resized = cv2.resize(image, None, fx=factor, fy=factor, interpolation=cv2.INTER_CUBIC)
    logger.debug("upscale_if_small: image agrandie de %dx%d à %dx%d", w, h, resized.shape[1], resized.shape[0])
    return resized


def preprocess_image(image_path: str, binarize: bool = False, apply_denoise: bool = False) -> np.ndarray:
    """
    Charge une image depuis le disque et applique le pipeline complet de
    nettoyage. Retourne une image en niveaux de gris contrastée (np.ndarray,
    1 canal), prête pour l'OCR.

    `binarize=False` par défaut : sur les documents à texte dense et petite
    police (tableaux, factures multi-colonnes), la binarisation adaptative
    peut détruire les détails fins des caractères et dégrader fortement les
    résultats OCR. Le niveau de gris contrasté donne de meilleurs résultats
    dans ce cas. Mettre `binarize=True` si besoin pour des documents plus
    simples (texte épars, fort contraste déjà présent).

    `apply_denoise=False` par défaut : mesuré empiriquement comme
    contre-productif sur du texte dense (voir docstring de `denoise`).
    Mettre `apply_denoise=True` pour des photos réellement bruitées/grainées
    (faible luminosité, vieux scanner) où le compromis peut s'inverser.
    """
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Impossible de lire l'image : {image_path}")

    gray = to_grayscale(image)
    base = denoise(gray) if apply_denoise else gray
    straightened = deskew(base)
    contrasted = enhance_contrast(straightened)
    upscaled = upscale_if_small(contrasted)

    if binarize:
        result = adaptive_binarize(upscaled)
    else:
        result = upscaled

    logger.info("preprocess_image: pipeline terminé pour %s", image_path)
    return result