import {ReactNode} from "react";
import "./global.css";
import ConfiguredQueryClientProvider from "@/app/providers/ConfiguredQueryClientProvider";
import {ThemeProvider} from "@/app/providers/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConfiguredQueryClientProvider>
          <ThemeProvider>
            <div className="p-8">
              {children}
            </div>
          </ThemeProvider>
        </ConfiguredQueryClientProvider>
      </body>
    </html>
  );
}
