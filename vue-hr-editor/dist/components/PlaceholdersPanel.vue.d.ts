interface PlaceholderItem {
    type: string;
    content: string;
    icon: string;
    label: string;
}
declare const _default: import("vue").DefineComponent<{}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "drag-start": (item: PlaceholderItem) => any;
    "add-custom-text": (text: string) => any;
}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{
    "onDrag-start"?: ((item: PlaceholderItem) => any) | undefined;
    "onAdd-custom-text"?: ((text: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
