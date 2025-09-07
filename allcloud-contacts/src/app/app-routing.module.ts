import { RouterModule, Routes } from "@angular/router";
import { ContactList } from "./contact-list/contact-list";
import { NgModule } from "@angular/core";

const routes: Routes = [
    { path: '', redirectTo: '/contacts', pathMatch: 'full' },
    { path: 'contacts', component: ContactList },
]

NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }