import { Component } from '@angular/core';
import { EventsService } from '../services/events.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, Location } from '@angular/common';
import { Event } from '../models/event.model';
import { RouterModule  } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [RouterModule,HttpClientModule, CommonModule,FormsModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent {
  events: Event[] = [];
  currentPage = 0;
  totalPages = 1;
  errorMessage = '';
  newEvent = { label: '', startDate: '', endDate: '' };
  showModal = false;

  constructor(private eventsService: EventsService,
     private location: Location,
     private toastr: ToastrService,
     private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadEvents(this.currentPage);
  }

  loadEvents(page: number): void {
    this.eventsService.getEvents(page, 10).subscribe({
      next: (data) => {
        this.events = data.events.map(event => ({
          ...event,
          artists: event.artists || [], 
        }));
        this.totalPages = data.totalPages;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.toastr.error('Impossible de charger les événements.', 'Erreur');
      },
    });
  }
  

  changePage(newPage: number): void {
    if (newPage < 0 || newPage > this.totalPages) {
      this.toastr.warning('Numéro de page invalide.', 'Attention');
      return; 
    }
    this.currentPage = newPage;
    this.loadEvents(this.currentPage);
  }

  goBack(): void {
    this.location.back();
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.newEvent = { label: '', startDate: '', endDate: '' }; 
  }

  deleteEvent(eventId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      this.eventsService.deleteEvent(eventId).subscribe({
        next: () => {
          this.toastr.success('Événement supprimé avec succès.', 'Succès');
          this.loadEvents(this.currentPage); 
        },
        error: () => {
          this.toastr.error('Une erreur s’est produite lors de la suppression de l’événement.', 'Erreur');
        }
      });
    }
  }

  addEvent(): void {
    const { label, startDate, endDate } = this.newEvent;
    if (!label || !startDate || !endDate) {
      this.toastr.warning('Veuillez remplir tous les champs.', 'Attention');
      return;
    }
    this.eventsService.createEvent({ label, startDate, endDate }).subscribe({
      next: (event) => {
        this.toastr.success('Événement créé avec succès.', 'Succès');
        this.events.unshift({
          ...event,
          artists: event.artists || [],
        });

        this.closeModal();
        this.newEvent = { label: '', startDate: '', endDate: '' }; 
      },
      error: () => {
        this.toastr.error('Impossible de créer l’événement.', 'Erreur');
      },
    });
  }
  
  
  
}
