"""
Exemple d'utilisation du pipeline complet :
image -> OCR -> extraction produits -> matching -> décision (stock / attente).
"""
from __future__ import annotations

from client_ia_service import scanner_image
from extraction import extraire_produits
from decision import traiter_bon_livraison

# Base de produits (temporaire, en dur -> remplacée plus tard par la vraie BD)
produits_base = [
    {"id": 1, "nom": "Farine T55 1kg"},
    {"id": 2, "nom": "Sucre blanc 1kg"},
    {"id": 3, "nom": "Lait UHT 1L"},
    {"id": 4, "nom": "Beurre doux 250g"},
    {"id": 5, "nom": "Huile de tournesol 1L"},
]

# Stock simulé (temporaire, en mémoire -> remplacé plus tard par la vraie BD)
stock = {p["id"]: {"nom": p["nom"], "quantite_stock": 100} for p in produits_base}
produits_en_attente = []
historique_mouvements = []


def main():
    chemin_image = r"C:\Users\merye\Documents\ScanStock\ScanStock-OCR\ia-service\tests\sample_bon_livraison.png"

    resultat_ocr = scanner_image(chemin_image)
    produits_extraits = extraire_produits(resultat_ocr["raw_ocr_text"])

    traiter_bon_livraison(
        produits_extraits,
        produits_base,
        stock,
        produits_en_attente,
        historique_mouvements,
    )

    print("=== ÉTAT DU STOCK ===")
    for produit in stock.values():
        print(f"  {produit['nom']} : {produit['quantite_stock']} unités")

    print("\n=== PRODUITS EN ATTENTE ===")
    for p in produits_en_attente:
        print(f"  {p['nom']} (quantite={p['quantite']})")

    print("\n=== HISTORIQUE DES MOUVEMENTS ===")
    for m in historique_mouvements:
        print(f"  {m['nom_produit']} : +{m['quantite']} (OCR: '{m['nom_ocr']}', score={m['score_match']:.1f}%)")


if __name__ == "__main__":
    main()