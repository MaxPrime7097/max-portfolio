import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
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
  private static readonly LAYOUT = [
    'wide:col-span-12',
    'wide:col-span-7',
    'wide:col-span-5 wide:mt-14',
    'wide:col-span-5',
    'wide:col-span-7 wide:mt-14',
  ];

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

  protected layoutFor(index: number): string {
    return ProjectDetail.LAYOUT[index % ProjectDetail.LAYOUT.length];
  }

  protected indexLabel(index: number): string {
    return String(index + 1).padStart(2, '0');
  }
}
