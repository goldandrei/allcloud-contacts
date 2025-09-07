import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OfflineService } from './services/offline.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [RouterOutlet],
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'Allcloud Contacts';
    offlineService = inject(OfflineService);
}