import { sign } from 'jsonwebtoken';
import { serialize } from 'cookie';
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

      try {
        res.setHeader(
          'Set-Cookie',
          serialize('authToken', token, {
            httpOnly: true,
            secure: Boolean(process.env.NODE_ENV === 'production'),
            maxAge: 3600,
            sameSite: 'strict',
            path: '/',
          })
        );
      } catch (err) {
        console.error('Error setting cookie:', err);
        return res.status(500).json({ error: 'Failed to set cookie' });
      }

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
