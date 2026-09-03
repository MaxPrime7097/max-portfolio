import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TagList } from '../../shared/tag-list';
import { Media } from '../../shared/media';
import { findProject, PROJECTS } from '../../data/projects';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-project-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TagList, Media, LucideAngularModule],
  templateUrl: './project-detail.html',
})
export class ProjectDetail {
  readonly slug = input.required<string>();

  protected readonly project = computed(() => findProject(this.slug()));

  protected readonly prevProject = computed(() => {
    const idx = PROJECTS.findIndex((p) => p.slug === this.slug());
    return idx > 0 ? PROJECTS[idx - 1] : null;
  });

  protected readonly nextProject = computed(() => {
    const idx = PROJECTS.findIndex((p) => p.slug === this.slug());
    return idx < PROJECTS.length - 1 ? PROJECTS[idx + 1] : null;
  });

  constructor() {
    const meta = inject(Meta);
    const BASE = environment.baseUrl;
    effect(() => {
      const p = this.project();
      if (p) {
        meta.updateTag({ name: 'description', content: p.oneLiner });
        meta.updateTag({ property: 'og:description', content: p.oneLiner });
        meta.updateTag({ property: 'og:title', content: `${p.title} — Nlend Max` });
        meta.updateTag({ property: 'og:url', content: `${BASE}/projets/${p.slug}` });
        meta.updateTag({ name: 'twitter:title', content: `${p.title} — Nlend Max` });
        meta.updateTag({ name: 'twitter:description', content: p.oneLiner });
        if (p.shots[0]) {
          meta.updateTag({ property: 'og:image', content: `${BASE}${p.shots[0].src}` });
          meta.updateTag({ name: 'twitter:image', content: `${BASE}${p.shots[0].src}` });
        }
      }
    });
  }

  private readonly router = inject(Router);

  protected goBack(): void {
    this.router.navigate(['/'], { state: { scrollTo: 'projets' } });
  }
}
