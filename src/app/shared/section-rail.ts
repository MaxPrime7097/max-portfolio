import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SectionTracker } from '../core/section-tracker';
import { SECTIONS } from '../core/portfolio-data';

/**
 * Fixed right-hand table of contents. Hidden below the `wide` breakpoint,
 * where the prototype dropped it entirely.
 */
@Component({
  selector: 'app-section-rail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav
      aria-label="Sections de la page"
      class="fixed top-1/2 right-7 z-20 hidden -translate-y-1/2 flex-col gap-3 rounded-[3px] border border-bone/10 bg-ink/55 px-3.5 py-4 backdrop-blur-[6px] wide:flex"
    >
      @for (section of sections; track section.id) {
        @let active = section.id === tracker.activeId();
        <button
          type="button"
          [attr.aria-current]="active ? 'true' : null"
          (click)="tracker.scrollTo(section.id)"
          class="flex cursor-pointer items-center gap-[9px] py-[3px] text-left"
        >
          <span
            aria-hidden="true"
            class="size-1.5 shrink-0 rounded-full transition-colors duration-300"
            [class.animate-pulse-dot]="active"
            [style.background]="active ? section.color : 'rgba(242,241,237,0.25)'"
          ></span>
          <span
            class="font-sans text-[10px] font-semibold leading-none tracking-[0.04em] whitespace-nowrap transition-colors duration-300"
            [class]="active ? 'text-bone' : 'text-bone/30'"
          >
            {{ section.label }}
          </span>
        </button>
      }
    </nav>
  `,
})
export class SectionRail {
  protected readonly tracker = inject(SectionTracker);
  protected readonly sections = SECTIONS;
}
