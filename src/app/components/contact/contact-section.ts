import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { SectionSpyDirective } from '../../core/section-spy';
import { ContactService } from '../../core/contact.service';
import { CONTACT } from '../../data/projects';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type Status = 'idle' | 'sending' | 'ok' | 'error';

@Component({
  selector: 'app-contact-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [SectionSpyDirective],
  templateUrl: './contact-section.html',
})
export class ContactSection {
  protected readonly contact = CONTACT;

  private readonly contactService = inject(ContactService);

  protected readonly name = signal('');
  protected readonly email = signal('');
  protected readonly message = signal('');
  /** Honeypot : ce champ est caché aux humains via CSS. */
  protected readonly website = signal('');
  protected readonly status = signal<Status>('idle');

  protected readonly sent = computed(() => this.status() === 'ok');

  protected readonly canSubmit = computed(
    () =>
      this.status() !== 'sending' &&
      this.name().trim().length > 0 &&
      EMAIL_RE.test(this.email().trim()) &&
      this.message().trim().length > 0,
  );

  protected setName(event: Event): void {
    this.name.set(inputValue(event));
  }

  protected setEmail(event: Event): void {
    this.email.set(inputValue(event));
  }

  protected setMessage(event: Event): void {
    this.message.set(inputValue(event));
  }

  protected setWebsite(event: Event): void {
    this.website.set(inputValue(event));
  }

  protected submit(): void {
    if (!this.canSubmit()) return;

    this.status.set('sending');

    this.contactService
      .send({
        name: this.name().trim(),
        email: this.email().trim(),
        message: this.message().trim(),
        website: this.website(),
      })
      .subscribe({
        next: () => this.status.set('ok'),
        error: () => this.status.set('error'),
      });
  }
}

function inputValue(event: Event): string {
  return (event.target as HTMLInputElement | HTMLTextAreaElement).value;
}
