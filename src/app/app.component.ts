import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <ul>
      <li>
        <a
            routerLink="/"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
        >
          Pokemon
        </a>
      </li>
      <li>
        <a routerLink="/todo" routerLinkActive="active">Todo</a>
      </li>
    </ul>
    <router-outlet></router-outlet>
  `,
  styles: [
      `
      ul {
        list-style: none;
        display: flex;
        padding: 0;
      }

      li:not(:first-of-type) {
        margin-left: 1rem;
      }

      a {
        font-size: x-large;
        color: darkgrey;
      }

      a.active {
        color: deeppink;
      }
    `,
  ],
})
export class AppComponent {
}
