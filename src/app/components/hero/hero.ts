import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
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
  private scriptLoaded = false;
  private loadTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Strategy: wait for window 'load' (all critical resources done), then
    // use requestIdleCallback (or a 200ms fallback) so the browser picks a
    // quiet moment to parse the WASM-heavy Lottie bundle.
    // This keeps the heavy JS execution well outside the TBT window.
    const inject = () => {
      if ((window as any).requestIdleCallback) {
        (window as any).requestIdleCallback(() => this.loadLottieScript(), { timeout: 2000 });
      } else {
        this.loadTimeout = setTimeout(() => this.loadLottieScript(), 200);
      }
    };

    if (document.readyState === 'complete') {
      inject();
    } else {
      window.addEventListener('load', inject, { once: true });
    }
  }

  ngOnDestroy(): void {
    if (this.loadTimeout) clearTimeout(this.loadTimeout);
  }

  private loadLottieScript(): void {
    if (this.scriptLoaded) return;
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
