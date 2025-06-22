import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt';


const prisma = new PrismaClient();
async function main() {
  const hashed = await bcrypt.hash('adminpass', 10);
  await prisma.user.create({
    data: {
      userName: 'admin',
      password: hashed,
      role: 'ADMIN',
    },
  });
}
main();
