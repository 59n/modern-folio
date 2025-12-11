const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const bcrypt = require('bcryptjs');

const connectionString = process.env.DATABASE_URL || 'file:./dev.db';
const dbPath = connectionString.replace('file:', '');

const adapter = new PrismaBetterSqlite3({
    url: dbPath
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    const existingUser = await prisma.user.findFirst();

    if (existingUser) {
        console.log('Admin user already exists.');
        return;
    }

    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });

    console.log('\n');
    console.log('┌──────────────────────────────────────────────────┐');
    console.log('│                                                  │');
    console.log('│   🔐 Admin User Created!                         │');
    console.log('│                                                  │');
    console.log(`│   Email:    ${email.padEnd(29)}│`);
    console.log(`│   Password: ${password.padEnd(29)}│`);
    console.log('│                                                  │');
    console.log('│   Please save these credentials immediately!     │');
    console.log('│                                                  │');
    console.log('└──────────────────────────────────────────────────┘');
    console.log('\n');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
