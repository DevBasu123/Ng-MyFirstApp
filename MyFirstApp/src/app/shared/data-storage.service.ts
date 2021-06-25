import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { exhaustMap, map, take, tap } from 'rxjs/operators';

import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from "../auth/auth.service";

@Injectable({providedIn: 'root'})
export class DataStorageService {
    constructor(    
        private http: HttpClient, 
        private recipeService: RecipeService,
        private authService: AuthService
    ) { }
    
    private dbFirebase: string = 'https://ng-recipe-book-e7690-default-rtdb.firebaseio.com/';
    private dbUrl: string = this.dbFirebase + 'recipes.json';

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        // this.http.put('https://ng-recipe-book-6cc92-default-rtdb.firebaseio.com/recipes.json', recipes)
        this.http.put(this.dbUrl, recipes)
            .subscribe((response) => {
            }
        );
    }

    fetchRecipes() {
        return this.http.get<Recipe[]>(
            // 'https://ng-recipe-book-6cc92-default-rtdb.firebaseio.com/recipes.json',
            this.dbUrl,
        ).pipe(
            map(
                (recipes) => {
                    return recipes.map(
                        (recipe) => {
                            return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
                        }
                    );
                }
            ),
            tap((recipes) => { this.recipeService.setRecipes(recipes); })
        );
    }

}