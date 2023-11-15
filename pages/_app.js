import React, { useState } from "react";
import "@/styles/globals.css";
import { SWRConfig } from "swr";
import { AuthProvider, useAuth } from "../context/auth";
import Login from "@/components/layout/Login";
import { Sidebar } from "@/components/layout";
import Head from "next/head";
import { GlobalProvider } from "./GlobalProvider";

export default function App({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url) => axios(url).then((res) => res.data),
        revalidateOnFocus: false,
      }}
    >
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>Admin</title>
      </Head>
      <GlobalProvider>
        <AuthProvider>
          <LoginProvider>
            <>
              <Sidebar />
              <main
                role="main"
                className="flex flex-col min-h-screen left-10 pl-72 pt-20 pr-8"
              >
                {/* <p>ggggg</p> */}
                <div className="bg-white p-12 rounded-md">
                  <Component {...pageProps} />
                </div>
              </main>
            </>
          </LoginProvider>
        </AuthProvider>
      </GlobalProvider>
    </SWRConfig>
  );
}

function LoginProvider({ children }) {
  const { user } = useAuth();

  return !user ? React.createElement(Login, null) : children;
}
