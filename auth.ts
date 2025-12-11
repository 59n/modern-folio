import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import bcrypt from 'bcryptjs';
import { prisma } from './lib/prisma'; // Adapting for my lib path
import type { User } from '@prisma/client';

async function getUser(email: string): Promise<User | null> {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                // Simple validation or Zod. I'll use basic for now to avoid extra installs unless necessary,
                // but 'zod' is great. I didn't verify if it's installed.
                // Actually, let's just do manual check to be safe.
                const { email, password } = credentials ?? {};

                if (typeof email !== 'string' || typeof password !== 'string') return null;

                const user = await getUser(email);
                if (!user) return null;

                const passwordsMatch = await bcrypt.compare(password, user.password);

                if (passwordsMatch) return user;

                return null;
            },
        }),
    ],
});
