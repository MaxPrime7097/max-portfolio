import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes, withComponentInputBinding())],
    }).compileComponents();
  });

  it('creates the app shell', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('lazy-loads the blog index at /blog', async () => {
    const harness = await RouterTestingHarness.create('/blog');
    expect(harness.routeNativeElement?.textContent).toContain('Blog');
  });

  it('renders a project detail page from its slug', async () => {
    const harness = await RouterTestingHarness.create('/projets/agriguard');
    expect(harness.routeNativeElement?.textContent).toContain('AgriGuard');
    expect(harness.routeNativeElement?.textContent).toContain('Tech & Product Lead');
  });

  it('shows a not-found message for an unknown project slug', async () => {
    const harness = await RouterTestingHarness.create('/projets/inconnu');
    expect(harness.routeNativeElement?.textContent).toContain('Projet introuvable');
  });
});
