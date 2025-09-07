import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from '../models/contact';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css'
})
export class ContactForm implements OnInit {
  private contactService = inject(ContactService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  contactForm!: FormGroup;
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  isEditMode = signal<boolean>(false);
  contactId = signal<number | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      // We're editing an existing contact
      this.isEditMode.set(true);
      this.contactId.set(+id);
      this.loadContact(+id);
    } else {
      // We're creating a new contact
      this.isEditMode.set(false);
      this.contactId.set(null);
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      cell: [''],
      full_address: [''],
      age: [null, [Validators.min(1), Validators.max(120)]],
      image_url: ['']
    });
  }

  private loadContact(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.contactService.getContact(id).subscribe({
      next: (contact) => {
        if (contact) {
          this.initializeForm();
          this.contactForm.patchValue(contact);
          this.loading.set(false);
        } else {
          this.error.set('Contact not found');
          this.loading.set(false);
        }
      },
      error: (error) => {
        this.error.set('Failed to load contact details');
        this.loading.set(false);
        console.error('Error loading contact:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.loading.set(true);
      this.error.set(null);

      const formData = this.contactForm.value;

      if (this.isEditMode()) {
        // Update existing contact
        this.contactService.updateContact(this.contactId()!, formData).subscribe({
          next: () => {
            this.loading.set(false);
            this.router.navigate(['/contact', this.contactId()]);
          },
          error: (error) => {
            this.error.set('Failed to update contact');
            this.loading.set(false);
            console.error('Error updating contact:', error);
          }
        });
      } else {
        // Create new contact
        this.contactService.createContact(formData).subscribe({
          next: (newContact) => {
            this.loading.set(false);
            this.router.navigate(['/contact', newContact.id]);
          },
          error: (error) => {
            this.error.set('Failed to create contact');
            this.loading.set(false);
            console.error('Error creating contact:', error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  cancel(): void {
    if (this.isEditMode()) {
      this.router.navigate(['/contact', this.contactId()]);
    } else {
      this.router.navigate(['/contacts']);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength']) return `${fieldName} must be at least 2 characters`;
      if (field.errors['min']) return 'Age must be at least 1';
      if (field.errors['max']) return 'Age must be less than 120';
      if (field.errors['pattern']) return 'Please enter a valid phone number';
    }
    return '';
  }
}