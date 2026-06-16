import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/lib/theme-context'
import { DoctorProvider } from '@/lib/doctor-context'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PediSpectra — All 18 Pediatric Subspecialties, One Platform',
  description:
    'Expert pediatric subspecialist consultations via video. Every specialist your child needs — one tap away.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Theme flash prevention: apply saved theme class before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var themeId = localStorage.getItem('pedispectra-theme');
                  var classMap = { 'light-sage': 'light-sage', 'earthy-warm': 'earthy-warm' };
                  if (themeId && classMap[themeId]) {
                    document.documentElement.classList.add(classMap[themeId]);
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider>
          <DoctorProvider>
            {children}
          </DoctorProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
