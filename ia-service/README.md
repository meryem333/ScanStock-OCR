# ScanStock-AI — Service IA (`ia-service/`)

Service Python indépendant qui reçoit une image de feuille de charge / bon de
livraison et retourne un JSON structuré (produits, quantités, prix) consommé
par le backend Symfony.

Pipeline : **image** → prétraitement OpenCV → OCR → structuration LLM → **JSON validé (Pydantic)**.

---

## 1. Installation

Prérequis système : Python 3.10+ et **Tesseract OCR** installé sur la machine.

```bash
# Linux (Debian/Ubuntu)
apt-get install -y tesseract-ocr tesseract-ocr-fra

# macOS
brew install tesseract tesseract-lang

# Windows : installeur officiel
# https://github.com/UB-Mannheim/tesseract/wiki
```

Puis, à la racine de `ia-service/` :

```bash
python3 -m venv venv
source venv/bin/activate        # Windows : venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env            # ajuster si besoin (ex: chemin tesseract)
```

## 2. Lancer le service

```bash
uvicorn app.main:app --reload --port 8001
```

- API : http://127.0.0.1:8001
- Documentation interactive (Swagger) : http://127.0.0.1:8001/docs
- Healthcheck : `GET /health`

## 3. Tester l'endpoint

```bash
curl -X POST http://127.0.0.1:8001/process-image \
  -F "file=@chemin/vers/une_image.jpg;type=image/jpeg"
```

Réponse attendue (exemple réel, testé avec une image générée automatiquement
simulant un bon de livraison légèrement incliné) :

```json
{
  "status": "success",
  "confidence": 0.5,
  "products": [
    {"name": "Farine T55 1kg", "quantity": 12, "unit_price": 1.35, "raw_ocr_text": "Farine T55 1kg 12 1.35"},
    {"name": "Sucre blanc 1kg", "quantity": 5, "unit_price": 0.9, "raw_ocr_text": "Sucre blanc 1kg 5 0.90"},
    {"name": "Lait UHT 1L", "quantity": 6, "unit_price": 1.1, "raw_ocr_text": "Lait UHT 1L 6 1.10"}
  ],
  "warnings": ["Ligne non reconnue par le mock, ignorée : 'BON DE LIVRAISON — N 2026-0472'"]
}
```

## 4. Lancer les tests unitaires

```bash
pip install pytest
pytest tests/ -v
```

Une image de test est déjà fournie : `tests/sample_bon_livraison.png`
(générée par script, simule une feuille de charge avec léger biais de rotation).

---

## Compromis techniques

### PaddleOCR → fallback Tesseract

La consigne initiale imposait **PaddleOCR avec Tesseract en fallback**.
En pratique : `paddlepaddle` et `paddleocr` s'installent sans problème via
pip, **mais** PaddleOCR télécharge ses modèles de détection/reconnaissance
depuis un serveur d'hébergement externe au tout premier appel. Dans
l'environnement où ce service a été développé, cet accès réseau est bloqué,
ce qui rend PaddleOCR **inutilisable en pratique** sans configuration réseau
supplémentaire.

**Décision** : Tesseract est devenu le moteur **par défaut** (variable
`OCR_ENGINE=tesseract` dans `.env`), pas seulement un fallback. Le code de
`app/ocr/ocr_engine.py` garde toutefois un chemin PaddleOCR complet et
fonctionnel (`OCR_ENGINE=paddle`), avec bascule automatique vers Tesseract si
PaddleOCR échoue à l'exécution (exception réseau, modèles manquants, etc.).

**Pour activer PaddleOCR plus tard** (ex: CI/serveur avec accès réseau, ou
modèles pré-téléchargés et montés en volume) :
```bash
# dans .env
OCR_ENGINE=paddle
```

### LLM → JSON mocké

Aucune clé API LLM n'est utilisée pour l'instant (contrainte du projet).
`app/llm/llm_client.py::structure_text()` utilise une **heuristique simple**
(regex sur des lignes du type `"<nom> <quantité> [prix]"`) pour simuler ce
qu'un LLM ferait, uniquement pour pouvoir tester le pipeline de bout en bout.

Le **vrai prompt** à envoyer à un LLM (OpenAI/Mistral/Llama) est déjà rédigé
et prêt dans `app/llm/prompt_templates.py` (`build_messages`), avec des
règles strictes : sortie JSON uniquement, correction des erreurs OCR
plausibles, normalisation des noms de produits, ignorance des éléments hors
sujet (en-têtes, totaux...), détection et fusion des doublons.

Dès qu'une clé API sera disponible côté équipe :
1. Renseigner `LLM_API_KEY` et `LLM_PROVIDER` dans `.env`
2. Implémenter l'appel réel dans `llm_client.py` (squelette déjà commenté
   dans le fichier, avec `httpx` et `build_messages()`)
3. Remplacer le corps mocké de `structure_text()` par l'appel réel

### Limites connues du mock

- La regex du mock ne gère qu'un format de ligne simple (`nom quantité
  [prix]`) ; toute variation de mise en page réelle nécessitera le vrai LLM
  pour être robuste.
- `confidence` est arbitrairement fixée à `0.5` en cas de succès du mock
  (volontairement pessimiste) — elle devra refléter un vrai score une fois
  le LLM branché.

---

## Structure du projet

```
ia-service/
├── app/
│   ├── main.py               # FastAPI entrypoint
│   ├── routers/scan.py       # POST /process-image, GET /health
│   ├── preprocessing/image_cleaner.py   # OpenCV : deskew, denoise, CLAHE, binarisation
│   ├── ocr/ocr_engine.py     # Tesseract (défaut) + PaddleOCR (optionnel)
│   ├── llm/
│   │   ├── prompt_templates.py  # vrai prompt, prêt pour un LLM réel
│   │   └── llm_client.py        # mock actuel + TODO pour le vrai appel
│   ├── schemas/scan_result.py   # contrat Pydantic (status/confidence/products/warnings)
│   └── core/{config.py, logging.py}
├── tests/
│   ├── test_pipeline.py
│   └── sample_bon_livraison.png
├── requirements.txt
├── .env.example
└── README.md
```

## Ce qui n'est PAS dans ce service (par design)

- Pas de connexion PostgreSQL, pas d'authentification JWT : ce service est
  indépendant du backend Symfony pour l'instant, il expose juste une API
  REST interne.
- Pas de logique métier de mise à jour du stock (`Scan`, `ScanItem`,
  `StockHistory`) : c'est le rôle du backend Symfony, qui appellera cet
  endpoint puis traitera la réponse JSON.
