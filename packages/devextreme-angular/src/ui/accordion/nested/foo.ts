/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';





import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-accordion-foo',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoAccordionFooComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get a(): string {
        return this._getOption('a');
    }
    set a(value: string) {
        this._setOption('a', value);
    }

    @Input()
    get b(): string {
        return this._getOption('b');
    }
    set b(value: string) {
        this._setOption('b', value);
    }


    protected get _optionPath() {
        return 'foo';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }


    ngOnInit() {
        this._addRecreatedComponent();
    }

    ngOnDestroy() {
        this._addRemovedOption(this._getOptionPath());
    }


}

@NgModule({
  imports: [
    DxoAccordionFooComponent
  ],
  exports: [
    DxoAccordionFooComponent
  ],
})
export class DxoAccordionFooModule { }
