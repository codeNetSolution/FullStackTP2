import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './events/events.component';
import { NgModule } from '@angular/core';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { ArtistsListComponent } from './artists-list-component/artists-list.component';
import { ArtistDetailComponent } from './artists-detail/artists-detail.component';
import { HomepageComponent } from './home-page/home-page.component';

export const routes: Routes = [
    { path: '', component: HomepageComponent },
    { path: 'events', component: EventsComponent},
    { path: 'events/:id', component: EventDetailComponent},
    { path: 'artists', component:ArtistsListComponent  },
    { path: 'artists/:id', component: ArtistDetailComponent },

    
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})

export class AppRoutingModule {}