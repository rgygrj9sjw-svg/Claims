import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { OrganizationJsonLd } from "@/components/seo/json-ld"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://insuranceclaimindex.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Insurance Claim Index | Michigan Insurance Claim Experiences",
    template: "%s | Insurance Claim Index",
  },
  description: "Learn from real Michigan insurance claim experiences. Crowdsourced, anonymized data on claim timelines, outcomes, and carrier performance. Educational resources for policyholders.",
  keywords: [
    "michigan insurance claims",
    "insurance claim experience",
    "insurance claim timeline",
    "homeowners insurance claims",
    "insurance claim denied",
    "michigan policyholder rights",
    "insurance claim process",
    "insurance carrier reviews",
  ],
  authors: [{ name: "Insurance Claim Index" }],
  creator: "Insurance Claim Index",
  publisher: "Insurance Claim Index",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Insurance Claim Index",
    title: "Insurance Claim Index | Michigan Insurance Claim Experiences",
    description: "Learn from real Michigan insurance claim experiences. Crowdsourced, anonymized data on claim timelines, outcomes, and carrier performance.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Insurance Claim Index - Michigan Insurance Claim Experiences",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Insurance Claim Index | Michigan Insurance Claim Experiences",
    description: "Learn from real Michigan insurance claim experiences. Crowdsourced data on claim timelines and outcomes.",
    images: [`${BASE_URL}/og-image.png`],
  },
  alternates: {
    canonical: BASE_URL,
  },
  category: "Insurance",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <OrganizationJsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
