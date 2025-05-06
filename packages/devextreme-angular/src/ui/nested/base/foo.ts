/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';


@Component({
    template: ''
})
export abstract class DxoFoo extends NestedOption {
    get a(): string {
        return this._getOption('a');
    }
    set a(value: string) {
        this._setOption('a', value);
    }

    get b(): string {
        return this._getOption('b');
    }
    set b(value: string) {
        this._setOption('b', value);
    }
}
