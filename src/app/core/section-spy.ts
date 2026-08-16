import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';
import { SectionTracker } from './section-tracker';

/**
 * Registers the host section with the {@link SectionTracker}, and mirrors the
 * id onto `data-section-id` / `id` so the observer and deep links can find it.
 */
@Directive({
  selector: '[appSectionSpy]',
  host: {
    '[attr.id]': 'sectionId()',
    '[attr.data-section-id]': 'sectionId()',
    class: 'scroll-mt-4',
  },
})
export class SectionSpyDirective implements OnInit, OnDestroy {
  readonly sectionId = input.required<string>({ alias: 'appSectionSpy' });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly tracker = inject(SectionTracker);

  ngOnInit(): void {
    this.tracker.register(this.sectionId(), this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.tracker.unregister(this.sectionId(), this.host.nativeElement);
  }
}
