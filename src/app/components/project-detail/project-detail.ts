import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TagList } from '../../shared/tag-list';
import { Media } from '../../shared/media';
import { findProject } from '../../data/projects';

@Component({
  selector: 'app-project-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TagList, Media, LucideAngularModule],
  templateUrl: './project-detail.html',
})
export class ProjectDetail {
  /**
   * Largeurs des captures, en colonnes sur 12. Une pleine largeur pour ouvrir,
   * puis des paires 7/5 et 5/7 dont la seconde descend d'un cran : le regard
   * suit une diagonale au lieu de balayer une grille régulière. Le motif se
   * répète si un projet a plus de cinq captures.
   *
   * Ces classes ne vivent pas dans le template, donc Tailwind ne les voit que
   * parce qu'il scanne aussi les `.ts` — vérifier le CSS de sortie si l'une
   * d'elles cesse d'être générée.
   */
  private static readonly LAYOUT = [
    'wide:col-span-12',
    'wide:col-span-7',
    'wide:col-span-5 wide:mt-14',
    'wide:col-span-5',
    'wide:col-span-7 wide:mt-14',
  ];

  /** Bound from the `:slug` route param via `withComponentInputBinding()`. */
  readonly slug = input.required<string>();

  protected readonly project = computed(() => findProject(this.slug()));

  protected layoutFor(index: number): string {
    return ProjectDetail.LAYOUT[index % ProjectDetail.LAYOUT.length];
  }

  protected indexLabel(index: number): string {
    return String(index + 1).padStart(2, '0');
  }
}
