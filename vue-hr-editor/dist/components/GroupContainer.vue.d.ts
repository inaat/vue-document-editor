import type { Group, ElementPosition } from '../types';
interface Props {
    group: Group;
    visible: boolean;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    select: (id: string) => any;
    move: (id: string, position: ElementPosition) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onSelect?: ((id: string) => any) | undefined;
    onMove?: ((id: string, position: ElementPosition) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
