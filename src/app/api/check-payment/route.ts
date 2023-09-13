import { APP_BASE } from '@/app/constants';
import { getDatabase } from '@/app/hooks/getDatabase';
import type { NextApiRequest, NextApiResponse } from 'next'
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const stripe = require('stripe')(process.env.NEXT_STRIPE_PUBLIC_KEY);

type Data = {}

export async function POST (req: NextRequest, res: NextApiResponse<Data>) {
  const formData = await req.formData();
  const hash = formData.get('hash');

  if (!hash) {
    return NextResponse.json({ error: 'Missing hash' }, { status: 400 });
  }
  const db = getDatabase();
  // TODO: Session may duplicate
  const sessionID = await new Promise((resolve, reject) => {
    db.serialize(() => {
      db.get('SELECT id FROM sessions WHERE hash = ?', hash, (err: { message: any; }, row: { id: unknown; }) => {
        console.error(err);
        if (err) {
          db.close();
          console.error(err.message);
          // return NextResponse.json({ error: 'Failed to store key-value pair' }, { status: 500 });
          reject(err);
          return;
        }

        if (row) {
          console.log('ID:', row?.id);
        } else {
          console.log('No matching record found.');
        }

        db.close();
        resolve(row?.id)

        // return NextResponse.json({ message: 'Key-value pair stored successfully' }, { status: 200 });
        return;
      });
    });
  });

  console.log({ sessionID, hash });

  if (!sessionID) {
    return NextResponse.json({ message: 'User is not submitted the payment jet' }, { status: 200 });
  }
  const session = await stripe.checkout.sessions.retrieve(sessionID);

  return NextResponse.json({ payment_status: session.payment_status });
}
