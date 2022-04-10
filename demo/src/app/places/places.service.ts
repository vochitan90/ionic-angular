import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';
import { delay, filter, map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York city',
      'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg',
      149.99,
      new Date('2019-01-01'),
      new Date('2025-12-31'),
      'abc'
    ),
    new Place(
      'p2',
      'Amour Toujours',
      'A romantic place in Paris!',
      'https://resources.tidal.com/images/ab09f446/1def/4bcf/8d5e/ddb9ee024c09/640x640.jpg',
      189.99,
      new Date('2019-01-01'),
      new Date('2025-12-31'),
      'abc'
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip',
      'https://image.shutterstock.com/z/stock-photo-fairytale-in-a-foggy-castle-palace-with-fog-1252568530.jpg',
      99.99,
      new Date('2019-01-01'),
      new Date('2025-12-31'),
      'abc'
    ),
  ]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService) {}

  getPlace(id: string) {
    return this.places.pipe(
      take(1),
      map((places) => places.find((place) => place.id === id))
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://image.shutterstock.com/z/stock-photo-fairytale-in-a-foggy-castle-palace-with-fog-1252568530.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );

    // take 1 mean take one object and then automatically cancel the subscription =>
    // get current latest list of places and dont listen to the future places
    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        this._places.next([...places, newPlace]);
      })
    );
  }

  editPlace(place: Place) {
    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        const findIndex = places.findIndex((x) => x.id === place.id);
        places[findIndex].title = place.title;
        places[findIndex].description = place.description;
        this._places.next([...places]);
      })
    );
  }
}
