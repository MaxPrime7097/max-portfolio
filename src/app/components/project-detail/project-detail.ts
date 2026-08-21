import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TagList } from '../../shared/tag-list';
import { Media } from '../../shared/media';
import { findProject, PROJECTS } from '../../data/projects';

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
    effect(() => {
      const p = this.project();
      if (p) {
        meta.updateTag({ name: 'description', content: p.oneLiner });
        meta.updateTag({ property: 'og:description', content: p.oneLiner });
        meta.updateTag({ property: 'og:title', content: `${p.title} — Nlend Max` });
        if (p.shots[0]) {
          meta.updateTag({ property: 'og:image', content: `https://nlend-max.vercel.app${p.shots[0].src}` });
        }
      }
    });
  }

  protected indexLabel(index: number): string {
    return String(index + 1).padStart(2, '0');
  }
}
