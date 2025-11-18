import { Home, Wallet, Landmark, Store, UserCog2Icon, Braces } from "lucide-react";

type LocationItem = {
  title: string;
  navTitle: string;
  navIcon: React.ReactNode;
  requiresAdmin?: boolean;
}

const NAV_ICON_SIZE = 30;

export const LOCATION_MAPPINGS: Record<string, LocationItem> = {
  '/': {
    title: 'My Insurance Tokens',
    navTitle: 'My Insurance Tokens',
    navIcon: <Wallet size={NAV_ICON_SIZE} />,
  },
  '/purchase': {
    title: 'Buy Insurance',
    navTitle: 'Buy Insurance',
    navIcon: <Landmark size={NAV_ICON_SIZE} />,
  },
  "/marketplace": {
    title: 'P2P Marketplace',
    navTitle: 'P2P Marketplace',
    navIcon: <Store size={NAV_ICON_SIZE} />,

  },
  "/admin": {
    title: 'Admin Operations',
    navTitle: 'Admin Operations',
    navIcon: <UserCog2Icon size={NAV_ICON_SIZE} />,
    requiresAdmin: true,
  },
  "/metadata": {
    title: 'Metadata',
    navTitle: 'Metadata',
    navIcon: <Braces size={NAV_ICON_SIZE} />,
  }
};

const DEFAULT_LOCATION = {
  title: 'Unknown Page',
  navTitle: 'Unknown Page',
  navIcon: <Home size={NAV_ICON_SIZE} />,
} satisfies LocationItem;

export const getLocationItem = (pathname: string): LocationItem => {
  return LOCATION_MAPPINGS[pathname as keyof typeof LOCATION_MAPPINGS] || DEFAULT_LOCATION;
}


export const REQUIRED_CONFIRMATIONS = 2;
export const REFETCH_ON_EVENT_MS = 10_000; // 10 seconds