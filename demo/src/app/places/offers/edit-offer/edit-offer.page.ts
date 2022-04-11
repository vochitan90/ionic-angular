import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NavController,
  LoadingController,
  AlertController,
} from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  placeSub: Subscription;
  isLoading = false;
  form: FormGroup;

  dateForm = '';
  dateTo = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private placesServices: PlacesService,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offer');
        return;
      }

      this.isLoading = true;
      this.placeSub = this.placesServices
        .getPlace(paramMap.get('placeId'))
        .subscribe(
          (place) => {
            this.place = place;
            this.form = this.fb.group({
              id: this.place.id,
              title: [
                this.place.title,
                { updateOn: 'blur', validators: [Validators.required] },
              ],
              description: [
                this.place.description,
                {
                  updateOn: 'blur',
                  validators: [Validators.required, Validators.maxLength(100)],
                },
              ],
            });

            this.isLoading = false;
          },
          (error) => {
            this.alertCtrl
              .create({
                header: 'An error occurred!',
                message: 'Place could not be fetched. Please try again later!',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.router.navigate(['places/tabs/offers']);
                    },
                  },
                ],
              })
              .then((alertEl) => {
                alertEl.present();
              });
          }
        );
    });
  }

  ngOnDestroy(): void {
    this.placeSub?.unsubscribe();
  }

  onEditOffer() {
    console.log('editing...', this.form.value);

    this.loadingCtrl
      .create({
        message: 'Editing place ...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.placesServices
          .updatePlace(this.form.getRawValue())
          .subscribe((_) => {
            loadingEl.dismiss();
            this.router.navigate(['places', 'tabs', 'offers']);
          });
      });
  }
}
