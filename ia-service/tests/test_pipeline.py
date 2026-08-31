"""
Tests légers, sans dépendance à un vrai fichier image sur disque autre que
celui généré à la volée par le test lui-même.
"""
import cv2
import numpy as np

from app.llm.llm_client import structure_text
from app.ocr.ocr_engine import extract_text
from app.preprocessing.image_cleaner import preprocess_image
from app.schemas.scan_result import ScanResult


def _make_test_image(path: str) -> None:
    """Génère une image blanche avec du texte noir simple, façon liste de produits."""
    img = np.full((400, 800, 3), 255, dtype=np.uint8)
    lines = ["Farine T55 1kg 12 1.35", "Sucre blanc 1kg 5 0.90", "Lait UHT 1L 6 1.10"]
    y = 60
    for line in lines:
        cv2.putText(img, line, (30, y), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 0), 2)
        y += 80
    cv2.imwrite(path, img)


def test_preprocess_image_returns_binary_ndarray(tmp_path):
    img_path = tmp_path / "test.png"
    _make_test_image(str(img_path))

    result = preprocess_image(str(img_path))

    assert isinstance(result, np.ndarray)
    assert result.ndim == 2  # image à un seul canal après le pipeline
    # une image binarisée ne doit contenir que 0 et 255
    assert set(np.unique(result)).issubset({0, 255})


def test_extract_text_and_structure_end_to_end(tmp_path):
    img_path = tmp_path / "test.png"
    _make_test_image(str(img_path))

    preprocessed = preprocess_image(str(img_path))
    raw_text = extract_text(preprocessed)
    assert isinstance(raw_text, str)

    structured = structure_text(raw_text)
    result = ScanResult.model_validate(structured)

    assert result.status in ("success", "error")
    assert 0.0 <= result.confidence <= 1.0
