import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { combineLatest } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { Pokemon } from './pokemon.model';
import { PokemonService } from './pokemon.service';

export interface PokemonState {
  status: 'loading' | 'success';
  total: number;
  originalResult: Pokemon[];
  filteredResult: Pokemon[];
  limit: number;
  offset: number;
  currentPage: number;
  query: string;
}

@Injectable()
export class PokemonStateService extends RxState<PokemonState> {
  readonly originalResult$ = this.select('originalResult');
  readonly total$ = this.select('total');
  readonly limit$ = this.select('limit');
  readonly offset$ = this.select('offset');

  readonly vm$ = combineLatest([
    this.select('status'),
    this.select('filteredResult'),
    this.select('currentPage'),
    this.total$,
    this.limit$,
    this.offset$,
  ]).pipe(
    map(([status, filteredResult, currentPage, total, limit, offset]) => ({
      status,
      filteredResult,
      total,
      currentPage,
      limit,
      offset,
    })),
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
    return combineLatest([this.limit$, this.offset$]).pipe(
      withLatestFrom(this.total$, this.originalResult$),
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
      withLatestFrom(this.originalResult$),
      map(([query, data]) => (!query ? data : this.filter(data, query))),
    );
  }

  private filter(data: Pokemon[], query: string): Pokemon[] {
    return data.filter((res) =>
      res.name.toLowerCase().includes(query.toLowerCase()),
    );
  }
}
