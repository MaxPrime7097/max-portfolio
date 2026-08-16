import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostList } from '../../shared/post-list';
import { BLOG_POSTS } from '../../core/portfolio-data';

@Component({
  selector: 'app-blog-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PostList],
  template: `
    <div class="mx-auto box-border max-w-[840px] px-6 pt-14 pb-[100px] wide:px-16">
      <a
        routerLink="/"
        fragment="blog"
        class="mb-9 inline-block font-sans text-[12px] leading-none font-semibold tracking-[0.06em] text-bone/50 uppercase no-underline hover:text-bone"
      >
        ← Retour
      </a>

      <h1 class="section-title m-0 mb-3.5">Blog</h1>

      <p class="m-0 mb-8 max-w-[52ch] font-sans text-[14px] leading-[1.6] font-medium text-bone/40">
        Ce que je retiens de ce que je construis — décisions produit, arbitrages techniques, et les
        fois où je me suis trompé.
      </p>

      <app-post-list [posts]="posts" />
    </div>
  `,
})
export class BlogList {
  protected readonly posts = BLOG_POSTS;
}
