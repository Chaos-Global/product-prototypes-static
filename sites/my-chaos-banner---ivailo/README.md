# My Chaos – segment-targeted banner test page v3 (OneTrust + GTM, HubSpot Sandbox)

Static snapshot of dev.my.chaos.com (Active products, logged in as License Admin) with the same consent and tracking stack as production my.chaos.com, but HubSpot pointing to the **Sandbox (51090794)**.

Replace the previous index.html with this one (v1 had no OneTrust/GTM).

## What the page loads (same order as production)
1. **OneTrust** – Chaos domain script `e4ec21e7-8a4e-4ddf-9da4-54fbe0a97eaf-test` (published test version, works on any domain).
2. **Google Consent Mode defaults** – same as production.
3. **GTM-KMHCGS** – production container, unchanged. Its tags (GA4, ad pixels, Clarity) fire on this page once consent is given.
4. **HubSpot loader** – `type="text/plain" class="optanon-category-C0004"`, only runs after Targeting cookies are accepted. Portal 51090794 (Sandbox).
5. End of body: the portal's `user` dataLayer push incl. `email`, and an inline copy of the planned GTM "HubSpot – identify" tag.

Test-only addition: an `OptanonWrapper` safety net that runs the HubSpot loader if OneTrust allowed C0004 but didn't run it. If that happens, the console shows "[banner test] OneTrust did not activate the HubSpot loader" and the badge says "via test fallback". Production has no OptanonWrapper.

## How to test
1. Open the page in a new incognito window. The OneTrust banner should appear.
2. Accept all (or at least Targeting cookies). Badge: "HubSpot loaded: yes".
3. Reload once. Top banner appears immediately; bottom-right slide-in 1 s later.
4. Negative tests: "Reset consent" and reject Targeting → no HubSpot, no banners. Or a new incognito window with `?email=someone.not.in.segment@chaos.com&uid=test` → no banners.
5. Other test users: `?email=ivailo.iliev@chaos.com` or `?email=stela.aleksandrova@chaos.com`.

## GTM tag to create later (Custom HTML, trigger: Custom Event "user", user_data.logged_in equals true)
```html
<script>
  (function () {
    var email = {{DLV - user_data.email}};
    if (!email) return;
    var loaded = !!window._hsq && window._hsq.push !== Array.prototype.push;
    window._hsq = window._hsq || [];
    window._hsq.push(["identify", { email: email, id: {{DLV - user_data.user_id}} }]);
    if (loaded) window._hsq.push(["trackPageView"]);
  })();
</script>
```
