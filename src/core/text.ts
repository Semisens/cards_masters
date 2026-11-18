/** Minuscules et sans accents, pour comparer des mots sans se soucier de la casse ni des accents. */
export const normalizeText = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
