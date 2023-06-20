import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appUnless]',
})
export class UnlessDirective {
  private viewShown = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input() public set appUnless(value: boolean) {
    if (value && this.viewShown) {
      // hide view
      this.viewContainer.clear();
      this.viewShown = false;
    }

    if (!value && !this.viewShown) {
      // show value
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.viewShown = true;
    }
  }
}
