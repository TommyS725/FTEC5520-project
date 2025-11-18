import { AppKitProvider } from "./appkit";
import { MetadataProvider } from "./metadata";
import { ThemeProvider } from "./theme";
import { TransactionTrackProvider } from "./txTrack";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AppKitProvider>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                <TransactionTrackProvider>
                    <MetadataProvider>
                        {children}
                    </MetadataProvider>
                </TransactionTrackProvider>
            </ThemeProvider>
        </AppKitProvider>
    );
}
