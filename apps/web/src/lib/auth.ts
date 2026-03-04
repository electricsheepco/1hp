import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Strava from 'next-auth/providers/strava'
import { db } from './db'
import type { Adapter, AdapterAccount } from 'next-auth/adapters'

// Wrap PrismaAdapter to convert providerAccountId to string
// Strava returns integer IDs but Prisma schema expects strings
function StravaCompatibleAdapter(): Adapter {
  const prismaAdapter = PrismaAdapter(db)

  return {
    ...prismaAdapter,
    getUserByAccount: async (providerAccount) => {
      return prismaAdapter.getUserByAccount!({
        ...providerAccount,
        providerAccountId: String(providerAccount.providerAccountId),
      })
    },
    linkAccount: async (account: AdapterAccount) => {
      return prismaAdapter.linkAccount!({
        ...account,
        providerAccountId: String(account.providerAccountId),
      })
    },
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: StravaCompatibleAdapter(),
  providers: [
    Strava({
      clientId: process.env.STRAVA_CLIENT_ID,
      clientSecret: process.env.STRAVA_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read,activity:read_all',
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  pages: {
    signIn: '/runstate',
    error: '/runstate',
  },
})

// Augment types for session.user.id
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
