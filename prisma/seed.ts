import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';
import bcrypt from 'bcryptjs';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const seedUsers = [
  { username: 'Alice', email: 'alice@test.com', password: 'alice123' },
  { username: 'Bob', email: 'bob@test.com', password: 'bob123' },
  { username: 'Max', email: 'max@test.com', password: 'max123' },
];
async function main() {
  for (const u of seedUsers) {
    const hashedPasswords = bcrypt.hashSync(u.password, 10);
    await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: {
        username: u.username,
        email: u.email,
        passwordHash: hashedPasswords,
      },
    });
    console.log(`Seeded successfully with ${u.username}`);
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
