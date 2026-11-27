(function (P) {
  const { h } = P.ui;
  const { store } = P;

  const ROUTES = {
    credits: {
      path: '/organization/credits',
      id: 'ORGANIZATION_CONSUMPTION_CREDITS',
      page: () => P.pages.credits,
    },
    usage: {
      path: '/organization/credits/usage',
      id: 'ORGANIZATION_CONSUMPTION_CREDITS_USAGE',
      page: () => P.pages.usage,
    },
    teams: {
      path: '/organization/teams',
      id: 'ORGANIZATION_TEAMS',
      page: () => P.pages.teams,
    },
    projects: {
      path: '/organization/projects',
      id: 'ORGANIZATION_PROJECTS',
      page: () => P.pages.projects,
    },
  };

  const ORGANIZATION_ITEMS = [
    {
      title: 'Users & Product assignments',
    },
    {
      title: 'Teams',
      route: 'teams',
    },
    {
      title: 'Projects',
      route: 'projects',
    },
    {
      title: 'Chaos Credits Management',
      route: 'credits',
      subroutes: ['usage'],
      badge: 'New',
    },
  ];

  const TOP_ITEMS = [
    {
      title: 'Products',
      chevron: true,
    },
    {
      title: 'Licensing',
      chevron: true,
    },
    {
      title: 'Organization',
      items: ORGANIZATION_ITEMS,
    },
    {
      title: 'Billing',
      chevron: true,
    },
    {
      title: 'Learning',
    },
    {
      title: 'CGconnect',
    },
    {
      title: 'Account',
      chevron: true,
    },
  ];

  // Routing is kept in memory so it works inside the design canvas,
  // where the frame does not reliably let the URL hash change.
  const routeFromPath = (path) => Object.keys(ROUTES).find((key) => ROUTES[key].path === path);
  let current = null;

  const currentRoute = () => {
    if (current && ROUTES[current]) return current;
    return routeFromPath(window.location.hash.replace(/^#/, '')) || 'credits';
  };

  const navigate = (route) => {
    if (!ROUTES[route]) return;
    current = route;
    try { history.replaceState(null, '', `#${ROUTES[route].path}`); } catch (e) { /* frame may block it */ }
    if (P.ui && P.ui.closeDialog) P.ui.closeDialog();
    render();
    const page = document.getElementById('page');
    if (page && page.scrollIntoView) window.scrollTo(0, 0);
  };

  // Catch in-app links ("#/organization/...") before the canvas treats them as anchors.
  window.addEventListener(
    'click',
    (e) => {
      const a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (href === '#') { e.preventDefault(); return; }
      if (!href.startsWith('#/')) return;
      const route = routeFromPath(href.slice(1));
      if (!route) return;
      e.preventDefault();
      e.stopPropagation();
      navigate(route);
    },
    true,
  );

  const notInPrototype = (what) => (e) => {
    if (e) e.preventDefault();
    P.ui.snackbar(`${what} in the real app. It is not part of this prototype.`);
  };

  const navLink = (item, onClick) =>
    h(
      'a',
      { className: 'page-nav-item', href: item.route ? `#${ROUTES[item.route].path}` : '#', onClick },
      item.title,
      item.badge && h('span', { className: 'menu-item-badge' }, item.badge),
    );

  const subMenu = (route) =>
    h(
      'div',
      { className: 'mui-grid-container justify-center sub-menu', style: { zIndex: 1 } },
      ORGANIZATION_ITEMS.map((item) => {
        const current = item.route === route || (item.subroutes || []).includes(route);
        return h(
          'div',
          { className: `mui-grid-item nav-menu-item${current ? ' current' : ''} ` },
          navLink(item, item.route ? undefined : notInPrototype(`"${item.title}" opens the existing users page`)),
        );
      }),
    );

  const header = (route) => {
    const org = store.org();
    const admin = org.members.find((m) => m.role === 'admin') || org.members[0];
    return h(
      'header',
      { id: 'page-header' },
      h(
        'div',
        { className: 'nav-menu' },
        h(
          'div',
          null,
          h(
            'div',
            { className: 'mui-grid-container justify-center menu' },
            TOP_ITEMS.map((item) =>
              h(
                'div',
                { className: `mui-grid-item nav-menu-item${item.items ? ' current' : ''} ` },
                navLink(item, item.items ? (e) => e.preventDefault() : notInPrototype(`"${item.title}" opens another my.chaos section`)),
                (item.items || item.chevron) && h('span', { className: 'chevron' }),
                item.items && subMenu(route),
              ),
            ),
          ),
          h('div', { className: `sub-menu-background ${ROUTES[route].id}` }),
        ),
      ),
      h('a', { className: 'logo', href: `#${ROUTES.credits.path}` }, h('img', { src: `${P.assetBase}mychaosgroup-logo.svg`, alt: 'Chaos Group' })),
      h(
        'div',
        { className: 'side-menu' },
        h(
          'div',
          { className: 'mui-grid-container account-info', title: `${P.ui.memberName(admin)} (${admin.email})` },
          h('div', { className: 'name' }, `${admin.firstName[0]}${admin.lastName[0]}`),
        ),
      ),
    );
  };

  const orgPicker = () => {
    const activeOrg = store.org().guid;
    return h(
      'div',
      { className: 'org-toggle', role: 'group', 'aria-label': 'Organization' },
      store.orgs().map((org) =>
        h(
          'button',
          { type: 'button', className: org.guid === activeOrg ? 'active' : '', 'aria-pressed': String(org.guid === activeOrg), onClick: () => store.switchOrg(org.guid) },
          org.guid === 'org-acme' ? `${org.name} (shared pool)` : `${org.name} (no shared pool)`,
        ),
      ),
    );
  };

  const render = () => {
    const route = currentRoute();
    const root = document.getElementById('root');
    if (!root) return; // the canvas mounts #root after the scripts load
    root.replaceChildren(
      h(
        'div',
        { className: 'page', id: 'page' },
        h(
          'div',
          { className: 'page-header-content' },
          header(route),
          h('div', { id: 'page-content', className: `${ROUTES[route].id}${route === 'credits' || route === 'usage' ? ' credits-route' : ''}` }, ROUTES[route].page().render()),
        ),
      ),
    );
    P.ui.renderDialog();
  };

  P.app = {
    navigate,
    orgPicker,
    notInPrototype,
    render,
  };

  window.addEventListener('hashchange', () => {
    const r = routeFromPath(window.location.hash.replace(/^#/, ''));
    if (r) current = r;
    P.ui.closeDialog();
    render();
  });
  store.subscribe(render);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else if (document.getElementById('root')) render();

  // The design canvas serves the prototype's files through its own fetch, not as
  // plain URLs, so images the scripts create are loaded through fetch and shown
  // from a local copy.
  const imageCache = new Map();
  const fixImage = (img) => {
    const src = img.getAttribute('src') || '';
    if (!src || /^(data:|blob:|https?:)/.test(src) || img.dataset.protoSrc === src) return;
    img.dataset.protoSrc = src;
    if (!imageCache.has(src)) {
      imageCache.set(
        src,
        window
          .fetch(src)
          .then((r) => (r.ok ? r.blob() : Promise.reject(r.status)))
          .then((b) => URL.createObjectURL(b))
          .catch(() => null),
      );
    }
    imageCache.get(src).then((url) => {
      if (url && img.dataset.protoSrc === src) img.src = url;
    });
  };
  const fixImages = (node) => {
    if (!node || node.nodeType !== 1) return;
    if (node.tagName === 'IMG') fixImage(node);
    node.querySelectorAll && node.querySelectorAll('img').forEach(fixImage);
  };
  new MutationObserver((records) => {
    records.forEach((r) => {
      if (r.type === 'attributes') fixImages(r.target);
      else r.addedNodes.forEach(fixImages);
    });
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
  fixImages(document.body);
})(window.Proto = window.Proto || {});
