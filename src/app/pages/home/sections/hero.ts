import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { SectionSpyDirective } from '../../../core/section-spy';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [SectionSpyDirective, LucideAngularModule],
  templateUrl: './hero.html',
})
export class Hero {}
