import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SectionTracker } from '../../core/section-tracker';
import { SectionSpyDirective } from '../../core/section-spy';
import { SiteFooter } from '../../shared/site-footer';
import { Hero } from './sections/hero';
import { ProjectsGrid } from './sections/projects-grid';
import { About } from './sections/about';
import { StackSection } from './sections/stack-section';
import { ContactSection } from './sections/contact-section';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SectionTracker],
  imports: [
    SectionSpyDirective,
    SiteFooter,
    Hero,
    ProjectsGrid,
    About,
    StackSection,
    ContactSection,
  ],
  templateUrl: './home.html',
})
export class Home {
  protected readonly tracker = inject(SectionTracker);
}
