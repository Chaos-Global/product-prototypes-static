// Sample feed. Replace with data from your notifications service.
// Copy marked PLACEHOLDER needs sign-off from product marketing / the release owner.
import verasGif from './assets/veras-enscape.gif';
import verasPoster from './assets/veras-poster.jpg';
import coronaVantage from './assets/corona-vantage.jpg';
import empty1 from './assets/empty-1.jpg';
import empty2 from './assets/empty-2.jpg';
import empty3 from './assets/empty-3.jpg';

export const EMPTY_IMAGES = [empty1, empty2, empty3];

export const SAMPLE_NOTIFICATIONS = [
  {
    id: 'licensing-2025-01',
    type: 'action',                 // pinned under "Action needed"; Clear all keeps it until resolved
    category: 'licensing',          // always on in settings
    title: 'Update your Chaos licensing',
    body: 'Required by January 28, 2025 to keep uninterrupted access to your licenses.',
    time: '1 min ago',
    merged: 1,                      // duplicates collapsed server-side or client-side
    due: 'Jan 28, 2025',            // shown as "Due Jan 28, 2025 · 14 days left"; full body is the card's tooltip
    deadline: { daysLeft: 14 },     // 4–30 days: amber; 0–3 days: red
    primaryLabel: 'Update licensing',
    primaryShortLabel: 'Update',    // the compact card uses the short label
    doneTitle: 'Licensing updated',
    doneBody: 'Your licenses are up to date.',
    unread: true,
  },
  {
    id: 'veras-enscape-v2',
    type: 'feature',                // large card with animated media
    category: 'releases',
    eyebrow: 'New integration',
    title: 'Chaos Veras and Enscape: integration v2',
    body: 'Veras now works inside Enscape, with node workflows and the new Astra model.',
    time: 'Just now',
    products: ['enscape'],
    media: {
      src: verasGif,
      poster: verasPoster,          // shown when paused, when animations are off, and for reduced motion
      alt: 'An Enscape view turned into Veras daylight, golden hour and dusk options',
    },
    details: [                      // with `icon` → feature highlights; without → numbered steps
      { icon: 'viewport', title: 'Work right in the Enscape viewport', text: 'Generate from the view you’re already in.' },
      { icon: 'nodes', title: 'Build with nodes in Veras', text: 'Chain steps on a canvas and reuse them.' },
      { icon: 'sparkles', title: 'Astra model now available', text: 'Pick it from the model list in Veras.' }, // confirm wording
    ],
    link: { label: 'Full release notes', href: '#veras-enscape-v2' },
    unread: true,
  },
  {
    id: 'corona-vantage-cloud-licensing',
    type: 'update',                 // compact row with thumbnail, expandable
    category: 'releases',
    title: 'New versions of Corona and Vantage',
    summary: 'Cloud Licensing built in',
    time: '1 min ago',
    thumb: coronaVantage,
    details: [                      // PLACEHOLDER
      { title: 'Cloud Licensing built in.', text: 'No license server to set up.' },
      { title: 'Activate with your Chaos account.', text: 'Sign in once.' },
    ],
    link: { label: 'Full release notes', href: '#corona-vantage' },
    unread: true,
  },
  {
    id: 'chaos-suites',
    type: 'news',
    category: 'releases',
    title: 'Introducing Chaos suites',
    time: 'January 26, 2026',
    link: { href: '#chaos-suites' },
    unread: false,
  },
  {
    id: 'survey-2026-q4',
    type: 'survey',
    category: 'surveys',
    title: 'Help us improve your experience',
    body: 'Share your thoughts in a 2-minute survey for a chance to win a $50 Amazon gift card.',
    link: { label: 'Take survey', href: '#survey' },
  },
];
