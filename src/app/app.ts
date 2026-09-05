import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SectionTracker } from './core/section-tracker';
import { SectionSpyDirective } from './core/section-spy';
import { BackToTop } from './shared/back-to-top';
import { CursorFollower } from './shared/cursor-follower';
import { SiteHeader } from './components/header/site-header';
import { SiteFooter } from './components/footer/site-footer';
import { Hero } from './components/hero/hero';
import { About } from './components/about/about';
import { ProjectsGrid } from './components/projects/projects-grid';
import { StackSection } from './components/skills/stack-section';
import { ContactSection } from './components/contact/contact-section';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SectionTracker],
  host: { class: 'relative block min-h-screen overflow-x-hidden' },
  imports: [
    RouterOutlet,
    SectionSpyDirective,
    BackToTop,
    CursorFollower,
    SiteHeader,
    SiteFooter,
    Hero,
    About,
    ProjectsGrid,
    StackSection,
    ContactSection,
  ],
  templateUrl: './app.html',
})
export class App {
  protected readonly tracker = inject(SectionTracker);

  private readonly url = signal('/');
  protected readonly isHome = computed(() => this.url() === '/' || this.url() === '');

  constructor() {
    const router = inject(Router);
    const destroyRef = inject(DestroyRef);

    // Seed with the current URL (handles direct navigation / refresh)
    this.url.set(router.url);

    const sub = router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.url.set(e.urlAfterRedirects);

        const url = e.urlAfterRedirects;

        // Navigation vers une page détail → scroll to top
        if (url.startsWith('/projets/')) {
          window.scrollTo({ top: 0, behavior: 'instant' });
          return;
        }

        // Retour vers la home avec state.scrollTo (depuis goBack())
        const scrollTarget = (history.state as { scrollTo?: string })?.scrollTo;
        if (scrollTarget && url === '/') {
          setTimeout(() => {
            document.getElementById(scrollTarget)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 80);
        }
      }
    });

    destroyRef.onDestroy(() => sub.unsubscribe());
  }
}
