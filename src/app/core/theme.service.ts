import { Injectable, PLATFORM_ID, inject, signal, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'portfolio-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);

  /** Thème actif — dark par défaut. */
  readonly theme = signal<Theme>('dark');

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Restaurer le thème depuis localStorage au démarrage
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === 'light' || saved === 'dark') {
      this.theme.set(saved);
    }

    // Synchroniser la classe sur <html> à chaque changement
    effect(() => {
      const t = this.theme();
      const html = document.documentElement;
      if (t === 'light') {
        html.classList.add('light');
      } else {
        html.classList.remove('light');
      }
      localStorage.setItem(STORAGE_KEY, t);
    });
  }

  toggle(): void {
    this.theme.update(t => (t === 'dark' ? 'light' : 'dark'));
  }
}
