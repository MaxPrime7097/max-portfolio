import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { SectionSpyDirective } from '../../core/section-spy';
import { ScrollRevealDirective } from '../../core/scroll-reveal';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [SectionSpyDirective, ScrollRevealDirective, LucideAngularModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './hero.html',
})
export class Hero {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  protected scrollTo(event: Event, id: string): void {
    event.preventDefault();
    if (!isPlatformBrowser(this.platformId)) return;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
