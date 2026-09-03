import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  inject,
  input,
} from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Directive appReveal — fade-in + translateY au scroll.
 *
 * Usage :
 *   <div appReveal>…</div>
 *   <div appReveal [revealDelay]="150">…</div>
 *
 * L'élément démarre invisible (classe CSS `reveal-hidden`) et passe
 * à `reveal-visible` dès qu'il entre dans le viewport.
 * Respecte `prefers-reduced-motion` via CSS.
 */
@Directive({
  selector: '[appReveal]',
  host: { class: 'reveal-hidden' },
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  /** Délai en ms avant le déclenchement de l'animation (pour les stagger). */
  readonly revealDelay = input<number>(0);

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const delay = this.revealDelay();
    if (delay) {
      this.el.nativeElement.style.transitionDelay = `${delay}ms`;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('reveal-hidden');
            entry.target.classList.add('reveal-visible');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
