import { Component, OnInit } from '@angular/core';
import { MenuController, SegmentChangeEventDetail } from '@ionic/angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  placedPlaces: Place[];
  listedLoadedPlaces: Place[];

  constructor(
    private placeService: PlacesService,
    private menuCtrl: MenuController
  ) {}

  ngOnInit(): void {
    this.placedPlaces = this.placeService.places;
    this.listedLoadedPlaces = this.placeService.places.slice(1);
  }

  onOpenMenu() {
    this.menuCtrl.toggle();
  }

  onFilterUpdate(event: Event) {
    const detail = (<CustomEvent>event).detail;
    console.log(detail);
  }
}
