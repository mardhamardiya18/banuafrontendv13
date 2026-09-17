import test from 'node:test'
import assert from 'node:assert/strict'
import { lockAdminScroll, scrollAdminToTop } from '../src/utils/adminScroll.js'

test('modal scroll: cancel restores position, successful save resets it, nested locks release safely', () => {
  const calls = []
  let blurred = false
  const pane = { scrollTop: 350 }
  const originalStyle = { position: '', top: '', left: '', width: '', overflow: 'clip' }
  globalThis.window = { scrollX: 0, scrollY: 720, scrollTo: options => calls.push(options) }
  globalThis.document = {
    body: { style: { ...originalStyle } },
    documentElement: { style: { overflow: '' } },
    activeElement: { blur: () => { blurred = true } },
    querySelectorAll: () => [pane]
  }
  try {
    const cancel = lockAdminScroll()
    assert.equal(document.body.style.position, 'fixed')
    assert.equal(document.body.style.top, '-720px')
    assert.equal(document.documentElement.style.overflow, 'hidden')
    cancel()
    assert.deepEqual(document.body.style, originalStyle)
    assert.deepEqual(calls.at(-1), { left: 0, top: 720, behavior: 'instant' })

    const closeForm = lockAdminScroll()
    const closeNested = lockAdminScroll()
    scrollAdminToTop()
    assert.equal(blurred, true)
    assert.equal(pane.scrollTop, 0)
    closeForm()
    assert.equal(document.body.style.position, 'fixed')
    closeForm() // Duplicate lifecycle cleanup must not release another modal's lock.
    assert.equal(document.body.style.position, 'fixed')
    closeNested()
    assert.deepEqual(calls.at(-1), { left: 0, top: 0, behavior: 'instant' })
    assert.deepEqual(document.body.style, originalStyle)
    assert.equal(document.documentElement.style.overflow, '')

    scrollAdminToTop() // Non-modal order creation.
    assert.equal(calls.at(-1).top, 0)
    const reopen = lockAdminScroll()
    reopen()
    assert.equal(calls.at(-1).top, 720) // A new modal gets its own original position.
  } finally {
    delete globalThis.window
    delete globalThis.document
  }
})
