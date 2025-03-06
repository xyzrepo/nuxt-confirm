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
  version?: 2 | 3 // Add version option
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
  version: 2 | 3
}

/**
 * Default configurations for each dialog type
 * These provide consistent styling and behavior based on the dialog's purpose
 */
const INFO: {
  type: ConfirmType
  size: ConfirmSize
  bgClass: string
  icon: ConfirmIcon
  confirm: ConfirmButton
  cancel: ConfirmButton
} = {
  type: 'info',
  size: 'lg',
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
  size: ConfirmSize
  bgClass: string
  icon: ConfirmIcon
  confirm: ConfirmButton
  cancel: ConfirmButton
} = {
  type: 'warning',
  size: 'lg',
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
  size: ConfirmSize
  bgClass: string
  icon: ConfirmIcon
  confirm: ConfirmButton
  cancel: ConfirmButton
} = {
  type: 'danger',
  size: 'lg',
  bgClass: 'bg-white dark:bg-black',
  icon: {
    name: 'i-heroicons-exclamation-circle',
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
  size: ConfirmSize
  bgClass: string
  icon: ConfirmIcon
  confirm: ConfirmButton
  cancel: ConfirmButton
} = {
  type: 'success',
  size: 'lg',
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
 * Simple color mapping function
 */
function mapColorToVersion(color: string, version?: 2 | 3): string {
  if (version === 2) {
    // Map v3 colors to v2
    const v2ColorMap: Record<string, string> = {
      info: 'blue',
      warning: 'yellow',
      error: 'red',
      success: 'green',
      neutral: 'gray',
    }
    return v2ColorMap[color] || color
  }
  return color
}

// Define the type for typeDefaults
interface _DefaultsType {
  confirm: Partial<ConfirmButton>
  cancel: Partial<ConfirmButton>
  icon: Partial<ConfirmIcon>
  [key: string]: unknown
}

/**
 * Helper function to create a button configuration by merging options with defaults
 */
function getButton(
  option?: Partial<ConfirmButton> | string | false,
  defaultButton?: Partial<ConfirmButton> | null,
  version: 2 | 3 = 3,
  size?: ConfirmSize,
): ConfirmButton {
  if (option === false) return {} as ConfirmButton
  if (!option && defaultButton) return { ...defaultButton } as ConfirmButton
  if (!option && !defaultButton) return {} as ConfirmButton

  if (typeof option === 'string') {
    if (!defaultButton) return { label: option, size } as ConfirmButton

    return {
      ...defaultButton,
      label: option,
      color: mapColorToVersion(defaultButton.color as string || '', version),
      size: size || defaultButton.size,
    } as ConfirmButton
  }

  if (!defaultButton) return option as ConfirmButton

  const result = defu(option, defaultButton) as ConfirmButton
  if (result.color) {
    result.color = mapColorToVersion(result.color as string, version)
  }
  if (result.size) {
    result.size = size || result.size
  }
  return result
}

/**
 * Helper function to create an icon configuration by merging options with defaults
 */
function getIcon(
  option?: Partial<ConfirmIcon> | string,
  defaultIcon?: Partial<ConfirmIcon> | null,
  version: 2 | 3 = 3,
  size?: ConfirmSize,
): ConfirmIcon {
  if (!option && defaultIcon) return { ...defaultIcon } as ConfirmIcon
  if (!option && !defaultIcon) return {} as ConfirmIcon

  if (typeof option === 'string') {
    if (!defaultIcon) return { name: option, size } as ConfirmIcon

    return {
      ...defaultIcon,
      name: option,
      color: mapColorToVersion(defaultIcon.color as string || '', version),
      size: size || defaultIcon.size,
    } as ConfirmIcon
  }

  if (!defaultIcon) return option as ConfirmIcon

  const result = defu(option, defaultIcon) as ConfirmIcon
  if (result.color) {
    result.color = mapColorToVersion(result.color as string, version)
  }
  if (result.size) {
    result.size = size || result.size
  }
  return result
}

/**
 * Creates a confirmation dialog utility with customizable options
 * @param globalOptions - Default options to apply to all dialogs created by this instance
 * @returns Object containing methods to show/hide dialogs and access dialog state
 */
export function useConfirm(globalOptions: ConfirmOptions = {}) {
  // Get version from options or default to v3
  const version = globalOptions.version || 3

  // Create initial state with merged defaults
  const state = useState<ConfirmState>('confirmState', () => {
    const type = globalOptions.type || 'info'
    const typeDefaults = PRESETS[type]
    const mergedDefaults = defu(globalOptions, typeDefaults)

    return {
      visible: false,
      title: globalOptions.title || 'Confirm',
      message: globalOptions.message || 'Are you sure?',
      confirm: getButton(
        globalOptions.confirm as Partial<ConfirmButton> | string | undefined,
        typeDefaults.confirm as Partial<ConfirmButton>,
        version,
        globalOptions.size,
      ),
      cancel: getButton(
        globalOptions.cancel as Partial<ConfirmButton> | string | false | undefined,
        typeDefaults.cancel as Partial<ConfirmButton>,
        version,
        globalOptions.size,
      ),
      type,
      size: globalOptions.size || mergedDefaults.size || 'lg',
      icon: getIcon(
        globalOptions.icon as Partial<ConfirmIcon> | string | undefined,
        typeDefaults.icon as Partial<ConfirmIcon>,
        version,
        globalOptions.size,
      ),
      bgClass: globalOptions.bgClass || mergedDefaults.bgClass || '',
      resolve: null,
      version,
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
        visible: true,
        title: mergedOptions.title ?? state.value.title,
        message: mergedOptions.message ?? state.value.message,
        confirm: getButton(
          mergedOptions.confirm as Partial<ConfirmButton> | string | undefined,
          typeDefaults.confirm as Partial<ConfirmButton>,
          version,
          mergedOptions.size,
        ),
        cancel: mergedOptions.cancel === false
          ? false
          : getButton(
              mergedOptions.cancel as Partial<ConfirmButton> | string | undefined,
              typeDefaults.cancel as Partial<ConfirmButton>,
              version,
              mergedOptions.size,
            ),
        type,
        size: mergedOptions.size ?? state.value.size,
        icon: getIcon(
          mergedOptions.icon as Partial<ConfirmIcon> | string | undefined,
          typeDefaults.icon as Partial<ConfirmIcon>,
          version,
          mergedOptions.size,
        ),
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
