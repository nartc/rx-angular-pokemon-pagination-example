import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { PokemonModule } from './pokemon/pokemon.module';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, PokemonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
