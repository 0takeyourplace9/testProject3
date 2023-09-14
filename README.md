This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started..

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Flow

```yuml
// {type: activity}
(WebGL app)[fires event with price, hash]->(Web root)
(WebGL app)[waits result of payment by hash]->(processing)
(Web root)[open popup with price,hash trough processing]->(processing)
(processing)[create Stripe session, stores sessionId,hash pair to DB]->(Web popup)
(Web popup)[succeeded]->(close popup)
(Web popup)[failed]->(close popup)
(Web popup)[canceled]->(close popup)
// (Web root)[checks every 5 sec status by hash]->(processing)
// (Web root)[sends event back succeeded]->(WebGL app)
// (Web root)[canceled]->(WebGL app)
```

## Implementation

1. Create file `Assets/Plugins/Next.jslib` inside your Unity project containing:

```js
mergeInto(LibraryManager.library, {
  Message: function (str) {
    window.postMessage(UTF8ToString(str), 'http://localhost:4242/');
  },
});
```

2. Add following code to your class which will call and listen the Web app events:\

```cs
    // Send events to web app (see. Next.jslib file)
    [DllImport("__Internal")]
    private static extern void Message(string eventData);

    public void OnMessage(string eventData)
    {
        // Following line will be called from Web app (see. UnityAppController.tsx file):
        //                                       class name,       method name, event data
        // unityInstance.current?.SendMessage?.('player1(Clone)', 'OnMessage',  event.data);

        // TODO: Handle the UNITY_PLAYER_AFTER_PAY event in C#
    }
```

```cs
    void PayWithPrice(string price, string message)
    {
        Debug.Log($"Sending message with price {price} to JS from Unity");

        string priceCode = prices[price];

        hashCode = System.Guid.NewGuid().ToString();
        Message("{ \"type\": \"UNITY_PLAYER_PAY\", \"payload\": { \"message\": \"" + message+ "\", \"price\": \"" + priceCode + "\", \"hash\": \"" + hashCode + "\" } }");
    }
```

3. Build Unity App and put it to the `public/{some path}/` folder of Next.js app
4. Update paths to your build directory in `src/app/config.json` and `src/app/metadata.json` files. (you can change to .ts files when you will be ready to automate this process)
5. Ensure that you have implemented the following routes in your Next.js app and API:

- `NEXT_STRIPE_CHECKOUT_FORM` - static page with POST form (used inside `popup`), which uses `price` and `hash` slug params (you can use search params instead) and have single button which allow user to confirm the payment and start the whole process.
  > See. `src/app/checkout/page.tsx` for example.
- `NEXT_STRIPE_CHECKOUT_GATEWAY` - API route, where you will create the Stripe session and store the `hash` and `sessionId` pair to the DB. (This route will be called from the `NEXT_STRIPE_CHECKOUT_FORM` page and redirects to Stripe page afterwords.)
  > See. `src/app/api/checkout/route.ts` for example.
- `NEXT_STRIPE_CHECKOUT_SUCCESS`, `NEXT_STRIPE_CHECKOUT_CANCELED` - static pages which will be shown to the user after the payment process will be finished.
  > See. `src/app/success/page.tsx` and `src/app/canceled/page.tsx` for example.
- `NEXT_STRIPE_CHECK_PAYMENT` - API route, which will be called from the Web app to check the payment status by `hash` param.
  > See. `src/app/api/check-payment/route.ts` for example.

6. Add `UnityAppController` and `PaymentController` to your root page of NextJS/React app.
