import { sign } from 'jsonwebtoken';
import cookie from 'cookie';
import { envVar } from '@/constants';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;
      if (email == '' || password == '') {
        return res.status(400).json({
          error: "Request body incomplete",
        });
      }
      if (!envVar.JWT_SECRET || !envVar.ADMIN_EMAIL || !envVar.ADMIN_PASSWORD) {
        return res.status(500).json({ error: 'ENV SECRETS missing' });
      }
      if (envVar.ADMIN_EMAIL !== email) {
        return res.status(401).json({ error: 'Invalid email' });
      }

      const isPasswordCorrect = (password === envVar.ADMIN_PASSWORD ? true : false);

      if (!isPasswordCorrect) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      const token = sign({ email: envVar.ADMIN_EMAIL, role: 'admin' }, envVar.JWT_SECRET, { expiresIn: '1h' });

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
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Something went wrong" });
    }

  }
  else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
