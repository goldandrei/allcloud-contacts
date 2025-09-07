import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ContactList } from './app/contact-list/contact-list';
import { ContactDetail } from './app/contact-detail/contact-detail';
import { ContactForm } from './app/contact-form/contact-form';

const routes: Routes = [
  { path: '', redirectTo: '/contacts', pathMatch: 'full' as const },
  { path: 'contacts', component: ContactList },
  { path: 'contact/new', component: ContactForm },
  { path: 'contact/:id', component: ContactDetail },
  { path: 'contact/:id/edit', component: ContactForm }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
}).catch(err => console.error(err));