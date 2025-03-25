import { serialize } from 'cookie';
import { sign } from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { jwt } = req.body;
      if (jwt == '') {
        return res.status(400).json({
          error: "Request body incomplete",
        });
      }
      const token = sign({ jwt: jwt, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      try {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader(
          'Set-Cookie',
          serialize('authToken', token, {
            httpOnly: true,
            secure: Boolean(process.env.NODE_ENV === 'production'),
            maxAge: 3600,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
          })
        );
      } catch (err) {
        console.error('Error setting cookie:', err);
        return res.status(500).json({ error: 'Failed to set cookie' });
      }

      return res.status(200).json({ message: 'Login successful' });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return res.status(400).json({ message: "Something went wrong" });
    }

  }
  else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
