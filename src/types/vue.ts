import type Vue from 'vue'
import type { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import type { ExtendedVue, VueConstructor } from 'vue/types/vue'

export interface DefineMixin {
    <Data, Methods, Computed, Props>(options?: ThisTypedComponentOptionsWithRecordProps<Vue, Data, Methods, Computed, Props>): Data & Methods & Computed & Props & VueConstructor<Vue>
}

export interface DefineComponentWithMixin {
    // this is currently a hack - ideally we wouldn't need to duplicate this for multiple mixins
    <Data, Methods, Computed, Props, Mixin1 extends Record<string, any>, Mixin2 extends Record<string, any>>(options?: ThisTypedComponentOptionsWithRecordProps<Vue, Data & Omit<Mixin1 & Mixin2, keyof VueConstructor<Vue>>, Methods, Computed, Props> & { mixins: [Mixin1, Mixin2] }): ExtendedVue<Vue, Data, Methods, Computed, Props>;
    <Data, Methods, Computed, Props, Mixin extends Record<string, any>>(options?: ThisTypedComponentOptionsWithRecordProps<Vue, Data & Omit<Mixin, keyof VueConstructor<Vue>>, Methods, Computed, Props> & { mixins: Mixin[] }): ExtendedVue<Vue, Data, Methods, Computed, Props>;
}
