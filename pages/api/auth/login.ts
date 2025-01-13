import { sign } from 'jsonwebtoken';
import cookie from 'cookie';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log('Processing POST request...');
    const { email, password } = req.body;
    console.log(`Email: ${email}`);
    if (email == '' || password == '') {
      return res.status(400).json({
        error: "Request body incomplete",
      });
    }
    if (!process.env.JWT_SECRET || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      return res.status(500).json({ error: 'ENV SECRETS missing' });
    }
    if (process.env.ADMIN_EMAIL !== email) {
      return res.status(401).json({ error: 'Invalid email' });
    }

    const isPasswordCorrect = (password === process.env.ADMIN_PASSWORD ? true : false);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = sign({ email: process.env.ADMIN_EMAIL, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

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

  else {
    console.log(`Method not allowed: ${req.method}`);
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
