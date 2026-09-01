"""
Matching des produits extraits contre la base de produits existante.
Étape 2 du pipeline : nom brut (OCR) -> produit identifié en base (ou non trouvé).
"""
from __future__ import annotations

from rapidfuzz import fuzz, process


def matcher_produit(nom_extrait: str, produits_base: list[dict], seuil: int = 80) -> dict | None:
    """
    Cherche le produit de produits_base qui correspond le mieux à nom_extrait.

    (aucun produit assez proche -> à traiter comme "non trouvé").
    """
    # 1. Match exact (insensible à la casse)
    for produit in produits_base:
        if produit["nom"].lower() == nom_extrait.lower():
            return {"produit": produit, "score": 100, "type_match": "exact"}

    # 2. Match flou
    noms_base = [p["nom"] for p in produits_base]
    resultat = process.extractOne(nom_extrait, noms_base, scorer=fuzz.WRatio)

    if resultat is None:
        return None

    nom_trouve, score, index = resultat

    if score >= seuil:
        return {"produit": produits_base[index], "score": score, "type_match": "flou"}

    return None