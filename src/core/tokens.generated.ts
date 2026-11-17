// Fichier généré par scripts/gen-tokens.ts depuis charte/mastercards-charte.json. Ne pas éditer.
export const tokens = {
  "colors": {
    "ciel": "#1E5BD6",
    "ciel_degrade": [
      "#2A70E8",
      "#1648B8"
    ],
    "nuit": "#0E2F86",
    "soleil": "#FFC928",
    "soleil_ombre": "#B98300",
    "cerise": "#D93A34",
    "prairie": "#2DB24E",
    "azur": "#36A0F5",
    "blanc_carte": "#FFFFFF",
    "encre": "#14213D",
    "texte_secondaire": "#4A5675",
    "bordure": "#C9D6F2"
  },
  "tapis": {
    "jaune": "#FFC928",
    "vert": "#187A33",
    "rouge": "#B8312C",
    "bleu": "#2273C9"
  },
  "textOn": {
    "ciel": "#FFFFFF",
    "nuit": "#FFFFFF",
    "cerise": "#FFFFFF",
    "soleil": "#14213D",
    "prairie": "#14213D",
    "azur": "#14213D",
    "tapis_vert": "#FFFFFF",
    "tapis_rouge": "#FFFFFF",
    "tapis_bleu": "#FFFFFF",
    "tapis_jaune": "#14213D"
  },
  "card": {
    "ratio": 1.4,
    "red": "#D93A34",
    "black": "#14213D",
    "face": "#FFFFFF"
  }
} as const

export type TapisName = 'jaune' | 'vert' | 'rouge' | 'bleu'
