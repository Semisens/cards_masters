#!/usr/bin/env sh
# Ouvre l'app dans une fenêtre au format Pixel 8a : écran 1080 x 2400 px, 430 ppp, densité 2,75,
# soit 393 x 852 px CSS. (Une fenêtre de 1080 x 2400 px réels ne tiendrait pas sur un écran de PC.)
#
# Taille à l'écran : l'écran du Pixel 8a mesure environ 6,4 x 14 cm. À 96 dpi, 393 px CSS en feraient 10,4 x 22,5 :
# PHONE_SCALE réduit la fenêtre sans changer la mise en page (toujours calculée sur 393 x 852 px CSS).
#   PHONE_SCALE=1 npm run phone        taille « pixel pour pixel » (pour juger la lisibilité)
#   défaut 0.6                         taille réelle du téléphone sur un écran d'environ 96 dpi
#   PHONE_SCALE=0.8 npm run phone      taille réelle sur un portable à écran dense (~130 dpi)
# Usage : npm run phone [adresse]      (le serveur de dev doit tourner : npm run dev)
# Exemples : npm run phone
#            npm run phone -- http://localhost:5173/dev/design-system
set -eu

URL="${1:-http://localhost:5173/}"
WIDTH=393
HEIGHT=852
SCALE=1

for bin in google-chrome google-chrome-stable chromium chromium-browser; do
  if command -v "$bin" >/dev/null 2>&1; then
    BROWSER="$bin"
    break
  fi
done
if [ -z "${BROWSER:-}" ]; then
  echo "Chrome ou Chromium est introuvable. Installe-le, ou utilise le mode appareil des outils de développement (F12 puis Ctrl+Maj+M)." >&2
  exit 1
fi

# Un profil séparé est indispensable : sans lui, Chrome rouvre une fenêtre dans la session existante et ignore la taille demandée.
PROFILE="${TMPDIR:-/tmp}/masterscards-phone-profile"

exec "$BROWSER" \
  --user-data-dir="$PROFILE" \
  --no-first-run \
  --no-default-browser-check \
  --force-device-scale-factor="$SCALE" \
  --window-size="$WIDTH,$HEIGHT" \
  --app="$URL"
