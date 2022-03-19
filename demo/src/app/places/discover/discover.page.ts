import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  placedPlaces: Place[];

  constructor(
    private placeService: PlacesService,
    private menuCtrl: MenuController
  ) {}

  ngOnInit(): void {
    this.placedPlaces = this.placeService.places;
  }

  onOpenMenu() {
    this.menuCtrl.toggle();
  }
}
