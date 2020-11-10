import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
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
        [first]="vm.offset"
        (onPageChange)="onPageChanged(vm.limit, $event)"
      ></app-paginator>
      <input
        class="query"
        type="text"
        placeholder="Filter on the current page..."
        [formControl]="query"
      />
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
  styles: [
    `
      table {
        width: 100%;
        text-align: center;
      }

      .border-bottom {
        border-bottom: 1px solid;
      }

      .border-left {
        border-left: 1px solid;
      }

      .query {
        width: 50%;
        margin: 1rem 0;
      }

      .overlay {
        position: relative;
      }

      .overlay::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.3);
      }

      .overlay::after {
        content: 'Loading...';
        font-size: 2rem;
        font-weight: bold;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PokemonStateService],
})
export class PokemonComponent {
  vm$ = this.pokemonStateService.vm$;
  query = new FormControl();

  constructor(private readonly pokemonStateService: PokemonStateService) {
    this.pokemonStateService.connect(
      'query',
      this.query.valueChanges.pipe(debounceTime(250)),
    );
  }

  onPageChanged(
    currentLimit: number,
    $event: { page: number; rows: number; first: number },
  ) {
    if ($event.rows !== currentLimit) {
      this.pokemonStateService.set({
        currentPage: 1,
        limit: $event.rows,
        offset: 0,
      });
    } else {
      this.pokemonStateService.set({
        currentPage: $event.page,
        limit: $event.rows,
        offset: $event.first - $event.rows,
      });
    }
    // Reset query on pageChanged
    this.query.setValue('');
  }
}
