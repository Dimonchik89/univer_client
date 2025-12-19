"use client"
import React, { useState } from 'react'
import {
	isServer,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
	if(isServer) {
		return makeQueryClient();
	} else {
		if (!browserQueryClient) browserQueryClient = makeQueryClient();
    	return browserQueryClient;
	}
}

interface ReactQueryProviderProps {
	children: React.ReactNode,
}

const ReactQueryProvider = ({ children }: ReactQueryProviderProps) => {
	const queryClient = getQueryClient();


	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools/>
		</QueryClientProvider>
	)
}

export default ReactQueryProvider