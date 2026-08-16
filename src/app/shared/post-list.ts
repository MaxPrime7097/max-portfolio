import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogPost } from '../core/portfolio-data';

/** Shared row list for the blog teaser on the home page and the blog index. */
@Component({
  selector: 'app-post-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col' },
  imports: [RouterLink],
  template: `
    @for (post of posts(); track post.slug) {
      <a
        [routerLink]="['/blog', post.slug]"
        class="flex flex-wrap items-baseline justify-between gap-6 border-t border-bone/10 py-[22px] text-inherit no-underline hover:text-inherit"
      >
        <span class="min-w-0 flex-[1_1_320px]">
          <span class="mb-1.5 block font-display text-[20px] leading-[1.3] font-bold text-bone">
            {{ post.title }}
          </span>
          <span class="block max-w-[60ch] font-sans text-[14px] leading-[1.5] text-bone/55">
            {{ post.excerpt }}
          </span>
        </span>
        @if (post.date) {
          <span
            class="font-mono text-[11px] leading-none font-semibold tracking-[0.05em] whitespace-nowrap text-bone/40"
          >
            {{ post.date }}
          </span>
        }
      </a>
    }
  `,
})
export class PostList {
  readonly posts = input.required<readonly BlogPost[]>();
}
