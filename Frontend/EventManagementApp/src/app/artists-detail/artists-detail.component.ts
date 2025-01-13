import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistService } from '../services/artist.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { EventsService } from '../services/events.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-artists-detail',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
  ],
  templateUrl: './artists-detail.component.html',
  styleUrls: ['./artists-detail.component.css']
})
export class ArtistDetailComponent implements OnInit {
  artist: any;
  availableEvents: any[] = [];
  selectedEventId: string | null = null;
  isEditing: boolean = false;
  genres: string[] = ['Pop', 'Rock', 'Jazz', 'Classical'];
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private artistService: ArtistService,
    private eventsService: EventsService,
    private location: Location,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    const artistId = this.route.snapshot.params['id'];
    this.artistService.getArtistById(artistId).subscribe({
      next: (data) => {
        this.artist = {
          id: data.id,
          name: data.label || 'Nom inconnu', 
          events: data.events.map((event: any) => ({
            id: event.id,
            name: event.label || 'Nom inconnu',
            startDate: event.startDate || 'Date inconnue',
            endDate: event.endDate || 'Date inconnue'
          }))
        };
        this.loadAvailableEvents();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l\'artiste :', err);
        this.errorMessage = 'Impossible de récupérer les détails de l\'artiste.';
        this.toastr.error(this.errorMessage, 'Erreur');
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveChanges() {
    if(this.artist.name.length < 3) {
      this.toastr.error('Le nom doit contenir au moins 3 caractères.', 'Erreur');
      return;
    }
    const updatedArtist = {
      label: this.artist.name 
    };
  
    this.artistService.updateArtist(this.artist.id, updatedArtist).subscribe({
      next: () => {
        this.isEditing = false;
        this.toastr.success('Les modifications ont été enregistrées avec succès.', 'Succès');
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour de l\'artiste :', err);
        this.toastr.error('Échec de la sauvegarde des modifications.', 'Erreur');
      }
    });
  }

  removeEvent(eventId: string) {
    if (!this.artist || !this.artist.id) return;

    const artistId = this.artist.id; 

    this.eventsService.unlinkArtistFromEvent(eventId, artistId).subscribe({
      next: () => {
        this.artist.events = this.artist.events.filter((event: any) => event.id !== eventId);
        this.toastr.success('L\'événement a été retiré avec succès.', 'Succès');
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de l\'événement :', err);
        this.toastr.error('Impossible de retirer l\'événement.', 'Erreur');
      }
    });
  }

  loadAvailableEvents() {
    this.eventsService.getEvents(0, 100).subscribe({
      next: (data) => {
        this.availableEvents = data.events.filter(
          (event) => !this.artist.events.some((e: any) => e.id === event.id)
        );
      },
      error: (err) => {
        console.error('Erreur lors du chargement des événements disponibles :', err);
        this.toastr.error('Impossible de charger les événements disponibles.', 'Erreur');
      },
    });
  }

  assignEvent() {
    if (!this.selectedEventId) {
      this.toastr.error('Veuillez sélectionner un événement.', 'Erreur');
      return;
    }

    this.eventsService.linkArtistToEvent(this.selectedEventId, this.artist.id).subscribe({
      next: () => {
        const assignedEvent = this.availableEvents.find((event) => event.id === this.selectedEventId);
        if (assignedEvent) {
          this.artist.events.push(assignedEvent);
          this.availableEvents = this.availableEvents.filter((event) => event.id !== this.selectedEventId);
          this.toastr.success('Événement assigné avec succès.', 'Succès');
          this.selectedEventId = null;
        }
      },
      error: (err) => {
        this.toastr.error('Impossible d\'assigner l\'événement.', 'Erreur');
      },
    });
  }

  goBack(): void {
    this.location.back(); 
  }
}
