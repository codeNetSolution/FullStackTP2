import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '../services/events.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule , Location} from '@angular/common';
import { Event } from '../models/event.model';
import { ArtistService } from '../services/artist.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null; 
  errorMessage = ''; 
  eventForm: FormGroup; 
  isLoading: boolean = true; 
  isEditing = false; 
  artists: any[] = [];
  selectedArtistId: string | null = null;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService,
    private artistService: ArtistService,
    private toastr: ToastrService,
    private location: Location,
    private fb: FormBuilder
  ) {
    this.eventForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        startDate: ['', [Validators.required]],
        endDate: ['', [Validators.required]],
      },
      { validators: this.dateRangeValidator } 
    );
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); 
    if (id) {
      this.loadEvent(id);
    }
    this.loadArtists();
  }

  loadEvent(id: string): void {
    this.isLoading = true;
    this.eventsService.getEventById(id).subscribe({
      next: (event) => {
        this.event = event;
        this.eventForm.patchValue({
          name: event.name,
          startDate: event.startDate,
          endDate: event.endDate,
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Impossible de charger les détails de l’événement.', 'Erreur');
        this.isLoading = false;
      },
    });
  }

  loadArtists(): void {
    this.artistService.getPaginatedArtists(0, 100).subscribe({
      next: (response) => {
        this.artists = response.content;
      },
      error: () => {
        this.toastr.error('Impossible de charger les artistes.', 'Erreur');
      },
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

 
  saveChanges(): void {
    if (this.eventForm.invalid) {
      if (this.eventForm.errors?.['dateRangeInvalid']) {
        this.toastr.error('La date de début ne peut pas être supérieure à la date de fin.', 'Erreur');
      } else {
        this.toastr.error('Le formulaire contient des erreurs. Veuillez vérifier les champs.', 'Erreur');
      }
      return;
    }

    const updatedEvent = {
      label: this.eventForm.value.name, 
      startDate: this.eventForm.value.startDate,
      endDate: this.eventForm.value.endDate,
    };
    if (this.event) {
      this.eventsService.updateEvent(this.event.id, updatedEvent).subscribe({
        next: () => {
          this.toastr.success('Événement mis à jour avec succès.', 'Succès');
          this.toggleEdit();
          if (this.event) {
            this.loadEvent(this.event.id);
          }
           
        },
        error: (error) => {
          this.toastr.error('Impossible de mettre à jour l’événement.', 'Erreur');
        },
      });
    }
  }

  getArtistsDisplay(): string {
    if (!this.event?.artists || this.event.artists.length === 0) {
      return 'Aucun artiste';
    }
  
    return this.event.artists.map((artist: any) => artist.label || artist.name).join(', ');
  }

  dateRangeValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const startDate = formGroup.get('startDate')?.value;
    const endDate = formGroup.get('endDate')?.value;
  
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  addArtistToEvent(): void {
    if (!this.event || !this.selectedArtistId) {
      this.toastr.error('Veuillez sélectionner un artiste.', 'Erreur');
      return;
    }
  
    this.eventsService.linkArtistToEvent(this.event.id, this.selectedArtistId).subscribe({
      next: () => {
        this.toastr.success('Artiste ajouté avec succès à l’événement.', 'Succès');
        if (this.event?.id) { 
          this.loadEvent(this.event.id);
        }
        this.selectedArtistId = null;
      },
      error: () => {
        this.toastr.error('Impossible d’ajouter l’artiste à l’événement.', 'Erreur');
      },
    });
  }

  removeArtistFromEvent(artistId: string): void {
    if (!this.event) {
      return;
    }
  
    this.eventsService.unlinkArtistFromEvent(this.event.id, artistId).subscribe({
      next: () => {
        this.toastr.success('Artiste retiré avec succès de l’événement.', 'Succès');
        this.event!.artists = this.event!.artists.filter((artist: any) => artist.id !== artistId);
      },
      error: () => {
        this.toastr.error('Impossible de retirer l’artiste de l’événement.', 'Erreur');
      },
    });
  }
  
  goBack(): void {
    this.location.back(); 
  }
  
}
