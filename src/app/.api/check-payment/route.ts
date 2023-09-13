import type { NextApiResponse } from 'next'
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const stripe = require('stripe')(process.env.NEXT_STRIPE_PUBLIC_KEY);

type Data = {}

export async function POST (req: NextRequest, res: NextApiResponse<Data>) {
  // @ts-ignore
  const hash = req.body?.hash;
  const sessionID = ''; // TODO: Retrieve session from DB by using hash

  const session = await stripe.checkout.sessions.retrieve(sessionID);
  console.log(session);

  return NextResponse.json({ payment_status: session.payment_status });
}
