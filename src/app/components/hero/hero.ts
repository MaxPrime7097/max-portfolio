import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { SectionSpyDirective } from '../../core/section-spy';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [SectionSpyDirective, LucideAngularModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './hero.html',
})
export class Hero implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    // Ne charge le runtime Lottie que sur écrans larges (≥ wide breakpoint)
    // pour ne pas pénaliser mobile sur LCP/TBT
    const isWide = window.matchMedia('(min-width: 1280px)').matches;
    if (!isWide) return;
    await import('@lottiefiles/dotlottie-wc');
  }
}
