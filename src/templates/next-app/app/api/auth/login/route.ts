import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { loginSchema } from '@/lib/validators';
import bcrypt from 'bcryptjs';
import { setAuthCookie, signToken } from '@/lib/auth';

export async function POST(req: Request) {
  const json = await req.json();
  const parse = loginSchema.safeParse(json);
  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const { email, password } = parse.data;
  const user = await prisma.user.findUnique({
    where: { email },
    include: { userRoles: { include: { role: true } } },
  });
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const roles = user.userRoles.map((ur) => ur.role.name);
  const token = await signToken({ sub: String(user.id), roles });
  await setAuthCookie(token);
  return NextResponse.json({ id: user.id, email: user.email, roles });
}


