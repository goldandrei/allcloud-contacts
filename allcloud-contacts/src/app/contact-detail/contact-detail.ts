import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from '../models/contact';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-detail.html',
  styleUrl: './contact-detail.css'
})
export class ContactDetail implements OnInit {
  private contactService = inject(ContactService);
  private route = inject(ActivatedRoute);
  private router = inject(Router)

  contact = signal<Contact | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  deleting = signal<boolean>(false);

  ngOnInit(): void {
    const contactId = this.route.snapshot.paramMap.get('id');
    if (contactId) {
      this.loadContact(+contactId);
    }
  }

  loadContact(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.contactService.getContact(id).subscribe({
      next: (contact) => {
        this.contact.set(contact);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load contact');
        this.loading.set(false);
        console.error('Error loading contact:', error);
      }
    })
  }

  goBack(): void {
    this.router.navigate(['/contacts']);
  }

  getContactImage(contact: Contact): string {
    if (contact.image_url) {
      return contact.image_url;
    }
    return this.getDefaultAvatar();
  }

  getDefaultAvatar(): string {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0Ij5BdmF0YXI8L3RleHQ+PC9zdmc+';
  }

  editContact(): void {
    this.router.navigate(['/contact', this.contact()!.id, 'edit'])
  }

  deleteContact(): void {
    if (confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      this.deleting.set(true);
      this.error.set(null);

      this.contactService.deleteContact(this.contact()!.id).subscribe({
        next: () => {
          this.deleting.set(false);
          this.router.navigate(['/contacts']);
        },
        error: (error) => {
          this.error.set('Failed to delete contact');
          this.deleting.set(false);
          console.error('Error deleting contact:', error);
        }
      });
    }
  }

}
