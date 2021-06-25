import { Injectable } from '@angular/core';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {

    recipesChanged = new Subject<Recipe[]>();
    private recipes: Recipe[] = [];

    // private recipes: Recipe[] =   [
    //     new Recipe(
    //         'French fries', 
    //         'Crunchy snacky fries!', 
    //         'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    //         [
    //             new Ingredient('Potato', 2)
    //         ]
    //         ),
    //     new Recipe(
    //         'Green salad', 
    //         'Green and Healthy!', 
    //         'https://images.pexels.com/photos/1580466/pexels-photo-1580466.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    //         [
    //             new Ingredient('Avocado', 1),
    //             new Ingredient('Broccoli', 1),
    //             new Ingredient('Herbs', 4)
    //         ]
    //         ),
    //     new Recipe(
    //         'Delicious platter', 
    //         'Best platter ever!', 
    //         'https://images.pexels.com/photos/3659862/pexels-photo-3659862.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    //         [
    //             new Ingredient('Meat', 4),
    //             new Ingredient('Cottage cheese', 3),
    //             new Ingredient('Pineapple', 1),
    //             new Ingredient('Herbs', 4),
    //         ]
    //         )
    
    // ];

    constructor(private slService: ShoppingListService){ }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }

    getRecipes() {
        return this.recipes.slice();
    }

    getRecipe(index: number){
        return this.recipes[index];
        // return this.recipes.slice()[index];
    }
    
    addIngredientsToShoppingList(ingredients: Ingredient[]){
        this.slService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}
