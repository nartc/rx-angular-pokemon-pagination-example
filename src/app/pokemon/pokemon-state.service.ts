import {RxState} from "@rx-angular/state";
import {PaginatedPokemon} from "./pokemon.mode";
import {PokemonService} from "./pokemon.service";
import {Injectable} from "@angular/core";
import {combineLatest} from "rxjs";
import {map, switchMap, withLatestFrom} from "rxjs/operators";

export interface PokemonState {
    status: 'loading' | 'success'
    data: PaginatedPokemon;
    limit: number;
    offset: number;
    currentPage: number;
}

@Injectable()
export class PokemonStateService extends RxState<PokemonState> {
    readonly status$ = this.select('status');
    readonly data$ = this.select('data');
    readonly currentPage$ = this.select('currentPage');
    readonly limit$ = this.select('limit');
    readonly offset$ = this.select('offset');

    readonly vm$ = combineLatest([
        this.status$,
        this.data$,
        this.currentPage$,
        this.limit$
    ]).pipe(map(([status, data, currentPage, limit]) => ({status, data, currentPage, limit})));

    constructor(private readonly pokemonService: PokemonService) {
        super();
        this.set({
            currentPage: 1, limit: 20, offset: 0, data: {
                count: 0,
                next: '',
                previous: '',
                results: []
            }
        });
        this.connect(this.effect$());
    }

    private effect$() {
        return combineLatest([
            this.limit$,
            this.offset$
        ]).pipe(
            withLatestFrom(this.data$),
            switchMap(([[limit, offset], previous]) => this.pokemonService.getPokemon(limit, offset, previous))
        )
    }
}