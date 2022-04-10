import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterContentInit,
  AfterViewInit,
} from '@angular/core';
import { Place } from 'src/app/places/place.model';
import { ModalController } from '@ionic/angular';
import { format, isThisSecond, parseISO } from 'date-fns';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit, AfterViewInit {
  @Input() selectedPlace!: Place;
  @Input() selectedMode: 'select' | 'random';
  @ViewChild('f', { static: true }) form: NgForm;

  startDate: string;
  endDate: string;

  dateForm = '';
  dateTo = '';

  constructor(private modalCtrl: ModalController) {}

  ngAfterViewInit() {
    console.log(this.form);
  }

  ngOnInit() {
    console.log(this.form);

    const availabelFrom = new Date(this.selectedPlace.availableForm);
    const availabelTo = new Date(this.selectedPlace.availableTo);

    if (this.selectedMode === 'random') {
      // 7 days
      this.startDate = new Date(
        availabelFrom.getTime() +
          Math.random() *
            (availabelTo.getTime() -
              7 * 24 * 60 * 60 * 1000 -
              availabelFrom.getTime())
      ).toISOString();

      this.endDate = new Date(
        new Date(this.startDate).getTime() +
          Math.random() *
            (new Date(this.startDate).getTime() +
              6 * 24 * 60 * 60 * 1000 -
              new Date(this.startDate).getTime())
      ).toISOString();

      this.dateForm = this.formatDate(this.startDate);
      this.dateTo = this.formatDate(this.endDate);
    }
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onBookPlace(f: NgForm) {
    console.log(f);

    this.modalCtrl.dismiss(
      {
        bookingData: {
          firstName: this.form.value['first-name'],
          lastName: this.form.value['last-name'],
          guestNumber: this.form.value['guest-number'],
          startDate: this.form.value['date-from'],
          endDate: this.form.value['date-to'],
        },
      },
      'confirm'
    );
  }

  getDateFormSelected(dateForm: string) {
    return new Date(dateForm)?.toISOString();
  }

  formatDate(value: string) {
    return value ? format(parseISO(value), 'yyyy-MM-dd') : '';
  }

  datesValid() {
    const startDate = new Date(this.form?.value['date-form']);
    const endDate = new Date(this.form?.value['date-to']);
    return endDate > startDate;
  }
}
