let lockCount = 0
let snapshot = null

function scrollInstantly(left, top) {
  window.scrollTo({ left, top, behavior: 'instant' })
}

// Fixed body also prevents background scrolling on mobile Safari.
export function lockAdminScroll() {
  if (lockCount === 0) {
    const body = document.body
    const root = document.documentElement
    snapshot = {
      x: window.scrollX,
      y: window.scrollY,
      body: Object.fromEntries(['position', 'top', 'left', 'width', 'overflow'].map(key => [key, body.style[key]])),
      rootOverflow: root.style.overflow
    }
    Object.assign(body.style, {
      position: 'fixed', top: `-${snapshot.y}px`, left: `-${snapshot.x}px`, width: '100%', overflow: 'hidden'
    })
    root.style.overflow = 'hidden'
  }
  lockCount += 1
  let released = false

  return () => {
    if (released) return
    released = true
    lockCount -= 1
    if (lockCount !== 0) return

    const saved = snapshot
    snapshot = null
    Object.assign(document.body.style, saved.body)
    document.documentElement.style.overflow = saved.rootOverflow
    scrollInstantly(saved.x, saved.y)
  }
}

export function scrollAdminToTop() {
  document.activeElement?.blur?.()
  document.querySelectorAll('[data-admin-content] .overflow-y-auto').forEach(element => {
    element.scrollTop = 0
  })
  if (snapshot) {
    // Apply after the last modal unlocks, rather than scrolling a fixed body.
    snapshot.x = 0
    snapshot.y = 0
  } else {
    scrollInstantly(0, 0)
  }
}
