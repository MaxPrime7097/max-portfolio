import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { PROJECTS } from '../../data/projects';

@Component({
  selector: 'app-projects-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './projects-grid.html',
})
export class ProjectsGrid {
  protected readonly projects = PROJECTS;
}
