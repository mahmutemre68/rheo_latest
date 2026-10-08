import assert from 'node:assert/strict'
import { share, SHARE_URL } from '../src/nativeBridge.js'
assert.equal(SHARE_URL, 'https://apps.apple.com/app/id6799256948')
let native
 globalThis.window = { RheoNative: {postMessage: msg => { native = JSON.parse(msg) }} }
assert.equal(await share('Practice code', SHARE_URL), true)
assert.equal(native.url, SHARE_URL)
globalThis.window = {}
let browser
Object.defineProperty(globalThis, 'navigator', {configurable:true,value:{share: async payload => { browser = payload }}})
assert.equal(await share('Practice code', SHARE_URL), true)
assert.equal(browser.url, SHARE_URL)
let copied
Object.defineProperty(globalThis, 'navigator', {configurable:true,value:{clipboard:{writeText:async text => {copied = text}}}})
assert.equal(await share('Practice code', SHARE_URL), 'copied')
assert.equal(copied, `Practice code ${SHARE_URL}`)
console.log('Native message, browser share and clipboard target checks passed; no OS/device claim')
