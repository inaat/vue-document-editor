interface Props {
    isOpen: boolean;
    sourceType: 'upload' | 'url';
    url: string;
    width: number;
    height: number;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: () => any;
    confirm: () => any;
    "update:sourceType": (value: "upload" | "url") => any;
    "update:url": (value: string) => any;
    "update:width": (value: number) => any;
    "update:height": (value: number) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onClose?: (() => any) | undefined;
    onConfirm?: (() => any) | undefined;
    "onUpdate:sourceType"?: ((value: "upload" | "url") => any) | undefined;
    "onUpdate:url"?: ((value: string) => any) | undefined;
    "onUpdate:width"?: ((value: number) => any) | undefined;
    "onUpdate:height"?: ((value: number) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
