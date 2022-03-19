import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York city',
      'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg',
      149.99
    ),
    new Place(
      'p2',
      'Amour Toujours',
      'A romantic place in Paris!',
      'https://resources.tidal.com/images/ab09f446/1def/4bcf/8d5e/ddb9ee024c09/640x640.jpg',
      189.99
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip',
      'https://image.shutterstock.com/z/stock-photo-fairytale-in-a-foggy-castle-palace-with-fog-1252568530.jpg',
      99.99
    ),
  ];

  get places() {
    return [...this._places];
  }

  constructor() {}

  getPlace(id: string) {
    return { ...this._places.find((place) => place.id === id) };
  }
}
