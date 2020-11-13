import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LetModule } from '@rx-angular/template';
import { PaginatorModule } from '../components/paginator/paginator.module';
import { QueryModule } from '../components/query/query.module';
import { PokemonComponent } from './pokemon.component';

const routes = [{ path: '', component: PokemonComponent }];

@NgModule({
  declarations: [PokemonComponent],
  imports: [
    CommonModule,
    LetModule,
    RouterModule.forChild(routes),
    PaginatorModule,
    QueryModule,
  ],
})
export class PokemonModule {}
