const { buildSync } = require('esbuild')
const { JSDOM } = require('jsdom')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')

// Real component, with isolated reward persistence and presentation-only stubs.
async function run() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rheo-daily-'))
  try {
    const source = fs.readFileSync('src/components/DailyReward.jsx', 'utf8')
      .replace("from '../data'", "from './data-stub.js'")
      .replace("from './XPToast'", "from './xp-stub.js'")
      .replace("from '../nativeBridge'", "from './native-stub.js'")
      .replace("from '../data/dailyRewardState.js'", `from ${JSON.stringify(path.resolve('src/data/dailyRewardState.js'))}`)
    fs.writeFileSync(path.join(tmp, 'component.jsx'), source)
    fs.writeFileSync(path.join(tmp, 'data-stub.js'), `export const stats = globalThis.__dailyStats; export const t = s => s; export const saveProgress = () => globalThis.__dailySaves++; export const addXP = n => stats.xp += n; export const isHapticEnabled = () => false;`)
    fs.writeFileSync(path.join(tmp, 'xp-stub.js'), 'export const showXP = () => {};')
    fs.writeFileSync(path.join(tmp, 'native-stub.js'), 'export const haptic = () => {};')
    fs.writeFileSync(path.join(tmp, 'motion.js'), `import React from 'react'; export const AnimatePresence = ({children}) => children; export const motion = new Proxy({}, {get: (_, tag) => ({children, initial, animate, exit, transition, whileTap, ...props}) => React.createElement(tag, props, children)});`)
    buildSync({entryPoints:[path.join(tmp, 'component.jsx')], outfile:path.join(tmp, 'component.cjs'), bundle:true, platform:'node', format:'cjs', jsx:'automatic', external:['react','react/jsx-runtime'], alias:{'framer-motion':path.join(tmp,'motion.js')}, nodePaths:[path.resolve('node_modules')]})
    const dom = new JSDOM('<div id="root"></div>', {url:'https://qa.example/'})
    global.window = dom.window; global.document = dom.window.document
    global.localStorage = dom.window.localStorage
    global.IS_REACT_ACT_ENVIRONMENT = true
    global.__dailyStats = {gems:0, energy:0, xp:0}; global.__dailySaves = 0
    const React = require('react'); const {createRoot} = require('react-dom/client')
    // Let the temporary bundle resolve the project's React dependency.
    const Module = require('node:module'); const oldPaths = Module.globalPaths.slice()
    process.env.NODE_PATH = path.resolve('node_modules'); Module._initPaths()
    const DailyReward = require(path.join(tmp, 'component.cjs')).default
    const root = createRoot(document.getElementById('root'))
    localStorage.setItem('rheo_daily_state', JSON.stringify({currentDay:99,lastClaimDate:new Date(Date.now()-86400000).toDateString()}))
    await React.act(async () => root.render(React.createElement(DailyReward,{onClose:()=>{}})))
    const button = [...document.querySelectorAll('button')].find(b => b.textContent.includes('COLLECT REWARD'))
    assert.ok(button, 'Malformed state must still offer a safe reward')
    await React.act(async () => {
      button.dispatchEvent(new window.MouseEvent('click',{bubbles:true}))
      button.dispatchEvent(new window.MouseEvent('click',{bubbles:true}))
    })
    assert.equal(global.__dailyStats.gems,10, 'Two same-turn clicks must award once')
    assert.equal(global.__dailySaves,1)
    assert.equal(JSON.parse(localStorage.getItem('rheo_daily_state')).currentDay,2)
    await React.act(async () => root.unmount())
    const again = createRoot(document.getElementById('root'))
    await React.act(async () => again.render(React.createElement(DailyReward,{onClose:()=>{}})))
    assert.equal(global.__dailyStats.gems,10)
    assert.equal([...document.querySelectorAll('button')].some(b => !b.disabled && b.textContent.includes('COLLECT REWARD')),false,'Same-day remount cannot claim again')
    await React.act(async () => again.unmount())
    Module.globalPaths = oldPaths
    console.log('Mounted component: malformed day recovery, same-turn double click and same-day reopen passed')
  } finally { fs.rmSync(tmp,{recursive:true,force:true}) }
}
run().catch(error => {console.error(error);process.exitCode=1})
