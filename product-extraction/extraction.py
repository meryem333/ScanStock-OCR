"""
Extraction des produits à partir du texte OCR brut.
première étape du pipeline : texte brut -> liste de produits structurés.
"""
from __future__ import annotations

import re

MOTIF_LIGNE_PRODUIT = re.compile(r"^(.*?)\s+(\d+)\s+(\d+[.,]\d+)\s*$")


def extraire_produits(texte: str) -> list[dict]:
    """
    Prend le texte OCR brut et retourne une liste de produits sous forme de dictionnaires {nom, quantite, prix}.
    """
    produits = []

    for ligne in texte.split("\n"):
        ligne = ligne.strip()
        if not ligne:
            continue

        resultat = MOTIF_LIGNE_PRODUIT.match(ligne)
        if resultat:
            nom = resultat.group(1).strip()
            quantite = int(resultat.group(2))
            prix = float(resultat.group(3).replace(",", "."))
            produits.append({"nom": nom, "quantite": quantite, "prix": prix})

    return produits