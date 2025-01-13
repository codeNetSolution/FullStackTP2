import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',

})
export class ArtistService {
    private baseUrl = 'http://localhost:9090/artists';

    constructor(private http: HttpClient) {}

    getPaginatedArtists(page: number, size: number, searchQuery: string = ''): Observable<any> {
      let url = `${this.baseUrl}?page=${page}&size=${size}`;
      if (searchQuery) {
        url += `&label=${encodeURIComponent(searchQuery)}`; 
      }
      return this.http.get(url);
    }

    getArtistById(id: number): Observable<any> {
      return this.http.get(`${this.baseUrl}/${id}`);
    }

    updateArtist(id: number, artistData: any):Observable<any> {
        return this.http.put(`${this.baseUrl}/${id}`, artistData)
    }

    deleteArtist(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`);
      }
    
      createArtist(artistData: any): Observable<any> {
        return this.http.post(this.baseUrl, artistData);
      }
    
      getArtistEvents(id: number): Observable<any> {
        return this.http.get(`${this.baseUrl}/${id}/events`);
      }
      
      deleteCategory(categoryId: number): Observable<void> {
        const url = `${this.baseUrl}/${categoryId}`;
        return this.http.delete<void>(url);
      }

      

      
}