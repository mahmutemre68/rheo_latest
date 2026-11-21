import{C as j,a as D}from"./vendor-firebase-component-N4ElxnhW.js";import{L as ne,s as re,a as ae}from"./vendor-firebase-logger-o66HKV40.js";import{g as x,E as se,d as R,i as ie,a as oe,b as ce,c as z,e as de,v as fe,F as J}from"./vendor-firebase-util-CmYS7GNi.js";const pe=(e,t)=>t.some(n=>e instanceof n);let L,M;function le(){return L||(L=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function he(){return M||(M=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const W=new WeakMap,$=new WeakMap,K=new WeakMap,v=new WeakMap,O=new WeakMap;function ue(e){const t=new Promise((n,r)=>{const a=()=>{e.removeEventListener("success",s),e.removeEventListener("error",i)},s=()=>{n(l(e.result)),a()},i=()=>{r(e.error),a()};e.addEventListener("success",s),e.addEventListener("error",i)});return t.then(n=>{n instanceof IDBCursor&&W.set(n,e)}).catch(()=>{}),O.set(t,e),t}function me(e){if($.has(e))return;const t=new Promise((n,r)=>{const a=()=>{e.removeEventListener("complete",s),e.removeEventListener("error",i),e.removeEventListener("abort",i)},s=()=>{n(),a()},i=()=>{r(e.error||new DOMException("AbortError","AbortError")),a()};e.addEventListener("complete",s),e.addEventListener("error",i),e.addEventListener("abort",i)});$.set(e,t)}let A={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return $.get(e);if(t==="objectStoreNames")return e.objectStoreNames||K.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return l(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function ge(e){A=e(A)}function be(e){return e===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...n){const r=e.call(S(this),t,...n);return K.set(r,t.sort?t.sort():[t]),l(r)}:he().includes(e)?function(...t){return e.apply(S(this),t),l(W.get(this))}:function(...t){return l(e.apply(S(this),t))}}function we(e){return typeof e=="function"?be(e):(e instanceof IDBTransaction&&me(e),pe(e,le())?new Proxy(e,A):e)}function l(e){if(e instanceof IDBRequest)return ue(e);if(v.has(e))return v.get(e);const t=we(e);return t!==e&&(v.set(e,t),O.set(t,e)),t}const S=e=>O.get(e);function De(e,t,{blocked:n,upgrade:r,blocking:a,terminated:s}={}){const i=indexedDB.open(e,t),c=l(i);return r&&i.addEventListener("upgradeneeded",o=>{r(l(i.result),o.oldVersion,o.newVersion,l(i.transaction),o)}),n&&i.addEventListener("blocked",o=>n(o.oldVersion,o.newVersion,o)),c.then(o=>{s&&o.addEventListener("close",()=>s()),a&&o.addEventListener("versionchange",f=>a(f.oldVersion,f.newVersion,f))}).catch(()=>{}),c}const ye=["get","getKey","getAll","getAllKeys","count"],_e=["put","add","delete","clear"],E=new Map;function k(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(E.get(t))return E.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,a=_e.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(a||ye.includes(n)))return;const s=async function(i,...c){const o=this.transaction(i,a?"readwrite":"readonly");let f=o.store;return r&&(f=f.index(c.shift())),(await Promise.all([f[n](...c),a&&o.done]))[0]};return E.set(t,s),s}ge(e=>({...e,get:(t,n,r)=>k(t,n)||e.get(t,n,r),has:(t,n)=>!!k(t,n)||e.has(t,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ce{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(ve(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function ve(e){const t=e.getComponent();return(t==null?void 0:t.type)==="VERSION"}const y="@firebase/app",T="0.16.7";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const p=new ne("@firebase/app"),Se="@firebase/app-compat",Ee="@firebase/analytics-compat",Ie="@firebase/analytics",$e="@firebase/app-check-compat",Ae="@firebase/app-check",Te="@firebase/auth",Pe="@firebase/auth-compat",Be="@firebase/crashlytics",xe="@firebase/database",Oe="@firebase/data-connect",Re="@firebase/database-compat",Le="@firebase/functions",Me="@firebase/functions-compat",ke="@firebase/installations",Fe="@firebase/installations-compat",Ne="@firebase/messaging",He="@firebase/messaging-compat",Ue="@firebase/performance",Ve="@firebase/performance-compat",je="@firebase/remote-config",ze="@firebase/remote-config-compat",Je="@firebase/storage",We="@firebase/storage-compat",Ke="@firebase/firestore",Ye="@firebase/ai",Ge="@firebase/firestore-compat",Xe="firebase",qe="13.4.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _="[DEFAULT]",Qe={[y]:"fire-core",[Se]:"fire-core-compat",[Ie]:"fire-analytics",[Ee]:"fire-analytics-compat",[Ae]:"fire-app-check",[$e]:"fire-app-check-compat",[Te]:"fire-auth",[Pe]:"fire-auth-compat",[Be]:"fire-cls",[xe]:"fire-rtdb",[Oe]:"fire-data-connect",[Re]:"fire-rtdb-compat",[Le]:"fire-fn",[Me]:"fire-fn-compat",[ke]:"fire-iid",[Fe]:"fire-iid-compat",[Ne]:"fire-fcm",[He]:"fire-fcm-compat",[Ue]:"fire-perf",[Ve]:"fire-perf-compat",[je]:"fire-rc",[ze]:"fire-rc-compat",[Je]:"fire-gcs",[We]:"fire-gcs-compat",[Ke]:"fire-fst",[Ge]:"fire-fst-compat",[Ye]:"fire-vertex","fire-js":"fire-js",[Xe]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const h=new Map,u=new Map,m=new Map;function F(e,t){try{e.container.addComponent(t)}catch(n){p.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function yt(e,t){e.container.addOrOverwriteComponent(t)}function P(e){const t=e.name;if(m.has(t))return p.debug(`There were multiple attempts to register component ${t}.`),!1;m.set(t,e);for(const n of h.values())F(n,e);for(const n of u.values())F(n,e);return!0}function Ze(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}function _t(e,t,n=_){Ze(e,t).clearInstance(n)}function Y(e){return e.options!==void 0}function et(e){return Y(e)?!1:"authIdToken"in e||"appCheckToken"in e||"releaseOnDeref"in e||"automaticDataCollectionEnabled"in e}function Ct(e){return e==null?!1:e.settings!==void 0}function vt(){m.clear()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tt={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},d=new se("app","Firebase",tt);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class G{constructor(t,n,r){this._isDeleted=!1,this._options={...t},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new D("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw d.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function N(e,t){const n=ce(e.split(".")[1]);if(n===null){console.error(`FirebaseServerApp ${t} is invalid: second part could not be parsed.`);return}if(JSON.parse(n).exp===void 0){console.error(`FirebaseServerApp ${t} is invalid: expiration claim could not be parsed`);return}const a=JSON.parse(n).exp*1e3,s=new Date().getTime();a-s<=0&&console.error(`FirebaseServerApp ${t} is invalid: the token has expired.`)}class nt extends G{constructor(t,n,r,a){const s=n.automaticDataCollectionEnabled!==void 0?n.automaticDataCollectionEnabled:!0,i={name:r,automaticDataCollectionEnabled:s};if(t.apiKey!==void 0)super(t,i,a);else{const c=t;super(c.options,i,a)}this._serverConfig={automaticDataCollectionEnabled:s,...n},this._serverConfig.authIdToken&&N(this._serverConfig.authIdToken,"authIdToken"),this._serverConfig.appCheckToken&&N(this._serverConfig.appCheckToken,"appCheckToken"),this._finalizationRegistry=null,typeof FinalizationRegistry<"u"&&(this._finalizationRegistry=new FinalizationRegistry(()=>{this.automaticCleanup()})),this._refCount=0,this.incRefCount(this._serverConfig.releaseOnDeref),this._serverConfig.releaseOnDeref=void 0,n.releaseOnDeref=void 0,w(y,T,"serverapp")}toJSON(){}get refCount(){return this._refCount}incRefCount(t){this.isDeleted||(this._refCount++,t!==void 0&&this._finalizationRegistry!==null&&this._finalizationRegistry.register(t,this))}decRefCount(){return this.isDeleted?0:--this._refCount}automaticCleanup(){this.isDeleted||at(this)}get settings(){return this.checkDestroyed(),this._serverConfig}checkDestroyed(){if(this.isDeleted)throw d.create("server-app-deleted")}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const St=qe;function rt(e,t={}){let n=e;typeof t!="object"&&(t={name:t});const r={name:_,automaticDataCollectionEnabled:!0,...t},a=r.name;if(typeof a!="string"||!a)throw d.create("bad-app-name",{appName:String(a)});if(n||(n=x()),!n)throw d.create("no-options");const s=h.get(a);if(s)if(R(n,s.options)){if(R(r,s.config))return s;throw d.create("duplicate-app",{appName:a,mismatchedParam:"config",oldValue:JSON.stringify(s.config),newValue:JSON.stringify(r)})}else throw d.create("duplicate-app",{appName:a,mismatchedParam:"options",oldValue:JSON.stringify(s.options),newValue:JSON.stringify(n)});const i=new j(a);for(const o of m.values())i.addComponent(o);const c=new G(n,r,i);return h.set(a,c),c}function Et(e,t={}){if(ie()&&!oe())throw d.create("invalid-server-app-environment");let n,r=t||{};if(e&&(Y(e)?n=e.options:et(e)?r=e:n=e),r.automaticDataCollectionEnabled===void 0&&(r.automaticDataCollectionEnabled=!0),n||(n=x()),!n)throw d.create("no-options");const a={...r,...n};a.releaseOnDeref!==void 0&&delete a.releaseOnDeref;const s=C=>[...C].reduce((ee,te)=>Math.imul(31,ee)+te.charCodeAt(0)|0,0);if(r.releaseOnDeref!==void 0&&typeof FinalizationRegistry>"u")throw d.create("finalization-registry-not-supported",{});const i=""+s(JSON.stringify(a)),c=u.get(i);if(c)return c.incRefCount(r.releaseOnDeref),c;const o=new j(i);for(const C of m.values())o.addComponent(C);const f=new nt(n,r,i,o);return u.set(i,f),f}function It(e=_){const t=h.get(e);if(!t&&e===_&&x())return rt();if(!t)throw d.create("no-app",{appName:e});return t}function $t(){return Array.from(h.values())}async function at(e){let t=!1;const n=e.name;h.has(n)?(t=!0,h.delete(n)):u.has(n)&&e.decRefCount()<=0&&(u.delete(n),t=!0),t&&(await Promise.all(e.container.getProviders().map(r=>r.delete())),e.isDeleted=!0)}function w(e,t,n){let r=Qe[e]??e;n&&(r+=`-${n}`);const a=r.match(/\s|\//),s=t.match(/\s|\//);if(a||s){const i=[`Unable to register library "${r}" with version "${t}":`];a&&i.push(`library name "${r}" contains illegal characters (whitespace or "/")`),a&&s&&i.push("and"),s&&i.push(`version name "${t}" contains illegal characters (whitespace or "/")`),p.warn(i.join(" "));return}P(new D(`${r}-version`,()=>({library:r,version:t}),"VERSION"))}function At(e,t){if(e!==null&&typeof e!="function")throw d.create("invalid-log-argument");re(e,t)}function Tt(e){ae(e)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const st="firebase-heartbeat-database",it=1,g="firebase-heartbeat-store";let I=null;function X(){return I||(I=De(st,it,{upgrade:(e,t)=>{switch(t){case 0:try{e.createObjectStore(g)}catch(n){console.warn(n)}}}}).catch(e=>{throw d.create("idb-open",{originalErrorMessage:e.message})})),I}async function ot(e){try{const n=(await X()).transaction(g),r=await n.objectStore(g).get(q(e));return await n.done,r}catch(t){if(t instanceof J)p.warn(t.message);else{const n=d.create("idb-get",{originalErrorMessage:t==null?void 0:t.message});p.warn(n.message)}}}async function H(e,t){try{const r=(await X()).transaction(g,"readwrite");await r.objectStore(g).put(t,q(e)),await r.done}catch(n){if(n instanceof J)p.warn(n.message);else{const r=d.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});p.warn(r.message)}}}function q(e){return`${e.name}!${e.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ct=1024,dt=30;class ft{constructor(t){this.container=t,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new lt(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var t,n;try{const a=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=U();if(((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(i=>i.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:a}),this._heartbeatsCache.heartbeats.length>dt){const i=ht(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(i,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){p.warn(r)}}async getHeartbeatsHeader(){var t;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=U(),{heartbeatsToSend:r,unsentEntries:a}=pt(this._heartbeatsCache.heartbeats),s=z(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,a.length>0?(this._heartbeatsCache.heartbeats=a,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return p.warn(n),""}}}function U(){return new Date().toISOString().substring(0,10)}function pt(e,t=ct){const n=[];let r=e.slice();for(const a of e){const s=n.find(i=>i.agent===a.agent);if(s){if(s.dates.push(a.date),V(n)>t){s.dates.pop();break}}else if(n.push({agent:a.agent,dates:[a.date]}),V(n)>t){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class lt{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return de()?fe().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await ot(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){if(await this._canUseIndexedDBPromise){const r=await this.read();return H(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){if(await this._canUseIndexedDBPromise){const r=await this.read();return H(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...t.heartbeats]})}else return}}function V(e){return z(JSON.stringify({version:2,heartbeats:e})).length}function ht(e){if(e.length===0)return-1;let t=0,n=e[0].date;for(let r=1;r<e.length;r++)e[r].date<n&&(n=e[r].date,t=r);return t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ut(e){P(new D("platform-logger",t=>new Ce(t),"PRIVATE")),P(new D("heartbeat",t=>new ft(t),"PRIVATE")),w(y,T,e),w(y,T,"esm2020"),w("fire-js","")}/**
 * @license
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const B="firebase-js-sdk-policy",mt=["https://www.googletagmanager.com/gtag/js","https://apis.google.com/js/api.js","https://www.google.com/recaptcha/api.js","https://www.google.com/recaptcha/enterprise.js"];let b,Q=!1;function Z(e){if(!mt.some(n=>e.startsWith(n)&&(e.length===n.length||e.charAt(n.length)==="?")))throw new TypeError(`Firebase: Refusing to load untrusted script URL: ${e}`);return e}function gt(){if(b===void 0){b=null;const e=typeof window<"u"?window.trustedTypes:void 0;if(e!=null&&e.createPolicy)try{b=e.createPolicy(B,{createScriptURL:Z})}catch{Q=!0}}return b}function Pt(e,t){Z(t);const n=gt();if(n){e.src=n.createScriptURL(t);return}try{e.src=t}catch(r){throw Q&&p.error(`Unable to load ${t} because this page requires Trusted Types for scripts but does not allow the "${B}" Trusted Types policy. To fix this, add "${B}" to the trusted-types directive of the page's Content-Security-Policy.`),r}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ut("");export{_ as D,St as S,F as _,yt as a,h as b,vt as c,m as d,Ze as e,Y as f,Ct as g,et as h,P as i,_t as j,u as k,Pt as l,at as m,It as n,$t as o,rt as p,Et as q,w as r,At as s,Tt as t};
