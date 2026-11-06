# My Chaos – segment-targeted banner test page

Static snapshot of dev.my.chaos.com (Active products page, logged in as License Admin) used to test the HubSpot banner end to end.

## What's different from the real portal
- No app JavaScript, so the page is static and links/menus don't work.
- Production GTM (GTM-KMHCGS), OneTrust cookie gating and the production HubSpot tracking code (6852391) are removed.
- The HubSpot **Sandbox** tracking code (51090794) is loaded directly.
- An inline script does what the GTM "HubSpot identify" tag will do: it pushes the `user` event (now incl. `email`) to the dataLayer and calls `_hsq.push(["identify", { email, id }])` before HubSpot loads.
- A black TEST PAGE badge (bottom left) shows the identified email, whether HubSpot loaded, and a "Reset HubSpot cookies & reload" button.

## How to test
1. Upload `index.html` to GitHub Pages.
2. Open the page. Default user: ivailo.iliev+admin@chaos.com (in the test segment).
3. Reload once. The visitor-to-contact link is made on the first pageview; the banner should appear about 1 second after the next one.
4. Negative test: open in a new incognito window with `?email=someone.not.in.segment@chaos.com&uid=test`. No banner should appear.
5. Other test users: `?email=ivailo.iliev@chaos.com` or `?email=stela.aleksandrova@chaos.com`.

Use a fresh incognito window (or the reset button) when switching users, otherwise the HubSpot cookie stays linked to the previous contact. Ad/tracking blockers will block HubSpot.

## HubSpot Sandbox setup
- Segment: "[Test] Portal banner – internal users" (list ID 3738)
- CTA: "[Test] My Chaos portal banner – segment targeted" (sticky banner, all pages, after 1 s, segment only, re-shows 14 days after dismissal, hidden on small screens)
