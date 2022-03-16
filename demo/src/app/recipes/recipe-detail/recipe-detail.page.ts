import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesService } from '../recipes.service';
import { Recipe } from '../recipe.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit {
  loadedRecipe: Recipe;
  constructor(
    private activatedRoute: ActivatedRoute,
    private recipeService: RecipesService,
    private routes: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.get('recipeId')) {
        this.routes.navigate(['/recipes']);
        return;
      }

      const recipeId = paramMap.get('recipeId');
      this.loadedRecipe = this.recipeService.getRecipe(recipeId);
    });
  }

  deleteRecipe(recipeId: string) {
    this.alertCtrl
      .create({
        header: 'Are you sure?',
        message: 'Do you really want to delete it?',
        buttons: [
          {
            text: 'Delete',
            handler: () => {
              this.recipeService.deleteRecipe(recipeId);
              this.routes.navigate(['/recipes']);
            },
          },
          {
            text: 'Cancel',
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }
}
