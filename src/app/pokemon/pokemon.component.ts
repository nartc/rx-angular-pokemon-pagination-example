import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PokemonStateService} from "./pokemon-state.service";
import {Subject} from "rxjs";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs/operators";

@Component({
    selector: 'app-pokemon',
    template: `
        <ng-container *rxLet="vm$; let vm;">
            <app-paginator [currentPage]="vm.currentPage" [rowsPerPageOptions]="[10, 20, 40, 80]" [rows]="vm.limit"
                           [totalRecords]="vm.total"
                           (onPageChange)="onPageChanged(vm.limit, $event)"></app-paginator>
            <input class="query" type="text" placeholder="Filter on the current page..." [formControl]="query"/>
            <h2 *ngIf="vm.status === 'loading'">Loading...</h2>
            <table *ngIf="vm.status === 'success'">
                <thead>
                <tr>
                    <th class="border-bottom">Name</th>
                    <th class="border-bottom">Detail URL</th>
                </tr>
                </thead>
                <tbody>
                <tr *ngFor="let result of vm.filteredResult">
                    <td>{{result.name}}</td>
                    <td class="border-left">
                        <a [href]="result.url">{{result.url}}</a>
                    </td>
                </tr>
                </tbody>
            </table>
        </ng-container>
    `,
    styles: [`
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
    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [PokemonStateService]
})
export class PokemonComponent {
    vm$ = this.pokemonStateService.vm$;
    query = new FormControl();
    private $pageChanged = new Subject<{ page: number, rows: number, first: number }>();

    constructor(private readonly pokemonStateService: PokemonStateService) {
        this.pokemonStateService.connect(this.$pageChanged.asObservable(), (oldState, value) => {
            oldState.currentPage = value.page;
            oldState.limit = value.rows;
            oldState.offset = value.first;
            return oldState;
        });
        this.pokemonStateService.connect('query', this.query.valueChanges.pipe(debounceTime(250)));
    }

    onPageChanged(currentLimit: number, $event: { page: number, rows: number, first: number }) {
        if ($event.rows !== currentLimit) {
            this.$pageChanged.next({page: 1, rows: $event.rows, first: 0});
        } else {
            this.$pageChanged.next({page: $event.page, rows: $event.rows, first: $event.first - $event.rows});
        }
        // Reset query on pageChanged
        this.query.setValue('');
    }
}
