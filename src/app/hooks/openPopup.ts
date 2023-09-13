export const openPopup = (url: string, onLoad?: (this: GlobalEventHandlers, ev: Event) => any) => {
  const [width, height] = [400, 500];
  const options = `${Object.entries({
    width,
    height,
    top: Math.round(window.outerHeight / 2 - height / 2),
    left: Math.round(window.outerWidth / 2 - width / 2),
    popup: 'yes',
    toolbar: 'no',
    menubar: 'no',
    }).map(([k, v]) => `${k}=${v}`)
  }`;
  // Chrome blocks popups with data-url, so we need to open a blank page first
  const popup = window.open(url, '_blank', options);

  // Stripe Checkout is not able to run in an iFrame. Please redirect to Checkout at the top level.
  // const popup = window.open(url, '_blank', options);
  // popup?.document.write('<iframe src="' + url  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');

  if (!popup) return;

  if (onLoad) {
    console.log('setting onload');
    popup.onload = onLoad;
  }
  return popup;
}