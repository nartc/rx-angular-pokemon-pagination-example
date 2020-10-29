import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedPokemon } from './pokemon.mode';
import { Observable } from 'rxjs';
import { toApiResponse } from '../utils/to-api-response.util';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  constructor(private readonly httpClient: HttpClient) {}

  getPokemon(
    limit: number = 20,
    offset: number = 0,
    prev: PaginatedPokemon,
  ): Observable<{ status: 'loading' | 'success'; data: PaginatedPokemon }> {
    const params = {
      limit: limit.toString(),
      offset: offset.toString(),
    };

    return this.httpClient
      .get<PaginatedPokemon>('https://pokeapi.co/api/v2/pokemon', { params })
      .pipe(toApiResponse(prev));
  }
}
