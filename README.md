# Wakala Pro

Daily closing, float and profit records for a mobile money agent (wakala) business.
Runs as a web app on GitHub Pages with Firebase (Auth + Firestore) as the database.

## How profit is calculated

Agents only count and enter each balance (every float, Lipa kwa Simu and the cash drawer) and list expenses.

```
Daily profit   = today's closing total − last closing total
                 − owner money in/out since the last closing
                   (capital added is not profit; owner withdrawals are not a loss)

Monthly profit = sum of daily profits (money growth over the month)
               + provider commission received (entered with "Commission In")
```

Daily profit comes from the Lipa kwa Simu fees and is already net of expenses, because
expenses are paid out of the counted money. If the money goes down on a day, the agent must
explain why before locking. Month-end commission can be recorded into one of the floats or as
"Not in these balances" (paid to a bank or elsewhere); either way it is added to monthly profit.

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
