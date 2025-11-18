import{e6 as u,c_ as h,e7 as c,d4 as r,e8 as y,e9 as q,ea as Q,dP as F,d5 as k,d0 as s,d6 as O,eb as E,d3 as S,cV as N,e5 as o,ec as H,ed as L,ee as _,ef as U,eg as W,eh as $,ei as V,ej as Y}from"./index-CxSkHIcN.js";import{C as z,a as G,b as J,d as X,c as Z,e as ee}from"./card-ClZIoZm-.js";import{L as se,I as ne}from"./label-BUsIq6pv.js";import{q as v,u as p,f as g,g as B,h as A}from"./empty-icUEEQM8.js";import{p as ie}from"./parseEther-B2b6leuI.js";const te=A(`
  query listedInsuranceTokens {
    insuranceTokens(where: { listedPrice_not: null }) {
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
`),ae=A(`
  query ownedInsuranceTokens($address: String!) {
    insuranceTokens(where: { owner: $address }) {
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
`),xe=e=>v({queryKey:c.owned(e),queryFn:({signal:t})=>B(ae,t,{address:e.toLowerCase()}),enabled:!!e}),fe=()=>v({queryKey:c.all(),queryFn:({signal:e})=>B(te,e)}),re=()=>{const{showTransactionDialog:e}=u(),{writeContractAsync:t}=p(),a=h();return g({mutationFn:async i=>{const n=await t({abi:r.abi,address:r.address,functionName:"unlistToken",args:[i]});return e(n),a?.waitForTransactionReceipt({hash:n,confirmations:y})},onSuccess(...i){i[3].client.invalidateQueries({queryKey:c.all()})}})},oe=()=>{const{showTransactionDialog:e}=u(),{writeContractAsync:t}=p(),a=h();return g({mutationFn:async i=>{const n=await t({abi:r.abi,address:r.address,functionName:"listToken",args:[i.tokenId,i.price]});return e(n),a?.waitForTransactionReceipt({hash:n,confirmations:y})},onSuccess(...i){i[3].client.invalidateQueries({queryKey:c.all()})}})},ce=()=>{const{showTransactionDialog:e}=u(),{writeContractAsync:t}=p(),a=h();return g({mutationFn:async i=>{const n=await t({abi:r.abi,address:r.address,functionName:"purchaseToken",args:[i.tokenId],value:i.value});return e(n),a?.waitForTransactionReceipt({hash:n,confirmations:y})},onSuccess(...i){i[3].client.invalidateQueries({queryKey:c.all()})}})},le=()=>{const{showTransactionDialog:e}=u(),{writeContractAsync:t}=p(),a=h();return g({mutationFn:async i=>{const n=await t({abi:r.abi,address:r.address,functionName:"claimPayout",args:[i]});return e(n),a?.waitForTransactionReceipt({hash:n,confirmations:y})},onSuccess(...i){const n=i[3].client;n.invalidateQueries({queryKey:c.all()}),n.invalidateQueries({queryKey:q.requiredReserve()}),n.invalidateQueries({queryKey:q.insuranceContractBalance()})}})},de=()=>{const{showTransactionDialog:e}=u(),{writeContractAsync:t}=p(),a=h();return g({mutationFn:async i=>{const n=await t({abi:r.abi,address:r.address,functionName:"tokenOwnerRequestFlightData",args:[i]});return e(n),a?.waitForTransactionReceipt({hash:n,confirmations:y})},onSuccess(...i){const n=i[3].client;n.invalidateQueries({queryKey:c.all()}),n.invalidateQueries({queryKey:Q.all()})}})},T=e=>!!e.policy.flight.delay&&BigInt(e.policy.flight.delay)>=BigInt(e.policy.delayThreshold),ue=e=>{const a=e.policy.flight;return e.processed?T(e)?"Paid Out":"No Payout":a.delay?T(e)?"Claimable":"Not Claimable":a.requestedAt?"Pending Delay Info":"Awaiting Delay Info Request"};function we({token:e,className:t,showOwner:a,...i}){const[n,j]=F.useState(""),[K,C]=F.useState(!1),{address:M}=k(),m=oe(),b=re(),I=ce(),D=de(),P=le(),d=M?.toLowerCase()===e.owner.toLowerCase(),x=e.policy,l=x.flight,f=T(e),w=n!==""&&Number.isNaN(Number(n))&&"Please enter a valid number";return s.jsxs(z,{...i,className:O("min-w-96 shadow-xl",t),children:[s.jsxs(G,{children:[s.jsx(J,{children:s.jsxs("div",{className:"flex justify-between",children:[s.jsx("p",{children:l.flightNumber}),s.jsx("p",{children:l.flightDate})]})}),s.jsxs(X,{children:[s.jsxs("p",{children:["Token ID: ",e.id]}),a&&s.jsxs("p",{children:["Owner:",s.jsx("a",{href:S(e.owner,"address"),target:"_blank",rel:"noopener noreferrer",className:"text-blue-600  ml-1",children:E(e.owner,10)}),d&&" (You)"]})]})]}),s.jsxs(Z,{children:[s.jsxs("p",{children:["Status: ",ue(e)]}),s.jsxs("p",{children:[e.processed&&f?"":"Planned"," Payout: ",N(BigInt(x.payout))," ETH"]}),s.jsxs("p",{children:["Delay Threshold: ",x.delayThreshold," minutes"]}),l.delay&&s.jsxs("p",{children:["Actual Delay: ",l.delay," minutes"]}),e.listedPrice&&s.jsxs("p",{children:["Listed Price: ",N(BigInt(e.listedPrice))," ETH"]})]}),s.jsxs(ee,{className:" mt-auto justify-end gap-4",children:[e.listedPrice&&(d?s.jsx(o,{disabled:b.isPending,onClick:()=>b.mutate(BigInt(e.id)),children:"Unlist"}):s.jsx(o,{disabled:I.isPending,onClick:()=>I.mutate({tokenId:BigInt(e.id),value:BigInt(e.listedPrice??"0")}),children:"Buy"})),!e.listedPrice&&d&&s.jsxs(H,{open:K,onOpenChange:C,children:[s.jsx(L,{asChild:!0,children:s.jsx(o,{disabled:m.isPending,children:"List on Marketplace"})}),s.jsxs(_,{className:"sm:max-w-[425px]",children:[s.jsxs(U,{children:[s.jsxs(W,{children:["List Token #",e.id," on Marketplace"]}),s.jsx($,{children:"Enter the price at which you want to list your insurance token."})]}),s.jsxs("div",{className:"grid gap-3",children:[s.jsx(se,{htmlFor:"price",children:"Price (ETH)"}),s.jsx(ne,{id:"price",placeholder:"0.05",value:n,onChange:R=>j(R.target.value)}),w&&s.jsx("p",{className:"text-sm text-red-600",children:w})]}),s.jsxs(V,{children:[s.jsx(Y,{asChild:!0,children:s.jsx(o,{variant:"outline",children:"Cancel"})}),s.jsx(o,{disabled:!!w||n===""||m.isPending,onClick:()=>{C(!1),m.mutate({tokenId:BigInt(e.id),price:ie(n)}),j("")},children:"Confirm"})]})]})]}),d&&!e.processed&&!l.delay&&s.jsx(o,{disabled:D.isPending,onClick:()=>D.mutate(BigInt(e.id)),children:"Request Flight Delay"}),d&&!e.processed&&l.delay&&s.jsx(o,{disabled:P.isPending||!f,onClick:()=>P.mutate(BigInt(e.id)),children:f?"Claim Payout":"Not Claimable"})]})]})}export{we as I,fe as l,xe as o};
