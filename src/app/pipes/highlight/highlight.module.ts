import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HighlightPipe } from './highlight.pipe';

@NgModule({
  declarations: [HighlightPipe],
  imports: [CommonModule],
  exports: [HighlightPipe],
})
export class HighlightModule {}
