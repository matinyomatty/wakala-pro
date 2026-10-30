# Wakala Pro

Daily closing, float and profit records for a mobile money agent (wakala) business.
Runs as a web app on GitHub Pages with Firebase (Auth + Firestore) as the database.

## How the money check works

Every day the agent counts each network float and the cash drawer and locks the day.
The app then checks:

```
Expected closing total = last closing total
                       + Lipa kwa Simu commission (paid by customers, goes into the balances)
                       − expenses
                       ± owner money in/out recorded since the last closing
                         (capital added, owner withdrawals, commission received, approved adjustments)

Difference = counted closing total − expected
```

A difference must be explained before the day can be locked. Other providers' commission
is not daily profit; record it with **+ Commission Received** when it is paid at month end.

## One-time setup after updating

1. **Database rules** – Firebase Console → Firestore Database → Rules → paste `firestore.rules` → Publish.
2. **WhatsApp alerts** – the old CallMeBot keys were visible in this public repository, so get new ones
   (send "I allow callmebot to send me messages" to CallMeBot on WhatsApp), then in the app:
   Owner view → Accounts → Edit → paste the key in "CallMeBot key".

## Files

- `index.html` – the whole app
- `sw.js` – lets the app open without internet
- `manifest.json`, `icon-*.png` – install to phone home screen
- `firestore.rules` – who is allowed to change what
