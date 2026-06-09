import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Global, css } from "@emotion/react";
import { useState } from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";

const globalStyles = css`
  :root {
    color-scheme: dark;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    max-width: 100vw;
    overflow-x: hidden;
    font-family:
      "Pretendard",
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      sans-serif;
    background-color: #131315;
    color: #ededed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000,
          },
        },
      }),
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Global styles={globalStyles} />
        <Component {...pageProps} />
      </QueryClientProvider>
    </Provider>
  );
}
