import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionSpyDirective } from '../../core/section-spy';
import { Media } from '../../shared/media';
import { PORTRAIT } from '../../data/projects';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [SectionSpyDirective, Media],
  templateUrl: './about.html',
})
export class About {
  protected readonly portrait = PORTRAIT;
}
