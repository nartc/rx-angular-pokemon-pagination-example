import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { PokemonModule } from './pokemon/pokemon.module';

const routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pokemon/pokemon.module').then(
        ({ PokemonModule }) => PokemonModule,
      ),
  },
  {
    path: 'todo',
    loadChildren: () =>
      import('./todo/todo.module').then(({ TodoModule }) => TodoModule),
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(routes)],
  bootstrap: [AppComponent],
})
export class AppModule {}
