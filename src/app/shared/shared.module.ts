import { NgModule } from '@angular/core';
import { UnlessDirective } from './directives/unless/unless.directive';
import { DialogComponent } from './components/dialog/dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

const sharedComponents = [DialogComponent];
const sharedDirectives = [UnlessDirective];

@NgModule({
  declarations: [...sharedComponents, ...sharedDirectives],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  exports: [...sharedComponents, ...sharedDirectives],
})
export class SharedModule {}
