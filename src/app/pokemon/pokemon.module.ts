import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PokemonComponent} from './pokemon.component';
import {LetModule} from "@rx-angular/template";
import {PaginatorComponent} from "../components/paginator/paginator.component";
import {FormsModule} from "@angular/forms";


@NgModule({
    declarations: [PokemonComponent, PaginatorComponent],
    exports: [
        PokemonComponent
    ],
    imports: [
        CommonModule,
        LetModule,
        FormsModule
    ]
})
export class PokemonModule {
}
