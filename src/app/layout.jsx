import logoDark from '@/assets/images/Deepak.png'
import ReduxProvider from '@/providers/ReduxProvider'
import AppProvidersWrapper from '@/components/wrappers/AppProvidersWrapper'
import { Play } from 'next/font/google'
import Image from 'next/image'
import NextTopLoader from 'nextjs-toploader'
import '@/assets/scss/app.scss'
import { DEFAULT_PAGE_TITLE } from '@/context/constants'
import DynamicBranding from '@/components/DynamicBranding'
const play = Play({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})
export const metadata = {
  title: {
    template: 'OTT- Admin Dashboard',
    default: DEFAULT_PAGE_TITLE,
  },
  description: 'OTT Admin Dashboard',
}
const splashScreenStyles = `
#splash-screen {
  position: fixed;
  top: 50%;
  left: 50%;
  background: white;
  display: flex;
  height: 100%;
  width: 100%;
  transform: translate(-50%, -50%);
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 1;
  transition: all 15s linear;
  overflow: hidden;
}

#splash-screen.remove {
  animation: fadeout 0.7s forwards;
  z-index: 0;
}

@keyframes fadeout {
  to {
    opacity: 0;
    visibility: hidden;
  }
}
`
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style suppressHydrationWarning>{splashScreenStyles}</style>
      </head>
      <body className={play.className} suppressHydrationWarning>
        <div id="splash-screen">
          <Image
            alt="Logo"
            width={200}
            height={60}
            src={logoDark}
            style={{
              height: '15%',
              width: 'auto',
            }}
            priority
          />
        </div>
        <NextTopLoader color="#ff6c2f" showSpinner={false} />
        <div id="__next_splash">
          <AppProvidersWrapper>
            <ReduxProvider>
              <DynamicBranding />
              {children}
            </ReduxProvider>
          </AppProvidersWrapper>
        </div>
      </body>
    </html>
  )
}
