#!/usr/bin/env sh
# Une seule commande : démarre le serveur de dev (s'il ne tourne pas déjà) et ouvre la fenêtre au format téléphone.
# Fermer la fenêtre arrête le serveur qu'on a démarré. Usage : npm run dev:phone
set -eu

URL="http://localhost:5173/"

if curl -s -o /dev/null "$URL"; then
  echo "Serveur de dev déjà lancé : on l'utilise."
else
  # Même groupe de processus : `kill 0` arrête aussi le serveur quand on ferme la fenêtre ou fait Ctrl+C.
  trap 'trap - INT TERM EXIT; kill 0' INT TERM EXIT
  npm run dev -- --strictPort >/dev/null 2>&1 &
  echo "Démarrage du serveur de dev…"
  tries=0
  until curl -s -o /dev/null "$URL"; do
    tries=$((tries + 1))
    if [ "$tries" -gt 60 ]; then
      echo "Le serveur de dev ne répond pas sur $URL. Lance « npm run dev » pour voir l'erreur." >&2
      exit 1
    fi
    sleep 0.5
  done
fi

sh scripts/phone.sh "$URL"
