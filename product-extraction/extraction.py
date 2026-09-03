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

    MOTIF_REFERENCE_PRODUIT = re.compile(r"^\W*([PB][T7]\s?\d{2,4}[.,]?\d{0,3}\w*)\b\s+(.*)$")


def extraire_lignes_produits_tableau(texte: str) -> list[dict]:
    """
    Filtre le texte OCR d'un tableau de bon de livraison pour ne garder
    que les lignes de produits (en ignorant en-tête, adresse, footer).
    Une ligne produit est reconnue si elle commence par une référence
    du type 'PT110.005', 'PT155.002KT', etc. (tolère les erreurs OCR
    fréquentes : 'P7' au lieu de 'PT', 'BT' au lieu de 'PT').

    Retourne une liste de dicts {reference, reste_ligne} — l'extraction
    précise de la désignation/quantité/prix se fait dans un second temps,
    car l'OCR reste imparfait sur les colonnes numériques.
    """
    lignes_produits = []

    for ligne in texte.split("\n"):
        ligne = ligne.strip()
        if not ligne:
            continue

        resultat = MOTIF_REFERENCE_PRODUIT.match(ligne)
        if resultat:
            reference = resultat.group(1)
            reste = resultat.group(2).strip()
            lignes_produits.append({"reference": reference, "reste_ligne": reste})

    return lignes_produits