from extraction import extraire_lignes_produits_tableau

# Colle ici le contenu de raw_ocr_text (entre guillemets, tel quel)
texte_ocr = """— —\nCHAKIB DRUG STORE 2 vo |\nBD AL MAQDIS ALQODS —\nOQUJDA | ie\n| 0661979591 4\nBon de livraison N\" 12442\nBon de commande N* DC12145\nModalité de paiement cheque \nDate d'expédition 07/07/2026\nA\nEetsece | as DERGNATION quawnre | PUNT eure | (Reimge | TOTAL rr:\noptace Jefy Effect Nad Potsn-004 2 of 1280 Oo ta0c\nPT110.005 8651217254268 Toptace Jetty Effect Nal Polsn-005 % a 12.50 .\nPT10.0t2 8651217254336 Topface Jelly Effect Nat Potsh-012 12 a 128 c :"""

lignes = extraire_lignes_produits_tableau(texte_ocr)
print(f"{len(lignes)} lignes produits détectées :\n")
for l in lignes:
    print(l)