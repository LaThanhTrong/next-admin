import '@/styles/globals.css'
import 'styles/stats.css';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from "next-auth/react"

export default function App({Component, pageProps: { session, ...pageProps }}) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider enableSystem={true} attribute='class'>
        <Component {...pageProps}/>
      </ThemeProvider>
    </SessionProvider>
  )
}