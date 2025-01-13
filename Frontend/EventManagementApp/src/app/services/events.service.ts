import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private apiUrl = 'http://localhost:9090/events';

  constructor(private http: HttpClient) {}

  getEvents(page: number, limit: number): Observable<{ events: Event[]; totalPages: number }> {
    return this.http
      .get<any>(`${this.apiUrl}?page=${page}&size=${limit}`)
      .pipe(
        map((response) => ({
          events: response.content.map((event: any) => ({
            id: event.id,
            name: event.label,
            startDate: event.startDate,
            endDate: event.endDate,
            artists: event.artists || [],
          })),
          totalPages: response.totalPages,
        })),
        catchError((error) => {
          console.error('Erreur API:', error);
          return throwError(() => new Error('Impossible de récupérer les événements.'));
        })
      );
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((event) => ({
        id: event.id,
        name: event.label,
        startDate: event.startDate,
        endDate: event.endDate,
        artists: event.artists || [], 
      })),
      catchError((error) => {
        console.error('Erreur API:', error);
        return throwError(() => new Error('Impossible de récupérer les détails de l’événement.'));
      })
    );
  }
  

  updateEvent(id: string, eventData: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, eventData).pipe(
      catchError((error) => {
        console.error('Erreur API:', error);
        return throwError(() => new Error('Impossible de mettre à jour l’événement.'));
      })
    );
  }

  unlinkArtistFromEvent(eventId: string, artistId: string): Observable<any> {
    const url = `${this.apiUrl}/${eventId}/artists/${artistId}`;
    return this.http.delete(url);
  }

  linkArtistToEvent(eventId: string, artistId: string): Observable<any> {
    const url = `${this.apiUrl}/${eventId}/artists/${artistId}`;
    return this.http.post(url, {}); 
  }

  deleteEvent(eventId: string): Observable<void> {
    const url = `${this.apiUrl}/${eventId}`;
    return this.http.delete<void>(url);
  }

  createEvent(eventData: { label: string; startDate: string; endDate: string }): Observable<Event> {
    const payload = {
      label: eventData.label, 
      startDate: eventData.startDate,
      endDate: eventData.endDate,
    };
  
    return this.http.post<Event>(this.apiUrl, payload).pipe(
      catchError((error) => {
        console.error('Erreur API:', error);
        return throwError(() => new Error('Impossible de créer l’événement.'));
      })
    );
  }
  
  
  
  
  
}
