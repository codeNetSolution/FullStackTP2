import { Artist } from "./artist.model";

export interface Event {
    id: string;
    name: string; 
    startDate: string;
    endDate: string;
    artists: Artist[];
  }
  