/**
 * Vrai quand l'utilisateur a demandé moins d'animation au niveau du système.
 * Tout défilement programmatique doit passer par là — la règle CSS globale de
 * `styles.css` neutralise les animations, mais pas un `scrollTo` en JS.
 */
export function prefersReducedMotion(): boolean {
  return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}
