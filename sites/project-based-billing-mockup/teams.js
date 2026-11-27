(function (P) {
  const { h, button, radioGroup, textField, showDialog, mutate, isPending, memberName, memberOptions, actionMenu } = P.ui;
  const { store } = P;
  const c = P.c;
  // Features that ship after the MVP are hidden when the artboard shows the MVP.
  const F = (name) => P.feature(name);

  const MAX_NAME_LENGTH = 100;
  const NAME_ERROR = 'Enter a name of up to 100 characters.';
  const DEFAULT_NOTIFY_PCTS = [50, 75, 90, 100];

  const MODE_OPTIONS = [
    {
      value: 'limit',
      label: 'Limit',
      hint: 'Caps what the team can spend. Credits stay open to everyone.',
    },
    {
      value: 'reservation', // shown as Allocation
      label: 'Allocation',
      hint: 'Holds credits aside so only the team can use them.',
    },
  ];

  const PERIOD_OPTIONS = [
    {
      value: 'monthly',
      label: 'Monthly',
    },
    {
      value: 'lifetime',
      label: 'One-time',
    },
  ];

  const EXHAUSTED_OPTIONS = [
    {
      value: 'warn',
      label: 'Warn and keep going',
    },
    {
      value: 'stop',
      label: 'Stop team work',
    },
    {
      value: 'overage',
      label: 'Allow an overage',
    },
  ];

  const CONFIRM_COPY = {
    release: {
      title: 'Release budget',
      get message() {
        return F('allocation')
          ? 'The budget is released for good. Allocated credits return to the shared pool. You can set a new budget afterwards.'
          : 'The budget is released for good. Team members fall back to their own credit limits. You can set a new budget afterwards.';
      },
      confirm: 'Release',
      destructive: true,
      status: 'released',
    },
    delete: {
      title: 'Delete team',
      get message() {
        return F('allocation')
          ? 'The team and its direct members are deleted. Its projects stay and no longer belong to a team. Its budget is released first and any allocated credits return to the shared pool.'
          : 'The team and its direct members are deleted. Its projects stay and no longer belong to a team. Its budget is released first.';
      },
      confirm: 'Delete',
      destructive: true,
    },
  };

  const nameInvalid = (name) => !name.trim() || name.trim().length > MAX_NAME_LENGTH;

  // Dialogs

  const teamNameDialog = (team) => {
    const d = {
      name: team ? team.name : '',
      touched: false,
      error: null,
    };
    const submit = () => {
      d.touched = true;
      if (nameInvalid(d.name)) return d.refresh();
      return mutate(d, () => (team ? store.renameTeam(team.guid, d.name) : store.createTeam(d.name)));
    };
    d.render = () => ({
      title: team ? 'Rename team' : 'Create team',
      error: d.error,
      confirmLabel: team ? 'Save' : 'Create',
      onConfirm: submit,
      body: textField({
        name: 'teamName',
        label: 'Team name',
        value: d.name,
        autoFocus: !d.touched,
        error: d.touched && nameInvalid(d.name) ? NAME_ERROR : null,
        onInput: (value) => {
          d.name = value;
          if (d.touched) d.refresh();
        },
        onEnter: submit,
      }),
    });
    return d;
  };

  const teamDetailsDialog = (teamGUID, title) => {
    const d = {
      error: null,
      memberSelected: '',
      projectSelected: '',
    };
    const run = (fn) => mutate(d, fn, { keepOpen: true });
    d.render = () => {
      const team = store.teamDetails(teamGUID);
      const busy = isPending();
      const projectOptions = store
        .projectSummaries()
        .filter((project) => !project.team)
        .map((project) => ({
          value: project.guid,
          label: project.name,
        }));
      return {
        title,
        error: d.error,
        closeLabel: 'Close',
        body: [
          h(
            'div',
            { className: 'credit-team-section' },
            c.fieldLabel(`Direct members (${team.members.length})`),
            h(
              'ul',
              { className: 'credit-team-list' },
              team.members.map((member) =>
                c.listRow({
                  label: memberName(member),
                  sublabel: member.email,
                  removeLabel: `Remove ${memberName(member)}`,
                  disabled: busy,
                  onRemove: () => run(() => store.removeTeamMember(team.guid, member.guid)),
                }),
              ),
            ),
            c.addItemRow({
              options: memberOptions(store.org().members, team.members),
              placeholder: 'Choose an organization member',
              selectLabel: 'Organization member',
              addLabel: 'Add member',
              disabled: busy,
              selected: d.memberSelected,
              onSelect: (value) => {
                d.memberSelected = value;
                d.refresh();
              },
              onAdd: (userGUID) => run(() => store.addTeamMember(team.guid, userGUID)),
            }),
          ),
          h(
            'div',
            { className: 'credit-team-section' },
            c.fieldLabel(`Project members (${team.projectMembers.length})`),
            h('p', { className: 'credit-team-field-hint' }, 'Members of the projects of this team. Manage them on the Projects page.'),
            h(
              'ul',
              { className: 'credit-team-list', 'aria-label': 'Project members' },
              team.projectMembers.map((member) => c.listRow({ label: memberName(member), sublabel: member.email })),
            ),
          ),
          h(
            'div',
            { className: 'credit-team-section' },
            c.fieldLabel(`Projects (${team.projects.length})`),
            h(
              'ul',
              { className: 'credit-team-list' },
              team.projects.map((project) =>
                c.listRow({
                  label: project.name,
                  sublabel: `${project.memberCount} members`,
                  removeLabel: `Remove ${project.name} from the team`,
                  disabled: busy,
                  onRemove: () => run(() => store.removeTeamProject(team.guid, project.guid)),
                }),
              ),
            ),
            c.addItemRow({
              options: projectOptions,
              placeholder: 'Choose a project without a team',
              selectLabel: 'Project',
              addLabel: 'Add project',
              disabled: busy,
              selected: d.projectSelected,
              onSelect: (value) => {
                d.projectSelected = value;
                d.refresh();
              },
              onAdd: (projectGUID) => run(() => store.assignTeamProject(team.guid, projectGUID)),
            }),
          ),
        ],
      };
    };
    return d;
  };

  const isNumber = (value) => value !== '' && value !== null && value !== undefined && !Number.isNaN(Number(value));

  const AMOUNT_OPTIONS = [
    { value: 'set', label: 'Set amount' },
    { value: 'none', label: 'No budget' },
  ];
  const AMOUNT_HINTS = {
    none: 'No credit limit is set for this team.',
  };

  const validateBudgetForm = ({ amountType, amount, onExhausted, overagePct }) => {
    const errors = {};
    if (amountType !== 'set') return errors;
    if (!isNumber(amount) || Number(amount) <= 0) errors.amount = 'Enter an amount greater than 0.';
    if (onExhausted === 'overage' && (!isNumber(overagePct) || Number(overagePct) <= 0)) {
      errors.overagePct = 'Enter an overage percentage greater than 0.';
    }
    return errors;
  };

  const budgetRequestBody = (form) => {
    const { amountType, mode, period, amount, onExhausted, overagePct, notifyPcts } = window.CreditModel ? { ...form, ...window.CreditModel.effective(form, P.release) } : form;
    return amountType === 'set'
      ? {
          amountType,
          mode,
          period,
          amount: Number(amount),
          onExhausted,
          overagePct: onExhausted === 'overage' ? Number(overagePct) : undefined,
          notifyPcts: [...notifyPcts].sort((a, b) => a - b),
        }
      : { amountType: 'none' };
  };

  const segmented = ({ options, value, disabled, onChange, small }) =>
    h(
      'div',
      { className: `sb-seg${small ? ' sb-seg-sm' : ''}`, role: 'radiogroup' },
      options.map((o) =>
        h(
          'button',
          {
            type: 'button',
            role: 'radio',
            'aria-checked': String(o.value === value),
            className: o.value === value ? 'active' : '',
            disabled: disabled && o.value !== value,
            onClick: () => o.value !== value && onChange(o.value),
          },
          o.label,
        ),
      ),
    );

  const sbTitle = (label, tip, attrs) =>
    h('span', { className: 'sb-title-row' }, h(attrs && attrs.for ? 'label' : 'span', { className: 'sb-label sb-title', ...(attrs || {}) }, label), tip && P.ui.infoTooltip(tip));

  const sbSection = (label, meta, ...children) => {
    const [text, tip] = Array.isArray(label) ? label : [label];
    return h('section', { className: 'sb-section' }, h('div', { className: 'sb-section-head' }, sbTitle(text, tip), meta), ...children);
  };

  const emptyBudgetForm = (budget) => ({
    amountType: budget ? ((budget.amountType || 'set') === 'set' ? 'set' : 'none') : 'set',
    mode: budget && (budget.amountType || 'set') === 'set' ? budget.mode : 'limit',
    period: budget && (budget.amountType || 'set') === 'set' ? budget.period : F('monthlyRefresh') ? 'monthly' : 'lifetime',
    amount: budget && budget.amount ? String(budget.amount) : '',
    onExhausted: budget && budget.onExhausted ? budget.onExhausted : 'stop',
    overagePct: budget && budget.overagePct != null ? String(budget.overagePct) : '',
    notifyPcts: budget && budget.notifyPcts && budget.notifyPcts.length ? [...budget.notifyPcts] : [75, 100],
  });

  const exhaustedLabel = (v) => EXHAUSTED_OPTIONS.find((o) => o.value === v).label;

  const budgetFields = (d, errors, locked) => {
    const { form } = d;
    const update = (field) => (value) => {
      form[field] = value;
      d.refresh();
    };
    const toggleNotify = (pct) =>
      update('notifyPcts')(form.notifyPcts.includes(pct) ? form.notifyPcts.filter((p) => p !== pct) : [...form.notifyPcts, pct]);
    const summary = [
      F('allocation') && (form.mode === 'reservation' ? 'Allocation' : 'Limit'),
      F('overage') && exhaustedLabel(form.onExhausted) + (form.onExhausted === 'overage' && form.overagePct ? ` (${form.overagePct}%)` : ''),
      F('warnings') && (form.notifyPcts.length ? `Notify at ${[...form.notifyPcts].sort((a, b) => a - b).join(', ')}%` : 'No notifications'),
    ].filter(Boolean).join(' · ');
    const hasRules = F('allocation') || F('overage') || F('warnings');
    const creditsTip = [locked && (F('allocation') || F('monthlyRefresh')) && 'Type and period are fixed after the budget is created, because usage and allocated credits are tracked against them. To change them, release this budget and set a new one.'].filter(Boolean).join(' ');
    return sbSection(
      ['Credit budget', creditsTip],
      null,
      h('div', { className: 'sb-check-row' },
        h('label', { className: 'sb-check' },
          h('input', { type: 'checkbox', checked: form.amountType === 'set', onChange: () => update('amountType')(form.amountType === 'set' ? 'none' : 'set') }),
          h('span', null, 'Set limit'))),
      form.amountType !== 'set' && h('p', { style: { margin: '4px 0 0', fontSize: '12px', color: '#757575' } }, 'Individual member quotas apply.'),
      form.amountType === 'set' &&
        h(
          'div',
          { className: 'sb-amount-row' },
          h(
            'div',
            { className: `sb-amount${errors.amount ? ' has-error' : ''}` },
            h('input', {
              name: 'amount',
              type: 'text',
              inputMode: 'numeric',
              placeholder: '0',
              value: form.amount,
              'aria-label': 'Amount (credits)',
              onInput: (e) => {
                form.amount = e.target.value.replace(/[^0-9]/g, '');
                if (d.touched) d.refresh();
              },
            }),
            h('span', null, 'credits'),
          ),
          F('monthlyRefresh')
            ? segmented({ options: PERIOD_OPTIONS, value: form.period, disabled: locked, small: true, onChange: update('period') })
            : h('span', { className: 'sb-meta' }, 'One-time'),
        ),
      form.amountType === 'set' && errors.amount && h('p', { className: 'sb-error' }, errors.amount),
      form.amountType === 'set' && !hasRules &&
        h('p', { style: { margin: '4px 0 0', fontSize: '12px', color: '#757575' } }, 'Work in the team\u2019s projects stops when the limit is used up.'),
      form.amountType === 'set' && hasRules &&
        h(
          'details',
          { className: 'sb-more', open: d.moreOpen || Boolean(errors.overagePct), onToggle: (e) => (d.moreOpen = e.target.open) },
          h('summary', null, h('span', { className: 'sb-label sb-title' }, 'Budget rules'), h('span', { className: 'sb-more-summary' }, summary)),
          h(
            'div',
            { className: 'sb-more-body' },
            F('allocation') && h('div', { className: 'sb-rule' }, h('span', { className: 'sb-rule-label' }, 'Type', P.ui.infoTooltip(MODE_OPTIONS.map((o) => `${o.label}: ${o.hint}`).join(' '))),
              segmented({ options: MODE_OPTIONS, value: form.mode, disabled: locked, small: true, onChange: update('mode') })),
            F('overage') && h('div', { className: 'sb-rule' }, h('span', { className: 'sb-rule-label' }, 'When used up'),
              segmented({ options: EXHAUSTED_OPTIONS.map((o) => ({ ...o, label: o.value === 'warn' ? 'Warn only' : o.value === 'stop' ? 'Stop work' : 'Allow overage' })), value: form.onExhausted, small: true, onChange: update('onExhausted') }),
              form.onExhausted === 'overage' &&
                h('div', { className: `sb-amount sb-amount-sm${errors.overagePct ? ' has-error' : ''}` },
                  h('input', { name: 'overagePct', type: 'text', inputMode: 'numeric', placeholder: '10', value: form.overagePct, 'aria-label': 'Overage percentage',
                    onInput: (e) => { form.overagePct = e.target.value.replace(/[^0-9]/g, ''); if (d.touched) d.refresh(); } }),
                  h('span', null, '% over')),
              errors.overagePct && h('p', { className: 'sb-error' }, errors.overagePct)),
            F('warnings') && h('div', { className: 'sb-rule' }, h('span', { className: 'sb-rule-label' }, 'Notify at'),
              h('div', { className: 'sb-seg sb-seg-sm sb-seg-multi' },
                DEFAULT_NOTIFY_PCTS.map((pct) =>
                  h('button', { type: 'button', 'aria-pressed': String(form.notifyPcts.includes(pct)), className: form.notifyPcts.includes(pct) ? 'active' : '', onClick: () => toggleNotify(pct) }, `${pct}%`)))),
          ),
        ),
    );
  };

  const radioField = ({ name, label, options, value, disabled, error, onChange }) =>
    h(
      'div',
      { className: 'credit-team-field' },
      c.fieldLabel(label),
      radioGroup({ name, options, value, disabled, onChange }),
      error && h('span', { className: 'error-text' }, error),
    );

  const setBudgetDialog = (team) => {
    const { budget } = team;
    const d = { error: null, touched: false, form: emptyBudgetForm(budget) };
    const submit = () => {
      d.touched = true;
      if (Object.keys(validateBudgetForm(d.form)).length) return d.refresh();
      return mutate(d, () => store.setTeamBudget(team.guid, budgetRequestBody(d.form)));
    };
    d.render = () => ({
      title: budget ? 'Edit budget' : 'Set budget',
      className: 'credit-team-dialog sb-dialog',
      error: d.error,
      confirmLabel: 'Save budget',
      onConfirm: submit,
      body: [
        h('p', { className: 'credit-team-dialog-subject' }, team.name),
        budgetFields(d, d.touched ? validateBudgetForm(d.form) : {}, Boolean(budget && (budget.amountType || 'set') === 'set')),
      ],
    });
    return d;
  };

  // Combined dialog: team type, name, projects, members with credit access and credits
  const newTeamBudgetDialog = (hasSharedPool, teamGUID) => {
    const existing = teamGUID ? store.teamDetails(teamGUID) : null;
    const lockedBudget = Boolean(existing && existing.budget && (existing.budget.amountType || 'set') === 'set');
    const d = {
      error: null,
      touched: false,
      isDefault: existing ? existing.isDefault : false,
      name: existing ? existing.name : '',
      nameEdited: Boolean(existing),
      projects: existing ? existing.projects.map((p) => p.guid) : [],
      selected: new Set(existing ? existing.members.map((m) => m.guid) : []),
      query: '',
      projectQuery: '',
      newProjects: [],
      moreOpen: false,
      form: emptyBudgetForm(existing && existing.budget),
    };
    const activeMembers = () => store.org().members.filter((m) => !m.disabled);
    const projectMemberSources = () => {
      const map = new Map();
      if (!F('suggestedMembers')) return map;
      d.projects.forEach((g) => {
        const p = store.projectDetails(g);
        p.members.forEach((m) => map.set(m.guid, [...(map.get(m.guid) || []), p.name]));
      });
      return map;
    };
    // Credit access is its own list. Project members are only suggested; nobody is added without a pick.
    const hasAccess = (guid) => d.selected.has(guid);
    const setAccess = (guid, on) => (on ? d.selected.add(guid) : d.selected.delete(guid));
    const syncName = () => {
      if (d.nameEdited) return;
      const total = d.projects.length + d.newProjects.length;
      if (total === 1) d.name = d.projects.length ? store.projectSummaries().find((p) => p.guid === d.projects[0]).name : d.newProjects[0];
      else if (total === 0) d.name = '';
    };
    const focusSearch = () => {
      const s = d.projectOpen && document.querySelector('.team-editor input[name="projectQuery"]');
      if (s) s.focus();
    };
    const toggleProject = (project, clearQuery) => {
      d.projects = d.projects.includes(project.guid) ? d.projects.filter((g) => g !== project.guid) : [...d.projects, project.guid];
      if (clearQuery) d.projectQuery = '';
      syncName();
      focusSearch();
      d.refresh();
    };
    const createProject = () => {
      const name = d.projectQuery.trim();
      if (!name) return;
      d.newProjects = [...d.newProjects, name];
      d.projectQuery = '';
      syncName();
      focusSearch();
      d.refresh();
    };
    const accessList = () => activeMembers().filter((m) => hasAccess(m.guid)).map((m) => m.guid);
    const errorsFor = () => {
      const errors = hasSharedPool ? validateBudgetForm(d.form) : {};
      if (nameInvalid(d.name)) errors.name = NAME_ERROR;
      return errors;
    };
    const submit = () => {
      d.touched = true;
      if (Object.keys(errorsFor()).length) return d.refresh();
      const members = accessList();
      if (existing) {
        return panelMutate(d, () => {
          const guid = existing.guid;
          if (d.name.trim() !== existing.name) store.renameTeam(guid, d.name);
          existing.projects.forEach((p) => d.projects.includes(p.guid) || store.removeTeamProject(guid, p.guid));
          d.projects.forEach((p) => existing.projects.some((x) => x.guid === p) || store.assignTeamProject(guid, p));
          d.newProjects.forEach((name) => store.createProject(name, guid));
          existing.members.forEach((m) => members.includes(m.guid) || store.removeTeamMember(guid, m.guid));
          store.setTeamKind(guid, 'project', d.isDefault);
          members.forEach((m) => existing.members.some((x) => x.guid === m) || store.addTeamMember(guid, m));
          if (hasSharedPool) store.setTeamBudget(guid, budgetRequestBody(d.form));
          return guid;
        });
      }
      return panelMutate(d, () => {
        const guid = store.createTeam(d.name, { isDefault: d.isDefault });
        const created = [];
        try {
          d.projects.forEach((p) => store.assignTeamProject(guid, p));
          d.newProjects.forEach((name) => created.push(store.createProject(name, guid)));
          members.forEach((m) => store.addTeamMember(guid, m));
          if (hasSharedPool) store.setTeamBudget(guid, budgetRequestBody(d.form));
        } catch (err) {
          created.forEach((p) => store.deleteProject && store.deleteProject(p));
          store.deleteTeam(guid);
          throw err;
        }
        return guid;
      });
    };
    const matches = (q, ...fields) => !q || fields.some((f) => (f || '').toLowerCase().includes(q));

    d.render = () => {
      const errors = d.touched ? errorsFor() : {};
      const available = store.projectSummaries().filter((p) => !p.team || (existing && p.team.guid === existing.guid)).reverse();
      const sources = projectMemberSources();
      const all = activeMembers();
      const q = d.query.trim().toLowerCase();
      const pq = d.projectQuery.trim().toLowerCase();
      const withAccess = all.filter((m) => hasAccess(m.guid));
      const suggested = all.filter((m) => sources.has(m.guid) && !hasAccess(m.guid));
      const rank = (m) => (hasAccess(m.guid) ? 0 : sources.has(m.guid) ? 1 : 2);
      const visible = all
        .filter((m) => matches(q, memberName(m), m.email))
        .filter((m) => q || hasAccess(m.guid) || sources.has(m.guid))
        .sort((x, y) => rank(x) - rank(y) || memberName(x).localeCompare(memberName(y)));
      const bulkTargets = q ? visible : suggested;
      const bulkAdds = bulkTargets.some((m) => !hasAccess(m.guid));
      const bulk = () => {
        (bulkAdds ? bulkTargets : withAccess).forEach((m) => setAccess(m.guid, bulkAdds));
        d.refresh();
      };
      const bulkLabel = bulkAdds ? (q ? 'Add results' : `Add suggested (${suggested.length})`) : withAccess.length ? 'Remove all' : null;
      const matchedProjects = available.filter((p) => matches(pq, p.name));
      const projectRows = pq ? matchedProjects.slice(0, 8) : available.slice(0, 5);
      const q2 = d.projectQuery.trim().toLowerCase();
      const canCreate = F('createProjectFromTeam') && Boolean(q2) && !store.projectSummaries().some((p) => p.name.toLowerCase() === q2) && !d.newProjects.some((n) => n.toLowerCase() === q2);
      const selectedCount = d.projects.length + d.newProjects.length;

      return {
        title: existing ? 'Edit team and budget' : 'Set budget',
        className: 'credit-team-dialog sb-dialog',
        error: d.error,
        confirmLabel: existing ? 'Save team' : 'Create team',
        onConfirm: submit,
        body: [
          h(
            'div',
            { className: `sb-name${errors.name ? ' has-error' : ''}` },
            sbTitle('Team name', null, { for: 'teamName' }),
            h('input', {
              id: 'teamName',
              name: 'teamName',
              type: 'text',
              value: d.name,
              onInput: (e) => {
                d.name = e.target.value;
                d.nameEdited = d.name.trim() !== '';
                if (d.touched) d.refresh();
              },
            }),
            errors.name && h('p', { className: 'sb-error' }, errors.name),
          ),
          sbSection(
            'Projects',
            selectedCount ? h('span', { className: 'sb-meta' }, `${selectedCount} selected`) : null,
            selectedCount > 0 &&
              h(
                'div',
                { className: 'sb-chips' },
                d.projects.map((g) => {
                  const p = available.find((x) => x.guid === g);
                  return h('span', { className: 'sb-chip' }, p ? p.name : g,
                    h('button', { type: 'button', 'aria-label': `Remove ${p ? p.name : g}`, onClick: () => toggleProject({ guid: g }) }, '×'));
                }),
                d.newProjects.map((name) =>
                  h('span', { className: 'sb-chip sb-chip-new' }, name, h('span', { className: 'sb-chip-tag' }, 'New'),
                    h('button', { type: 'button', 'aria-label': `Remove ${name}`, onClick: () => { d.newProjects = d.newProjects.filter((n) => n !== name); syncName(); d.refresh(); } }, '×'))),
              ),
            h('div', { className: 'sb-ac' },
            h('input', {
              className: 'sb-search',
              name: 'projectQuery',
              type: 'text',
              autocomplete: 'off',
              role: 'combobox',
              'aria-expanded': String(Boolean(d.projectOpen)),
              placeholder: F('createProjectFromTeam') ? `Search ${available.length} projects or create a new one` : `Search ${available.length} projects`,
              value: d.projectQuery,
              onFocus: () => { if (!d.projectOpen) { d.projectOpen = true; d.refresh(); } },
              onInput: (e) => { d.projectQuery = e.target.value; d.projectOpen = true; d.refresh(); },
              onKeydown: (e) => {
                if (e.key === 'Escape') { e.stopPropagation(); d.projectOpen = false; d.refresh(); return; }
                if (e.key !== 'Enter') return;
                e.preventDefault();
                if (projectRows[0] && !d.projects.includes(projectRows[0].guid)) toggleProject(projectRows[0], true);
                else if (canCreate) createProject();
              },
            }),
            d.projectOpen && h('div', { className: 'sb-ac-pop', role: 'listbox' },
            h('div', { className: 'sb-list-caption' }, pq ? `${matchedProjects.length} ${matchedProjects.length === 1 ? 'match' : 'matches'}` : 'Recent projects'),
            h(
              'ul',
              { className: 'sb-list sb-list-projects', 'data-keep-scroll': 'projects' },
              projectRows.map((p) => {
                const on = d.projects.includes(p.guid);
                return h('li', null,
                  h('label', { className: `sb-row${on ? ' on' : ''}` },
                    h('input', { type: 'checkbox', checked: on, onChange: () => toggleProject(p, Boolean(pq)) }),
                    h('span', { className: 'sb-row-main' }, p.name),
                    h('span', { className: 'sb-row-aside' }, `${p.memberCount} members`)));
              }),
              canCreate &&
                h('li', null,
                  h('button', { type: 'button', className: 'sb-row sb-row-create', onClick: createProject },
                    h('span', { className: 'sb-plus' }, '+'),
                    h('span', { className: 'sb-row-main' }, 'Create project ', h('strong', null, d.projectQuery.trim())))),
            ),
            pq && !matchedProjects.length && !canCreate && h('p', { className: 'sb-hint sb-ac-empty' }, 'No projects match this search.'),
            )),
            h('div', { className: 'sb-check-row' },
              h('label', { className: 'sb-check' },
                h('input', { type: 'checkbox', checked: d.isDefault, onChange: () => { d.isDefault = !d.isDefault; d.refresh(); } }),
                h('span', null, 'Default team for new projects')),
              P.ui.infoTooltip('Projects that members of this team create join it automatically. They do not pick a team.')),
          ),
          sbSection(
            ['Members with credit access', `People who can spend this team\u2019s credits. Credit access is separate from project roles.${F('suggestedMembers') ? ' Members of the selected projects are suggested.' : ''}`],
            h('span', { className: 'sb-meta' }, `${withAccess.length} of ${all.length}`),
            h(
              'div',
              { className: 'sb-toolbar' },
              h('input', { className: 'sb-search', name: 'memberQuery', type: 'text', placeholder: 'Search all organization members', value: d.query,
                onInput: (e) => { d.query = e.target.value; d.refresh(); } }),
              bulkLabel && h('button', { type: 'button', className: 'sb-link', onClick: bulk }, bulkLabel),
            ),
            visible.length
              ? h(
                  'ul',
                  { className: 'sb-list sb-list-members', 'data-keep-scroll': 'members' },
                  visible.map((m) => {
                    const on = hasAccess(m.guid);
                    const src = sources.get(m.guid);
                    const where = src ? (src.length > 1 ? `${src.length} projects` : src[0]) : 'Organization';
                    const aside = src && !on ? `Suggested \u00b7 ${where}` : where;
                    return h(
                      'li',
                      null,
                      h('label', { className: `sb-row${on ? ' on' : ''}`, title: m.email },
                        h('input', { type: 'checkbox', checked: on, onChange: () => { setAccess(m.guid, !on); d.refresh(); } }),
                        h('span', { className: 'sb-row-main' }, memberName(m), h('span', { className: 'sb-row-sub' }, m.email)),
                        h('span', { className: 'sb-row-aside' }, aside)),
                    );
                  }),
                )
              : h('p', { className: 'sb-hint sb-empty' }, q ? 'No members match this search.' : F('suggestedMembers') ? 'Select a project to see suggested members, or search the organization.' : 'Search the organization to add members.'),
            errors.members && h('p', { className: 'sb-error' }, errors.members),
          ),
          hasSharedPool
            ? budgetFields(d, errors, lockedBudget)
            : sbSection('Credit budget', null, h('p', { className: 'sb-hint' }, 'Credit budgets become available once your organization has shared Chaos Credits.')),
        ],
      };
    };
    return d;
  };

  // Inline editor panel (right column). One editor at a time; it survives full page re-renders.

  let editor = null;
  const hasPool = () => store.budgetSummary().poolTotal > 0;

  const openEditor = (teamGUID) => {
    editor = newTeamBudgetDialog(hasPool(), teamGUID || undefined);
    editor.teamGUID = teamGUID || null;
    editor.orgGUID = store.org().guid;
    editor.release = P.release;
    editor.refresh = refreshPanel;
    P.app.render();
  };

  const closeEditor = () => {
    editor = null;
    P.app.render();
  };

  document.addEventListener('mousedown', (e) => {
    if (!editor || !editor.projectOpen || (e.target.closest && e.target.closest('.sb-ac'))) return;
    editor.projectOpen = false;
    editor.refresh();
  });

  const panelMutate = (d, fn) => {
    if (d.pending) return;
    d.pending = true;
    d.error = null;
    d.refresh();
    setTimeout(() => {
      if (editor !== d) return;
      d.pending = false;
      let guid;
      try {
        guid = fn();
      } catch (err) {
        if (!(err instanceof P.ApiError)) throw err;
        d.error = err.message;
        P.app.render();
        return;
      }
      const created = !d.teamGUID;
      openEditor(guid);
      P.ui.snackbar(created ? 'Team created' : 'Changes saved');
    }, 250);
  };

  const refreshPanel = () => {
    const prev = document.querySelector('.team-editor');
    if (!prev) return;
    const focused = prev.contains(document.activeElement) ? document.activeElement : null;
    const inner = [...prev.querySelectorAll('[data-keep-scroll]')].map((el) => [el.dataset.keepScroll, el.scrollTop]);
    const next = editorPanel();
    prev.replaceWith(next);
    inner.forEach(([key, top]) => {
      const el = next.querySelector(`[data-keep-scroll="${key}"]`);
      if (el) el.scrollTop = top;
    });
    if (focused && focused.name) {
      const input = next.querySelector(`input[name="${focused.name}"]`);
      if (input) {
        input.focus();
        if (input.type === 'text') input.setSelectionRange(input.value.length, input.value.length);
      }
    }
  };


  const editorPanel = () => {
    if (!editor) {
      return h(
        'section',
        { className: 'team-editor te-empty' },
        h('p', { className: 'te-empty-title' }, 'No team selected'),
        h('p', { className: 'te-empty-text' }, 'Select a team to edit its projects, credit access and budget, or create a new team.'),
        button('New team', { variant: 'outlined', onClick: () => openEditor(null) }),
      );
    }
    const spec = editor.render();
    const team = editor.teamGUID && store.teamSummaries().find((t) => t.guid === editor.teamGUID);
    const pending = Boolean(editor.pending);
    const showBudgets = hasPool();
    const actions = team
      ? [...(showBudgets ? budgetActions(team) : []), { type: 'delete', label: 'Delete team' }].filter(Boolean)
      : [];
    return h(
      'section',
      { className: `team-editor sb-dialog${pending ? ' is-pending' : ''}`, 'aria-busy': pending ? 'true' : null, 'aria-label': team ? `Edit ${team.name}` : 'New team' },
      h(
        'header',
        { className: 'te-head' },
        h(
          'div',
          { className: 'te-head-text' },
          h('h2', null, team ? team.name : 'New team'),
        ),
        h('div', { className: 'te-head-aside' },
          team && team.isDefault && h('span', { className: 'te-head-sub' }, 'Default for new projects'),
          team && showBudgets && team.budget && c.budgetStatusBadge(team.budget),
          actions.length > 0 && actionMenu('Team actions', actions.map((a) => ({ label: a.label, onClick: () => openAction(a.type, team) })))),
      ),
      h('div', { className: 'te-body' }, spec.body),
      spec.error && h('p', { className: 'te-error', role: 'alert' }, spec.error),
      h(
        'footer',
        { className: 'te-foot' },
        button('Cancel', { onClick: closeEditor, disabled: pending }),
        button(pending ? 'Saving' : spec.confirmLabel, { variant: 'primary', disabled: pending, onClick: spec.onConfirm }),
      ),
    );
  };

  const budgetLine = (budget) => {
    if (!budget || (budget.amountType || 'set') !== 'set') return h('span', { className: 'te-team-budget te-muted' }, 'No budget');
    return h(
      'div',
      { className: 'te-team-usage' },
      c.usageProgressBar({ usedCredits: budget.usedAmount, totalCredits: budget.amount, showTotal: true }),
      h('span', { className: 'te-team-period' }, F('allocation') || F('monthlyRefresh') ? `${budget.mode === 'reservation' ? 'Allocation' : 'Limit'} · ${budget.period === 'monthly' ? 'Monthly' : 'One-time'}` : 'One-time limit'),
    );
  };

  const FILTERS = [
    { key: 'period', placeholder: 'Any period', options: [{ value: 'monthly', label: 'Monthly' }, { value: 'lifetime', label: 'One-time' }] },
    { key: 'usage', placeholder: 'Any usage', options: [{ value: '0', label: 'Unused (0%)' }, { value: '80', label: '80% or more' }, { value: '100', label: 'Used up (100%)' }] },
    { key: 'access', placeholder: 'Any access', options: [{ value: 'set', label: 'Set amount' }, { value: 'none', label: 'No budget' }] },
  ];
  let filters = { period: '', usage: '', access: '' };
  const isSet = (b) => b && (b.amountType || 'set') === 'set';
  const matchesFilters = (team) => {
    const b = team.budget;
    if (filters.period && !(isSet(b) && b.period === filters.period)) return false;
    if (filters.access && (filters.access === 'set') !== Boolean(isSet(b))) return false;
    if (filters.usage) {
      if (!isSet(b)) return false;
      const pct = b.amount ? (b.usedAmount / b.amount) * 100 : 0;
      if (filters.usage === '0' && b.usedAmount !== 0) return false;
      if (filters.usage === '80' && pct < 80) return false;
      if (filters.usage === '100' && pct < 100) return false;
    }
    return true;
  };
  const filtersActive = () => Object.values(filters).some(Boolean);

  const filterBar = (total, shown) =>
    h(
      'div',
      { className: 'te-filters' },
      h('div', { className: 'te-filter-row' },
        FILTERS.filter((f) => f.key !== 'period' || F('monthlyRefresh')).map((f) =>
          P.ui.select({
            options: f.options,
            value: filters[f.key],
            placeholder: f.placeholder,
            ariaLabel: f.placeholder.replace('Any ', 'Filter by '),
            className: `te-filter-select${filters[f.key] ? ' on' : ''}`,
            onChange: (value) => {
              filters = { ...filters, [f.key]: value };
              P.app.render();
            },
          }))),
      filtersActive() &&
        h('div', { className: 'te-filter-status' },
          h('span', null, `${shown} of ${total} teams`),
          h('button', { type: 'button', className: 'te-filter-clear', onClick: () => { filters = { period: '', usage: '', access: '' }; P.app.render(); } }, 'Clear filters')),
    );

  const teamSidebar = (allTeams, showBudgets) => {
    const teams = showBudgets ? allTeams.filter(matchesFilters) : allTeams;
    return h(
      'aside',
      { className: 'te-sidebar' },
      h(
        'div',
        { className: 'te-sidebar-head' },
        h('span', { className: 'te-sidebar-title' }, `Teams (${allTeams.length})`),
        h('button', { type: 'button', className: `te-new${editor && !editor.teamGUID ? ' active' : ''}`, onClick: () => openEditor(null) }, h('span', { className: 'te-plus' }, '+'), 'New team'),
      ),
      showBudgets && allTeams.length > 0 && filterBar(allTeams.length, teams.length),
      teams.length
        ? h(
            'ul',
            { className: 'te-team-list' },
            teams.map((team) => {
              const active = editor && editor.teamGUID === team.guid;
              const state = c.budgetState(team.budget);
              return h(
                'li',
                null,
                h(
                  'button',
                  { type: 'button', className: `te-team${active ? ' active' : ''}`, 'aria-current': active ? 'true' : null, 'data-testid': 'team-row', onClick: () => openEditor(team.guid) },
                  h('span', { className: 'te-team-info' },
                    h('span', { className: 'te-team-top' },
                      h('span', { className: 'te-team-name', title: team.name }, team.name),
                      showBudgets && state === 'degraded' && c.budgetStatusBadge(team.budget)),
                    h('span', { className: 'te-team-meta' }, [team.isDefault ? 'Default' : null, `${team.projectCount} ${team.projectCount === 1 ? 'project' : 'projects'}`, `${team.memberCount} with access`].filter(Boolean).join(' · '))),
                  showBudgets && budgetLine(team.budget),
                ),
              );
            }),
          )
        : h('p', { className: 'te-sidebar-empty' }, allTeams.length ? 'No teams match these filters.' : 'No teams yet. Create a team to group projects and give it a credit budget.'),
    );
  };

  const confirmTeamDialog = (action, team) => {
    const copy = CONFIRM_COPY[action];
    const d = { error: null };
    d.render = () => ({
      title: copy.title,
      error: d.error,
      confirmLabel: copy.confirm,
      destructive: copy.destructive,
      onConfirm: () =>
        mutate(d, () => (action === 'delete' ? store.deleteTeam(team.guid) : store.setTeamBudgetStatus(team.guid, copy.status))),
      body: [h('p', { className: 'credit-team-dialog-subject' }, team.name), h('p', { className: 'subtitle' }, copy.message)],
    });
    return d;
  };

  // Table

  const budgetActions = (team) => {
    const { budget } = team;
    return [
      budget && {
        type: 'release',
        label: 'Release budget',
      },
    ];
  };

  const rowActions = (team, showBudgets) =>
    [
      {
        type: 'edit',
        label: 'Edit team and budget',
      },
      ...(showBudgets ? budgetActions(team) : []),
      {
        type: 'delete',
        label: 'Delete team',
      },
    ].filter(Boolean);

  const openAction = (type, team) => {
    if (type === 'edit') return openEditor(team.guid);
    if (type === 'details') return showDialog(teamDetailsDialog(team.guid, team.name));
    if (type === 'rename') return showDialog(teamNameDialog(team));
    if (type === 'budget') return showDialog(setBudgetDialog(team));
    return showDialog(confirmTeamDialog(type, team));
  };

  const teamsTable = (teams, showBudgets) => {
    if (!teams.length) {
      return h('p', { className: 'credit-teams-empty' }, 'No teams yet. Set a budget to group users and projects into a team.');
    }
    const budgetHeaders = showBudgets && [
      h('div', { className: 'cell header-cell col-budget-type' }, 'Budget type'),
      h('div', { className: 'cell header-cell col-period' }, 'Period'),
      h('div', { className: 'cell header-cell col-usage' }, 'Used'),
      h('div', { className: 'cell header-cell col-status' }, 'Status'),
    ];
    const special = (b) => b && (b.amountType || 'set') !== 'set';
    const specialLabel = () => 'No budget';
    const budgetCells = (team) =>
      showBudgets && special(team.budget) ? [
        h('div', { className: 'cell col-budget-type' }, specialLabel(team.budget)),
        h('div', { className: 'cell col-period' }, '-'),
        h('div', { className: 'cell col-usage usage-data-cell' }, '-'),
        h('div', { className: 'cell col-status' }, c.budgetStatusBadge(team.budget)),
      ] : showBudgets && [
        h('div', { className: 'cell col-budget-type' }, team.budget ? c.budgetTypeBadge(team.budget.mode) : '-'),
        h('div', { className: 'cell col-period' }, team.budget ? (team.budget.period === 'monthly' ? 'Monthly' : 'One-time') : '-'),
        h(
          'div',
          { className: 'cell col-usage usage-data-cell' },
          team.budget
            ? c.usageProgressBar({
                usedCredits: team.budget.usedAmount,
                totalCredits: team.budget.amount,
                showTotal: true,
              })
            : '-',
        ),
        h('div', { className: 'cell col-status' }, c.budgetStatusBadge(team.budget)),
      ];
    return h(
      'div',
      { className: 'credits-details-table credit-teams-table' },
      h(
        'div',
        { className: 'row header-row' },
        h('div', { className: 'cell header-cell col-team-name' }, 'Team'),
        h('div', { className: 'cell header-cell col-count' }, 'Credit access'),
        h('div', { className: 'cell header-cell col-count' }, 'Projects'),
        budgetHeaders,
        h('div', { className: 'cell header-cell col-actions' }),
      ),
      h('div', { className: 'divider' }),
      teams.map((team, index) => [
        h(
          'div',
          { className: `row ${index % 2 === 0 ? 'even-row' : 'odd-row'}`, 'data-testid': 'team-row' },
          h('div', { className: 'cell col-team-name', title: team.name }, team.name),
          h('div', { className: 'cell col-count' }, team.memberCount),
          h('div', { className: 'cell col-count' }, team.projectCount),
          budgetCells(team),
          h(
            'div',
            { className: 'cell col-actions' },
            actionMenu(
              'Team actions',
              rowActions(team, showBudgets).map((action) => ({
                label: action.label,
                onClick: () => openAction(action.type, team),
              })),
            ),
          ),
        ),
        h('div', { className: 'divider' }),
      ]),
    );
  };

  // Tiles and cards

  const overviewTile = ({ label, tooltip, value, caption }) =>
    h(
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
            h('div', { className: 'counts' }, h('span', { className: 'numeric-metrics' }, c.formatCredits(value)), h('span', null, caption)),
          ),
        ),
      ),
    );

  const teamsOverviewTiles = (summary) =>
    h(
      'div',
      { className: 'credits-overview-tiles teams-overview-tiles' },
      overviewTile({
        label: 'Shared pool',
        tooltip: 'Total shared pool credits of the organization.',
        value: summary.poolTotal,
        caption: `${c.formatCredits(summary.poolRemaining)} remaining`,
      }),
      F('allocation') && overviewTile({
        label: 'Allocated to teams',
        tooltip: 'Credits held aside by allocation budgets. Only the owning team can use them.',
        value: summary.reservedForTeams,
        caption: 'credits allocated',
      }),
      overviewTile({
        label: 'Team limits',
        tooltip: 'Sum of all limit budgets. Limits cap team spend but do not hold credits aside.',
        value: summary.limitsTotal,
        caption: 'credits in limits',
      }),
      overviewTile({
        label: 'Consumed',
        tooltip: 'Credits used by teams in their current budget periods.',
        value: summary.consumedInWindows,
        caption: 'credits used',
      }),
    );

  const noCreditsCard = () =>
    h(
      'div',
      { className: 'credit-teams-no-credits' },
      h('p', null, 'Credit budgets become available once your organization has shared Chaos Credits.'),
      h('a', { className: 'button', href: '#', onClick: P.app.notInPrototype('Buy credits opens chaos.com') }, 'Buy credits'),
    );

  const render = () => {
    const summary = store.budgetSummary();
    const hasSharedPool = summary.poolTotal > 0;
    const teams = store.teamSummaries();
    if (editor && (editor.release !== P.release || editor.orgGUID !== store.org().guid || (editor.teamGUID && !teams.some((t) => t.guid === editor.teamGUID)))) editor = null;
    return c.pageContent(
      {
        title: 'Teams',
        subtitle: 'Group users and projects into teams. Give a team a credit budget to control its Chaos Credits spend.',
      },
      [
        hasSharedPool ? teamsOverviewTiles(summary) : noCreditsCard(),
        h('div', { className: 'te-layout' }, teamSidebar(teams, hasSharedPool), editorPanel()),
      ],
    );
  };

  P.pages = P.pages || {};
  P.pages.teams = {
    render,
    openTeamDialog: (guid, action) => {
      const team = store.teamSummaries().find((t) => t.guid === guid);
      if (team) openAction(action, team);
    },
  };
})(window.Proto = window.Proto || {});
