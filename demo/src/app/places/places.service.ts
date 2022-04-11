import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

// new Place(
//       'p1',
//       'Manhattan Mansion',
//       'In the heart of New York city',
//       'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg',
//       149.99,
//       new Date('2019-01-01'),
//       new Date('2025-12-31'),
//       'xyz'
//     ),
//     new Place(
//       'p2',
//       'Amour Toujours',
//       'A romantic place in Paris!',
//       'https://resources.tidal.com/images/ab09f446/1def/4bcf/8d5e/ddb9ee024c09/640x640.jpg',
//       189.99,
//       new Date('2019-01-01'),
//       new Date('2025-12-31'),
//       'abc'
//     ),
//     new Place(
//       'p3',
//       'The Foggy Palace',
//       'Not your average city trip',
//       'https://image.shutterstock.com/z/stock-photo-fairytale-in-a-foggy-castle-palace-with-fog-1252568530.jpg',
//       99.99,
//       new Date('2019-01-01'),
//       new Date('2025-12-31'),
//       'abc'
//     ),
@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    return this._places.asObservable();
  }

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  // Get all data from server
  fetchPlaces() {
    return this.httpClient
      .get<{ [key: string]: Place }>(
        'https://ionic-demo-c2342-default-rtdb.firebaseio.com/offered-places.json'
      )
      .pipe(
        take(1),
        map((resData) => {
          return resData
            ? Object.keys(resData).map(function (key) {
                resData[key].id = key;
                return resData[key];
              })
            : [];
        }),
        tap((places) => {
          return this._places.next(places);
        })
      );
  }

  getPlace(id: string) {
    return this.httpClient
      .get(
        `https://ionic-demo-c2342-default-rtdb.firebaseio.com/offered-places/${id}.json`
      )
      .pipe(
        map((place: Place) => {
          place.id = id;
          console.log(place);
          return { ...place };
        })
      );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ): Observable<Place[]> {
    let generatedId: string;
    let newPlace = new Place(
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
    return this.httpClient
      .post<{ name: string }>(
        'https://ionic-demo-c2342-default-rtdb.firebaseio.com/offered-places.json',
        { ...newPlace, id: null }
      )
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap((places) => {
          newPlace.id = generatedId;
          return this._places.next(places.concat(newPlace));
        })
      );
  }

  updatePlace(place: Place) {
    let loadedData = [];
    return this.places.pipe(
      take(1),
      switchMap((places) => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap((places) => {
        const findIndex = places.findIndex((x) => x.id === place.id);
        places[findIndex].title = place.title;
        places[findIndex].description = place.description;

        loadedData = places;
        return this.httpClient.put(
          `https://ionic-demo-c2342-default-rtdb.firebaseio.com/offered-places/${place.id}.json`,
          { ...places[findIndex], id: null }
        );
      }),
      tap(() => {
        return this._places.next([...loadedData]);
      })
    );
  }
}
