import { config } from '@vue/test-utils'

config.global.stubs = {
  QItem: { template: '<div><slot /></div>' },
  QItemSection: { template: '<div><slot /></div>' },
  QItemLabel: { template: '<div><slot /></div>' },
  QCheckbox: { props: ['modelValue'], emits: ['update:modelValue'], template: '<input type="checkbox" :checked="modelValue" @change="$emit(\'update:modelValue\', !modelValue)">' },
  QBtn: { props: ['disable'], emits: ['click'], template: '<button :disabled="disable" @click="$emit(\'click\')"><slot />{{ $attrs.label }}</button>' },
  QIcon: { template: '<span><slot /></span>' },
  QTooltip: { template: '<span><slot /></span>' },
  QForm: { template: '<form><slot /></form>' },
  QInput: { props: ['modelValue'], emits: ['update:modelValue'], template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)">' },
  QBanner: { template: '<div><slot /></div>' },
  QList: { template: '<div><slot /></div>' },
  TransitionGroup: { template: '<div><slot /></div>' }
}
