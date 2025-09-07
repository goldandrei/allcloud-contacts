import { EventEmitter, inject, Injectable, signal } from '@angular/core';
import { Contact } from '../models/contact';
import { HttpClient } from '@angular/common/http';

export interface PendingOperation {
    id: string;
    type: 'CREATE' | 'UPDATE' | 'DELETE';
    data: Contact | { id: number };
    timestamp: number;
}

@Injectable({
    providedIn: 'root'
})
export class OfflineService {
    private http = inject(HttpClient);
    private dbName = 'ContactsDB';
    private dbVersion = 1;
    private db: IDBDatabase | null = null;

    isOnline = signal<boolean>(navigator.onLine);
    pendingOperations = signal<PendingOperation[]>([]);

    // Add event emitter for sync completion
    syncCompleted = new EventEmitter<void>();

    constructor() {
        this.initDB();
        this.setupOnlineOfflineListeners();
        this.checkAndSyncOnStartup();
    }

    private async checkAndSyncOnStartup(): Promise<void> {
        // Wait for DB to be initialized
        await this.initDB();

        // If we're online and have pending operations, sync them
        if (this.isOnline() && this.pendingOperations().length > 0) {
            console.log('App started online with pending operations, syncing...');
            await this.syncPendingOperations();
        }
    }

    private async initDB(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                this.loadPendingOperations();
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // Create contacts store
                if (!db.objectStoreNames.contains('contacts')) {
                    const contactsStore = db.createObjectStore('contacts', { keyPath: 'id' });
                    contactsStore.createIndex('email', 'email', { unique: false });
                }

                // Create pending operations store
                if (!db.objectStoreNames.contains('pendingOperations')) {
                    const operationsStore = db.createObjectStore('pendingOperations', { keyPath: 'id' });
                    operationsStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }

    private setupOnlineOfflineListeners(): void {
        window.addEventListener('online', () => {
            this.isOnline.set(true);
            this.syncPendingOperations();
        });

        window.addEventListener('offline', () => {
            this.isOnline.set(false);
        });
    }

    // Contact CRUD operations for offline mode
    async saveContact(contact: Contact): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        const transaction = this.db.transaction(['contacts'], 'readwrite');
        const store = transaction.objectStore('contacts');
        await store.put(contact);
    }

    async getContact(id: number): Promise<Contact | null> {
        if (!this.db) throw new Error('Database not initialized');

        const transaction = this.db.transaction(['contacts'], 'readonly');
        const store = transaction.objectStore('contacts');
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllContacts(): Promise<Contact[]> {
        if (!this.db) throw new Error('Database not initialized');

        const transaction = this.db.transaction(['contacts'], 'readonly');
        const store = transaction.objectStore('contacts');
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteContact(id: number): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        const transaction = this.db.transaction(['contacts'], 'readwrite');
        const store = transaction.objectStore('contacts');
        await store.delete(id);
    }

    // Pending operations management
    async addPendingOperation(operation: Omit<PendingOperation, 'id'>): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        const pendingOp: PendingOperation = {
            ...operation,
            id: `${operation.type}_${Date.now()}_${Math.random()}`
        };

        const transaction = this.db.transaction(['pendingOperations'], 'readwrite');
        const store = transaction.objectStore('pendingOperations');
        await store.add(pendingOp);

        this.loadPendingOperations();
    }

    private async loadPendingOperations(): Promise<void> {
        if (!this.db) return;

        const transaction = this.db.transaction(['pendingOperations'], 'readonly');
        const store = transaction.objectStore('pendingOperations');
        const request = store.getAll();

        request.onsuccess = () => {
            this.pendingOperations.set(request.result || []);
        };
    }

    async removePendingOperation(id: string): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        const transaction = this.db.transaction(['pendingOperations'], 'readwrite');
        const store = transaction.objectStore('pendingOperations');
        await store.delete(id);

        this.loadPendingOperations();
    }

    // Sync operations when online
    async syncPendingOperations(): Promise<void> {
        if (!this.isOnline()) {
            console.log('Not online, skipping sync');
            return;
        }

        const operations = this.pendingOperations();
        if (operations.length === 0) {
            console.log('No pending operations to sync');
            return;
        }

        console.log(`Syncing ${operations.length} pending operations...`);
        const apiUrl = 'http://localhost:3000/api';

        for (const operation of operations) {
            try {
                switch (operation.type) {
                    case 'CREATE':
                        await this.http.post(`${apiUrl}/contacts`, operation.data).toPromise();
                        break;
                    case 'UPDATE':
                        await this.http.put(`${apiUrl}/contacts/${(operation.data as Contact).id}`, operation.data).toPromise();
                        break;
                    case 'DELETE':
                        await this.http.delete(`${apiUrl}/contacts/${(operation.data as { id: number }).id}`).toPromise();
                        break;
                }

                await this.removePendingOperation(operation.id);
                console.log(`Successfully synced ${operation.type} operation`);
            } catch (error) {
                console.error('Failed to sync operation:', operation, error);
            }
        }

        console.log('Sync completed');
        // Emit event when sync is complete
        this.syncCompleted.emit();
    }
}