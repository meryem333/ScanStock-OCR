"""
Étape 3 du pipeline : produit matché -> mise à jour stock ; non matché -> mise en attente.

"""
from __future__ import annotations

from matching import matcher_produit


def traiter_bon_livraison(
    produits_extraits: list[dict],
    produits_base: list[dict],
    stock: dict,
    produits_en_attente: list[dict],
    historique_mouvements: list[dict],
    seuil: int = 80,
) -> None:
    """
    Pour chaque produit extrait du bon de livraison :
    - si un match est trouvé -> met à jour le stock + ajoute un mouvement à l'historique
    - sinon -> ajoute le produit à la liste d'attente (validation admin requise)

    """
    for p in produits_extraits:
        match = matcher_produit(p["nom"], produits_base, seuil=seuil)

        if match:
            produit_id = match["produit"]["id"]
            stock[produit_id]["quantite_stock"] += p["quantite"]

            historique_mouvements.append({
                "produit_id": produit_id,
                "nom_produit": match["produit"]["nom"],
                "nom_ocr": p["nom"],
                "quantite": p["quantite"],
                "prix": p["prix"],
                "score_match": match["score"],
                "type_match": match["type_match"],
            })
        else:
            produits_en_attente.append(p)