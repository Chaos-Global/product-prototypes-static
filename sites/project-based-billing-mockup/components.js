(function (P) {
  const { h, formatCredits, infoTooltip } = P.ui;

  const DEGRADED_REASONS = {
    pool_shrink: 'The shared pool shrank and no longer covers this allocation.',
    grant_removed: 'A grant that backed this allocation was removed. Update the budget to clear this state.',
  };

  const STATE_LABELS = {
    none: 'No budget',
    active: 'Active',
    degraded: 'Degraded',
  };

  const usageColor = (percent) => {
    if (percent >= 90) return '#E1161C';
    if (percent >= 80) return '#F3712B';
    return '#0B9EDD';
  };

  const badgeColors = (percent) => {
    if (percent >= 90) return { badgeBg: '#ffe8e8', badgeText: '#E1161C' };
    if (percent >= 80) return { badgeBg: '#fff1e9', badgeText: '#F3712B' };
    return { badgeBg: '#f6f6f6', badgeText: '#525252' };
  };

  const progressBar = (percent) =>
    h(
      'div',
      { className: 'progress-bar' },
      h('div', {
        className: 'fill',
        style: {
          width: `${Math.min(percent || 0, 100)}%`,
          backgroundColor: usageColor(percent || 0),
        },
      }),
    );

  const usageProgressBar = ({ usedCredits, totalCredits, showTotal }) => {
    const percent = totalCredits ? Math.round((usedCredits / totalCredits) * 100) : undefined;
    const { badgeBg, badgeText } = badgeColors(percent || 0);
    const usedLabel = Math.ceil(usedCredits || 0).toLocaleString('en-US');
    const againstTotal = showTotal && totalCredits != null;
    return [
      h(
        'div',
        { className: 'usage-progress-bar' },
        h('span', { className: 'count' }, againstTotal ? `${usedLabel} / ${Number(totalCredits).toLocaleString('en-US')}` : usedLabel),
        !againstTotal &&
          percent !== undefined &&
          h('span', { className: 'badge', style: { backgroundColor: badgeBg, color: badgeText } }, `${Math.min(100, percent)}%`),
      ),
      progressBar(percent),
    ];
  };

  const tableSectionCard = (title, children) =>
    h('div', { className: 'credits-table-section-card' }, h('p', { className: 'title' }, title), children);

  const budgetState = (budget) => {
    if (!budget || budget.status === 'released') return 'none';
    if (budget.degraded) return 'degraded';
    return 'active';
  };

  const budgetTypeBadge = (mode) =>
    h('span', { className: `team-badge team-badge-${mode}` }, mode === 'reservation' ? 'Allocation' : 'Limit');

  const budgetStatusBadge = (budget) => {
    const state = budgetState(budget);
    const tooltip =
      state === 'degraded'
        ? DEGRADED_REASONS[budget.degradedReason] || 'The shared pool no longer covers this allocation.'
        : undefined;
    return h('span', { className: `team-badge team-badge-${state}`, 'data-tooltip': tooltip }, STATE_LABELS[state]);
  };

  const quotaBadge = (type) =>
    h(
      'span',
      {
        className: `quota-badge ${type}`,
        'data-tooltip':
          type === 'unlimited'
            ? 'The user can use all available credits from the shared pool.'
            : 'The user does not have access to the shared pool',
      },
      type === 'unlimited' ? 'Unlimited' : 'No access',
    );

  const pageContent = ({ title, subtitle, aside }, children) =>
    h(
      'div',
      { className: 'mui-grid-container justify-center' },
      h(
        'div',
        { className: 'mui-grid-item', style: { flexBasis: '100%' } },
        h(
          'div',
          { className: 'mui-grid-container justify-center' },
          h(
            'div',
            { className: 'mui-grid-item' },
            aside
              ? h('div', { className: 'page-title-row' }, h('h1', { className: `page-title${subtitle ? ' with-subtitle' : ''}` }, title), aside)
              : h('h1', { className: `page-title${subtitle ? ' with-subtitle' : ''}` }, title),
            subtitle && h('h6', { className: 'page-title-subtitle' }, subtitle),
          ),
        ),
      ),
      h('div', { className: 'mui-grid-item', style: { flexBasis: '100%', maxWidth: '100%' } }, children),
    );

  const quickActions = (buttons) =>
    h('div', { className: 'organization-quick-actions' }, h('div', { className: 'actions' }, buttons));

  const tileHeaderTitle = (label, tooltip) =>
    h('div', { className: 'header-title' }, h('span', { className: 'tile-label' }, label), tooltip && infoTooltip(tooltip));

  const listRow = ({ label, sublabel, removeLabel, disabled, onRemove }) =>
    h(
      'li',
      { className: 'credit-team-list-row' },
      h('span', { className: 'credit-team-list-label', title: label }, label, sublabel && h('span', { className: 'credit-team-list-sublabel' }, sublabel)),
      onRemove && P.ui.iconButton('close', { label: removeLabel, disabled, small: true, onClick: onRemove }),
    );

  const addItemRow = ({ options, placeholder, selectLabel, addLabel, disabled, selected, onSelect, onAdd }) => {
    const value = options.some((o) => o.value === selected) ? selected : '';
    return h(
      'div',
      { className: 'credit-team-add-row' },
      P.ui.select({
        options,
        value,
        placeholder,
        ariaLabel: selectLabel,
        className: 'credit-team-select',
        disabled: disabled || !options.length,
        onChange: onSelect,
      }),
      P.ui.button(addLabel, { variant: 'outlined', disabled: disabled || !value, onClick: () => onAdd(value) }),
    );
  };

  const fieldLabel = (text) => h('span', { className: 'credit-team-field-label' }, text);

  P.c = {
    progressBar,
    usageProgressBar,
    tableSectionCard,
    budgetState,
    budgetTypeBadge,
    budgetStatusBadge,
    quotaBadge,
    pageContent,
    quickActions,
    tileHeaderTitle,
    listRow,
    addItemRow,
    fieldLabel,
    formatCredits,
  };
})(window.Proto = window.Proto || {});
