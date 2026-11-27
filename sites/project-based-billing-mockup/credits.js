(function (P) {
  const { h, icon, formatDate, formatCredits, memberName, select, showDialog, mutate, actionMenu } = P.ui;
  const { store } = P;
  const c = P.c;

  const SUBTITLE =
    'Chaos Credits is a new system that manages credit consumption across Veras, AI Enhancer, AI Upscaler, and Cloud rendering.';

  // Overview tiles

  const ringIndicator = (percent) => {
    const radius = 7;
    const length = 2 * Math.PI * radius;
    const value = Math.min(100, Math.max(0, percent));
    const ring = `<svg viewBox="0 0 18 18" width="18" height="18"><circle cx="9" cy="9" r="${radius}" fill="none" stroke="#ededed" stroke-width="3"/><circle cx="9" cy="9" r="${radius}" fill="none" stroke="${
      value >= 90 ? '#E1161C' : value >= 80 ? '#F3712B' : '#0B9EDD'
    }" stroke-width="3" stroke-dasharray="${(length * value) / 100} ${length}" transform="rotate(-90 9 9)"/></svg>`;
    const el = h('span', { className: 'rank-usage', 'data-tooltip': `${Math.round(value)}% used` });
    el.innerHTML = ring;
    return el;
  };

  const entryRow = (row, leading, badge) =>
    h(
      'div',
      { className: 'row entry-row' },
      leading,
      h(
        'div',
        { className: 'cell col-product' },
        h('img', { src: `${P.assetBase}images/product-icons/${row.productCode}.svg`, alt: '', className: 'product-icon' }),
        h(
          'div',
          { className: 'product-text' },
          h('span', { className: 'product-name' }, row.productName),
          h('span', { className: 'product-subtitle' }, row.subtitle, badge),
        ),
      ),
      h(
        'div',
        { className: 'cell col-remaining' },
        h('span', { className: 'remaining-value' }, formatCredits(row.balance)),
        h('span', { className: 'remaining-total' }, ` / ${formatCredits(row.totalCredits)}`),
      ),
      h('div', { className: 'cell col-refresh' }, formatDate(row.expireOn)),
    );

  const listHeader = (withRank) =>
    h(
      'div',
      { className: 'row header-row' },
      withRank && h('div', { className: 'cell col-rank' }, '#'),
      h('div', { className: 'cell col-product' }, 'Product'),
      h('div', { className: 'cell col-remaining' }, 'Remaining'),
      h('div', { className: 'cell col-refresh' }, 'Refresh'),
    );

  const overviewTile = ({ label, tooltip, balance, total, list }) => {
    const percent = total ? (balance / total) * 100 : 0;
    const body = h('div', null, list);
    const toggle = h('button', { type: 'button', className: 'collapse-toggle', 'aria-label': 'Collapse', 'aria-expanded': 'true' }, icon('arrowUp'));
    toggle.addEventListener('click', () => {
      const open = body.style.display === 'none';
      body.style.display = open ? '' : 'none';
      toggle.replaceChildren(icon(open ? 'arrowUp' : 'arrowDown'));
      toggle.setAttribute('aria-expanded', String(open));
    });
    return h(
      'div',
      { className: 'credits-overview-tile' },
      h(
        'div',
        { className: 'tile-header' },
        h(
          'div',
          { className: 'header-summary' },
          c.tileHeaderTitle(label, tooltip),
          h(
            'div',
            { className: 'metrics' },
            h(
              'div',
              { className: 'counts' },
              h('div', { className: 'remaining' }, h('span', { className: 'numeric-metrics' }, formatCredits(balance)), h('span', null, '\u00a0remaining')),
              h('span', null, `of ${formatCredits(total)}`),
            ),
            h('div', { className: 'percentage' }, h('span', { className: 'numeric-metrics' }, `${Math.round(percent)}%`), h('span', null, '\u00a0available')),
          ),
        ),
        toggle,
      ),
      body,
    );
  };

  const namedRows = () => {
    const org = store.org();
    const used = org.members.reduce((acc, m) => acc + (m.named || 0), 0);
    return org.namedGrants.map((g) => ({
      ...g,
      totalCredits: g.numberOfSeats * g.creditsPerSeat,
      balance: g.numberOfSeats * g.creditsPerSeat - used,
      subtitle: `Monthly allowance \u00b7 ${g.numberOfSeats} seats`,
    }));
  };

  const sharedRows = () =>
    store.org().sharedGrants.map((g) => ({
      ...g,
      balance: g.totalCredits - g.consumed,
      usagePercent: (g.consumed / g.totalCredits) * 100,
      subtitle: g.grantType === 'ela' ? 'Annual pool' : `Monthly allowance \u00b7 ${g.numberOfSeats} seats`,
    }));

  const overviewTiles = () => {
    const named = namedRows();
    const shared = sharedRows();
    const sumOf = (rows, key) => rows.reduce((acc, r) => acc + r[key], 0);
    return h(
      'div',
      { className: 'credits-overview-tiles' },
      named.length > 0 &&
        overviewTile({
          label: 'Named credits',
          tooltip: 'Assigned to one person. Only that person can spend them, and they are used up before any shared credits.',
          balance: sumOf(named, 'balance'),
          total: sumOf(named, 'totalCredits'),
          list: h(
            'div',
            { className: 'credits-entry-list named' },
            listHeader(false),
            named.map((row) =>
              entryRow(
                row,
                null,
                row.unassignedSeats > 0 && h('span', { className: 'unassigned-badge' }, h('span', { className: 'dot' }), `${row.unassignedSeats} unassigned`),
              ),
            ),
          ),
        }),
      shared.length > 0 &&
        overviewTile({
          label: 'Shared pool',
          tooltip: 'All users can draw from this balance. Credits are being consumed by expiration date.',
          balance: sumOf(shared, 'balance'),
          total: sumOf(shared, 'totalCredits'),
          list: h(
            'div',
            { className: 'credits-entry-list shared' },
            listHeader(true),
            shared.map((row) => entryRow(row, h('div', { className: 'cell col-rank' }, ringIndicator(row.usagePercent)))),
          ),
        }),
    );
  };

  const teamBudgetsCard = () => {
    const summary = store.budgetSummary();
    const budgeted = store.teamSummaries().filter((t) => t.budget).length;
    return h(
      'div',
      { className: 'team-budgets-card' },
      h(
        'div',
        { className: 'team-budgets-figures' },
        h('span', { className: 'tile-label' }, 'Team budgets'),
        P.feature('allocation') && h('span', null, h('span', { className: 'numeric-metrics' }, formatCredits(summary.reservedForTeams)), ' allocated to teams'),
        h('span', null, h('span', { className: 'numeric-metrics' }, formatCredits(summary.limitsTotal)), ' in team limits'),
        h('span', null, `${budgeted} teams with a budget`),
      ),
      h('button', { type: 'button', className: 'button', onClick: () => P.app.navigate('teams') }, 'Manage teams'),
    );
  };

  // Users table with personal limits

  const LIMIT_OPTIONS = [
    {
      value: 0,
      label: 'Disable access',
    },
    {
      value: 50,
      label: '50',
    },
    {
      value: 100,
      label: '100',
    },
    {
      value: 500,
      label: '500',
    },
    {
      value: 1000,
      label: '1,000',
    },
    {
      value: null,
      label: 'No limit',
    },
    {
      value: 'custom',
      label: 'Custom',
    },
  ];

  const usageLimitDialog = (member) => {
    const d = {
      error: null,
      selected: undefined,
      custom: '0',
    };
    const value = () => (d.selected === 'custom' ? Math.max(0, Math.floor(Number(d.custom) || 0)) : d.selected);
    d.render = () => ({
      title: 'Set usage limits',
      className: 'distribute-credit-limit',
      error: d.error,
      confirmLabel: 'Distribute',
      confirmDisabled: d.selected === undefined,
      onConfirm: () =>
        mutate(d, () => store.setUsageLimit(member.guid, value()), {
          onSuccess: () => P.ui.snackbar(`Usage limit updated for ${memberName(member)}.`),
        }),
      body: [
        h('p', { className: 'subtitle' }, 'Manage limits for the selected users in the Organisation.'),
        h('div', { className: 'users-tag' }, h('strong', null, '1'), ' Users'),
        h(
          'div',
          { className: 'options-card' },
          h('div', { className: 'options-header' }, icon('coin', 'credits-icon'), h('strong', null, `${formatCredits(store.poolFigures().total)} Credits`)),
          h('div', { className: 'divider' }),
          h(
            'div',
            { className: 'chip-row' },
            LIMIT_OPTIONS.map((option) =>
              h(
                'button',
                {
                  type: 'button',
                  className: d.selected === option.value ? 'chip active' : 'chip',
                  onClick: () => {
                    d.selected = option.value;
                    d.refresh();
                  },
                },
                option.label,
              ),
            ),
          ),
          d.selected === 'custom' &&
            P.ui.textField({
              name: 'creditLimit',
              type: 'number',
              label: 'Custom limit (credits)',
              value: d.custom,
              onInput: (v) => {
                d.custom = v;
              },
            }),
        ),
      ],
    });
    return d;
  };

  const limitCell = (member, resetDate) => {
    if (!member.quota || member.quota.maxAmount === 0) return c.quotaBadge('disabled');
    if (member.quota.maxAmount === null) return c.quotaBadge('unlimited');
    return [h('span', null, formatCredits(member.quota.maxAmount)), h('span', { className: 'limit-reset' }, `Resets ${formatDate(resetDate)}`)];
  };

  const usersTable = () => {
    const org = store.org();
    const poolBalance = store.poolFigures().remaining;
    const perSeat = org.namedGrants.length ? org.namedGrants[0].creditsPerSeat : 0;
    const remainingFor = (member) => {
      if (!member.quota) return 0;
      const quotaLeft = member.quota.maxAmount === null ? Infinity : Math.max(0, member.quota.maxAmount - member.quota.usage);
      return Math.min(quotaLeft, poolBalance);
    };
    return h(
      'div',
      { className: 'credits-details-table credit-users-table' },
      h(
        'div',
        { className: 'row header-row' },
        h('div', { className: 'cell header-cell col-user' }, 'User'),
        h('div', { className: 'cell header-cell col-usage' }, 'Named credits used'),
        h('div', { className: 'cell header-cell col-usage' }, 'Shared pool used'),
        h('div', { className: 'cell header-cell col-limit', 'data-tooltip': 'Consumption limit for an individual user on credits drawn from the shared pool. Does not include named credits.' }, 'Usage limit'),
        h('div', { className: 'cell header-cell col-actions' }),
      ),
      h('div', { className: 'divider' }),
      org.members.map((member, index) => {
        const used = member.quota ? member.quota.usage : 0;
        return [
          h(
            'div',
            { className: `row ${index % 2 === 0 ? 'even-row' : 'odd-row'}${member.disabled ? ' deactivated' : ''}` },
            h('div', { className: 'cell col-user' }, h('span', { className: 'user-name' }, memberName(member)), h('span', { className: 'user-email' }, member.email)),
            h(
              'div',
              { className: 'cell col-usage usage-data-cell' },
              member.named !== undefined ? c.usageProgressBar({ usedCredits: member.named, totalCredits: perSeat }) : '-',
            ),
            h('div', { className: 'cell col-usage usage-data-cell' }, c.usageProgressBar({ usedCredits: used, totalCredits: used + remainingFor(member) })),
            h('div', { className: 'cell col-limit' }, limitCell(member, org.windowEnd)),
            h(
              'div',
              { className: 'cell col-actions' },
              !member.disabled &&
                actionMenu('User actions', [
                  {
                    label: 'Set usage limit',
                    onClick: () => showDialog(usageLimitDialog(member)),
                  },
                ]),
            ),
          ),
          h('div', { className: 'divider' }),
        ];
      }),
    );
  };

  const noCredits = () =>
    h(
      'div',
      null,
      h('h1', { className: 'page-title with-subtitle' }, 'No Chaos Credits available'),
      h('h6', { className: 'page-title-subtitle' }, SUBTITLE),
      h('p', { style: { textAlign: 'center' } }, h('a', { className: 'button', href: '#', onClick: P.app.notInPrototype('Buy credits opens chaos.com') }, 'Buy credits')),
    );

  const render = () => {
    if (!store.org().sharedGrants.length && !store.org().namedGrants.length) return noCredits();
    return c.pageContent({ title: 'Organization Credits Management', subtitle: SUBTITLE }, [
      c.quickActions([
        h('button', { type: 'button', className: 'button plain', onClick: () => P.app.navigate('usage') }, 'Usage report'),
        h('button', { type: 'button', className: 'button', onClick: P.app.notInPrototype('Buy credits opens chaos.com') }, 'Buy credits'),
      ]),
      overviewTiles(),
      teamBudgetsCard(),
      c.tableSectionCard('Users', usersTable()),
    ]);
  };

  // Usage report (simplified)

  let groupBy = 'team';

  const usageGroups = () => {
    const org = store.org();
    const teamName = (guid) => {
      if (!guid) return 'No team';
      const team = org.teams.find((t) => t.guid === guid);
      return team ? team.name : 'Deleted team';
    };
    const projectName = (guid) => {
      if (!guid) return 'No project (personal work)';
      const project = org.projects.find((p) => p.guid === guid);
      return project ? project.name : 'Deleted project';
    };
    const totals = new Map();
    org.usage.forEach((row) => {
      const key = groupBy === 'team' ? row.teamGUID : row.projectGUID;
      const label = groupBy === 'team' ? teamName(row.teamGUID) : projectName(row.projectGUID);
      const sub = groupBy === 'project' && row.teamGUID ? teamName(row.teamGUID) : '';
      const entry = totals.get(key) || { label, sub, credits: 0 };
      entry.credits += row.credits;
      totals.set(key, entry);
    });
    return [...totals.values()].sort((a, b) => b.credits - a.credits);
  };

  const renderUsage = () => {
    const groups = usageGroups();
    const max = Math.max(1, ...groups.map((g) => g.credits));
    const total = groups.reduce((acc, g) => acc + g.credits, 0);
    return c.pageContent({ title: 'Chaos Credits Usage Report', subtitle: SUBTITLE }, [
      c.quickActions(h('button', { type: 'button', className: 'button plain', onClick: () => P.app.navigate('credits') }, 'Back to credits management')),
      c.tableSectionCard(`Shared pool usage this month: ${formatCredits(total)} credits`, [
        h(
          'div',
          { className: 'usage-groupby' },
          h('span', null, 'Group by'),
          select({
            options: [
              {
                value: 'team',
                label: 'By team',
              },
              {
                value: 'project',
                label: 'By project',
              },
            ],
            value: groupBy,
            ariaLabel: 'Group by',
            onChange: (value) => {
              groupBy = value;
              P.app.render();
            },
          }),
        ),
        groups.length
          ? h(
              'div',
              { className: 'usage-bars' },
              groups.map((g) =>
                h(
                  'div',
                  { className: 'usage-bar-row' },
                  h('div', { className: 'usage-bar-label', title: g.label }, g.label, g.sub && h('small', null, g.sub)),
                  h('div', { className: 'usage-bar-track' }, h('div', { className: 'usage-bar-fill', style: { width: `${(g.credits / max) * 100}%` } })),
                  h('div', { className: 'usage-bar-value' }, `${formatCredits(g.credits)} credits`),
                ),
              ),
            )
          : h('p', { className: 'credit-teams-empty' }, 'No usage in this period.'),
      ]),
    ]);
  };

  P.pages = P.pages || {};
  P.pages.credits = { render };
  P.pages.usage = { render: renderUsage };
})(window.Proto = window.Proto || {});
