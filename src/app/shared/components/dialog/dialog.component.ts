import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  @ContentChild('dialogFooter') dialogFooter: TemplateRef<unknown> | undefined;

  @Input() title: string | undefined;
  @Input() showLoader = false;
}
