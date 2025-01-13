import { Component, OnInit } from '@angular/core';
import { ArtistService } from '../services/artist.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-artists-list-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artists-list.component.html',
  styleUrls: ['./artists-list.component.css']
})
export class ArtistsListComponent implements OnInit {
  artists: any[] = [];
  currentPage: number = 1;
  totalPages: number = 10;
  searchQuery: string = '';
  pageSize: number = 10;
  newArtist = { label: '', genre: '' };
  showModal = false;

  constructor(private artistService: ArtistService,
    private location: Location,
    private router: Router,
    private toastr: ToastrService) {}

  ngOnInit() {
    this.loadArtists(this.currentPage);
  }

  loadArtists(page: number): void {
    this.artistService.getPaginatedArtists(page - 1, this.pageSize, this.searchQuery).subscribe((response: any) => {
      this.artists = response.content.map((artist: any) => ({
        ...artist,
        label: artist.label || 'Nom inconnu',
      }));
      this.currentPage = response.pageable?.pageNumber + 1 || 1;
      this.totalPages = response.totalPages || 1;
    });
  }

  get filteredArtists() {
    return this.artists.filter(artist =>
      artist.label?.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  goToDetails(artistId: number): void {
    this.router.navigate(['/artists', artistId]);
  }

  getEventNames(artist: any): string {
    return artist.events && artist.events.length > 0
      ? artist.events.map((e: any) => e.label).join(', ')
      : 'Aucun';
  }
  onSearchChange(): void {
    this.currentPage = 1; 
    this.loadArtists(this.currentPage);
  }

  goBack(): void {
    this.location.back(); 
  }

  changePage(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages) {
      this.toastr.warning('Numéro de page invalide.', 'Attention');
      return; 
    }
    this.currentPage = newPage;
    this.loadArtists(this.currentPage);
  }

  deleteCategory(categoryId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      this.artistService.deleteCategory(categoryId).subscribe({
        next: () => {
          this.toastr.success('Catégorie supprimée avec succès.', 'Succès');
          this.loadArtists(this.currentPage);
        },
        error: () => {
          this.toastr.error('Une erreur s’est produite lors de la suppression de la catégorie.', 'Erreur');
        }
      });
    }
  }

  openModal(): void {
    this.showModal = true;
  }
  
  closeModal(): void {
    this.showModal = false;
    this.newArtist = { label: '', genre: '' };
  }

  addArtist(): void {
    const { label, genre } = this.newArtist;
    if (!label || !genre) {
      this.toastr.warning('Veuillez remplir tous les champs.', 'Attention');
      return;
    }
  
    this.artistService.createArtist(this.newArtist).subscribe({
      next: (artist) => {
        this.toastr.success('Artiste ajouté avec succès.', 'Succès');
        this.artists.unshift(artist); 
        this.closeModal();
      },
      error: () => {
        this.toastr.error('Impossible d’ajouter l’artiste.', 'Erreur');
      },
    });
  }

}
