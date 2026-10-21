# Notification center (Chaos · Eris)

Production version of the notification center design. React 18, no other runtime dependencies, no design-canvas code.

## Why the canvas export broke

The `.dc.html` artboards only run inside the Claude design canvas, which supplies their runtime:

| In the canvas export | What happens in an app | Here |
|---|---|---|
| `{{hole}}`, `<sc-if>`, `<sc-for>`, `<dc-import>`, `class Component extends DCLogic` | Not HTML or React — renders as raw text, nothing is clickable | Plain React state and JSX |
| `<x-import component-from-global-scope="Eris.…">` | Needs `window.Eris` loaded first; otherwise empty | Local equivalents styled with Eris tokens (icons and product marks copied from the Eris bundle) |
| `/_blob/…` image URLs | Canvas-only storage — 404 in your app | Real files in `src/assets/`, imported |
| `./support.js`, `ds/eris/...` paths | Don't exist in your app | Not used |
| Global `:root` tokens and `.er-*` overrides | Leak into and fight the host app | Everything scoped under `.nc-root`, resets use `:where()` (zero specificity) |
| Menu position divided by the canvas zoom factor | Wrong position outside the canvas | Positioned from real DOM rects; flips up near the bottom |

## Files

```
src/NotificationCenter.jsx   components + useNotifications hook
src/NotificationCenter.css   styles, light default, dark via data-theme="dark"
src/erisMarks.js             Chaos outline icons + product marks (from Eris)
src/sampleNotifications.js   sample feed — shape reference (copy marked PLACEHOLDER needs sign-off)
src/assets/                  GIF, poster frame, thumbnails
demo/                        standalone demo (npm run build:demo → demo/dist/index.html)
```

## Use

Drop-in (bell + panel anchored under it, no scrim):

```jsx
import { NotificationCenter } from './NotificationCenter';
import './NotificationCenter.css';

<NotificationCenter
  items={notifications}
  emptyImages={[a, b, c]}
  onEvent={(type, payload) => track(type, payload)}      // read, read-all, dismiss, restore, snooze, unsnooze, expand, collapse, primary, preference
  onOpenItem={(item, target) => openUrl(item.link?.href)} // primary | link | read-more | survey
  theme="light"                                           // or "dark"
/>
```

Custom placement (e.g. the bell in an existing toolbar, the panel in a side dock):

```jsx
const state = useNotifications(items, { onEvent });
<NotificationBell count={state.unreadCount} expanded={open} onClick={toggle} controls="nc-panel" />
{open && <NotificationPanel state={state} onClose={close} style={{ height: '100%' }} />}
```

`NotificationPanel` fills the height its container gives it (min 320 px) and is 384 px wide.

## Item types

`action` (pinned, deadline meter, primary + remind; Clear all keeps it until resolved), `feature` (animated media card, expandable steps), `update` (compact row with thumbnail, expandable checklist), `news` (compact row), `survey` (footer row). See `sampleNotifications.js` for every field.

## Behaviour

- Remind me later: 1 hour / tomorrow 9:00 / next Monday 9:00 (licensing: first two only). Snoozed tab lists them with Unsnooze.
- Dismiss and Clear all show a 5 s Undo snackbar.
- Expanding an item marks it read; the unread dot is a button that marks read.
- Keyboard: Escape closes the menu → settings → panel (focus returns to the bell); arrow keys move through the menu; hover-only actions are visible on keyboard focus and on touch devices.
- Motion: GIF has pause/play; the poster frame is used when paused, when "Play animations" is off, and under `prefers-reduced-motion`.
- Settings toggles change the list immediately; "Licensing and account" is locked on. `preview` and `holdWhileRendering` are reported via `onEvent` — wire them to your arrival toast / render state.
- Snooze, dismiss and read state are in memory. Persist them from `onEvent` (or seed `unread` from your backend) so they survive a restart.

## Integration notes

- Inter is expected from the host app (as in Eris). If missing, the stack falls back to system UI fonts.
- If your app already ships Eris React components, `Button`, `IconButton`, `Toggle`, `Icon`, `ProductLogo` in the JSX map 1:1 to `Eris.Button`, `Eris.IconButton`, `Eris.Toggle`, `Eris.Icon`, `Eris.ProductLogo`.
- Assets are imported as modules (works with Vite, webpack 5, esbuild, Parcel). In Enscape's embedded web UI, make sure `.gif`/`.jpg` are handled by the bundler's asset loader.
