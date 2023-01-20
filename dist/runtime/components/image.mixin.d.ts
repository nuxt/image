export declare const imageMixin: {
    nImgAttrs: {
        width?: number;
        height?: number;
        alt?: string;
        referrerpolicy?: string;
        usemap?: string;
        longdesc?: string;
        ismap?: boolean;
        crossorigin?: '' | 'anonymous' | 'use-credentials';
        loading?: string;
        decoding?: 'async' | 'auto' | 'sync';
    };
    nModifiers: {
        width?: number;
        height?: number;
        format?: string;
        quality?: string | number;
        background?: string;
        fit?: string;
    } & Record<string, any>;
    nOptions: {
        provider?: string;
        preset?: string;
    };
} & {
    src: string;
    format: string;
    quality: string | number;
    background: string;
    fit: string;
    modifiers: Record<string, any>;
    preset: string;
    provider: string;
    sizes: string | Record<string, any>;
    preload: boolean;
    width: string | number;
    height: string | number;
    alt: string;
    referrerpolicy: string;
    usemap: string;
    longdesc: string;
    ismap: boolean;
    crossorigin: boolean | "" | "anonymous" | "use-credentials";
    loading: string;
    decoding: "async" | "auto" | "sync";
} & import("vue").VueConstructor<import("vue").default>;
