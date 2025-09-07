import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService } from '../contact.service';
import { Contact } from '../models/contact';
import { Router } from '@angular/router';
import { OfflineService } from '../services/offline.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css'
})
export class ContactList implements OnInit {
  private contactService = inject(ContactService);
  private router = inject(Router);
  private offlineService = inject(OfflineService);
  private syncSubscription?: Subscription;

  contacts = signal<Contact[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadContacts();
    // Listen for sync completion and reload contacts
    this.syncSubscription = this.offlineService.syncCompleted.subscribe(() => {
      console.log('Sync completed, reloading contacts...');
      this.loadContacts();
    });
  }

  ngOnDestroy(): void {
    if (this.syncSubscription) {
      this.syncSubscription.unsubscribe();
    }
  }

  loadContacts(): void {
    this.loading.set(true)
    this.error.set(null)

    this.contactService.getContacts().subscribe({
      next: (contacts) => {
        this.contacts.set(contacts)
        this.loading.set(false)
      },
      error: (error) => {
        this.error.set('Failed to load contacts')
        this.loading.set(false)
        console.error('Error loading contacts:', error)
      }
    })
  }

  generateRandomContacts(): void {
    this.loading.set(true)
    this.contactService.generateRandomContacts().subscribe({
      next: (newContacts) => {
        this.contacts.update(currentContacts => [...currentContacts, ...newContacts])
        this.loading.set(false)
      },
      error: (error) => {
        this.error.set('Failed to generate random contacts')
        this.loading.set(false)
        console.error('Error generating random contacts:', error)
      }
    })
  }

  viewContact(id: number): void {
    this.router.navigate(['/contact', id])
  }

  addContact(): void {
    this.router.navigate(['/contact/new'])
  }

}
