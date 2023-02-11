import { getFileExtension } from "#image";
import { useHead, useImage } from "#imports";
import { computed, defineComponent, h, onMounted, ref } from "vue";
import { prerenderStaticImages } from "../utils/prerender";
import { baseImageProps, useBaseImage } from "./_base";

export const pictureProps = {
  ...baseImageProps,
  legacyFormat: { type: String, default: null },
  imgAttrs: { type: Object, default: null },
};

export default defineComponent({
  name: "NuxtPicture",
  props: pictureProps,
  emits: ["load"],
  setup: (props, ctx) => {
    const $img = useImage();
    const _base = useBaseImage(props);

    const isTransparent = computed(() =>
      ["png", "webp", "gif", "svg"].includes(originalFormat.value)
    );

    const originalFormat = computed(() => getFileExtension(props.src));

    const legacyFormat = computed(() => {
      if (props.legacyFormat) {
        return props.legacyFormat;
      }
      return isTransparent.value ? "png" : "jpeg";
    });

    type Source = {
      srcset: string;
      src?: string;
      type?: string;
      sizes?: string;
    };
    const sources = computed<Source[]>(() => {
      const format = props.format || originalFormat.value;
      const formats = format.split(",");
      if (format.value === "svg") {
        return [<Source>{ srcset: props.src }];
      }

      if (!formats.includes(legacyFormat.value)) {
        formats.push(legacyFormat.value);
      } else {
        formats.splice(formats.indexOf(legacyFormat.value), 1);
        formats.push(legacyFormat.value);
      }

      return formats.map((format: string) => {
        const { srcset, sizes, src } = $img.getSizes(props.src!, {
          ..._base.options.value,
          sizes: props.sizes || $img.options.screens,
          modifiers: { ..._base.modifiers.value, format },
        });

        return <Source>{ src, type: `image/${format}`, sizes, srcset };
      });
    });

    if (props.preload) {
      const srcKey = sources.value?.[1] ? 1 : 0;

      const link: any = {
        rel: "preload",
        as: "image",
        imagesrcset: sources.value[srcKey].srcset,
      };

      if (sources.value?.[srcKey]?.sizes) {
        link.imagesizes = sources.value[srcKey].sizes;
      }

      useHead({ link: [link] });
    }

    // Only passdown supported <image> attributes
    const imgAttrs = { ...props.imgAttrs };
    for (const key in ctx.attrs) {
      if (key in baseImageProps && !(key in imgAttrs)) {
        imgAttrs[key] = ctx.attrs[key];
      }
    }

    const imgEl = ref<HTMLImageElement>();

    // Prerender static images
    if (process.server && process.env.prerender) {
      for (const src of sources.value as Source[]) {
        prerenderStaticImages(src.src, src.srcset);
      }
    }

    onMounted(() => {
      imgEl.value!.onload = (event) => {
        ctx.emit("load", event);
      };
    });

    const lastSourceIndex = computed(() => sources.value.length - 1);
    return () =>
      h("picture", { key: sources.value[0].src }, [
        ...(sources.value?.[1]
          ? [
              h("source", {
                type: sources.value[1].type,
                sizes: sources.value[1].sizes,
                srcset: sources.value[1].srcset,
              }),
            ]
          : []),
        h("img", {
          ref: imgEl,
          ..._base.attrs.value,
          ...imgAttrs,
          src: sources.value[lastSourceIndex.value].src,
          sizes: sources.value[lastSourceIndex.value].sizes,
          srcset: sources.value[lastSourceIndex.value].srcset,
        }),
      ]);
  },
});
