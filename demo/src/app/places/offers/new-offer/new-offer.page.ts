import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;

  dateForm = '';
  dateTo = '';

  constructor(private fb: FormBuilder) {}

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
    });
  }

  onCreateOffer() {
    console.log('create...', this.form.value);
  }

  formatDate(value: string) {
    return format(parseISO(value), 'MM/dd/yyyy');
  }
}
