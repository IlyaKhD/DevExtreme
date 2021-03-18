import {
    animationConfig
} from '../../animation/fx';

import {
  TElement
} from '../../core/element';

import DataSource, {
    DataSourceOptions
} from '../../data/data_source';

import HierarchicalCollectionWidget, {
    HierarchicalCollectionWidgetOptions
} from '../hierarchical_collection/ui.hierarchical_collection_widget';

import {
    dxMenuBaseItem
} from '../menu';

/**
* @public
*/
export interface Animation {
    /**
    * @docid
    * @prevFileNamespace DevExpress.ui
    * @default { type: "fade", from: 1, to: 0, duration: 100 }
    */
    hide?: animationConfig;
    /**
    * @docid
    * @prevFileNamespace DevExpress.ui
    * @default { type: "fade", from: 0, to: 1, duration: 100 }
    */
    show?: animationConfig;
}

/**
 * @public
*/
export interface Delay {
    /**
    * @docid
    * @prevFileNamespace DevExpress.ui
    * @default 300
    */
    hide?: number,
    /**
    * @docid
    * @prevFileNamespace DevExpress.ui
    * @default 50
    */
    show?: number
}

/**
 * @public
*/
export interface ShowSubmenuMode {
    /**
    * @docid
    * @prevFileNamespace DevExpress.ui
    * @default { show: 50, hide: 300 }
    */
    delay?: number | Delay;
    /**
    * @docid
    * @prevFileNamespace DevExpress.ui
    * @type Enums.ShowSubmenuMode
    * @default "onHover"
    */
    name?: 'onClick' | 'onHover';
}

export interface dxMenuBaseOptions<T = dxMenuBase> extends HierarchicalCollectionWidgetOptions<T> {
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @default { show: { type: "fade", from: 0, to: 1, duration: 100 }, hide: { type: "fade", from: 1, to: 0, duration: 100 } }
     * @ref
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    animation?: Animation;
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cssClass?: string;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<dxMenuBaseItem> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxMenuBaseItem>;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectByClick?: boolean;
    /**
     * @docid
     * @type Enums.MenuSelectionMode
     * @default none
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectionMode?: 'none' | 'single';
    /**
     * @docid
     * @type Object|Enums.ShowSubmenuMode
     * @default { name: "onHover", delay: { show: 50, hide: 300 } }
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showSubmenuMode?: 'onClick' | 'onHover' | ShowSubmenuMode;
}
/**
 * @docid
 * @inherits HierarchicalCollectionWidget
 * @hidden
 * @prevFileNamespace DevExpress.ui
 */
export default class dxMenuBase extends HierarchicalCollectionWidget {
    constructor(element: TElement, options?: dxMenuBaseOptions)
    /**
     * @docid
     * @publicName selectItem(itemElement)
     * @param1 itemElement:Element
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectItem(itemElement: Element): void;
    /**
     * @docid
     * @publicName unselectItem(itemElement)
     * @param1 itemElement:Element
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    unselectItem(itemElement: Element): void;
}
