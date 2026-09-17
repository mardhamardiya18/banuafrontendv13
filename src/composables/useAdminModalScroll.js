import { watch, onBeforeUnmount } from 'vue'
import { lockAdminScroll } from '../utils/adminScroll'

export function useAdminModalScroll(isOpen, panel) {
  let unlock
  const release = () => {
    if (panel.value?.contains(document.activeElement)) document.activeElement.blur()
    unlock?.()
    unlock = undefined
  }

  watch(isOpen, open => {
    if (open) {
      unlock ??= lockAdminScroll()
    } else {
      release()
    }
  }, { immediate: true, flush: 'pre' })

  onBeforeUnmount(release)
}
