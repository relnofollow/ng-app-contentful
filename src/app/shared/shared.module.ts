import { NgModule } from '@angular/core';
import { UnlessDirective } from './directives/unless/unless.directive';
import { DialogComponent } from './components/dialog/dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

const sharedComponents = [DialogComponent];
const sharedDirectives = [UnlessDirective];

@NgModule({
  declarations: [...sharedComponents, ...sharedDirectives],
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  exports: [...sharedComponents, ...sharedDirectives],
})
export class SharedModule {}
