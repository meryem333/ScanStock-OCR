import re

MOTIF_REFERENCE_PRODUIT = re.compile(r"^\W*([PB][T7]\s?\d{2,4}[.,]?\d{0,3}\w*)\b\s+(.*)$")

def extraire_lignes_produits_tableau(texte):
    lignes_produits = []
    for ligne in texte.split("\n"):
        ligne = ligne.strip()
        if not ligne:
            continue
        resultat = MOTIF_REFERENCE_PRODUIT.match(ligne)
        if resultat:
            lignes_produits.append({"reference": resultat.group(1), "reste_ligne": resultat.group(2).strip()})
    return lignes_produits
    