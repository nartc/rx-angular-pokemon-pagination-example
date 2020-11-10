import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LetModule } from '@rx-angular/template';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import { PokemonComponent } from './pokemon.component';

@NgModule({
  declarations: [PokemonComponent, PaginatorComponent],
  exports: [PokemonComponent],
  imports: [CommonModule, LetModule, FormsModule, ReactiveFormsModule],
})
export class PokemonModule {}
