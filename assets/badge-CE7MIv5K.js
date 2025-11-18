import{eo as R,cZ as I,ea as d,e6 as y,c_ as h,d4 as o,e8 as g,e7 as T,e9 as c,d0 as a,d6 as q,cV as w,ep as N,e5 as f,eq as Q,er as K,es as S,et as B}from"./index-CxSkHIcN.js";import{C as A,a as M,b as k,d as O,c as H,e as E}from"./card-ClZIoZm-.js";import{f as u,q as m,g as C,u as p,h as F}from"./empty-icUEEQM8.js";function _(e){return{mutationFn(i){return R(e,i)},mutationKey:["sendTransaction"]}}function V(e={}){const{mutation:i}=e,s=I(e),t=_(s),{mutate:n,mutateAsync:l,...v}=u({...i,...t});return{...v,sendTransaction:n,sendTransactionAsync:l}}const U=F(`
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
`),W=F(`
  query OpenPolicy($currentTimestamp: String!) {
    policies(
      where: { expiration_gt: $currentTimestamp, open: true, inventory_gt: "0" }
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
`),ee=()=>m({queryKey:d.all(),queryFn:({signal:e})=>C(U,e)}),te=()=>m({queryKey:d.all(),queryFn:({signal:e})=>C(W,e,{currentTimestamp:Math.floor(Date.now()/1e3).toString()})}),$=()=>{const{showTransactionDialog:e}=y(),{writeContractAsync:i}=p(),s=h();return u({mutationFn:async t=>{const n=await i({abi:o.abi,address:o.address,functionName:"purchaseInsurance",args:[t.policyId],value:t.price});return e(n),s?.waitForTransactionReceipt({hash:n,confirmations:g})},onSuccess(...t){const n=t[3].client;n.invalidateQueries({queryKey:T.all()}),n.invalidateQueries({queryKey:d.all()}),n.invalidateQueries({queryKey:c.requiredReserve()}),n.invalidateQueries({queryKey:c.insuranceContractBalance()})}})},z=()=>{const{showTransactionDialog:e}=y(),{writeContractAsync:i}=p(),s=h();return u({mutationFn:async t=>{const n=await i({abi:o.abi,address:o.address,functionName:t.active?"activatePolicy":"deactivatePolicy",args:[t.policyId]});return e(n),s?.waitForTransactionReceipt({hash:n,confirmations:g})},onSuccess(...t){t[3].client.invalidateQueries({queryKey:d.all()})}})},Y=()=>{const{showTransactionDialog:e}=y(),{writeContractAsync:i}=p(),s=h();return u({mutationFn:async t=>{const n=await i({abi:o.abi,address:o.address,functionName:"settleFlight",args:[t]});return e(n),s?.waitForTransactionReceipt({hash:n,confirmations:g})},onSuccess(...t){const n=t[3].client;n.invalidateQueries({queryKey:d.all()}),n.invalidateQueries({queryKey:T.all()}),n.invalidateQueries({queryKey:c.requiredReserve()}),n.invalidateQueries({queryKey:c.insuranceContractBalance()})}})},Z=()=>{const{showTransactionDialog:e}=y(),{writeContractAsync:i}=p(),s=h();return u({mutationFn:async({flightNumber:t,flightDate:n})=>{const l=await i({abi:o.abi,address:o.address,functionName:"requestFlightDataByFlight",args:[t,n]});return e(l),s?.waitForTransactionReceipt({hash:l,confirmations:g})},onSuccess(...t){t[3].client.invalidateQueries({queryKey:d.all()})}})},ne=()=>{const{showTransactionDialog:e}=y(),{writeContractAsync:i}=p(),s=h();return u({mutationFn:async t=>{const n=await i({abi:o.abi,address:o.address,functionName:"createPolicy",args:[t.flightNumber,t.flightDate,t.delayThreshold,t.expirationTs,t.payout,t.inventory,t.price,t.open]});return e(n),s?.waitForTransactionReceipt({hash:n,confirmations:g})},onSuccess(...t){t[3].client.invalidateQueries({queryKey:d.all()})}})},ae=({policy:e,className:i,isAdmin:s,...t})=>{const n=$(),l=z(),v=Y(),b=Z(),r=e.flight,D=Number(e.expiration)<Date.now()/1e3,j=r.delay?r.delay>=e.delayThreshold?"Delayed":"On Time":r.requestedAt?"Delay Info Requested":"Awaiting Data Request",x=t.availableReserve!==void 0&&BigInt(e.payout)<=t.availableReserve,P=e.open&&!D&&Number(e.inventory)>0&&!n.isPending&&x;return a.jsxs(A,{...t,className:q("min-w-96 shadow-xl",i),children:[a.jsxs(M,{children:[a.jsx(k,{children:a.jsxs("div",{className:"flex justify-between",children:[a.jsx("p",{children:r.flightNumber}),a.jsx("p",{children:r.flightDate})]})}),a.jsx(O,{children:a.jsxs("p",{children:["Policy ID: ",e.id]})})]}),a.jsxs(H,{children:[a.jsxs("p",{children:["Status: ",j]}),a.jsxs("p",{children:["Open for Sale : ",e.open?"Yes":"No"]}),a.jsxs("p",{children:["Delay Threshold: ",e.delayThreshold," minutes"]}),r.delay&&a.jsxs("p",{children:["Actual Delay: ",r.delay," minutes"]}),a.jsxs("p",{children:["Payout: ",w(BigInt(e.payout))," ETH"]}),a.jsxs("p",{children:["Price: ",w(BigInt(e.price))," ETH"]}),a.jsxs("p",{children:["Inventory: ",e.inventory," tokens"]}),a.jsxs("p",{children:["Sold: ",e.insuredTokens.length," tokens"]}),a.jsxs("p",{children:["Expiration: ",N.format(new Date(Number(e.expiration)*1e3))]})]}),a.jsxs(E,{className:" mt-auto justify-end gap-4",children:[!s&&a.jsx(f,{disabled:!P,onClick:()=>{n.mutate({policyId:BigInt(e.id),price:BigInt(e.price)})},children:x?"Purchase":"Insufficient Reserve"}),s&&a.jsx(f,{disabled:l.isPending,onClick:()=>{l.mutate({policyId:BigInt(e.id),active:!e.open})},children:e.open?"Deactivate Policy":"Activate Policy"}),s&&!r.settled&&a.jsx(f,{disabled:v.isPending||b.isPending,onClick:()=>{r.delay!==null?v.mutate(r.id):b.mutate({flightNumber:r.flightNumber,flightDate:r.flightDate})},children:r.delay?"Settle Flight":r.requestedAt?"Awaiting Delay Info":"Request Delay Info"})]})]})},ie=e=>m({queryKey:c.insuranceContractBalance(),queryFn:async()=>await e?.getBalance({address:o.address})??0n,enabled:!!e}),se=e=>Q(e,K),re=()=>{const{showTransactionDialog:e}=y(),{sendTransactionAsync:i}=V(),s=h();return u({mutationFn:async t=>{const n=await i({to:o.address,value:t});return e(n),s?.waitForTransactionReceipt({hash:n,confirmations:g})},onSuccess(...t){t[3].client.invalidateQueries({queryKey:c.insuranceContractBalance()})}})},oe=()=>{const{showTransactionDialog:e}=y(),{writeContractAsync:i}=p(),s=h();return u({mutationFn:async t=>{const n=await i({address:o.address,abi:o.abi,functionName:"withdraw",args:[t]});return e(n),s?.waitForTransactionReceipt({hash:n,confirmations:g})},onSuccess(...t){const n=t[3].client;n.invalidateQueries({queryKey:c.insuranceContractBalance()}),n.invalidateQueries({queryKey:c.requiredReserve()})}})},G=B("inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",secondary:"border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",destructive:"border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",outline:"text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"}},defaultVariants:{variant:"default"}});function ce({className:e,variant:i,asChild:s=!1,...t}){const n=s?S:"span";return a.jsx(n,{"data-slot":"badge",className:q(G({variant:i}),e),...t})}export{ce as B,ae as P,ne as a,oe as b,ie as i,te as o,ee as p,se as r,re as u};
