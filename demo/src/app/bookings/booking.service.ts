import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

import { Booking } from './booking.model';
import { AuthService } from '../auth/auth.service';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Place } from '../places/place.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  get bookings() {
    return this._bookings.asObservable();
  }

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
    let newBooking: Booking;

    return this.authService.userId.pipe(
      take(1),
      switchMap((userId: string) => {
        if (!userId) {
          //return of(null);
          throw new Error('No user id found!');
        }
        newBooking = new Booking(
          Math.random().toString(),
          placeId,
          userId,
          placeTitle,
          placeImage,
          firstName,
          lastName,
          guestNumber,
          dateFrom,
          dateTo
        );
        return this.httpClient.post<{ name: string }>(
          'https://ionic-demo-c2342-default-rtdb.firebaseio.com/bookings.json',
          { ...newBooking, id: null }
        );
      }),
      switchMap((resData) => {
        generatedId = resData.name;
        return this.bookings; // xem ham fetchBookings ben duoi
      }),
      take(1),
      tap((bookings) => {
        newBooking.id = generatedId;
        this._bookings.next([...bookings, newBooking]);
      })
    );
  }

  cancelBooking(bookingId: string) {
    return this.httpClient
      .delete(
        `https://ionic-demo-c2342-default-rtdb.firebaseio.com/bookings/${bookingId}.json`
      )
      .pipe(
        switchMap(() => {
          console.log(this.bookings);
          return this.bookings;
        }),
        take(1),
        tap((bookings) => {
          this._bookings.next([
            ...bookings.filter((booking) => booking.id !== bookingId),
          ]);
        })
      );
  }

  fetchBookings() {
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('User not found!');
        }
        return this.httpClient
          .get<{ [key: string]: Place }>(
            `https://ionic-demo-c2342-default-rtdb.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${userId}"`
          )
          .pipe(
            map((bookingData) => {
              const bookings = [];
              for (const key in bookingData) {
                if (bookingData.hasOwnProperty(key)) {
                  bookings.push({ ...bookingData[key], id: key } as Place);
                }
              }

              return bookings;
            }),
            tap((bookings) => {
              this._bookings.next([...bookings]);
            })
          );
      })
    );
  }
}
