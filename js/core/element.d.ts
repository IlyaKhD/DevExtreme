import { dxElementWrapper } from '../core/renderer';

export interface ElementWrapperType<T extends Element> { }
export type TElement<T extends Element = HTMLElement> = {} extends ElementWrapperType<T> ? T : ElementWrapperType<T>

export interface ElementsArrayWrapperType<T extends Element> { }
export type TElementsArray<T extends Element = HTMLElement> = {} extends ElementsArrayWrapperType<T> ? Array<T> : ElementsArrayWrapperType<T>

/**
 * @docid
 * @hidden
 * @prevFileNamespace DevExpress.core
 * @deprecated Use TElement instead
 */
export type dxElement = TElement<HTMLElement>;

/**
 * @docid
 * @hidden
 * @prevFileNamespace DevExpress.core
 * @deprecated Use TElement instead
 */
export type dxSVGElement = TElement<SVGElement>;

export function getPublicElement(element: JQuery|dxElementWrapper): TElement;
export function setPublicElementWrapper(newStrategy: (element: JQuery|dxElementWrapper) => TElement): void;
