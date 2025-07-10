import type { CanvasElement } from '../types';
interface Props {
    initialElements?: CanvasElement[];
    canvasWidth?: string;
    canvasHeight?: string;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    elementsChanged: (elements: CanvasElement[]) => any;
    documentGenerated: (html: string) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onElementsChanged?: ((elements: CanvasElement[]) => any) | undefined;
    onDocumentGenerated?: ((html: string) => any) | undefined;
}>, {
    initialElements: CanvasElement[];
    canvasWidth: string;
    canvasHeight: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
