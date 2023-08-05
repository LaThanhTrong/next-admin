import clientPromise from '@/lib/mongodb'
import { mongooseConnect } from '@/lib/mongoose'
import { Admin } from '@/models/Admin'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialProvider from 'next-auth/providers/credentials'
import { Uadmin } from '@/models/Uadmin'

async function isAdminEmail(email){
  await mongooseConnect()
  // Convert findOne to boolean value, return true if email exists (true) or not (false)
  return !! (await Admin.findOne({email}))
}

async function isUserAdminEmail(email){
  await mongooseConnect()
  return !! (await Uadmin.findOne({email}))
}

export const authOptions = {

  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),

    CredentialProvider({
      id: 'credentials',
      name: "Credentials",
      async authorize(credentials, req){
        await mongooseConnect()
        const results = await Uadmin.findOne({email: credentials.email})
        // If userAdmin not found, not authorized
        if(!results){
          throw new Error('Unauthorized')
        }
        var hash = require('hash.js')
        const checkPassword = hash.sha512().update(credentials.password).digest('hex') === results.password
        if(!checkPassword || results.email !== credentials.email){
          throw new Error('Email or password is incorrect')
        }
        return results
      }
    })
  ],
  
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({session,token,user}) => {
      if(await isUserAdminEmail(session?.user?.email) || await isAdminEmail(session?.user?.email)){
        session.accessToken = token.accessToken
        return session
      }
      else{
        return false
      }
    },
    async signIn({ user, account, profile, email, credentials }){
      if(await isUserAdminEmail(user.email) || await isAdminEmail(user.email)){
        return true
      }
      else{
        
        return '/'
      }
    }
  }
}

const authHandler =  NextAuth(authOptions)
export default async function handler(...params) {
  await authHandler(...params);
}

export async function isAdminRequest(req,res){
  const session = await getServerSession(req,res,authOptions)
  if(!(await isAdminEmail(session?.user?.email) || await isUserAdminEmail(session?.user?.email))){
    res.status(401)
    res.end()
    throw 'Unauthorized'
  }
}