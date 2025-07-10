interface Props {
    selectedElement: any;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "apply-heading": (format: string) => any;
    "apply-font-family": (fontFamily: string) => any;
    "apply-text-color": (color: string) => any;
    "apply-background-color": (color: string) => any;
    "format-text": (command: string) => any;
    "align-text": (alignment: string) => any;
    "increase-font-size": () => any;
    "decrease-font-size": () => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onApply-heading"?: ((format: string) => any) | undefined;
    "onApply-font-family"?: ((fontFamily: string) => any) | undefined;
    "onApply-text-color"?: ((color: string) => any) | undefined;
    "onApply-background-color"?: ((color: string) => any) | undefined;
    "onFormat-text"?: ((command: string) => any) | undefined;
    "onAlign-text"?: ((alignment: string) => any) | undefined;
    "onIncrease-font-size"?: (() => any) | undefined;
    "onDecrease-font-size"?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
