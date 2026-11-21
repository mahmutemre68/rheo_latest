// Firebase entry point: callable functions for live duels.
// Logic lives in src/duel.js; this file only wires auth, region and errors.
import { onCall, HttpsError } from 'firebase-functions/https'
import { setGlobalOptions } from 'firebase-functions/v2'
import { initializeApp } from 'firebase-admin/app'
import { getDatabase } from 'firebase-admin/database'
import { readFileSync } from 'node:fs'
import * as duel from './src/duel.js'

setGlobalOptions({ region: process.env.FUNCTIONS_REGION || 'europe-west1', maxInstances: 20 })
initializeApp()
const db = duel.makeAdminDb(getDatabase())
const pool = JSON.parse(readFileSync(new URL('./src/questions.json', import.meta.url), 'utf8'))

function callable(handler) {
    return onCall({ enforceAppCheck: false }, async req => {
        if (!req.auth?.uid) throw new HttpsError('unauthenticated', 'sign in first')
        try {
            return await handler(db, req.auth.uid, req.data || {}, { pool })
        } catch (e) {
            if (e instanceof duel.DuelError) throw new HttpsError(e.code, e.message)
            throw e
        }
    })
}

export const duelJoinQueue = callable(duel.joinQueue)
export const duelLeaveQueue = callable(duel.leaveQueue)
export const duelSubmitAnswer = callable(duel.submitAnswer)
export const duelTick = callable(duel.tick)
export const duelResign = callable(duel.resign)
