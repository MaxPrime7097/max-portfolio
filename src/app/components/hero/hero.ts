import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { SectionSpyDirective } from '../../core/section-spy';
import { ScrollRevealDirective } from '../../core/scroll-reveal';

const LOTTIE_CDN =
  'https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [SectionSpyDirective, ScrollRevealDirective, LucideAngularModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './hero.html',
})
export class Hero implements AfterViewInit, OnDestroy {
  private observer: IntersectionObserver | null = null;
  private scriptLoaded = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private elRef: ElementRef<HTMLElement>,
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Inject Lottie script only once the hero section enters the viewport
    // (fires after LCP so it doesn't block first paint)
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.scriptLoaded) {
          this.loadLottieScript();
          this.observer?.disconnect();
        }
      },
      { threshold: 0.01 },
    );
    this.observer.observe(this.elRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private loadLottieScript(): void {
    if (document.querySelector(`script[src="${LOTTIE_CDN}"]`)) {
      this.scriptLoaded = true;
      return;
    }
    const script = document.createElement('script');
    script.type = 'module';
    script.src = LOTTIE_CDN;
    script.onload = () => { this.scriptLoaded = true; };
    document.head.appendChild(script);
  }

  protected scrollTo(event: Event, id: string): void {
    event.preventDefault();
    if (!isPlatformBrowser(this.platformId)) return;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
