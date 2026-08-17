import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

/**
 * Image with a graceful stand-in: while the file is missing (404, or simply not
 * dropped into `public/` yet) the host renders the hatched placeholder carried
 * over from the design, labelled with the alt text so the slot still says what
 * belongs there.
 *
 * Sizing lives on the host — `<app-media class="aspect-16/10 w-full" …>` —
 * because every call site wants a different ratio.
 */
@Component({
  selector: 'app-media',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block overflow-hidden' },
  template: `
    @if (missing()) {
      <span
        class="hatch flex size-full items-center justify-center border border-bone/15 p-5 text-center font-mono text-[11px] leading-[1.6] font-medium tracking-[0.04em] text-bone/40 uppercase"
      >
        {{ alt() }}
      </span>
    } @else {
      <img
        [src]="src()"
        [alt]="alt()"
        [loading]="priority() ? 'eager' : 'lazy'"
        [attr.fetchpriority]="priority() ? 'high' : null"
        decoding="async"
        class="size-full object-cover"
        [class.object-top]="anchor() === 'top'"
        (error)="missing.set(true)"
      />
    }
  `,
})
export class Media {
  readonly src = input.required<string>();
  readonly alt = input.required<string>();
  readonly anchor = input<'center' | 'top'>('center');
  /** Marquer `true` pour les images above-the-fold (portrait, hero shot). */
  readonly priority = input<boolean>(false);

  protected readonly missing = signal(false);
}
