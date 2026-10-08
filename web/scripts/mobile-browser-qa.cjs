const assert = require('node:assert/strict')
const { chromium } = require('playwright')

const base = process.env.RHEO_QA_URL || 'http://127.0.0.1:4173/qa-mobile.html'
const viewports = [
  { width: 320, height: 568, name: '320x568' },
  { width: 375, height: 667, name: '375x667' },
  { width: 390, height: 844, name: '390x844' },
]

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const results = []
  try {
    for (const locale of ['en', 'tr']) {
      for (const viewport of viewports) {
        const page = await browser.newPage({ viewport })
        await page.emulateMedia({ reducedMotion: 'reduce' })
        const errors = []
        page.on('pageerror', error => errors.push(error.message))
        await page.goto(`${base}?locale=${locale}&language=python`, { waitUntil: 'networkidle' })
        await page.getByRole('dialog').waitFor()

        const geometry = await page.evaluate(() => {
          const buttons = [...document.querySelectorAll('button')]
            .filter(button => button.getClientRects().length)
            .map(button => {
              const rect = button.getBoundingClientRect()
              return { label: button.textContent.trim(), width: rect.width, height: rect.height }
            })
          const mascot = document.querySelector('img')
          return {
            documentWidth: document.documentElement.scrollWidth,
            viewportWidth: document.documentElement.clientWidth,
            statusCount: document.querySelectorAll('[role="status"]').length,
            mascotPath: mascot?.getAttribute('src'),
            mascotHidden: mascot?.parentElement?.getAttribute('aria-hidden'),
            buttons,
          }
        })

        assert.ok(geometry.documentWidth <= geometry.viewportWidth, `${locale}/${viewport.name}: page overflow`)
        assert.equal(geometry.statusCount, 1, `${locale}/${viewport.name}: status region count`)
        assert.ok(geometry.mascotPath?.endsWith('/mascot_happy.png'), `${locale}/${viewport.name}: mascot path`)
        assert.equal(geometry.mascotHidden, 'true', `${locale}/${viewport.name}: decorative mascot semantics`)
        for (const target of geometry.buttons) {
          assert.ok(target.width >= 24 && target.height >= 24, `${locale}/${viewport.name}: small target ${target.label} ${target.width}x${target.height}`)
        }
        const tr = locale === 'tr'
        await page.getByRole('button', { name: tr ? 'Satır 2' : 'Line 2' }).click()
        await page.getByRole('button', { name: tr ? 'Koşul score = 4 değerini dışlıyor.' : 'The condition excludes score = 4.' }).click()
        await page.getByRole('button', { name: '>=' }).click()
        await page.getByRole('button', { name: tr ? 'Durumları doğrula' : 'Verify cases' }).click()
        const finalGeometry = await page.evaluate(() => ({
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth,
          rowCount: document.querySelectorAll('tbody tr').length,
          finalButton: (() => {
            const button = [...document.querySelectorAll('button')].at(-1)
            const rect = button.getBoundingClientRect()
            return { label: button.textContent.trim(), width: rect.width, height: rect.height }
          })(),
        }))
        assert.ok(finalGeometry.documentWidth <= finalGeometry.viewportWidth, `${locale}/${viewport.name}: final stage overflow`)
        assert.equal(finalGeometry.rowCount, 3, `${locale}/${viewport.name}: boundary table`)
        assert.ok(finalGeometry.finalButton.width >= 24 && finalGeometry.finalButton.height >= 24, `${locale}/${viewport.name}: final target`)
        assert.deepEqual(errors, [], `${locale}/${viewport.name}: browser errors`)
        results.push({ locale, viewport: viewport.name, ...geometry, finalGeometry })
        await page.close()
      }
    }

    const keyboard = await browser.newPage({ viewport: viewports[0] })
    await keyboard.goto(`${base}?locale=en&language=python`, { waitUntil: 'networkidle' })
    await keyboard.getByRole('heading', { name: 'Find it. Explain it. Verify it.' }).focus()
    await keyboard.keyboard.press('Shift+Tab')
    assert.equal(await keyboard.locator(':focus').textContent(), 'Line 5')
    await keyboard.keyboard.press('Tab')
    assert.equal(await keyboard.locator(':focus').textContent(), 'Exit practice')
    await keyboard.keyboard.press('Escape')
    assert.equal(await keyboard.evaluate(() => window.__closed), true)
    await keyboard.close()

    console.log(JSON.stringify({ passed: true, browser: await browser.version(), results }, null, 2))
  } finally {
    await browser.close()
  }
})().catch(error => {
  console.error(error)
  process.exit(1)
})
