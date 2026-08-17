import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTACT } from '../../data/projects';

@Component({
  selector: 'app-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <footer class="flex flex-col gap-7 border-t border-bone/10 px-6 pt-14 pb-8 wide:px-16">
      <div class="flex flex-wrap gap-7">
        <a
          [href]="contact.github"
          target="_blank"
          rel="noopener"
          class="font-sans text-[13px] leading-none font-semibold tracking-[0.04em] text-bone/75 uppercase no-underline hover:text-bone"
        >
          GitHub
        </a>

        <a
          [href]="contact.linkedin"
          target="_blank"
          rel="noopener"
          class="font-sans text-[13px] leading-none font-semibold tracking-[0.04em] text-bone/75 uppercase no-underline hover:text-bone"
        >
          LinkedIn
        </a>

        <a
          [href]="contact.instagram"
          target="_blank"
          rel="noopener"
          class="font-sans text-[13px] leading-none font-semibold tracking-[0.04em] text-bone/75 uppercase no-underline hover:text-bone"
        >
          Instagram
        </a>

        <!-- Le fichier doit exister dans public/docs/, sinon ce lien 404. -->
        <a
          [href]="contact.cvUrl"
          download
          class="font-sans text-[13px] leading-none font-semibold tracking-[0.04em] text-accent uppercase no-underline hover:text-accent-bright"
        >
          Télécharger le CV
        </a>
      </div>

      <blockquote class="m-0">
        <p class="m-0 font-serif text-[14px] leading-[1.5] italic text-accent">
          « La meilleure façon de prédire l'avenir, c'est de l'inventer. »
        </p>
        <cite class="mt-0.5 block font-mono text-[10px] font-semibold not-italic tracking-[0.06em] text-bone/50">
          — Alan Kay
        </cite>
      </blockquote>

      <div class="flex flex-wrap justify-between gap-2">
        <span class="font-mono text-[11px] leading-[1.5] font-medium text-bone/50">
          © {{ year }} Nlend Max
        </span>
        <span class="font-mono text-[11px] leading-[1.5] font-medium text-bone/50">
          Fait avec Angular
        </span>
      </div>
    </footer>
  `,
})
export class SiteFooter {
  protected readonly contact = CONTACT;
  protected readonly year = new Date().getFullYear();
}
