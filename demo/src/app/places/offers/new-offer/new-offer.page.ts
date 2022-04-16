import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { format, parseISO } from 'date-fns';
import { PlacesService } from '../../places.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;

  dateForm = '';
  dateTo = '';

  constructor(
    private fb: FormBuilder,
    private placesService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: [null, { updateOn: 'blur', validators: [Validators.required] }],
      description: [
        null,
        {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(100)],
        },
      ],
      price: [
        null,
        {
          updateOn: 'blur',
          validators: [Validators.required, Validators.min(1)],
        },
      ],
      dateForm: [
        null,
        {
          updateOn: 'blur',
          validators: [Validators.required],
        },
      ],
      dateTo: [
        null,
        {
          updateOn: 'blur',
          validators: [Validators.required],
        },
      ],
      image: [null],
    });
  }

  formatDate(value: string) {
    return format(parseISO(value), 'yyyy-MM-dd');
  }

  onCreateOffer() {
    if (!this.form.valid) {
      return;
    }

    this.loadingCtrl
      .create({
        message: 'Creating place...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.form.patchValue({
          dateForm: this.formatDate(this.form.value?.dateForm),
          dateTo: this.formatDate(this.form.value?.dateTo),
        });
        console.log('create...', this.form.value);

        this.placesService
          .addPlace(
            this.form.value.title,
            this.form.value.description,
            +this.form.value.price,
            new Date(this.form.value.dateForm),
            new Date(this.form.value.dateTo)
          )
          .subscribe((resData) => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigateByUrl('places/tabs/offers');
          });
      });
  }

  onImagePicked(imageData: string | File) {
    if (typeof imageData === 'string') {
      this.form.patchValue({
        image: imageData,
      });
    } else {
    }
  }
}
