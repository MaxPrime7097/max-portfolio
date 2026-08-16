import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { findPost } from '../../core/portfolio-data';

@Component({
  selector: 'app-blog-post',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="mx-auto box-border max-w-[720px] px-6 pt-14 pb-[100px] wide:px-16">
      <a
        routerLink="/blog"
        class="mb-9 inline-block font-sans text-[12px] leading-none font-semibold tracking-[0.06em] text-bone/50 uppercase no-underline hover:text-bone"
      >
        ← Tous les articles
      </a>

      @let article = post();

      @if (!article) {
        <h1
          class="m-0 mb-4 font-display text-[clamp(32px,5vw,52px)] leading-[1.1] font-bold text-bone"
        >
          Article introuvable
        </h1>
        <p class="m-0 font-sans text-base leading-[1.6] text-bone/60">
          Cet article n'existe pas (ou plus).
        </p>
      } @else {
        @if (article.date) {
          <p
            class="m-0 mb-3 font-mono text-[11px] leading-none font-semibold tracking-[0.05em] text-bone/40"
          >
            {{ article.date }}
          </p>
        }

        <h1
          class="m-0 mb-7 font-display text-[clamp(32px,5vw,52px)] leading-[1.1] font-bold text-bone"
        >
          {{ article.title }}
        </h1>

        @for (paragraph of article.body; track $index) {
          <p class="m-0 mb-5 font-sans text-[17px] leading-[1.75] text-bone/75 last:mb-0">
            {{ paragraph }}
          </p>
        }
      }
    </div>
  `,
})
export class BlogPost {
  /** Bound from the `:slug` route param via `withComponentInputBinding()`. */
  readonly slug = input.required<string>();

  protected readonly post = computed(() => findPost(this.slug()));
}
