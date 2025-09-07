# AllcloudContacts

# AllCloud Contacts - Salesforce Angular Developer Assignment

A mobile-first contact management web application with offline capabilities, built with Angular and Node.js.

## �� Features

- **Full CRUD Operations**: Create, Read, Update, Delete contacts
- **Mobile-First Design**: Responsive UI optimized for mobile devices
- **Offline Support**: Complete offline functionality with automatic sync
- **Progressive Web App (PWA)**: Installable with service worker support
- **Real-time Sync**: Automatic synchronization when connection is restored
- **Modern Angular**: Built with Angular 17+ using standalone components and signals

## 🛠️ Tech Stack

### Frontend

- **Angular 17+** with standalone components
- **TypeScript** for type safety
- **Angular Signals** for reactive state management
- **Angular Reactive Forms** for form handling
- **Angular Router** for navigation
- **IndexedDB** for offline storage
- **Service Worker** for PWA capabilities

### Backend

- **Node.js** with Express.js
- **RESTful API** for contact management
- **CORS enabled** for cross-origin requests

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Sforce
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd simple-backend

# Install dependencies
npm install

# Start the backend server
node server.js
```

The backend will be running on `http://localhost:3000`

### 3. Frontend Setup

```bash
# Navigate to Angular project directory
cd allcloud-contacts

# Install dependencies
npm install

# Start the development server
ng serve
```

The frontend will be running on `http://localhost:4200`

## 📱 Usage

### Online Mode

- Create, edit, and delete contacts normally
- All changes are saved to the backend immediately
- Data is cached locally for offline access

### Offline Mode

- All CRUD operations work seamlessly offline
- Changes are stored locally in IndexedDB
- Pending operations are queued for sync
- Automatic sync when connection is restored

### Testing Offline Mode

1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Check "Offline" checkbox
4. Perform contact operations
5. Uncheck "Offline" to see automatic sync

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
