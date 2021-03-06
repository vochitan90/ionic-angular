import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[];

  private placesSub: Subscription;

  constructor(
    private placesService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe((places) => {
      this.offers = places;
    });
  }

  ionViewWillEnter() {
    this.loadingCtrl
      .create({
        message: 'loading data...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.placesService.fetchPlaces().subscribe((_) => {
          loadingEl.dismiss();
        });
      });
  }

  ngOnDestroy(): void {
    if (this.placesSub) this.placesSub.unsubscribe();
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close(); // will close it right before you navidate
    this.router.navigate(['places', 'tabs', 'offers', 'edit', offerId]);
    console.log('Editing item ', offerId);
  }
}
