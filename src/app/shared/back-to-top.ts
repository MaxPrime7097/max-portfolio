import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { prefersReducedMotion } from '../core/motion';

/**
 * Retour en haut de page, monté une fois dans `App` donc présent sur toutes les
 * routes. Le bouton reste dans le DOM pour pouvoir être animé, mais `inert` le
 * retire du parcours clavier et de l'arbre d'accessibilité tant qu'il est
 * masqué — sinon on tabule dans un bouton invisible.
 */
@Component({
  selector: 'app-back-to-top',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  template: `
    <button
      type="button"
      (click)="toTop()"
      [attr.inert]="visible() ? null : ''"
      [class]="
        visible() ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-2'
      "
      class="fixed right-5 bottom-5 z-30 flex size-11 cursor-pointer items-center justify-center rounded-full border border-bone/15 bg-ink/80 backdrop-blur-[6px] transition-all duration-300 hover:border-accent hover:text-accent wide:right-7 wide:bottom-7"
      aria-label="Revenir en haut de la page"
    >
      <lucide-icon name="ArrowUp" [size]="16" class="text-bone/65 hover:text-accent transition-colors"></lucide-icon>
    </button>
  `,
})
export class BackToTop {
  /** Environ un écran et demi : assez bas pour ne pas gêner le hero. */
  private static readonly THRESHOLD = 700;

  protected readonly visible = signal(false);

  constructor() {
    const onScroll = () => this.visible.set(window.scrollY > BackToTop.THRESHOLD);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    inject(DestroyRef).onDestroy(() => window.removeEventListener('scroll', onScroll));
  }

  protected toTop(): void {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }
}
