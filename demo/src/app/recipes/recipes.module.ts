import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipesPage } from './recipes.page';
import { RecipePageRoutingModule } from './recipes-routing.module';
import { RecipeItemComponent } from './recipe-item/recipe-item.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RecipePageRoutingModule],
  declarations: [RecipesPage, RecipeItemComponent],
})
export class RecipesPageModule {}
