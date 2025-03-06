// composables/useConfirm.ts
import { defu } from 'defu'
import { useState } from 'nuxt/app'
// import { useState } from '#imports';
/**
 * A composable for creating customizable confirmation dialogs.
 *
 * This utility provides a flexible way to create confirmation dialogs with various
 * styling options, button configurations, and preset types (info, warning, danger, success).
 * It manages the dialog state and returns a promise that resolves when the user makes a choice.
 * The dialog requires an explicit choice and can only be closed via the confirm or cancel buttons.
 *
 * @example Basic usage
 * ```ts
 * // In your component
 * const { confirm } = useConfirm();
 *
 * const handleAction = async () => {
 *   const confirmed = await confirm({
 *     title: 'Confirm Action',
 *     message: 'Are you sure you want to proceed?',
 *     type: 'warning'
 *   });
 *
 *   if (confirmed) {
 *     // User confirmed the action
 *     // Proceed with your logic
 *   }
 * };
 * ```
 *
 * @example With custom buttons
 * ```ts
 * const confirmed = await confirm({
 *   title: 'Delete Item',
 *   message: 'This action cannot be undone.',
 *   confirm: { label: 'Yes, Delete', color: 'error', variant: 'solid' },
 *   cancel: { label: 'Cancel', color: 'neutral', variant: 'outline' },
 *   type: 'danger'
 * });
 * ```
 *
 * @example With global defaults
 * ```ts
 * // Create a confirm dialog with custom defaults
 * const { confirm } = useConfirm({
 *   bgClass: 'dark:bg-black bg-white',
 *   size: 'lg',
 *   type: 'info'
 * });
 * ```
 */

/**
 * Types of confirmation dialogs with different visual styles and default configurations
 */
type ConfirmType = 'info' | 'warning' | 'danger' | 'success'

/**
 * Available size options for dialog elements
 */
type ConfirmSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Button style variants for Nuxt UI
 */
type ConfirmVariant = 'solid' | 'outline' | 'soft' | 'ghost' | 'link'

/**
 * Configuration for dialog buttons
 */
interface ConfirmButton {
  label?: string
  color?: string
  variant?: ConfirmVariant
  size?: ConfirmSize
}

/**
 * Configuration for the dialog icon
 */
interface ConfirmIcon {
  name?: string
  color?: string
  size?: ConfirmSize
}

/**
 * Options for configuring a confirmation dialog
 */
export interface ConfirmOptions {
  title?: string
  message?: string
  confirm?: Partial<ConfirmButton> | string
  cancel?: Partial<ConfirmButton> | string | false
  type?: ConfirmType
  size?: ConfirmSize
  icon?: Partial<ConfirmIcon> | string
  bgClass?: string
}

/**
 * Internal state of the confirmation dialog
 */
export interface ConfirmState extends Required<Omit<ConfirmOptions, 'confirm' | 'cancel' | 'icon'>> {
  visible: boolean
  confirm: ConfirmButton
  cancel: ConfirmButton
  icon: ConfirmIcon
  resolve: ((value: boolean) => void) | null
}

/**
 * Default configurations for each dialog type
 * These provide consistent styling and behavior based on the dialog's purpose
 */
const INFO: {
  type: ConfirmType
  size?: ConfirmSize
  icon?: ConfirmIcon
  confirm?: ConfirmButton
  cancel?: ConfirmButton
  bgClass?: string
} = {
  type: 'info',
  bgClass: 'bg-white dark:bg-black',
  icon: {
    name: 'i-heroicons-information-circle',
    color: 'info',
  },
  confirm: {
    label: 'Acknowledge',
    color: 'info',
    variant: 'solid',
  },
  cancel: {
    label: 'Cancel',
    color: 'info',
    variant: 'outline',
  },
}

const WARNING: {
  type: ConfirmType
  size?: ConfirmSize
  icon?: ConfirmIcon
  confirm?: ConfirmButton
  cancel?: ConfirmButton
  bgClass?: string
} = {
  type: 'warning',
  bgClass: 'bg-white dark:bg-black',
  icon: {
    name: 'i-heroicons-exclamation-circle',
    color: 'warning',
  },
  confirm: {
    label: 'Confirm',
    color: 'warning',
    variant: 'solid',
  },
  cancel: {
    label: 'Cancel',
    color: 'warning',
    variant: 'outline',
  },
}

const DANGER: {
  type: ConfirmType
  size?: ConfirmSize
  icon?: ConfirmIcon
  confirm?: ConfirmButton
  cancel?: ConfirmButton
  bgClass?: string
} = {
  type: 'danger',
  bgClass: 'bg-white dark:bg-black',
  icon: {
    name: 'i-heroicons-exclamation-triangle',
    color: 'error',
  },
  confirm: {
    label: 'Confirm',
    color: 'error',
    variant: 'solid',
  },
  cancel: {
    label: 'Cancel',
    color: 'error',
    variant: 'outline',
  },
}

const SUCCESS: {
  type: ConfirmType
  size?: ConfirmSize
  icon?: ConfirmIcon
  confirm?: ConfirmButton
  cancel?: ConfirmButton
  bgClass?: string
} = {
  type: 'success',
  bgClass: 'bg-white dark:bg-black',
  icon: {
    name: 'i-heroicons-check-circle',
    color: 'success',
  },
  confirm: {
    label: 'Confirm',
    color: 'success',
    variant: 'solid',
  },
  cancel: {
    label: 'Cancel',
    color: 'success',
    variant: 'outline',
  },
}

// Framework-specific presets
const PRESETS: Record<ConfirmType, ConfirmOptions> = {
  info: INFO,
  warning: WARNING,
  danger: DANGER,
  success: SUCCESS,
}

/**
 * Add size to the object if it does not have size
 * @param obj - The object to add size to
 * @param size - The size to add
 * @returns The mapped object
 */
function addSize<T extends ConfirmButton | ConfirmIcon>(obj: T, size: ConfirmSize): T {
  return defu(obj, { size }) as T
}
/**
 * Helper function to create a button configuration by merging options with defaults
 */
function getButton(option?: Partial<ConfirmButton> | string | false, defaultButton?: Partial<ConfirmButton> | null): ConfirmButton {
  // Handle edge cases
  if (option === false || (!option && !defaultButton)) return {} as ConfirmButton
  if (!option && defaultButton) return { ...defaultButton } as ConfirmButton

  // Handle string option (button label)
  if (typeof option === 'string') {
    const base = defaultButton ? defaultButton : {}
    return defu({ label: option }, base) as ConfirmButton
  }

  // Handle object option
  return defu(option, defaultButton || {}) as ConfirmButton
}

/**
 * Helper function to create an icon configuration by merging options with defaults
 */
function getIcon(option?: Partial<ConfirmIcon> | string | false, defaultIcon?: Partial<ConfirmIcon> | null): ConfirmIcon {
  // Handle edge cases
  if (option === false || (!option && !defaultIcon)) return {} as ConfirmIcon
  if (!option && defaultIcon) return { ...defaultIcon } as ConfirmIcon

  // Handle string option (icon name)
  if (typeof option === 'string') {
    const base = defaultIcon ? defaultIcon : {}
    return defu({ name: option }, base) as ConfirmIcon
  }

  // Handle object option
  return defu(option, defaultIcon || {}) as ConfirmIcon
}

/**
 * Creates a confirmation dialog utility with customizable options
 * @param globalOptions - Default options to apply to all dialogs created by this instance
 * @returns Object containing methods to show/hide dialogs and access dialog state
 */
export function useConfirm(globalOptions: ConfirmOptions = {}) {
  // Create initial state with merged defaults
  const state = useState<ConfirmState>('confirmState', () => {
    const type = globalOptions.type || 'info'
    const typeDefaults = PRESETS[type]
    const mergedDefaults = defu(globalOptions, typeDefaults)

    return {
      type,
      visible: false,
      title: globalOptions.title || 'Confirm',
      message: globalOptions.message || 'Are you sure?',
      size: globalOptions.size || mergedDefaults.size,
      confirm: addSize(getButton(
        globalOptions.confirm as Partial<ConfirmButton> | string,
        typeDefaults.confirm as Partial<ConfirmButton>,
      ), mergedDefaults.size as ConfirmSize),
      cancel: addSize(getButton(
        globalOptions.cancel as Partial<ConfirmButton> | string | false,
        typeDefaults.cancel as Partial<ConfirmButton>,
      ), mergedDefaults.size as ConfirmSize),
      icon: addSize(getIcon(
        globalOptions.icon as Partial<ConfirmIcon> | string,
        typeDefaults.icon as Partial<ConfirmIcon>,
      ), mergedDefaults.size as ConfirmSize),
      bgClass: globalOptions.bgClass || mergedDefaults.bgClass,
      resolve: null,
    } as ConfirmState
  })

  /**
   * Shows a confirmation dialog and returns a promise that resolves when the user makes a choice
   * @param options - Configuration options for this specific dialog
   * @returns Promise that resolves to true if confirmed, false if canceled
   */
  const confirm = async (options: ConfirmOptions = {}): Promise<boolean> => {
    const type = options.type || globalOptions.type || 'info'
    const typeDefaults = PRESETS[type]

    // Merge options with better defaults handling
    const mergedOptions = defu(options, globalOptions, typeDefaults)

    return new Promise((resolve) => {
      // Update state with new options
      state.value = {
        ...state.value,
        type,
        visible: true,
        title: mergedOptions.title ?? state.value.title,
        message: mergedOptions.message ?? state.value.message,
        confirm: addSize(getButton(
          mergedOptions.confirm as Partial<ConfirmButton> | string | undefined,
          typeDefaults.confirm as Partial<ConfirmButton>,
        ), mergedOptions.size as ConfirmSize),
        cancel: mergedOptions.cancel === false
          ? false
          : addSize(getButton(
              mergedOptions.cancel as Partial<ConfirmButton> | string | undefined,
              typeDefaults.cancel as Partial<ConfirmButton>,
            ), mergedOptions.size as ConfirmSize),
        icon: addSize(getIcon(
          mergedOptions.icon as Partial<ConfirmIcon> | string | undefined,
          typeDefaults.icon as Partial<ConfirmIcon>,
        ), mergedOptions.size as ConfirmSize),
        bgClass: mergedOptions.bgClass ?? state.value.bgClass,
        resolve,
      } as ConfirmState
    })
  }

  /**
   * Resolves the confirm dialog with a given value
   * @param value - True for confirm, false for cancel
   */
  const resolveDialog = (value: boolean) => {
    if (state.value.resolve) {
      state.value.resolve(value)
      state.value.visible = false
      state.value.resolve = null
    }
  }

  /**
   * Confirms the dialog, resolving the promise with true
   */
  const onConfirm = () => resolveDialog(true)

  /**
   * Cancels the dialog, resolving the promise with false
   */
  const onCancel = () => resolveDialog(false)

  return {
    confirm,
    onConfirm,
    onCancel,
    state,
  }
}
