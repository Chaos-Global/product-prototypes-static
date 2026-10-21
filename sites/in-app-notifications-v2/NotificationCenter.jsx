/**
 * Notification center — production component (React 18, no other dependencies).
 *
 *   import { NotificationBell, NotificationPanel, useNotifications } from './NotificationCenter';
 *   import './NotificationCenter.css';
 *
 * The bell and the panel are separate so the host app decides where each one sits.
 * All state (read, snoozed, dismissed, expanded, preferences) lives in useNotifications;
 * every user action is also reported through `onEvent` so it can be persisted or sent to analytics.
 */
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ERIS_ICONS, ERIS_LOGOS } from './erisMarks';

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

/** Chaos outline icons (Eris). */
export function Icon({ name, size = 12, className = '' }) {
  return (
    <span
      className={'nc-icon ' + className}
      style={{ width: size, height: size }}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: ERIS_ICONS[name] || '' }}
    />
  );
}

/** Lucide stand-ins for icons the Eris set does not have (bell, clock, settings, warning, megaphone, gift, external, check-check). */
const LUCIDE = {
  bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></>,
  settings: <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></>,
  warning: <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" /></>,
  update: <><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></>,
  megaphone: <><path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></>,
  gift: <><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13" /><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" /></>,
  external: <><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>,
  viewport: <><path d="M14 4.1 12 6" /><path d="m5.1 8-2.9-.8" /><path d="m6 12-1.9 2" /><path d="M7.2 2.2 8 5.1" /><path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z" /></>,
  nodes: <><rect width="8" height="8" x="3" y="3" rx="2" /><path d="M7 11v4a2 2 0 0 0 2 2h4" /><rect width="8" height="8" x="13" y="13" rx="2" /></>,
  sparkles: <><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /><path d="M20 3v4" /><path d="M22 5h-4" /></>,
  checkAll: <><path d="M18 6 7 17l-5-5" /><path d="m22 10-7.5 7.5L13 16" /></>,
};
export function Glyph({ name, size = 14 }) {
  return (
    <svg className="nc-svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {LUCIDE[name]}
    </svg>
  );
}
function PauseGlyph() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>;
}
function PlayGlyph() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z" /></svg>;
}

const PRODUCT_NAMES = { enscape: 'Enscape', corona: 'Corona', vantage: 'Vantage', 'chaos-logo': 'Chaos' };
export function ProductLogo({ name, size = 22 }) {
  if (!ERIS_LOGOS[name]) return null;
  const mark = name === 'chaos-logo' ? 0.64 : 0.6;
  return (
    <span className={'nc-logo nc-logo--' + name} style={{ width: size, height: size }} role="img" aria-label={PRODUCT_NAMES[name]}>
      <span style={{ width: size * mark, height: size * mark }} dangerouslySetInnerHTML={{ __html: ERIS_LOGOS[name] }} />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

function Button({ size = 's', variant = 'secondary', icon, children, ...rest }) {
  return (
    <button type="button" className={`nc-btn nc-btn--${size} nc-btn--${variant}`} {...rest}>
      {children}
      {icon ? <Icon name={icon} size={10} /> : null}
    </button>
  );
}

const IconButton = React.forwardRef(function IconButton({ label, small, onImage, className = '', children, ...rest }, ref) {
  return (
    <button ref={ref} type="button" title={label} aria-label={label}
      className={['nc-ibtn', small && 'nc-ibtn--sm', onImage && 'nc-ibtn--on-img', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </button>
  );
});

function Toggle({ checked, onChange, label, disabled }) {
  return (
    <label className={'nc-toggle' + (disabled ? ' nc-toggle--disabled' : '')}>
      <input type="checkbox" role="switch" checked={!!checked} disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.checked)} />
      <span className="nc-toggle-track" aria-hidden="true" />
      {label}
    </label>
  );
}

function usePrefersReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(query).matches);
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia(query);
    const fn = () => setReduced(mq.matches);
    mq.addEventListener ? mq.addEventListener('change', fn) : mq.addListener(fn);
    return () => (mq.removeEventListener ? mq.removeEventListener('change', fn) : mq.removeListener(fn));
  }, []);
  return reduced;
}

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

export const DEFAULT_PREFERENCES = { releases: true, surveys: true, preview: true, motion: true, holdWhileRendering: false };

const SNOOZE_OPTIONS = [
  { key: 'hour', label: 'In 1 hour', until: 'in 1 hour' },
  { key: 'tomorrow', label: 'Tomorrow at 9:00', until: 'tomorrow at 9:00' },
  { key: 'week', label: 'Next Monday at 9:00', until: 'next Monday at 9:00' },
];

function categoryOf(item) {
  if (item.category) return item.category;
  if (item.type === 'action') return 'licensing';
  if (item.type === 'survey') return 'surveys';
  return 'releases';
}

/**
 * Holds the notification center state.
 * @param {Array} items   notifications (see sampleNotifications.js for the shape)
 * @param {object} opts   { preferences, onEvent(type, payload) }
 */
export function useNotifications(items, opts = {}) {
  const { onEvent } = opts;
  const emit = useCallback((type, payload) => { if (onEvent) onEvent(type, payload); }, [onEvent]);

  const [read, setRead] = useState(() => Object.fromEntries(items.filter((i) => !i.unread).map((i) => [i.id, true])));
  const [snoozed, setSnoozed] = useState({});
  const [dismissed, setDismissed] = useState({});
  const [expanded, setExpanded] = useState({});
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;
  const [resolved, setResolved] = useState({});
  const [prefs, setPrefs] = useState({ ...DEFAULT_PREFERENCES, ...(opts.preferences || {}) });

  const set = (setter, ids, value) => setter((prev) => {
    const next = { ...prev };
    ids.forEach((id) => { if (value === undefined) delete next[id]; else next[id] = value; });
    return next;
  });

  const allowed = useCallback((item) => {
    const c = categoryOf(item);
    if (c === 'releases') return prefs.releases;
    if (c === 'surveys') return prefs.surveys;
    return true; // licensing and account is always on
  }, [prefs]);

  const isLive = useCallback((item) => !dismissed[item.id] && !snoozed[item.id] && allowed(item), [dismissed, snoozed, allowed]);
  const isUnread = useCallback((item) => !read[item.id] && item.type !== 'survey', [read]);

  const unreadCount = useMemo(() => items.filter((i) => isLive(i) && isUnread(i)).length, [items, isLive, isUnread]);
  const snoozedItems = useMemo(() => items.filter((i) => snoozed[i.id] && !dismissed[i.id]), [items, snoozed, dismissed]);

  const actions = useMemo(() => ({
    markRead: (id) => { set(setRead, [id], true); emit('read', { id }); },
    markAllRead: () => { set(setRead, items.map((i) => i.id), true); emit('read-all', {}); },
    dismiss: (ids) => { set(setDismissed, ids, true); emit('dismiss', { ids }); },
    restore: (ids) => { set(setDismissed, ids, undefined); emit('restore', { ids }); },
    snooze: (id, option) => { set(setSnoozed, [id], option.until); emit('snooze', { id, option: option.key }); },
    unsnooze: (id) => { set(setSnoozed, [id], undefined); emit('unsnooze', { id }); },
    toggleExpanded: (id) => {
      const open = !expandedRef.current[id];
      setExpanded((prev) => ({ ...prev, [id]: open }));
      if (open) set(setRead, [id], true);
      emit(open ? 'expand' : 'collapse', { id });
    },
    resolve: (id) => { set(setResolved, [id], true); set(setRead, [id], true); emit('primary', { id }); },
    setPreference: (key, value) => { setPrefs((p) => ({ ...p, [key]: value })); emit('preference', { key, value }); },
  }), [items, emit]);

  return { items, read, snoozed, dismissed, expanded, resolved, prefs, unreadCount, snoozedItems, isLive, isUnread, actions };
}

/* ------------------------------------------------------------------ */
/* Bell                                                                */
/* ------------------------------------------------------------------ */

export const NotificationBell = React.forwardRef(function NotificationBell({ count = 0, expanded = false, onClick, controls }, ref) {
  return (
    <span className="nc-root" style={{ display: 'inline-flex' }}>
      <button ref={ref} type="button" className="nc-ibtn nc-bell" onClick={onClick}
        aria-label={count ? `Notifications, ${count} unread` : 'Notifications'} title="Notifications"
        aria-expanded={expanded} aria-controls={controls} aria-haspopup="dialog">
        <Glyph name="bell" />
        {count > 0 && <span className="nc-bell-count" aria-hidden="true">{count > 9 ? '9+' : count}</span>}
      </button>
    </span>
  );
});

/* ------------------------------------------------------------------ */
/* Panel                                                               */
/* ------------------------------------------------------------------ */

const TABS = ['All', 'Unread', 'Snoozed'];

/**
 * @param {object}   props.state       return value of useNotifications
 * @param {function} props.onClose     close the panel (Escape, X)
 * @param {function} props.onOpenItem  (item, target) — "Full release notes", "Read more", "Take survey"
 * @param {Array}    props.emptyImages up to three render thumbnails for the empty state
 * @param {string}   props.id          id for aria-controls on the bell
 */
export function NotificationPanel({ state, onClose, onOpenItem, emptyImages = [], id = 'nc-panel', theme, className = '', style }) {
  const { items, snoozed, expanded, resolved, prefs, unreadCount, snoozedItems, isLive, isUnread, actions } = state;
  const reducedMotion = usePrefersReducedMotion();
  const [tab, setTab] = useState('All');
  const [view, setView] = useState('list');
  const [menu, setMenu] = useState(null); // { id, top, right, options }
  const [toast, setToast] = useState(null); // { text, undo }
  const [paused, setPaused] = useState({});
  const panelRef = useRef(null);
  const menuRef = useRef(null);
  const menuTrigger = useRef(null);
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const flash = useCallback((text, undo) => {
    clearTimeout(toastTimer.current);
    setToast({ text, undo });
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  }, []);

  /* --- menu: position from real DOM rects, keyboard support, outside click --- */
  const openMenu = (item, e) => {
    const trigger = e.currentTarget;
    const panel = panelRef.current;
    if (!panel || !trigger) return;
    const pr = panel.getBoundingClientRect();
    const br = trigger.getBoundingClientRect();
    const options = item.type === 'action' ? SNOOZE_OPTIONS.slice(0, 2) : SNOOZE_OPTIONS;
    const height = 34 + options.length * 32;
    let top = br.bottom - pr.top + 4;
    if (top + height > pr.height - 8) top = Math.max(8, br.top - pr.top - 4 - height);
    const right = Math.max(8, pr.right - br.right);
    menuTrigger.current = trigger;
    setMenu({ id: item.id, top, right, options });
  };
  const closeMenu = useCallback((refocus) => {
    setMenu(null);
    if (refocus && menuTrigger.current) menuTrigger.current.focus();
  }, []);

  useLayoutEffect(() => {
    if (menu && menuRef.current) {
      const first = menuRef.current.querySelector('[role="menuitem"]');
      if (first) first.focus();
    }
  }, [menu]);

  useEffect(() => {
    if (!menu) return undefined;
    const onDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && e.target !== menuTrigger.current) closeMenu(false);
    };
    document.addEventListener('pointerdown', onDown, true);
    return () => document.removeEventListener('pointerdown', onDown, true);
  }, [menu, closeMenu]);

  const onMenuKey = (e) => {
    const list = Array.from(menuRef.current.querySelectorAll('[role="menuitem"]'));
    const i = list.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); list[(i + 1) % list.length].focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
    if (e.key === 'Tab') closeMenu(false);
  };

  const onPanelKey = (e) => {
    if (e.key !== 'Escape') return;
    e.stopPropagation();
    if (menu) closeMenu(true);
    else if (view === 'settings') setView('list');
    else if (onClose) onClose();
  };

  /* --- actions with undo --- */
  const dismiss = (ids, text) => {
    actions.dismiss(ids);
    setMenu(null);
    flash(text, () => actions.restore(ids));
  };
  const snooze = (itemId, option) => {
    actions.snooze(itemId, option);
    closeMenu(false);
    flash('Snoozed until ' + option.until, () => actions.unsnooze(itemId));
  };

  /* --- derived lists --- */
  const visible = (item) => tab !== 'Snoozed' && isLive(item) && (tab === 'All' || isUnread(item)) && (item.type !== 'survey' || tab === 'All');
  const byType = (t) => items.filter((i) => i.type === t && visible(i));
  const actionItems = byType('action');
  const newItems = items.filter((i) => (i.type === 'feature' || i.type === 'update') && visible(i));
  const earlierItems = byType('news');
  const surveyItems = byType('survey');
  const showSnoozed = tab === 'Snoozed' && snoozedItems.length > 0;
  const isEmpty = !actionItems.length && !newItems.length && !earlierItems.length && !showSnoozed;

  const clearable = items.filter((i) => isLive(i) && (i.type !== 'action' || resolved[i.id]));
  const keptAction = items.some((i) => i.type === 'action' && isLive(i) && !resolved[i.id]);
  const clearAll = () => {
    if (!clearable.length) return;
    const n = clearable.length;
    dismiss(clearable.map((i) => i.id), `${n} ${n === 1 ? 'notification' : 'notifications'} cleared${keptAction ? ' · licensing kept' : ''}`);
  };

  const tabCount = { All: 0, Unread: unreadCount, Snoozed: snoozedItems.length };
  const open = (item, target) => { actions.markRead(item.id); if (onOpenItem) onOpenItem(item, target); };

  /* --- renderers --- */
  // Plain render helpers (not components) so buttons keep their DOM identity between renders — focus and menu anchoring rely on it.
  const unreadDot = (item) => (isUnread(item)
    ? <button type="button" className="nc-dot" title="Mark as read" aria-label={`Mark “${item.title}” as read`} onClick={() => actions.markRead(item.id)} />
    : null);

  const remindButton = (item) => (
    <IconButton label="Remind me later" aria-haspopup="menu" aria-expanded={menu && menu.id === item.id ? true : false}
      onClick={(e) => (menu && menu.id === item.id ? closeMenu(false) : openMenu(item, e))}>
      <Glyph name="clock" />
    </IconButton>
  );

  const dismissButton = (item, small, onImage) => (
    <IconButton label="Dismiss" small={small} onImage={onImage} aria-describedby={`nc-t-${item.id}`}
      onClick={() => dismiss([item.id], 'Notification dismissed')}>
      <Icon name="close" size={10} />
    </IconButton>
  );

  const renderAction = (item) => {
    if (resolved[item.id]) {
      return (
        <div className="nc-done" key={item.id}>
          <span className="nc-done-ic"><Icon name="checkmark" size={12} /></span>
          <div className="nc-row-main">
            <p className="nc-h" id={`nc-t-${item.id}`}>{item.doneTitle || 'Done'}</p>
            {item.doneBody && <p className="nc-text nc-action-sub">{item.doneBody}</p>}
          </div>
          {dismissButton(item, true)}
        </div>
      );
    }
    // Same footprint as the confirmation card: icon · two lines · actions, with a thin time-left bar on the bottom edge.
    const days = item.deadline ? Math.max(0, Math.min(30, item.deadline.daysLeft)) : null;
    const urgent = days !== null && days <= 3;
    const daysLabel = days === null ? null : days === 0 ? 'due today' : days === 1 ? '1 day left' : `${days} days left`;
    return (
      <article className={'nc-action' + (urgent ? ' is-urgent' : '')} key={item.id} aria-labelledby={`nc-t-${item.id}`}
        aria-describedby={`nc-b-${item.id}`} title={item.body}>
        <span className="nc-action-ic"><Glyph name={item.icon || 'update'} /></span>
        <div className="nc-row-main">
          <h4 className="nc-h" id={`nc-t-${item.id}`}>{item.title}</h4>
          <p className="nc-text nc-action-sub" id={`nc-b-${item.id}`}>
            {item.due ? `Due ${item.due}` : item.body}
            {daysLabel && <> · <span className="nc-action-days">{daysLabel}</span></>}
          </p>
        </div>
        <Button size="xs" variant="primary" onClick={() => { actions.resolve(item.id); if (onOpenItem) onOpenItem(item, 'primary'); }}>
          {item.primaryShortLabel || item.primaryLabel || 'Open'}
        </Button>
        <IconButton small label="Remind me later" aria-haspopup="menu" aria-expanded={menu && menu.id === item.id ? true : false}
          onClick={(e) => (menu && menu.id === item.id ? closeMenu(false) : openMenu(item, e))}>
          <Glyph name="clock" />
        </IconButton>
        {days !== null && (
          <span className="nc-action-track" role="progressbar" aria-label="Time left" aria-valuemin={0} aria-valuemax={30} aria-valuenow={days}>
            <span style={{ width: `${Math.max(3, Math.round((days / 30) * 100))}%` }} />
          </span>
        )}
      </article>
    );
  };

  const renderFeature = (item) => {
    const playing = prefs.motion && !reducedMotion && !paused[item.id];
    const isOpen = !!expanded[item.id];
    const media = item.media || {};
    return (
      <article className="nc-feat" key={item.id} aria-labelledby={`nc-t-${item.id}`}>
        {media.src && (
          <div className="nc-media">
            <img className={playing ? 'nc-media-reveal' : ''} src={playing ? media.src : (media.poster || media.src)} alt={media.alt || ''} />
            {playing && <span className="nc-sweep" aria-hidden="true" />}
            <div className="nc-media-tags">
              {(item.products || []).map((p) => <ProductLogo key={p} name={p} size={22} />)}
              {item.chip && <span className="nc-chip">{item.chip}</span>}
            </div>
            <div className="nc-media-acts nc-hover-acts">
              {media.poster && prefs.motion && !reducedMotion && (
                <IconButton small onImage label={playing ? 'Pause animation' : 'Play animation'}
                  onClick={() => setPaused((p) => ({ ...p, [item.id]: playing }))}>
                  {playing ? <PauseGlyph /> : <PlayGlyph />}
                </IconButton>
              )}
              {dismissButton(item, true, true)}
            </div>
          </div>
        )}
        <div className="nc-feat-body">
          <div className="nc-eyebrow-row">
            {item.eyebrow && <span className="nc-eyebrow">{item.eyebrow}</span>}
            <span className="nc-meta">· {item.time}</span>
            <span className="nc-spacer" />
            {unreadDot(item)}
          </div>
          <h4 className="nc-feat-title" id={`nc-t-${item.id}`}>{item.title}</h4>
          <p className="nc-text">{item.body}</p>
          {isOpen && item.details && (
            <div className="nc-details" id={`nc-d-${item.id}`}>
              {item.details.some((d) => d.icon) ? (
                // Feature highlights: icon tile, bold one-line title, one short line below
                <ul className="nc-steps nc-highlights">
                  {item.details.map((d, i) => (
                    <li key={i}>
                      <span className="nc-hl-ic" aria-hidden="true"><Glyph name={d.icon} size={12} /></span>
                      <span className="nc-text"><b>{d.title}</b>{d.text}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                // Sequential steps: numbered
                <ol className="nc-steps">
                  {item.details.map((d, i) => (
                    <li key={i}><span className="nc-step-n" aria-hidden="true">{i + 1}</span><span className="nc-text"><b>{d.title}</b> {d.text}</span></li>
                  ))}
                </ol>
              )}
              {item.link && <a className="nc-link" href={item.link.href} onClick={() => open(item, 'link')}>{item.link.label} <Icon name="arrow-right" size={10} /></a>}
            </div>
          )}
          <div className="nc-feat-foot">
            {item.details && (
              <Button variant="secondary" icon={isOpen ? 'chevron-up' : 'chevron-down'} aria-expanded={isOpen} aria-controls={`nc-d-${item.id}`}
                onClick={() => actions.toggleExpanded(item.id)}>{isOpen ? 'Show less' : 'See what’s new'}</Button>
            )}
            <span className="nc-spacer" />
            <span className="nc-hover-acts">{remindButton(item)}</span>
          </div>
        </div>
      </article>
    );
  };

  const renderUpdate = (item) => {
    const isOpen = !!expanded[item.id];
    return (
      <div key={item.id}>
        <div className="nc-row">
          {item.thumb ? <img className="nc-thumb" src={item.thumb} alt="" /> : <span className="nc-tile"><Glyph name="megaphone" /></span>}
          <div className="nc-row-main">
            <p className="nc-h" id={`nc-t-${item.id}`}>{item.title}</p>
            <p className="nc-meta" style={{ marginTop: 2 }}>{item.summary} · {item.time}</p>
          </div>
          <span className="nc-hover-acts">{remindButton(item)}{dismissButton(item)}</span>
          {item.details && (
            <IconButton label={isOpen ? 'Hide details' : 'Show details'} aria-expanded={isOpen} aria-controls={`nc-d-${item.id}`}
              onClick={() => actions.toggleExpanded(item.id)}>
              <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={10} />
            </IconButton>
          )}
          {unreadDot(item)}
        </div>
        {isOpen && item.details && (
          <div className="nc-row-details" id={`nc-d-${item.id}`}>
            <ul className="nc-checks">
              {item.details.map((d, i) => <li key={i}><Icon name="checkmark" size={12} /><span><b>{d.title}</b> {d.text}</span></li>)}
            </ul>
            {item.link && <a className="nc-link" href={item.link.href} onClick={() => open(item, 'link')}>{item.link.label} <Icon name="arrow-right" size={10} /></a>}
          </div>
        )}
      </div>
    );
  };

  const renderNews = (item) => (
    <div className="nc-row" key={item.id}>
      <span className="nc-tile"><Glyph name="megaphone" /></span>
      <div className="nc-row-main">
        <p className="nc-h" id={`nc-t-${item.id}`}>{item.title}</p>
        <p className="nc-meta" style={{ marginTop: 2 }}>{item.time}</p>
      </div>
      <span className="nc-hover-acts">{remindButton(item)}{dismissButton(item)}</span>
      <IconButton label={`Read more about ${item.title}`} onClick={() => open(item, 'read-more')}><Icon name="arrow-right" size={10} /></IconButton>
      {unreadDot(item)}
    </div>
  );

  const renderSurvey = (item) => (
    <div className="nc-survey" key={item.id}>
      <span className="nc-tile nc-tile--sm nc-tile--accent"><Glyph name="gift" /></span>
      <div className="nc-survey-main">
        <p className="nc-h" style={{ fontSize: 12 }} id={`nc-t-${item.id}`}>{item.title}</p>
        <p className="nc-meta" style={{ marginTop: 2, lineHeight: 1.45 }}>{item.body}</p>
        {item.link && (
          <a className="nc-link" href={item.link.href} target="_blank" rel="noopener noreferrer" onClick={() => open(item, 'survey')}>
            {item.link.label} <Glyph name="external" size={12} />
          </a>
        )}
      </div>
      {dismissButton(item, true)}
    </div>
  );

  const rootClass = ['nc-root', className].filter(Boolean).join(' ');

  return (
    <div className={rootClass} data-theme={theme} style={style}>
      <section ref={panelRef} id={id} className="nc-panel" role="dialog" aria-label="Notifications" onKeyDown={onPanelKey}>
        {view === 'list' ? (
          <>
            <div className="nc-head">
              <h2 className="nc-title">Notifications</h2>
              <div className="nc-head-actions">
                <Button size="xs" variant="tertiary" disabled={!clearable.length} onClick={clearAll}>Clear all</Button>
                <IconButton label="Mark all as read" onClick={actions.markAllRead} disabled={!unreadCount}><Glyph name="checkAll" /></IconButton>
                <IconButton label="Notification settings" onClick={() => { setMenu(null); setView('settings'); }}><Glyph name="settings" /></IconButton>
                {onClose && <IconButton label="Close notifications" onClick={onClose}><Icon name="close" size={12} /></IconButton>}
              </div>
            </div>

            <div className="nc-tabs" role="tablist" aria-label="Filter notifications">
              {TABS.map((t) => (
                <button key={t} type="button" role="tab" className="nc-tab" aria-selected={tab === t}
                  onClick={() => { setTab(t); setMenu(null); }}>
                  {t}
                  {tabCount[t] > 0 && <span className={'nc-tab-count' + (t === 'Snoozed' ? ' nc-tab-count--muted' : '')}>{tabCount[t]}</span>}
                </button>
              ))}
            </div>

            <div className="nc-body" role="tabpanel" aria-label={tab}>
              {actionItems.length > 0 && (
                <section className="nc-section" aria-label="Action needed">
                  <h3 className="nc-label">Action needed</h3>
                  {actionItems.map(renderAction)}
                </section>
              )}
              {newItems.length > 0 && (
                <section className="nc-section" aria-label="What’s new">
                  <h3 className="nc-label">What’s new</h3>
                  {newItems.map((i) => (i.type === 'feature' ? renderFeature(i) : renderUpdate(i)))}
                </section>
              )}
              {earlierItems.length > 0 && (
                <section className="nc-section" aria-label="Earlier" style={{ gap: 4 }}>
                  <h3 className="nc-label" style={{ marginBottom: 4 }}>Earlier</h3>
                  {earlierItems.map(renderNews)}
                </section>
              )}
              {showSnoozed && (
                <section className="nc-section" aria-label="Snoozed" style={{ gap: 4 }}>
                  <h3 className="nc-label" style={{ marginBottom: 4 }}>Snoozed</h3>
                  {snoozedItems.map((i) => (
                    <div className="nc-row" key={i.id}>
                      <span className="nc-tile"><Glyph name="clock" /></span>
                      <div className="nc-row-main">
                        <p className="nc-h">{i.title}</p>
                        <p className="nc-meta" style={{ marginTop: 2 }}>Back {snoozed[i.id]}</p>
                      </div>
                      <Button size="xs" variant="tertiary" onClick={() => actions.unsnooze(i.id)}>Unsnooze</Button>
                    </div>
                  ))}
                </section>
              )}
              {isEmpty && (
                <div className="nc-empty" role="status">
                  <div className={'nc-empty-art' + (emptyImages.length >= 3 ? '' : ' nc-empty-art--plain')} aria-hidden="true">
                    {emptyImages.length >= 3 && emptyImages.slice(0, 3).map((src, i) => <img key={i} src={src} alt="" />)}
                    <span className="nc-empty-check"><Icon name="checkmark" size={14} /></span>
                  </div>
                  <p className="nc-h" style={{ fontSize: 14 }}>{tab === 'Snoozed' ? 'Nothing snoozed' : 'You’re all caught up'}</p>
                  <p className="nc-text">{tab === 'Snoozed' ? 'Use Remind me later on any notification to bring it back when it suits you.' : 'Releases, licensing and account updates will appear here.'}</p>
                </div>
              )}
              {surveyItems.map(renderSurvey)}
            </div>
          </>
        ) : (
          <>
            <div className="nc-head nc-head--sub">
              <IconButton label="Back to notifications" onClick={() => setView('list')}>
                <span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}><Icon name="arrow-right" size={10} /></span>
              </IconButton>
              <h2 className="nc-title">Notification settings</h2>
              {onClose && <IconButton label="Close notifications" onClick={onClose}><Icon name="close" size={12} /></IconButton>}
            </div>
            <div className="nc-body">
              <div className="nc-settings">
                <section aria-label="Show in notifications">
                  <h3 className="nc-label">Show in notifications</h3>
                  <Toggle checked={prefs.releases} onChange={(v) => actions.setPreference('releases', v)} label="Product releases and integrations" />
                  <Toggle checked={prefs.surveys} onChange={(v) => actions.setPreference('surveys', v)} label="Surveys and feedback requests" />
                  <div>
                    <Toggle checked disabled label="Licensing and account" />
                    <p className="nc-help" style={{ marginTop: 4 }}>Always on. These affect access to your licenses.</p>
                  </div>
                </section>
                <section aria-label="While you work">
                  <h3 className="nc-label">While you work</h3>
                  <Toggle checked={prefs.preview} onChange={(v) => actions.setPreference('preview', v)} label="Show a brief preview when something arrives" />
                  <Toggle checked={prefs.motion} onChange={(v) => actions.setPreference('motion', v)} label="Play animations in release notes" />
                  <Toggle checked={prefs.holdWhileRendering} onChange={(v) => actions.setPreference('holdWhileRendering', v)} label="Hold notifications while rendering" />
                </section>
              </div>
            </div>
          </>
        )}

        {menu && (
          <div ref={menuRef} className="nc-menu" role="menu" aria-label="Remind me" style={{ top: menu.top, right: menu.right }} onKeyDown={onMenuKey}>
            <p className="nc-label nc-menu-label" aria-hidden="true">Remind me</p>
            {menu.options.map((o) => (
              <button key={o.key} type="button" role="menuitem" className="nc-menu-item" onClick={() => snooze(menu.id, o)}>
                <Glyph name="clock" /> {o.label}
              </button>
            ))}
          </div>
        )}

        {toast && (
          <div className="nc-snack" role="status" aria-live="polite">
            <span className="nc-snack-text">{toast.text}</span>
            {toast.undo && (
              <button type="button" className="nc-snack-undo" onClick={() => { toast.undo(); clearTimeout(toastTimer.current); setToast(null); }}>Undo</button>
            )}
            <IconButton small label="Close message" onClick={() => { clearTimeout(toastTimer.current); setToast(null); }}><Icon name="close" size={10} /></IconButton>
          </div>
        )}
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Convenience wrapper: bell + anchored panel                          */
/* ------------------------------------------------------------------ */

/**
 * Drop-in: renders the bell and, when open, the panel floating below it (no scrim, viewport stays usable).
 * For custom layouts use NotificationBell + NotificationPanel + useNotifications directly.
 */
export function NotificationCenter({ items, defaultOpen = false, onEvent, onOpenItem, emptyImages, theme, panelHeight = 'min(736px, calc(100vh - 64px))' }) {
  const state = useNotifications(items, { onEvent });
  const [open, setOpen] = useState(defaultOpen);
  const bellRef = useRef(null);
  const close = useCallback(() => { setOpen(false); if (bellRef.current) bellRef.current.focus(); }, []);
  return (
    <span className="nc-root" data-theme={theme} style={{ position: 'relative', display: 'inline-flex' }}>
      <NotificationBell ref={bellRef} count={state.unreadCount} expanded={open} controls="nc-panel" onClick={() => setOpen((o) => !o)} />
      {open && (
        <NotificationPanel state={state} onClose={close} onOpenItem={onOpenItem} emptyImages={emptyImages} theme={theme}
          style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, height: panelHeight, zIndex: 1000 }} />
      )}
    </span>
  );
}

export default NotificationCenter;
