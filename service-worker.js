if(!self.define){let e,s={};const i=(i,r)=>(i=new URL(i+".js",r).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(r,o)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let l={};const t=e=>i(e,n),c={module:{uri:n},exports:l,require:t};s[n]=Promise.all(r.map((e=>c[e]||t(e)))).then((e=>(o(...e),l)))}}define(["./workbox-79ffe3e0"],(function(e){"use strict";e.setCacheNameDetails({prefix:"sgk-schedule"}),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"/web_v2/css/app.baa93d9a.css",revision:null},{url:"/web_v2/github-logo.svg",revision:"5acbc10c75b63a9685828f208bbb7d5b"},{url:"/web_v2/img/github-logo.a3a02551.svg",revision:null},{url:"/web_v2/index.html",revision:"67ec56df3ca6f47f093c9200861fc2ff"},{url:"/web_v2/js/app.256b0724.js",revision:null},{url:"/web_v2/js/chunk-vendors.445a245b.js",revision:null},{url:"/web_v2/manifest.json",revision:"6f9ede031247650e6be87384edc94337"},{url:"/web_v2/robots.txt",revision:"b6216d61c03e6ce0c9aea6ca7808f7ca"}],{})}));
//# sourceMappingURL=service-worker.js.map
