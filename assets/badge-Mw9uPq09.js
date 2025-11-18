import{ep as R,cZ as I,eb as d,e7 as y,c_ as h,d4 as o,e9 as g,e8 as q,ea as c,d0 as a,d7 as C,cV as T,eq as N,e6 as v,er as Q,es as K,et as S,eu as B}from"./index-C2xHxvSk.js";import{C as A,a as M,b as k,d as O,c as H,e as E}from"./card-Dc43BtTL.js";import{f as u,q as m,g as F,u as p,h as D}from"./empty-BoVE9_UM.js";function _(e){return{mutationFn(s){return R(e,s)},mutationKey:["sendTransaction"]}}function V(e={}){const{mutation:s}=e,i=I(e),t=_(i),{mutate:n,mutateAsync:l,...f}=u({...s,...t});return{...f,sendTransaction:n,sendTransactionAsync:l}}const U=D(`
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
`),W=D(`
  query OpenPolicy($currentTimestamp: String!) {
    policies(
      where: {
        expiration_gt: $currentTimestamp
        open: true
        inventory_gt: "0"
        flight_: { settled: false, delay: null }
      }
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
`),ee=()=>m({queryKey:d.all(),queryFn:({signal:e})=>F(U,e)}),te=()=>m({queryKey:d.all(),queryFn:({signal:e})=>F(W,e,{currentTimestamp:Math.floor(Date.now()/1e3).toString()})}),$=()=>{const{showTransactionDialog:e}=y(),{writeContractAsync:s}=p(),i=h();return u({mutationFn:async t=>{const n=await s({abi:o.abi,address:o.address,functionName:"purchaseInsurance",args:[t.policyId],value:t.price});return e(n),i?.waitForTransactionReceipt({hash:n,confirmations:g})},onSuccess(...t){const n=t[3].client;n.invalidateQueries({queryKey:q.all()}),n.invalidateQueries({queryKey:d.all()}),n.invalidateQueries({queryKey:c.requiredReserve()}),n.invalidateQueries({queryKey:c.insuranceContractBalance()})}})},z=()=>{const{showTransactionDialog:e}=y(),{writeContractAsync:s}=p(),i=h();return u({mutationFn:async t=>{const n=await s({abi:o.abi,address:o.address,functionName:t.active?"activatePolicy":"deactivatePolicy",args:[t.policyId]});return e(n),i?.waitForTransactionReceipt({hash:n,confirmations:g})},onSuccess(...t){t[3].client.invalidateQueries({queryKey:d.all()})}})},Y=()=>{const{showTransactionDialog:e}=y(),{writeContractAsync:s}=p(),i=h();return u({mutationFn:async t=>{const n=await s({abi:o.abi,address:o.address,functionName:"settleFlight",args:[t]});return e(n),i?.waitForTransactionReceipt({hash:n,confirmations:g})},onSuccess(...t){const n=t[3].client;n.invalidateQueries({queryKey:d.all()}),n.invalidateQueries({queryKey:q.all()}),n.invalidateQueries({queryKey:c.requiredReserve()}),n.invalidateQueries({queryKey:c.insuranceContractBalance()})}})},Z=()=>{const{showTransactionDialog:e}=y(),{writeContractAsync:s}=p(),i=h();return u({mutationFn:async({flightNumber:t,flightDate:n})=>{const l=await s({abi:o.abi,address:o.address,functionName:"requestFlightDataByFlight",args:[t,n]});return e(l),i?.waitForTransactionReceipt({hash:l,confirmations:g})},onSuccess(...t){t[3].client.invalidateQueries({queryKey:d.all()})}})},ne=()=>{const{showTransactionDialog:e}=y(),{writeContractAsync:s}=p(),i=h();return u({mutationFn:async t=>{const n=await s({abi:o.abi,address:o.address,functionName:"createPolicy",args:[t.flightNumber,t.flightDate,t.delayThreshold,t.expirationTs,t.payout,t.inventory,t.price,t.open]});return e(n),i?.waitForTransactionReceipt({hash:n,confirmations:g})},onSuccess(...t){t[3].client.invalidateQueries({queryKey:d.all()})}})},ae=({policy:e,className:s,isAdmin:i,...t})=>{const n=$(),l=z(),f=Y(),b=Z(),r=e.flight,x=Number(e.expiration)<Date.now()/1e3,P=r.delay?r.delay>=e.delayThreshold?"Delayed":"On Time":r.requestedAt?"Delay Info Requested":"Awaiting Data Request",w=t.availableReserve!==void 0&&BigInt(e.payout)<=t.availableReserve,j=e.open&&!x&&r.settled===!1&&r.delay===null&&Number(e.inventory)>0&&!n.isPending&&w;return a.jsxs(A,{...t,className:C("min-w-96 shadow-xl",s),children:[a.jsxs(M,{children:[a.jsx(k,{children:a.jsxs("div",{className:"flex justify-between",children:[a.jsx("p",{children:r.flightNumber}),a.jsx("p",{children:r.flightDate})]})}),a.jsx(O,{children:a.jsxs("p",{children:["Policy ID: ",e.id]})})]}),a.jsxs(H,{children:[a.jsxs("p",{children:["Status: ",P]}),a.jsxs("p",{children:["Open for Sale : ",e.open?"Yes":"No"]}),a.jsxs("p",{children:["Delay Threshold: ",e.delayThreshold," minutes"]}),r.delay&&a.jsxs("p",{children:["Actual Delay: ",r.delay," minutes"]}),a.jsxs("p",{children:["Payout: ",T(BigInt(e.payout))," ETH"]}),a.jsxs("p",{children:["Price: ",T(BigInt(e.price))," ETH"]}),a.jsxs("p",{children:["Inventory: ",e.inventory," tokens"]}),a.jsxs("p",{children:["Sold: ",e.insuredTokens.length," tokens"]}),a.jsxs("p",{children:["Expiration: ",N.format(new Date(Number(e.expiration)*1e3))]})]}),a.jsxs(E,{className:" mt-auto justify-end gap-4",children:[!i&&a.jsx(v,{disabled:!j,onClick:()=>{n.mutate({policyId:BigInt(e.id),price:BigInt(e.price)})},children:r.settled||r.delay!==null?"Flight Processed":x?"Policy Expired":e.open?w?Number(e.inventory)>0?"Purchase":"Sold Out":"Insufficient Reserve":"Policy Closed"}),i&&a.jsx(v,{disabled:l.isPending,onClick:()=>{l.mutate({policyId:BigInt(e.id),active:!e.open})},children:e.open?"Deactivate Policy":"Activate Policy"}),i&&!r.settled&&a.jsx(v,{disabled:f.isPending||b.isPending,onClick:()=>{r.delay!==null?f.mutate(r.id):b.mutate({flightNumber:r.flightNumber,flightDate:r.flightDate})},children:r.delay?"Settle Flight":r.requestedAt?"Awaiting Delay Info":"Request Delay Info"})]})]})},se=e=>m({queryKey:c.insuranceContractBalance(),queryFn:async()=>await e?.getBalance({address:o.address})??0n,enabled:!!e}),ie=e=>Q(e,K),re=()=>{const{showTransactionDialog:e}=y(),{sendTransactionAsync:s}=V(),i=h();return u({mutationFn:async t=>{const n=await s({to:o.address,value:t});return e(n),i?.waitForTransactionReceipt({hash:n,confirmations:g})},onSuccess(...t){t[3].client.invalidateQueries({queryKey:c.insuranceContractBalance()})}})},oe=()=>{const{showTransactionDialog:e}=y(),{writeContractAsync:s}=p(),i=h();return u({mutationFn:async t=>{const n=await s({address:o.address,abi:o.abi,functionName:"withdraw",args:[t]});return e(n),i?.waitForTransactionReceipt({hash:n,confirmations:g})},onSuccess(...t){const n=t[3].client;n.invalidateQueries({queryKey:c.insuranceContractBalance()}),n.invalidateQueries({queryKey:c.requiredReserve()})}})},G=B("inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",secondary:"border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",destructive:"border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",outline:"text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"}},defaultVariants:{variant:"default"}});function ce({className:e,variant:s,asChild:i=!1,...t}){const n=i?S:"span";return a.jsx(n,{"data-slot":"badge",className:C(G({variant:s}),e),...t})}export{ce as B,ae as P,ne as a,oe as b,se as i,te as o,ee as p,ie as r,re as u};
