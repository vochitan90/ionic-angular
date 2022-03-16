import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  recipes: Recipe[] = [
    {
      id: 'r1',
      title: 'Schnitzel',
      imageUrl:
        'https://media.istockphoto.com/photos/fried-chicken-fillets-and-vegetables-on-wooden-background-picture-id622185412',
      ingredients: ['French fries', 'Salad'],
    },
    {
      id: 'r2',
      title: 'Spaghetti',
      imageUrl:
        'https://media.gettyimages.com/photos/schnitzel-with-beer-picture-id1058050208?s=2048x2048',
      ingredients: ['Spaghetti', 'Meet', 'Tomato'],
    },
  ];

  constructor() {}

  getAllRecipes() {
    return [...this.recipes];
  }

  getRecipe(recipeId: string) {
    return { ...this.recipes.find((recipe) => recipe.id == recipeId) };
  }

  deleteRecipe(recipeId: string) {
    this.recipes = [...this.recipes.filter((recipe) => recipe.id !== recipeId)];
  }
}
