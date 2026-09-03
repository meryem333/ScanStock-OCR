import sys
import cv2
import pytesseract

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

if len(sys.argv) < 2:
    print("Usage : python test_ocr_reglages.py \"chemin\\vers\\image.jpeg\"")
    sys.exit(1)

chemin_image = sys.argv[1]

image = cv2.imread(chemin_image)
if image is None:
    print(f"Impossible de lire l'image : {chemin_image}")
    sys.exit(1)

print(f"Taille originale : {image.shape[1]}x{image.shape[0]} pixels")

gris = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

gris_agrandi = cv2.resize(gris, None, fx=3, fy=3, interpolation=cv2.INTER_CUBIC)

debruite = cv2.bilateralFilter(gris_agrandi, 9, 75, 75)

binaire = cv2.adaptiveThreshold(
    debruite, 255,
    cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY,
    31, 15
)

config = "--psm 6"
texte = pytesseract.image_to_string(binaire, lang="fra+eng", config=config)
print(f"\n{'='*20} Résultat amélioré (gris + x3 + débruitage + binarisation) {'='*20}")
print(texte)