import { useState, useEffect, useMemo } from "react";

const fetchIntent = async () => {
  const req = await fetch('/api/create-intent', { method: 'POST' });
  const { client_secret } = await req.json();
  return client_secret;
}

export const usePaymentIntent = () => {
  const [intent, setIntent] = useState();

  useEffect(() => {
    fetchIntent()
      .then(setIntent)
      .catch((e) => {
        console.error(e);
      });
  }, [])

  return intent;
}