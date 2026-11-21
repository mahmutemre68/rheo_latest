/**
 * @license
 * Copyright 2017 Google LLC
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
 */const i=[];var t;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(t||(t={}));const a={debug:t.DEBUG,verbose:t.VERBOSE,info:t.INFO,warn:t.WARN,error:t.ERROR,silent:t.SILENT},g=t.INFO,E={[t.DEBUG]:"log",[t.VERBOSE]:"log",[t.INFO]:"info",[t.WARN]:"warn",[t.ERROR]:"error"},f=(n,e,...o)=>{if(e<n.logLevel)return;const l=new Date().toISOString(),s=E[e];if(s)console[s](`[${l}]  ${n.name}:`,...o);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class R{constructor(e){this.name=e,this._logLevel=g,this._logHandler=f,this._userLogHandler=null,i.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in t))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?a[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,t.DEBUG,...e),this._logHandler(this,t.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,t.VERBOSE,...e),this._logHandler(this,t.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,t.INFO,...e),this._logHandler(this,t.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,t.WARN,...e),this._logHandler(this,t.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,t.ERROR,...e),this._logHandler(this,t.ERROR,...e)}}function _(n){i.forEach(e=>{e.setLogLevel(n)})}function L(n,e){for(const o of i){let l=null;e&&e.level&&(l=a[e.level]),n===null?o.userLogHandler=null:o.userLogHandler=(s,u,...h)=>{const d=h.map(r=>{if(r==null)return null;if(typeof r=="string")return r;if(typeof r=="number"||typeof r=="boolean")return r.toString();if(r instanceof Error)return r.message;try{return JSON.stringify(r)}catch{return null}}).filter(r=>r).join(" ");u>=(l??s.logLevel)&&n({level:t[u].toLowerCase(),message:d,args:h,type:s.name})}}}export{R as L,_ as a,t as b,L as s};
