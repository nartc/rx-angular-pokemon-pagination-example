import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import { QueryComponent } from './query.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [QueryComponent],
  exports: [QueryComponent],
})
export class QueryModule {}
