import { Component, OnDestroy, OnInit } from '@angular/core';
import { RecipesService } from './recipes.service';
import { Recipe } from './recipe.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit, OnDestroy {
  recipes!: Recipe[];
  constructor(private recipeService: RecipesService) {}

  ngOnInit() {
    // Some how can not go to this but ionViewWillEnter have
  }

  ngOnDestroy(): void {
    console.log('detroy');
  }

  ionViewWillEnter() {
    this.recipes = this.recipeService.getAllRecipes();
    console.log('ionViewWillEnter');
  }
}
