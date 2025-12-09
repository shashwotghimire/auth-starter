import bcrypt from "bcrypt";

const salt_rounds = 10;

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, salt_rounds);
}

export async function verifyPassword(password: string, hashPassword: string) {
  return await bcrypt.compare(password, hashPassword);
}
