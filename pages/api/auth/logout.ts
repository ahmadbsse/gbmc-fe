import { serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader(
        'Set-Cookie',
        serialize('authToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(0),
            sameSite: 'strict',
            path: '/',
        })
    );
    res.status(200).json({ message: 'Logged out successfully' });
}
