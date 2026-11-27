(function (P) {
  const { h, select, textField, showDialog, mutate, isPending, memberName, memberOptions, actionMenu } = P.ui;
  const { store } = P;
  const c = P.c;
  const F = (name) => P.feature(name);

  const MAX_NAME_LENGTH = 100;
  const NAME_ERROR = 'Enter a name of up to 100 characters.';

  const nameInvalid = (name) => !name.trim() || name.trim().length > MAX_NAME_LENGTH;

  const NO_TEAM = '__none';
  let teamFilter = '';
  let selected = new Set();

  const addToTeamDialog = (guids) => {
    const picked = store.projectSummaries().filter((p) => guids.includes(p.guid));
    // Moving a project to another team ships after the MVP.
    const projects = F('moveProject') ? picked : picked.filter((p) => !p.team);
    const kept = picked.length - projects.length;
    const d = { error: null, teamGUID: '' };
    d.render = () => {
      const moving = projects.filter((p) => p.team && p.team.guid !== d.teamGUID);
      return {
        title: `Add ${projects.length} ${projects.length === 1 ? 'project' : 'projects'} to a team`,
        error: d.error,
        confirmLabel: 'Add to team',
        confirmDisabled: !d.teamGUID || !projects.length,
        onConfirm: () =>
          mutate(d, () => projects.forEach((p) => store.setProjectTeam(p.guid, d.teamGUID)), {
            onSuccess: () => {
              selected = new Set();
              P.app.render();
              P.ui.snackbar(`${projects.length} ${projects.length === 1 ? 'project' : 'projects'} added to the team`);
            },
          }),
        body: [
          h('p', { className: 'subtitle' }, 'The budget of the team applies to the credits spent in these projects.'),
          h('ul', { className: 'credit-team-list' }, projects.map((p) => c.listRow({ label: p.name, sublabel: p.team ? `Now in ${p.team.name}` : 'No team' }))),
          select({
            options: store.teamSummaries().map((t) => ({ value: t.guid, label: t.name })),
            value: d.teamGUID,
            placeholder: 'Choose a team',
            ariaLabel: 'Team',
            className: 'credit-team-select',
            disabled: isPending(),
            onChange: (value) => {
              d.teamGUID = value;
              d.refresh();
            },
          }),
          kept > 0 &&
            h('p', { className: 'credit-team-field-hint' }, `${kept} of the selected ${kept === 1 ? 'project is' : 'projects are'} already in a team and ${kept === 1 ? 'stays' : 'stay'} there.`),
          d.teamGUID && moving.length > 0 &&
            h('p', { className: 'credit-team-field-hint' }, `${moving.length} of these ${moving.length === 1 ? 'project moves' : 'projects move'} from another team.`),
        ],
      };
    };
    return d;
  };

  const teamSelect = ({ value, disabled, onChange }) =>
    h(
      'div',
      { className: 'credit-team-field' },
      c.fieldLabel('Team'),
      select({
        options: store.teamSummaries().map((team) => ({
          value: team.guid,
          label: team.name,
        })),
        value,
        placeholder: 'No team',
        ariaLabel: 'Team',
        className: 'credit-team-select',
        disabled,
        onChange,
      }),
    );

  // Dialogs

  const projectNameDialog = (project) => {
    const d = {
      name: project ? project.name : '',
      ownerGUID: '',
      teamGUID: '',
      teamPicked: false,
      touched: false,
      error: null,
    };
    const submit = () => {
      d.touched = true;
      if (nameInvalid(d.name)) return d.refresh();
      return mutate(d, () => (project ? store.renameProject(project.guid, d.name) : store.createProject(d.name, d.teamGUID, d.ownerGUID)));
    };
    d.render = () => {
      const fallback = d.ownerGUID ? store.defaultTeamFor(d.ownerGUID) : undefined;
      const owner = d.ownerGUID && store.org().members.find((m) => m.guid === d.ownerGUID);
      return {
      title: project ? 'Rename project' : 'Create project',
      error: d.error,
      confirmLabel: project ? 'Save' : 'Create',
      onConfirm: submit,
      body: [
        textField({
          name: 'projectName',
          label: 'Project name',
          value: d.name,
          autoFocus: !d.touched,
          error: d.touched && nameInvalid(d.name) ? NAME_ERROR : null,
          onInput: (value) => {
            d.name = value;
            if (d.touched) d.refresh();
          },
          onEnter: submit,
        }),
        !project &&
          h(
            'div',
            { className: 'credit-team-field' },
            c.fieldLabel('Owner'),
            select({
              options: memberOptions(store.org().members, []),
              value: d.ownerGUID,
              placeholder: 'Choose an organization member',
              ariaLabel: 'Owner',
              className: 'credit-team-select',
              onChange: (value) => {
                d.ownerGUID = value;
                if (!d.teamPicked) {
                  const t = value ? store.defaultTeamFor(value) : undefined;
                  d.teamGUID = t ? t.guid : '';
                }
                d.refresh();
              },
            }),
          ),
        !project &&
          teamSelect({
            value: d.teamGUID,
            onChange: (value) => {
              d.teamGUID = value;
              d.teamPicked = true;
              d.refresh();
            },
          }),
        !project && fallback && d.teamGUID === fallback.guid &&
          h('p', { className: 'credit-team-field-hint' }, `${memberName(owner)} is a member of ${fallback.name}, the default team for new projects.`),
      ],
      };
    };
    return d;
  };

  const projectMembersDialog = (projectGUID, title) => {
    const d = {
      error: null,
      selected: '',
    };
    const run = (fn) => mutate(d, fn, { keepOpen: true });
    d.render = () => {
      const project = store.projectDetails(projectGUID);
      const busy = isPending();
      return {
        title,
        error: d.error,
        closeLabel: 'Close',
        body: h(
          'div',
          { className: 'credit-team-section' },
          c.fieldLabel(`Members (${project.members.length})`),
          h('p', { className: 'credit-team-field-hint' }, 'Project members. Being a member does not give credit access. Credit access is set on the team.'),
          h(
            'ul',
            { className: 'credit-team-list' },
            project.members.map((member) =>
              c.listRow({
                label: memberName(member),
                sublabel: member.email,
                removeLabel: `Remove ${memberName(member)}`,
                disabled: busy,
                onRemove: () => run(() => store.removeProjectMember(project.guid, member.guid)),
              }),
            ),
          ),
          c.addItemRow({
            options: memberOptions(store.org().members, project.members),
            placeholder: 'Choose an organization member',
            selectLabel: 'Organization member',
            addLabel: 'Add member',
            disabled: busy,
            selected: d.selected,
            onSelect: (value) => {
              d.selected = value;
              d.refresh();
            },
            onAdd: (userGUID) => run(() => store.addProjectMember(project.guid, userGUID)),
          }),
        ),
      };
    };
    return d;
  };

  const projectTeamDialog = (project) => {
    const d = {
      error: null,
      teamGUID: project.team ? project.team.guid : '',
    };
    d.render = () => ({
      title: 'Project team',
      error: d.error,
      confirmLabel: 'Save',
      onConfirm: () => mutate(d, () => store.setProjectTeam(project.guid, d.teamGUID)),
      body: [
        h('p', { className: 'credit-team-dialog-subject' }, project.name),
        h('p', { className: 'subtitle' }, 'The budget of the team applies to the credits spent in this project.'),
        teamSelect({
          value: d.teamGUID,
          disabled: isPending(),
          onChange: (value) => {
            d.teamGUID = value;
            d.refresh();
          },
        }),
      ],
    });
    return d;
  };

  const deleteProjectDialog = (project) => {
    const d = { error: null };
    d.render = () => ({
      title: 'Delete project',
      error: d.error,
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: () => mutate(d, () => store.deleteProject(project.guid)),
      body: [
        h('p', { className: 'credit-team-dialog-subject' }, project.name),
        h('p', { className: 'subtitle' }, 'The project and its member list are deleted. Its members can no longer spend credits in this project.'),
      ],
    });
    return d;
  };

  // Table

  const rowActions = (project) => [
    {
      label: 'Rename',
      onClick: () => showDialog(projectNameDialog(project)),
    },
    (F('moveProject') || !project.team) && {
      label: project.team ? 'Change team' : 'Assign team',
      onClick: () => showDialog(projectTeamDialog(project)),
    },
    {
      label: 'Delete project',
      onClick: () => showDialog(deleteProjectDialog(project)),
    },
  ];

  const memberTooltip = (members) => {
    if (!members.length) return undefined;
    const names = members.slice(0, 12).map(memberName).join(', ');
    return members.length > 12 ? `${names} and ${members.length - 12} more` : names;
  };

  const projectsTable = (projects) => {
    if (!projects.length) {
      return h('p', { className: 'credit-teams-empty' }, 'No projects yet. Create a project to track the credits spent on it.');
    }
    const allOn = projects.every((p) => selected.has(p.guid));
    const someOn = !allOn && projects.some((p) => selected.has(p.guid));
    const check = (on, label, onChange, indeterminate) => {
      const el = h('input', { type: 'checkbox', className: 'project-check', checked: on, 'aria-label': label, onChange });
      el.indeterminate = Boolean(indeterminate);
      return el;
    };
    return h(
      'div',
      { className: 'credits-details-table credit-teams-table projects-table' },
      h(
        'div',
        { className: 'row header-row' },
        h('div', { className: 'cell header-cell col-check' }, check(allOn, 'Select all projects', () => {
          projects.forEach((p) => (allOn ? selected.delete(p.guid) : selected.add(p.guid)));
          P.app.render();
        }, someOn)),
        h('div', { className: 'cell header-cell col-team-name' }, 'Project'),
        h('div', { className: 'cell header-cell col-owner' }, 'Owner'),
        h('div', { className: 'cell header-cell col-project-team' }, 'Team'),
        h('div', { className: 'cell header-cell col-count' }, 'Members'),
        h('div', { className: 'cell header-cell col-actions' }),
      ),
      h('div', { className: 'divider' }),
      projects.map((project, index) => [
        h(
          'div',
          { className: `row ${index % 2 === 0 ? 'even-row' : 'odd-row'}${selected.has(project.guid) ? ' is-selected' : ''}`, 'data-testid': 'project-row' },
          h('div', { className: 'cell col-check' }, check(selected.has(project.guid), `Select ${project.name}`, () => {
            if (selected.has(project.guid)) selected.delete(project.guid);
            else selected.add(project.guid);
            P.app.render();
          })),
          h('div', { className: 'cell col-team-name', title: project.name }, project.name),
          h('div', { className: 'cell col-owner' }, project.owner ? memberName(project.owner) : '-'),
          h('div', { className: 'cell col-project-team', title: project.team ? project.team.name : undefined }, project.team ? project.team.name : '-'),
          h('div', { className: 'cell col-count' },
            h('span', { className: 'members-count', 'data-tooltip': memberTooltip(project.members) }, project.memberCount)),
          h('div', { className: 'cell col-actions' }, actionMenu('Project actions', rowActions(project).filter(Boolean))),
        ),
        h('div', { className: 'divider' }),
      ]),
    );
  };

  const filterBar = (all) => {
    const without = all.filter((p) => !p.team).length;
    return h(
      'div',
      { className: 'project-filter' },
      c.fieldLabel('Team'),
      select({
        options: [
          { value: NO_TEAM, label: `Without a team (${without})` },
          ...store.teamSummaries().map((t) => ({ value: t.guid, label: `${t.name} (${all.filter((p) => p.team && p.team.guid === t.guid).length})` })),
        ],
        value: teamFilter,
        placeholder: `All projects (${all.length})`,
        ariaLabel: 'Filter by team',
        className: 'credit-team-select',
        onChange: (value) => {
          teamFilter = value;
          P.app.render();
        },
      }),
    );
  };

  const bulkBar = () =>
    h(
      'div',
      { className: 'project-bulk-bar', role: 'toolbar', 'aria-label': 'Selected projects' },
      h('span', { className: 'project-bulk-count' }, `${selected.size} selected`),
      P.ui.button('Add to team', { variant: 'outlined', onClick: () => showDialog(addToTeamDialog([...selected])) }),
      h('button', { type: 'button', className: 'project-bulk-clear', onClick: () => { selected = new Set(); P.app.render(); } }, 'Clear selection'),
    );

  const render = () => {
    const all = store.projectSummaries();
    selected = new Set([...selected].filter((g) => all.some((p) => p.guid === g)));
    if (teamFilter && teamFilter !== NO_TEAM && !store.teamSummaries().some((t) => t.guid === teamFilter)) teamFilter = '';
    const shown = !teamFilter ? all : all.filter((p) => (teamFilter === NO_TEAM ? !p.team : p.team && p.team.guid === teamFilter));
    const empty = all.length && !shown.length && h('p', { className: 'credit-teams-empty' }, teamFilter === NO_TEAM ? 'Every project belongs to a team.' : 'This team has no projects yet.');
    return c.pageContent(
      {
        title: 'Projects',
        subtitle:
          'Track credit spend by project. Assign a project to a team to put its spend under the team budget.',
      },
      [
        c.quickActions(h('button', { type: 'button', className: 'button', onClick: () => showDialog(projectNameDialog(null)) }, 'Create project')),
        c.tableSectionCard('Projects', [all.length > 0 && h('div', { className: 'project-toolbar' }, filterBar(all), selected.size > 0 && bulkBar()), empty || projectsTable(shown)]),
      ],
    );
  };

  P.pages = P.pages || {};
  P.pages.projects = { render };
})(window.Proto = window.Proto || {});
