import { sign } from 'jsonwebtoken';
import cookie from 'cookie';

import type { NextApiRequest, NextApiResponse } from 'next';

const users = [
  { email: 'admin@admin.com', password: 'admin123' }, // Replace with your hashed password
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordCorrect = (password === user.password ? true : false);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'JWT_SECRET is not defined' });
    }
    const token = sign({ email: user.email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600,
        sameSite: 'strict',
        path: '/',
      })
    );

    return res.status(200).json({ message: 'Login successful' });
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
