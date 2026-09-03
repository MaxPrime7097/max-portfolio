import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionSpyDirective } from '../../core/section-spy';
import { ScrollRevealDirective } from '../../core/scroll-reveal';
import { STACK_GROUPS, StackItem } from '../../data/projects';

@Component({
  selector: 'app-stack-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [SectionSpyDirective, ScrollRevealDirective],
  templateUrl: './stack-section.html',
})
export class StackSection {
  protected readonly groups = STACK_GROUPS;

  protected trackItem(_: number, item: StackItem): string {
    return item.name;
  }
}
