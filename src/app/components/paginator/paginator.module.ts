import { NgModule } from '@angular/core';
import { PaginatorComponent } from './paginator.component';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [PaginatorComponent],
  exports: [PaginatorComponent],
})
export class PaginatorModule {}
