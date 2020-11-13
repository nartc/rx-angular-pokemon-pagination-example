import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Pagination } from '../components/paginator/paginator.component';
import { PokemonStateService } from './pokemon-state.service';

@Component({
  selector: 'app-pokemon',
  template: `
    <ng-container *rxLet="vm$; let vm">
      <app-paginator
        [currentPage]="vm.currentPage"
        [rowsPerPageOptions]="[10, 20, 40, 80]"
        [rows]="vm.limit"
        [totalRecords]="vm.total"
        [first]="vm.offset + vm.limit"
        (onPageChange)="onPageChanged($event)"
      ></app-paginator>
      <app-query
        [placeholder]="'Filter on the current page...'"
        [currentQuery]="vm.query"
        (query)="onQueryChanged($event)"
      ></app-query>
      <table [class.overlay]="vm.status === 'loading'">
        <thead>
          <tr>
            <th class="border-bottom">Name</th>
            <th class="border-bottom">Detail URL</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let result of vm.filteredResult">
            <td>{{ result.name }}</td>
            <td class="border-left">
              <a [href]="result.url" target="_blank">{{ result.url }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </ng-container>
  `,
  styleUrls: ['../table.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PokemonStateService],
})
export class PokemonComponent {
  vm$ = this.pokemonStateService.vm$;

  constructor(private readonly pokemonStateService: PokemonStateService) {}

  onPageChanged({ rows, page, first }: Pagination) {
    this.pokemonStateService.set(({ limit }) => {
      if (rows !== limit) {
        return {
          currentPage: 1,
          limit: rows,
          offset: 0,
          query: '',
        };
      }

      return {
        currentPage: page,
        limit: rows,
        offset: first - rows,
        query: '',
      };
    });
  }

  onQueryChanged(query: string) {
    this.pokemonStateService.set({ query });
  }
}
