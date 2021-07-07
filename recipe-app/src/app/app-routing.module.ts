import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
 
//setting routes for both recipe and shopping list components
const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  //applying lazy loading for recipes pages
  { 
    path: 'recipes', 
    loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule) 
  },
  //lazy loading for shopping lists pages, dont use string method
  {
    path: 'shopping-list',
    loadChildren: () => import('./shopping-list/shopping-list.module').then(m => m.ShoppingListModule)
  },
  //lazy loading for auth page
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  }
];

@NgModule({
  //pass appRoutes to configure this router module angular ships with
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})], //preloading lazy loaded codes for fast initial load and fast subsequent loads
  exports: [RouterModule] //exports to appmodule
})
export class AppRoutingModule { }
