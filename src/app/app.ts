import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackToTop } from './shared/back-to-top';
import { SiteHeader } from './shared/site-header';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, BackToTop, SiteHeader],
  host: { class: 'relative block min-h-screen overflow-x-hidden' },
  template: `
    <app-site-header />
    <router-outlet />
    <app-back-to-top />
  `,
})
export class App {}
