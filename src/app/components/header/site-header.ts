import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SectionTracker } from '../../core/section-tracker';
import { CONTACT } from '../../data/projects';

/**
 * Navbar fixe en haut de page.
 *
 * - Desktop : nom à gauche, ancres principales + CV à droite.
 * - Mobile  : nom à gauche, bouton burger à droite → menu plein écran.
 * - Scrollée : fond ink/80 + backdrop-blur. Au top : transparent.
 * - Le lien actif suit le scroll-spy via SectionTracker (optionnel, uniquement
 *   sur la home — sur les autres pages on reste sur le style par défaut).
 */
@Component({
  selector: 'app-site-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <!-- ── Barre principale ─────────────────────────────────────────────── -->
    <header
      [class]="
        scrolled()
          ? 'border-b border-bone/10 bg-ink/80 backdrop-blur-[10px] shadow-[0_1px_0_rgba(242,241,237,0.05)]'
          : 'border-b border-transparent bg-transparent'
      "
      class="fixed top-0 right-0 left-0 z-40 flex h-14 items-center justify-between px-6 transition-all duration-300 wide:px-16"
    >
      <!-- Logo / Nom -->
      <a
        routerLink="/"
        class="flex items-baseline gap-[5px] no-underline"
        aria-label="Accueil — Nlend Max"
      >
        <span class="font-display text-[17px] font-extrabold leading-none tracking-[-0.01em] text-bone">
          NLEND
        </span>
        <span class="font-display text-[17px] font-extrabold leading-none tracking-[-0.01em] text-accent">
          MAX
        </span>
      </a>

      <!-- Liens desktop -->
      <nav
        aria-label="Navigation principale"
        class="hidden items-center gap-6 wide:flex"
      >
        @for (link of navLinks; track link.id) {
          <button
            type="button"
            (click)="navigateTo(link)"
            class="cursor-pointer border-none bg-transparent p-0 font-sans text-[12px] font-semibold leading-none tracking-[0.06em] uppercase transition-colors duration-200 hover:text-bone"
            [class]="activeId() === link.id ? 'text-bone' : 'text-bone/60'"
          >
            {{ link.label }}
          </button>
        }

        <!-- CV — lien direct, pas une section -->
        <a
          [href]="contact.cvUrl"
          download
          class="rounded-[2px] border border-accent/40 px-3.5 py-2 font-sans text-[11px] font-bold leading-none tracking-[0.08em] text-accent uppercase no-underline transition-colors duration-200 hover:border-accent hover:bg-accent/10"
        >
          CV
        </a>
      </nav>

      <!-- Burger (mobile uniquement) -->
      <button
        type="button"
        (click)="toggleMenu()"
        [attr.aria-expanded]="menuOpen()"
        aria-controls="mobile-menu"
        [attr.aria-label]="menuOpen() ? 'Fermer le menu' : 'Ouvrir le menu'"
        class="relative flex size-10 cursor-pointer items-center justify-center rounded-[2px] border-none bg-transparent wide:hidden"
      >
        <!-- Trois lignes → croix via CSS (classes statiques pour Tailwind JIT) -->
        <span
          aria-hidden="true"
          class="absolute block h-[1.5px] w-5 bg-bone transition-all duration-200"
          [style.transform]="menuOpen() ? 'rotate(45deg)' : 'translateY(-6px)'"
        ></span>
        <span
          aria-hidden="true"
          class="absolute block h-[1.5px] w-5 bg-bone transition-all duration-200"
          [style.opacity]="menuOpen() ? '0' : '1'"
          [style.transform]="menuOpen() ? 'scaleX(0)' : 'none'"
        ></span>
        <span
          aria-hidden="true"
          class="absolute block h-[1.5px] w-5 bg-bone transition-all duration-200"
          [style.transform]="menuOpen() ? 'rotate(-45deg)' : 'translateY(6px)'"
        ></span>
      </button>
    </header>

    <!-- ── Menu mobile plein écran ──────────────────────────────────────── -->
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navigation"
      [attr.inert]="menuOpen() ? null : ''"
      [class]="menuOpen() ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
      class="fixed inset-0 z-30 flex flex-col bg-ink/95 px-6 pt-20 pb-10 backdrop-blur-[12px] transition-opacity duration-300 wide:hidden"
    >
      <nav aria-label="Navigation mobile" class="flex flex-col gap-1">
        @for (link of navLinks; track link.id) {
          <button
            type="button"
            (click)="navigateTo(link); closeMenu()"
            class="flex w-full cursor-pointer items-center gap-4 border-none border-b border-bone/10 bg-transparent py-5 text-left last:border-b-0"
          >
            <span class="w-7 font-mono text-[11px] font-semibold text-bone/35">
              {{ link.index }}
            </span>
            <span class="font-display text-[28px] font-extrabold leading-none tracking-[-0.01em] text-bone">
              {{ link.label }}
            </span>
          </button>
        }
      </nav>

      <!-- Liens du bas -->
      <div class="mt-auto flex flex-wrap items-center gap-4 border-t border-bone/10 pt-8">
        <a
          [href]="contact.cvUrl"
          download
          (click)="closeMenu()"
          class="rounded-[2px] border border-accent/40 px-4 py-2.5 font-sans text-[12px] font-bold leading-none tracking-[0.08em] text-accent uppercase no-underline"
        >
          Télécharger le CV
        </a>
        <a
          [href]="contact.linkedin"
          target="_blank"
          rel="noopener"
          (click)="closeMenu()"
          class="font-sans text-[12px] font-semibold leading-none tracking-[0.06em] text-bone/60 uppercase no-underline hover:text-bone"
        >
          LinkedIn
        </a>
        <a
          [href]="contact.github"
          target="_blank"
          rel="noopener"
          (click)="closeMenu()"
          class="font-sans text-[12px] font-semibold leading-none tracking-[0.06em] text-bone/60 uppercase no-underline hover:text-bone"
        >
          GitHub
        </a>
      </div>
    </div>
  `,
})
export class SiteHeader {
  // SectionTracker est optionnel : présent sur la home, absent sur les autres pages.
  private readonly tracker = inject(SectionTracker, { optional: true });
  private readonly router = inject(Router);
  protected readonly contact = CONTACT;

  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);

  /** Propage l'activeId du tracker si disponible, sinon chaîne vide. */
  protected readonly activeId = this.tracker?.activeId ?? signal('');

  protected readonly navLinks = [
    { id: 'a-propos', label: 'À propos',    index: '01', route: null },
    { id: 'projets',  label: 'Projets',     index: '02', route: null },
    { id: 'stack',    label: 'Compétences', index: '03', route: null },
    { id: 'contact',  label: 'Contact',     index: '04', route: null },
  ];

  constructor() {
    const onScroll = () => this.scrolled.set(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    inject(DestroyRef).onDestroy(() => window.removeEventListener('scroll', onScroll));
  }

  /** Ferme le menu mobile sur Escape. */
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.menuOpen()) this.closeMenu();
  }

  protected toggleMenu(): void {
    this.menuOpen.update((v) => !v);
    document.body.style.overflow = this.menuOpen() ? 'hidden' : '';
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
    document.body.style.overflow = '';
  }

  /**
   * Navigue vers un lien de nav.
   *
   * - Si le lien a une `route` dédiée (ex. /blog), on y navigue directement.
   * - Si on est sur la home et que le tracker est disponible, on scrolle.
   * - Sinon (page détail, article), on navigue vers la home avec le fragment
   *   pour que Angular scrolle automatiquement via anchorScrolling.
   */
  protected navigateTo(link: { id: string; route: string | null }): void {
    if (link.route) {
      this.router.navigateByUrl(link.route);
      return;
    }

    if (this.tracker) {
      this.tracker.scrollTo(link.id);
    } else {
      this.router.navigate(['/'], { fragment: link.id });
    }
  }
}
