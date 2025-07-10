import type { CanvasElement } from '../types';
interface Props {
    element: CanvasElement;
    selected: boolean;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    select: (id: string, multiSelect?: boolean | undefined) => any;
    delete: (id: string) => any;
    update: (id: string, updates: Partial<CanvasElement>) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onSelect?: ((id: string, multiSelect?: boolean | undefined) => any) | undefined;
    onDelete?: ((id: string) => any) | undefined;
    onUpdate?: ((id: string, updates: Partial<CanvasElement>) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
