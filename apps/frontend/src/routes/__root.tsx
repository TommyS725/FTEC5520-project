import { Navigate, Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useAppKitAccount } from "@reown/appkit/react";

import Header from '../components/Header'
import Providers from '@/providers'
import TransactionDialog from '@/components/TransactionDialog';
import { useQueryClient } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';
import { useEffect } from 'react';
import { watchAllContractEvents } from '@/action/watchEvent';

export const Route = createRootRoute({
  component: () => <>
    <Providers>
      <Root />
    </Providers>
    <TanStackDevtools
      config={{
        position: 'bottom-right',
      }}
      plugins={[
        {
          name: 'Tanstack Router',
          render: <TanStackRouterDevtoolsPanel />,
        },
      ]}
    />
  </>
})


function Root() {
  const { isConnected } = useAppKitAccount();
  const publicClient = usePublicClient();
  const qc = useQueryClient();
  const location = useLocation();
  const showHeader = location.pathname !== '/connect';
  useEffect(() => {
    let cleanup = null as null | (() => void);
    if (isConnected && publicClient) {
      cleanup = watchAllContractEvents(publicClient, qc);
    }
    return () => {
      if (cleanup) {
        cleanup();
      }
    }
  }, [qc, publicClient, isConnected])
  if (!isConnected && location.pathname !== '/connect')
    return <Navigate to="/connect" search={{
      redirectTo: location.pathname
    }} replace />;

  return (
    <>
      {showHeader && <Header />}
      <Outlet />
      <TransactionDialog />
    </>
  )
}