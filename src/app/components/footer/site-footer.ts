import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CONTACT } from '../../data/projects';

@Component({
  selector: 'app-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [LucideAngularModule],
  template: `
    <footer class="relative overflow-hidden border-t border-bone/10 px-6 pt-14 pb-8 wide:px-16">

      <!-- Gradient diagonal de fond (même effet que le hero) -->
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 z-0 footer-gradient"
      ></div>

      <!-- Grain SVG overlay -->
      <div
        aria-hidden="true"
        class="hero-grain pointer-events-none absolute inset-0 z-0 opacity-[0.18]"
      ></div>

      <!-- Contenu relatif par-dessus les effets -->
      <div class="relative z-10">

      <!-- ── Grille principale ──────────────────────────────────────────── -->
      <div class="grid grid-cols-1 gap-12 wide:grid-cols-[1fr_auto] wide:gap-16 mb-12">

        <!-- Colonne gauche : identité + CTA -->
        <div class="flex flex-col gap-5">
          <div>
            <p class="m-0 font-display text-[28px] font-extrabold leading-none tracking-[-0.02em] text-bone">
              NLEND <span class="text-accent">MAX</span>
            </p>
            <p class="mt-1.5 m-0 font-mono text-[11px] font-semibold tracking-[0.08em] text-bone/50 uppercase">
              Développeur Web FullStack · Product Builder
            </p>
          </div>

          <blockquote class="m-0">
            <p class="m-0 font-serif text-[14px] leading-[1.5] italic text-accent">
              « La meilleure façon de prédire l'avenir, c'est de l'inventer. »
            </p>
            <cite class="mt-0.5 block font-mono text-[10px] font-semibold not-italic tracking-[0.06em] text-bone/50">
              — Alan Kay
            </cite>
          </blockquote>

          <a
            [href]="contact.cvUrl"
            download
            class="inline-flex self-start items-center gap-2 rounded-[2px] border border-accent/40 px-4 py-2.5 font-sans text-[12px] font-bold leading-none tracking-[0.07em] text-accent uppercase no-underline transition-colors duration-200 hover:border-accent hover:bg-accent/10"
          >
            Télécharger mon CV
          </a>
        </div>

        <!-- Colonne droite : nav + liens sociaux -->
        <div class="flex flex-col gap-8 wide:items-end">
          <!-- Navigation rapide -->
          <nav aria-label="Navigation rapide">
            <ul class="m-0 list-none p-0 flex flex-col gap-2.5 wide:items-end">
              @for (link of navLinks; track link.id) {
                <li>
                  <button
                    type="button"
                    (click)="scrollTo(link.id)"
                    class="cursor-pointer border-none bg-transparent p-0 font-sans text-[13px] font-semibold leading-none tracking-[0.04em] text-bone/55 uppercase no-underline transition-colors duration-200 hover:text-bone"
                  >{{ link.label }}</button>
                </li>
              }
            </ul>
          </nav>

          <!-- Liens sociaux -->
          <div class="flex flex-wrap gap-5">
            <a [href]="contact.github" target="_blank" rel="noopener"
               class="flex items-center gap-1.5 font-sans text-[12px] font-semibold leading-none tracking-[0.04em] text-bone/55 uppercase no-underline transition-colors duration-200 hover:text-bone">
              <lucide-icon name="Github" [size]="14" aria-hidden="true"></lucide-icon>
              GitHub
            </a>
            <a [href]="contact.linkedin" target="_blank" rel="noopener"
               class="flex items-center gap-1.5 font-sans text-[12px] font-semibold leading-none tracking-[0.04em] text-bone/55 uppercase no-underline transition-colors duration-200 hover:text-bone">
              <lucide-icon name="Linkedin" [size]="14" aria-hidden="true"></lucide-icon>
              LinkedIn
            </a>
            <a [href]="contact.instagram" target="_blank" rel="noopener"
               class="flex items-center gap-1.5 font-sans text-[12px] font-semibold leading-none tracking-[0.04em] text-bone/55 uppercase no-underline transition-colors duration-200 hover:text-bone">
              <lucide-icon name="Instagram" [size]="14" aria-hidden="true"></lucide-icon>
              Instagram
            </a>
          </div>
        </div>
      </div>

      <!-- ── Séparateur ──────────────────────────────────────────────────── -->
      <div class="border-t border-bone/10 pt-6 flex flex-wrap items-center justify-between gap-3">
        <span class="font-mono text-[11px] font-medium leading-none text-bone/40">
          © {{ year }} Nlend Max — Tous droits réservés
        </span>
        <span class="font-mono text-[11px] font-medium leading-none text-bone/40">
          Fait avec Angular
        </span>
      </div>

      </div><!-- /relative z-10 -->

    </footer>
  `,
})
export class SiteFooter {
  protected readonly contact = CONTACT;
  protected readonly year = new Date().getFullYear();
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  protected scrollTo(id: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // On est sur une page détail — retour home avec scroll cible
      this.router.navigate(['/'], { state: { scrollTo: id } });
    }
  }

  protected readonly navLinks = [
    { id: 'a-propos',  label: 'À propos' },
    { id: 'projets',   label: 'Projets' },
    { id: 'stack',     label: 'Compétences' },
    { id: 'contact',   label: 'Contact' },
  ];
}
