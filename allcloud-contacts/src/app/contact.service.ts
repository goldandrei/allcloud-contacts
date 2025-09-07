import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { Contact } from './models/contact';
import { OfflineService } from './services/offline.service';

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    private http = inject(HttpClient);
    private offlineService = inject(OfflineService);
    private apiUrl = 'http://localhost:3000/api';

    getContacts(): Observable<Contact[]> {
        if (this.offlineService.isOnline()) {
            return this.http.get<Contact[]>(`${this.apiUrl}/contacts`).pipe(
                switchMap(contacts => {
                    // Cache contacts locally
                    contacts.forEach(contact => this.offlineService.saveContact(contact));
                    return of(contacts);
                }),
                catchError(() => {
                    // Fallback to offline data
                    return from(this.offlineService.getAllContacts());
                })
            );
        } else {
            // Return offline data
            return from(this.offlineService.getAllContacts());
        }
    }

    getContact(id: number): Observable<Contact | null> {
        if (this.offlineService.isOnline()) {
            return this.http.get<Contact>(`${this.apiUrl}/contacts/${id}`).pipe(
                switchMap(contact => {
                    this.offlineService.saveContact(contact);
                    return of(contact);
                }),
                catchError(() => {
                    return from(this.offlineService.getContact(id));
                })
            );
        } else {
            return from(this.offlineService.getContact(id));
        }
    }

    createContact(contact: Omit<Contact, 'id'>): Observable<Contact> {
        if (this.offlineService.isOnline()) {
            return this.http.post<Contact>(`${this.apiUrl}/contacts`, contact).pipe(
                switchMap(newContact => {
                    this.offlineService.saveContact(newContact);
                    return of(newContact);
                }),
                catchError(() => {
                    // Queue for offline sync
                    const tempContact = { ...contact, id: Date.now() } as Contact;
                    this.offlineService.saveContact(tempContact);
                    this.offlineService.addPendingOperation({
                        type: 'CREATE',
                        data: tempContact,
                        timestamp: Date.now()
                    });
                    return of(tempContact);
                })
            );
        } else {
            // Offline mode - save locally and queue for sync
            const tempContact = { ...contact, id: Date.now() } as Contact;
            this.offlineService.saveContact(tempContact);
            this.offlineService.addPendingOperation({
                type: 'CREATE',
                data: tempContact,
                timestamp: Date.now()
            });
            return of(tempContact);
        }
    }

    updateContact(id: number, contact: Partial<Contact>): Observable<Contact> {
        if (this.offlineService.isOnline()) {
            return this.http.put<Contact>(`${this.apiUrl}/contacts/${id}`, contact).pipe(
                switchMap(updatedContact => {
                    this.offlineService.saveContact(updatedContact);
                    return of(updatedContact);
                }),
                catchError(() => {
                    // Queue for offline sync
                    this.offlineService.addPendingOperation({
                        type: 'UPDATE',
                        data: { ...contact, id } as Contact,
                        timestamp: Date.now()
                    });
                    return of({ ...contact, id } as Contact);
                })
            );
        } else {
            // Offline mode
            this.offlineService.addPendingOperation({
                type: 'UPDATE',
                data: { ...contact, id } as Contact,
                timestamp: Date.now()
            });
            return of({ ...contact, id } as Contact);
        }
    }

    deleteContact(id: number): Observable<void> {
        if (this.offlineService.isOnline()) {
            return this.http.delete<void>(`${this.apiUrl}/contacts/${id}`).pipe(
                switchMap(() => {
                    this.offlineService.deleteContact(id);
                    return of(void 0);
                }),
                catchError(() => {
                    // Queue for offline sync
                    this.offlineService.addPendingOperation({
                        type: 'DELETE',
                        data: { id },
                        timestamp: Date.now()
                    });
                    return of(void 0);
                })
            );
        } else {
            // Offline mode
            this.offlineService.addPendingOperation({
                type: 'DELETE',
                data: { id },
                timestamp: Date.now()
            });
            return of(void 0);
        }
    }

    generateRandomContacts(): Observable<Contact[]> {
        if (this.offlineService.isOnline()) {
            return this.http.post<Contact[]>(`${this.apiUrl}/contacts/random`, {});
        } else {
            // Generate random contacts locally for offline mode
            const randomContacts: Contact[] = [];
            for (let i = 0; i < 5; i++) {
                randomContacts.push({
                    id: Date.now() + i,
                    name: `Random Contact ${i + 1}`,
                    email: `contact${i + 1}@example.com`,
                    phone: `555-${Math.floor(Math.random() * 10000)}`,
                    cell: `555-${Math.floor(Math.random() * 10000)}`,
                    full_address: `${Math.floor(Math.random() * 999)} Random St`,
                    age: Math.floor(Math.random() * 50) + 20
                });
            }
            return of(randomContacts);
        }
    }
}