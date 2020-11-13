import { Injectable } from '@angular/core';
import { RxState, selectSlice } from '@rx-angular/state';
import { combineLatest } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { PaginationState } from '../utils/pagination-state.model';
import { Pokemon } from './pokemon.model';
import { PokemonService } from './pokemon.service';

export interface PokemonState extends PaginationState {
  status: 'loading' | 'success';
  originalResult: Pokemon[];
  filteredResult: Pokemon[];
}

@Injectable()
export class PokemonStateService extends RxState<PokemonState> {
  readonly vm$ = this.select(
    selectSlice([
      'status',
      'filteredResult',
      'currentPage',
      'total',
      'limit',
      'offset',
      'query',
    ]),
  );

  constructor(private readonly pokemonService: PokemonService) {
    super();
    this.set({
      currentPage: 1,
      limit: 20,
      offset: 0,
      query: '',
      filteredResult: [],
      originalResult: [],
      total: 0,
    });
    this.connect(this.effect$());
    this.connect('filteredResult', this.queryEffect$());
  }

  private effect$() {
    return combineLatest([this.select('limit'), this.select('offset')]).pipe(
      withLatestFrom(this.select('total'), this.select('originalResult')),
      switchMap(([[limit, offset], total, original]) =>
        this.pokemonService.getPokemon(limit, offset, {
          count: total,
          next: '',
          previous: '',
          results: original,
        }),
      ),
      map(({ status, data }) => ({
        status,
        total: data.count,
        filteredResult: data.results,
        originalResult: data.results,
      })),
    );
  }

  private queryEffect$() {
    return this.select('query').pipe(
      distinctUntilChanged(),
      withLatestFrom(this.select('originalResult')),
      map(([query, data]) => (!query ? data : this.filter(data, query))),
    );
  }

  private filter(data: Pokemon[], query: string): Pokemon[] {
    return data.filter((res) =>
      res.name.toLowerCase().includes(query.toLowerCase()),
    );
  }
}
