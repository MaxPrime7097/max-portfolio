import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * CursorFollower — point + anneau qui suivent la souris.
 *
 * - Point 5px : suit immédiatement (transform direct)
 * - Anneau 36px : suit avec lag (requestAnimationFrame lerp)
 * - Grossit sur les éléments interactifs (a, button, [role=button])
 * - Invisible sur touch devices (pointer: coarse) et prefers-reduced-motion
 */
@Component({
  selector: 'app-cursor-follower',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pointer-events-none fixed inset-0 z-[9999]', 'aria-hidden': 'true' },
  template: `
    @if (visible()) {
      <!-- Point -->
      <div
        class="cursor-dot"
        [style.transform]="'translate(' + dotX() + 'px,' + dotY() + 'px)'"
        [class.cursor-dot--hover]="hovering()"
      ></div>
      <!-- Anneau -->
      <div
        class="cursor-ring"
        [style.transform]="'translate(' + ringX() + 'px,' + ringY() + 'px)'"
        [class.cursor-ring--hover]="hovering()"
      ></div>
    }
  `,
  styles: [`
    :host { display: block; }

    .cursor-dot {
      position: fixed;
      top: -4px;
      left: -4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-accent);
      transition: width 0.2s, height 0.2s, background 0.2s, top 0.2s, left 0.2s;
      will-change: transform;
      pointer-events: none;
    }
    .cursor-dot--hover {
      top: -7px;
      left: -7px;
      width: 14px;
      height: 14px;
      background: var(--color-accent-bright);
    }

    .cursor-ring {
      position: fixed;
      top: -18px;
      left: -18px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2px solid var(--color-accent);
      opacity: 0.5;
      transition: width 0.3s, height 0.3s, top 0.3s, left 0.3s, opacity 0.3s, border-color 0.2s;
      will-change: transform;
      pointer-events: none;
    }
    .cursor-ring--hover {
      top: -24px;
      left: -24px;
      width: 48px;
      height: 48px;
      opacity: 0.8;
      border-color: var(--color-accent-bright);
    }
  `],
})
export class CursorFollower implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly visible = signal(false);
  protected readonly hovering = signal(false);

  protected readonly dotX = signal(0);
  protected readonly dotY = signal(0);
  protected readonly ringX = signal(0);
  protected readonly ringY = signal(0);

  private mouseX = 0;
  private mouseY = 0;
  private currentRingX = 0;
  private currentRingY = 0;
  private rafId = 0;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Ne s'active que sur pointer fine (souris), pas tactile
    if (!window.matchMedia('(pointer: fine)').matches) return;

    // Respecte prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.visible.set(true);

    const onMove = (e: MouseEvent) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.dotX.set(e.clientX);
      this.dotY.set(e.clientY);
    };

    const onEnter = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('a, button, [role="button"], input, textarea, select, label')) {
        this.hovering.set(true);
      }
    };

    const onLeave = () => this.hovering.set(false);

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onEnter, { passive: true });
    document.addEventListener('mouseout', onLeave, { passive: true });

    // Lerp loop pour l'anneau
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const loop = () => {
      this.currentRingX = lerp(this.currentRingX, this.mouseX, 0.12);
      this.currentRingY = lerp(this.currentRingY, this.mouseY, 0.12);
      this.ringX.set(Math.round(this.currentRingX * 10) / 10);
      this.ringY.set(Math.round(this.currentRingY * 10) / 10);
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);

    this.destroyRef.onDestroy(() => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
      cancelAnimationFrame(this.rafId);
    });
  }
}
