import { NEXT_STRIPE_CHECKOUT_SUCCESS, NEXT_STRIPE_CHECKOUT_CANCELED } from '../../../app/constants';
import type { NextApiResponse } from 'next'
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const stripe = require('stripe')(process.env.NEXT_STRIPE_PUBLIC_KEY);

type Data = {}

export async function POST (req: NextRequest, res: NextApiResponse<Data>) {
  const formData = await req.formData();
  const price = formData.get('price');
  const hash = formData.get('hash');

  console.log({ price, hash, success_url: `${NEXT_STRIPE_CHECKOUT_SUCCESS}?session_id={CHECKOUT_SESSION_ID}`, canceled_url: `${NEXT_STRIPE_CHECKOUT_CANCELED}?session_id={CHECKOUT_SESSION_ID}` });
  const session = await stripe.checkout.sessions.create({
    // apiVersion: '2022-11-15',
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${NEXT_STRIPE_CHECKOUT_SUCCESS}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${NEXT_STRIPE_CHECKOUT_CANCELED}?session_id={CHECKOUT_SESSION_ID}`,
  });

  console.log({ sessionId: session.id });
  // if (session?.id) {
  //   const db = getDatabase();
  //   db.serialize(() => {
  //     db.run('INSERT INTO sessions (id, hash) VALUES (?, ?)', [session.id, hash], (err) => {
  //       console.error(err);
  //       if (err) {
  //         console.error(err.message);
  //         // return NextResponse.json({ error: 'Failed to store key-value pair' }, { status: 500 });
  //       }

  //       db.close();
  //       // return NextResponse.json({ message: 'Key-value pair stored successfully' }, { status: 200 });
  //     });
  //   });

  //   db.close();
  // }

  return NextResponse.redirect(session.url, 303);
}

// export async function GET (req: NextRequest) {
//   const { searchParams } = new URL(req.url)
//   const price = searchParams.get('price')

//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//         price,
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     success_url: `/success.html?session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: `/canceled.html?session_id={CHECKOUT_SESSION_ID}`,
//   });
//   console.log(session);

//   NextResponse.redirect(session.url, 303);
// }
