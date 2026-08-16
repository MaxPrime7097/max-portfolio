import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Monospaced stack pills, used on the home sections and the project pages. */
@Component({
  selector: 'app-tag-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-wrap gap-2' },
  template: `
    @for (tag of tags(); track tag) {
      <span
        class="rounded-[2px] border border-bone/15 px-[9px] py-1.5 font-mono text-[10.5px] font-semibold leading-none tracking-[0.03em] text-bone/55"
      >
        {{ tag }}
      </span>
    }
  `,
})
export class TagList {
  readonly tags = input.required<readonly string[]>();
}
