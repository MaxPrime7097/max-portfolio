import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionSpyDirective } from '../../core/section-spy';
import { STACK_GROUPS } from '../../data/projects';

@Component({
  selector: 'app-stack-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [SectionSpyDirective],
  templateUrl: './stack-section.html',
})
export class StackSection {
  protected readonly groups = STACK_GROUPS;
}
