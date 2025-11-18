import{eJ as y,eK as m,eL as f,eM as c,eN as g,eO as h,eP as x,eQ as v,dQ as u,eR as b,eS as w,cZ as T,d0 as r,d7 as o,eu as k}from"./index-C2xHxvSk.js";const q=[["path",{d:"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",key:"1kt360"}],["path",{d:"m9.5 10.5 5 5",key:"ra9qjz"}],["path",{d:"m14.5 10.5-5 5",key:"l2rkpq"}]],A=y("folder-x",q);var O=class extends m{#t;#s=void 0;#e;#n;constructor(e,t){super(),this.#t=e,this.setOptions(t),this.bindMethods(),this.#i()}bindMethods(){this.mutate=this.mutate.bind(this),this.reset=this.reset.bind(this)}setOptions(e){const t=this.options;this.options=this.#t.defaultMutationOptions(e),f(this.options,t)||this.#t.getMutationCache().notify({type:"observerOptionsUpdated",mutation:this.#e,observer:this}),t?.mutationKey&&this.options.mutationKey&&c(t.mutationKey)!==c(this.options.mutationKey)?this.reset():this.#e?.state.status==="pending"&&this.#e.setOptions(this.options)}onUnsubscribe(){this.hasListeners()||this.#e?.removeObserver(this)}onMutationUpdate(e){this.#i(),this.#r(e)}getCurrentResult(){return this.#s}reset(){this.#e?.removeObserver(this),this.#e=void 0,this.#i(),this.#r()}mutate(e,t){return this.#n=t,this.#e?.removeObserver(this),this.#e=this.#t.getMutationCache().build(this.#t,this.options),this.#e.addObserver(this),this.#e.execute(e)}#i(){const e=this.#e?.state??g();this.#s={...e,isPending:e.status==="pending",isSuccess:e.status==="success",isError:e.status==="error",isIdle:e.status==="idle",mutate:this.mutate,reset:this.reset}}#r(e){h.batch(()=>{if(this.#n&&this.hasListeners()){const t=this.#s.variables,s=this.#s.context,n={client:this.#t,meta:this.options.meta,mutationKey:this.options.mutationKey};e?.type==="success"?(this.#n.onSuccess?.(e.data,t,s,n),this.#n.onSettled?.(e.data,null,t,s,n)):e?.type==="error"&&(this.#n.onError?.(e.error,t,s,n),this.#n.onSettled?.(void 0,e.error,t,s,n))}this.listeners.forEach(t=>{t(this.#s)})})}};function _(e){return{mutationFn(t){return x(e,t)},mutationKey:["writeContract"]}}function K(e){return e}function C(e,t){const s=v(),[n]=u.useState(()=>new O(s,e));u.useEffect(()=>{n.setOptions(e)},[n,e]);const i=u.useSyncExternalStore(u.useCallback(a=>n.subscribe(h.batchCalls(a)),[n]),()=>n.getCurrentResult(),()=>n.getCurrentResult()),d=u.useCallback((a,p)=>{n.mutate(a,p).catch(b)},[n]);if(i.error&&w(n.options.throwOnError,[i.error]))throw i.error;return{...i,mutate:d,mutateAsync:i.mutate}}function I(e={}){const{mutation:t}=e,s=T(e),n=_(s),{mutate:i,mutateAsync:d,...a}=C({...t,...n});return{...a,writeContract:i,writeContractAsync:d}}class l extends String{__apiType;value;__meta__;constructor(t,s){super(t),this.value=t,this.__meta__=s}toString(){return this.value}}const E=new l(`
    query listedInsuranceTokens {
  insuranceTokens(where: {listedPrice_not: null}) {
    id
    owner
    listedPrice
    processed
    policy {
      id
      flight {
        flightNumber
        flightDate
        settled
        requestedAt
        delay
      }
      payout
      delayThreshold
      expiration
      inventory
      open
      price
    }
  }
}
    `),N=new l(`
    query ownedInsuranceTokens($address: String!) {
  insuranceTokens(where: {owner: $address}) {
    id
    owner
    listedPrice
    processed
    policy {
      id
      flight {
        flightNumber
        flightDate
        settled
        requestedAt
        delay
      }
      payout
      delayThreshold
      expiration
      inventory
      open
      price
    }
  }
}
    `),S=new l(`
    query Policy {
  policies {
    id
    flight {
      id
      flightNumber
      flightDate
      settled
      requestedAt
      delay
    }
    payout
    delayThreshold
    expiration
    inventory
    open
    price
    insuredTokens {
      id
    }
  }
}
    `),j=new l(`
    query OpenPolicy($currentTimestamp: String!) {
  policies(
    where: {expiration_gt: $currentTimestamp, open: true, inventory_gt: "0", flight_: {settled: false, delay: null}}
  ) {
    id
    flight {
      id
      flightNumber
      flightDate
      settled
      requestedAt
      delay
    }
    payout
    delayThreshold
    expiration
    inventory
    open
    price
    insuredTokens {
      id
    }
  }
}
    `),M={"\n  query listedInsuranceTokens {\n    insuranceTokens(where: { listedPrice_not: null }) {\n      id\n      owner\n      listedPrice\n      processed\n      policy {\n        id\n        flight {\n          flightNumber\n          flightDate\n          settled\n          requestedAt\n          delay\n        }\n        payout\n        delayThreshold\n        expiration\n        inventory\n        open\n        price\n      }\n    }\n  }\n":E,"\n  query ownedInsuranceTokens($address: String!) {\n    insuranceTokens(where: { owner: $address }) {\n      id\n      owner\n      listedPrice\n      processed\n      policy {\n        id\n        flight {\n          flightNumber\n          flightDate\n          settled\n          requestedAt\n          delay\n        }\n        payout\n        delayThreshold\n        expiration\n        inventory\n        open\n        price\n      }\n    }\n  }\n":N,"\n  query Policy {\n    policies {\n      id\n      flight {\n        id\n        flightNumber\n        flightDate\n        settled\n        requestedAt\n        delay\n      }\n      payout\n      delayThreshold\n      expiration\n      inventory\n      open\n      price\n      insuredTokens {\n        id\n      }\n    }\n  }\n":S,'\n  query OpenPolicy($currentTimestamp: String!) {\n    policies(\n      where: {\n        expiration_gt: $currentTimestamp\n        open: true\n        inventory_gt: "0"\n        flight_: { settled: false, delay: null }\n      }\n    ) {\n      id\n      flight {\n        id\n        flightNumber\n        flightDate\n        settled\n        requestedAt\n        delay\n      }\n      payout\n      delayThreshold\n      expiration\n      inventory\n      open\n      price\n      insuredTokens {\n        id\n      }\n    }\n  }\n':j};function R(e){return M[e]??{}}async function $(e,t,...[s]){const n=await fetch("https://api.studio.thegraph.com/query/1715692/ftec-5520-project-sepolia/version/latest",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/graphql-response+json"},body:JSON.stringify({query:e,variables:s}),signal:t});if(!n.ok)throw new Error("Network response was not ok");const i=await n.json();if(!i.data)throw new Error("No data in response");return i.data}function L({className:e,...t}){return r.jsx("div",{"data-slot":"empty",className:o("flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12",e),...t})}function z({className:e,...t}){return r.jsx("div",{"data-slot":"empty-header",className:o("flex max-w-sm flex-col items-center gap-2 text-center",e),...t})}const D=k("flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0",{variants:{variant:{default:"bg-transparent",icon:"bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6"}},defaultVariants:{variant:"default"}});function F({className:e,variant:t="default",...s}){return r.jsx("div",{"data-slot":"empty-icon","data-variant":t,className:o(D({variant:t,className:e})),...s})}function Q({className:e,...t}){return r.jsx("div",{"data-slot":"empty-title",className:o("text-lg font-medium tracking-tight",e),...t})}function U({className:e,...t}){return r.jsx("div",{"data-slot":"empty-description",className:o("text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4",e),...t})}function V({className:e,...t}){return r.jsx("div",{"data-slot":"empty-content",className:o("flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance",e),...t})}export{L as E,A as F,z as a,F as b,Q as c,U as d,V as e,C as f,$ as g,R as h,K as q,I as u};
