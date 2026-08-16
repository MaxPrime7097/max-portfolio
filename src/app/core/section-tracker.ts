import { computed, DestroyRef, Injectable, inject, signal } from '@angular/core';
import { SECTIONS } from '../data/projects';
import { prefersReducedMotion } from './motion';

/**
 * Scroll-spy for the long-form home page.
 *
 * Sections register themselves through {@link SectionSpyDirective}; a single
 * IntersectionObserver with a narrow band around the viewport centre decides
 * which one is "current". Provided by the home page rather than the root
 * injector so the observer is torn down when the user routes away.
 */
@Injectable()
export class SectionTracker {
  /** Only the middle ~16% of the viewport counts as "in view". */
  private static readonly BAND = '-42% 0px -42% 0px';

  private readonly elements = new Map<string, HTMLElement>();
  private observer: IntersectionObserver | null = null;

  private readonly active = signal(SECTIONS[0].id);

  readonly activeId = this.active.asReadonly();
  readonly tint = computed(
    () => SECTIONS.find((s) => s.id === this.active())?.tint ?? 'transparent',
  );

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.observer?.disconnect();
      this.observer = null;
      this.elements.clear();
    });
  }

  register(id: string, el: HTMLElement): void {
    this.elements.set(id, el);
    this.observer ??= new IntersectionObserver((entries) => this.onIntersect(entries), {
      rootMargin: SectionTracker.BAND,
      threshold: 0,
    });
    this.observer.observe(el);
  }

  unregister(id: string, el: HTMLElement): void {
    this.elements.delete(id);
    this.observer?.unobserve(el);
  }

  /** Scrolls the given section into view, honouring reduced-motion. */
  scrollTo(id: string): void {
    this.elements.get(id)?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  private onIntersect(entries: IntersectionObserverEntry[]): void {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const id = (entry.target as HTMLElement).dataset['sectionId'];
      if (id && SECTIONS.some((s) => s.id === id)) {
        this.active.set(id);
      }
    }
  }
}
