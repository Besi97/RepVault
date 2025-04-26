"use client";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactNode} from "react";

const queryClient = new QueryClient();

const ConfiguredQueryClientProvider = ({
  children,
}: {
  children: ReactNode
}) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
);

export default ConfiguredQueryClientProvider;
