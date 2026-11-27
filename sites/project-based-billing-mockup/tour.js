// The guided walkthroughs. Tutorial.dc.html lists the use cases; each step names
// the artboard it runs on, who does it, what it says, and the screen state to show.
// Veras, Collaboration, My Chaos and Email read the current step from here and show
// the step card with the arrows. Edit a step's copy or screen state here.
(function (w) {
  const KEY = 'chaos-tour';
  const TTL = 30 * 60 * 1000; // a walkthrough left alone this long ends
  const START = 'Tutorial.dc.html';
  // My Chaos keeps its demo data here; starting a walkthrough clears it so each run begins the same.
  const MYCHAOS_STORE_KEYS = ['bsr-18201-ui-prototype-v9-Full'];

  const APPS = {
    'Main.dc.html': 'Veras',
    'Collaboration.dc.html': 'Collaboration',
    'MyChaos.dc.html': 'My Chaos',
    'Email.dc.html': 'Email',
  };
  const ROLES = {
    lm: { label: 'License Manager', bg: '#714AB5' },
    owner: { label: 'Project Owner', bg: '#1681BD' },
    member: { label: 'Team member', bg: '#0E7A70' },
  };
  const PEOPLE = {
    omar: { guid: 'u-omar', name: 'Omar Haddad', email: 'omar.haddad@acme-studio.com' },
    maria: { guid: 'u-maria', name: 'Maria Petrova', email: 'maria.petrova@acme-studio.com' },
    grace: { guid: 'u-grace', name: 'Grace Kim', email: 'grace.kim@acme-studio.com' },
    aiko: { guid: 'u-aiko', name: 'Aiko Tanaka', email: 'aiko.tanaka@acme-studio.com' },
  };

  // Budgets the walkthroughs create, as Veras and Collaboration see them once they exist.
  const oneTime = (amount) => ({ mode: 'limit', period: 'lifetime', amount, used: 0, onExhausted: 'stop', notifyPcts: [75, 100] });
  const WORLD = {
    oakNoTeam: { teams: { oak: null }, projects: [{ id: 'oak', guid: 'p-oak', name: '25-047 Oak Street Housing', team: null }] },
    oakFunded: { teams: { oak: { guid: 't-oak', name: '25-047 Oak Street Housing', kind: 'project', budget: oneTime(500) } } },
    quay: {
      teams: { quay: { guid: 't-quay', name: '25-051 Quayside Apartments', kind: 'project', budget: oneTime(2000) } },
      projects: [{ id: 'quay', guid: 'p-quay', name: '25-051 Quayside Apartments', team: 'quay' }],
    },
    interiors: {
      teams: { interiors: { guid: 't-interiors', name: 'Interiors', kind: 'department', budget: { mode: 'limit', period: 'monthly', amount: 3000, used: 0, onExhausted: 'stop', notifyPcts: [75, 100] } } },
      projects: [{ id: 'lobby', guid: 'p-lobby', name: '25-053 Hotel Lobby Refurbishment', team: 'interiors' }],
    },
  };

  const GRACE = PEOPLE.grace.email, AIKO = PEOPLE.aiko.email;

  const USE_CASES = [
    {
      id: 'owner-requests', group: 'project', label: '1.1',
      title: 'The Project Owner asks for a budget',
      summary: 'Omar sets up a project in Collaboration and requests credits. Maria, the License Manager, creates a team for it, adds the members and grants a one-time budget.',
      steps: [
        { board: 'Collaboration.dc.html', role: 'owner', title: 'Create the project and invite colleagues',
          text: 'Omar has created 25-047 Oak Street Housing in Collaboration. He shares it with Grace and Aiko as Editors. Click Invite, or use the arrow.',
          wait: 'collab.invite', world: WORLD.oakNoTeam,
          scene: { project: 'oak', members: [['omar', 'Owner', false]], cc: { share: true, chips: [GRACE, AIKO], inviteRole: 'Editor' } } },
        { board: 'Collaboration.dc.html', role: 'owner', title: 'Request a credit budget',
          text: 'The project belongs to no team yet, so everyone uses their own credit limit. Omar opens Credit balance from the credits chip, chooses Get credits › Request credits and asks for 500 credits for the project. Click Send request, or use the arrow.',
          wait: 'collab.request', world: WORLD.oakNoTeam,
          scene: { project: 'oak', members: [['omar', 'Owner', false], ['grace', 'Editor', false], ['aiko', 'Editor', false]],
            cc: { panel: true, req: true, reqAmount: '500', reqNote: 'Design development renders for the client review' } } },
        { board: 'Collaboration.dc.html', role: 'owner', title: 'The request is on its way',
          text: 'The request goes to every License Manager and Admin in the organization. Omar keeps working on his own credit limit while he waits.',
          world: WORLD.oakNoTeam,
          scene: { project: 'oak', members: [['omar', 'Owner', false], ['grace', 'Editor', false], ['aiko', 'Editor', false]], cc: { panel: true, pending: 500 } } },
        { board: 'Email.dc.html', role: 'lm', title: 'Maria receives the request', email: 'request',
          text: 'Maria Petrova, the License Manager, gets an email with the amount and the reason. Review in My Chaos takes her to Teams.' },
        { board: 'MyChaos.dc.html', role: 'lm', title: 'Create a team for the project',
          text: 'Maria starts a new team and links 25-047 Oak Street Housing. The team takes the project’s name, and the project’s members are suggested as team members.',
          scene: { removeTeams: ['25-047 Oak Street Housing'], draft: { name: '25-047 Oak Street Housing', projects: ['25-047 Oak Street Housing'] } } },
        { board: 'MyChaos.dc.html', role: 'lm', title: 'Add the members and grant one-time credits',
          text: 'She adds Omar, Grace and Aiko, the people who should spend the team’s credits, and sets a one-time limit of 500 credits. Click Create team, or use the arrow.',
          wait: 'mychaos.save',
          scene: { removeTeams: ['25-047 Oak Street Housing'], draft: { name: '25-047 Oak Street Housing', projects: ['25-047 Oak Street Housing'], members: ['u-omar', 'u-grace', 'u-aiko'], budget: { amount: 500, period: 'lifetime' } } } },
        { board: 'MyChaos.dc.html', role: 'lm', title: 'The team is ready',
          text: '25-047 Oak Street Housing now has its own budget. No credits move: the budget sets how much the team may draw from the organization’s pool.',
          scene: { save: true, draft: { name: '25-047 Oak Street Housing', projects: ['25-047 Oak Street Housing'], members: ['u-omar', 'u-grace', 'u-aiko'], budget: { amount: 500, period: 'lifetime' } } } },
        { board: 'Email.dc.html', role: 'owner', title: 'Omar hears back', email: 'granted',
          text: 'Omar and the other team members get an email that the project now has credits. Open in Veras takes them to generate.' },
        { board: 'Main.dc.html', role: 'member', title: 'Generate against the team budget',
          text: 'In Veras, the team picks 25-047 Oak Street Housing before rendering. Credits now come from the team’s 500-credit budget, not from anyone’s own limit. Click Render to spend some.',
          wait: 'veras.render', world: WORLD.oakFunded, scene: { project: 'oak', picker: true } },
      ],
    },
    {
      id: 'lm-sets-up', group: 'project', label: '1.2',
      title: 'The License Manager sets up the project',
      summary: 'Maria creates the project and its team in My Chaos and adds Omar as the Project Owner. Omar invites colleagues in Collaboration and gives them credit access.',
      steps: [
        { board: 'MyChaos.dc.html', role: 'lm', title: 'Create the team and its project',
          text: 'Maria starts a new team and creates the 25-051 Quayside Apartments project from the same screen. The team takes the project’s name.',
          scene: { removeTeams: ['25-051 Quayside Apartments'], removeProjects: ['25-051 Quayside Apartments'], draft: { name: '25-051 Quayside Apartments', newProjects: ['25-051 Quayside Apartments'] } } },
        { board: 'MyChaos.dc.html', role: 'lm', title: 'Add the Project Owner and set the budget',
          text: 'She adds Omar, who will run the project, and gives the team a one-time limit of 2,000 credits. Click Create team, or use the arrow.',
          wait: 'mychaos.save',
          scene: { removeTeams: ['25-051 Quayside Apartments'], removeProjects: ['25-051 Quayside Apartments'],
            draft: { name: '25-051 Quayside Apartments', newProjects: ['25-051 Quayside Apartments'], owner: 'u-omar', members: ['u-omar'], budget: { amount: 2000, period: 'lifetime' } } } },
        { board: 'MyChaos.dc.html', role: 'lm', title: 'The team is ready',
          text: '25-051 Quayside Apartments has a team, a project and a 2,000-credit budget. Omar is its only member so far.',
          scene: { save: true, draft: { name: '25-051 Quayside Apartments', newProjects: ['25-051 Quayside Apartments'], owner: 'u-omar', members: ['u-omar'], budget: { amount: 2000, period: 'lifetime' } } } },
        { board: 'Email.dc.html', role: 'owner', title: 'Omar learns he runs the project', email: 'owner',
          text: 'Omar gets an email that he is the Project Owner, with the budget he has to work with. Open in Collaboration takes him to the project.' },
        { board: 'Collaboration.dc.html', role: 'owner', title: 'Invite colleagues with credit access',
          text: 'Omar shares 25-051 Quayside Apartments with Grace and Aiko as Editors. Sharing alone does not let anyone spend the project’s credits, so he also ticks Give credit access, which adds them to the team. Click Invite, or use the arrow.',
          wait: 'collab.invite', world: WORLD.quay,
          scene: { project: 'quay', members: [['omar', 'Owner', true]], cc: { share: true, chips: [GRACE, AIKO], inviteRole: 'Editor', inviteCredits: true } } },
        { board: 'Collaboration.dc.html', role: 'owner', title: 'Access granted',
          text: 'Grace and Aiko have a coin next to their names: they are members of the 25-051 Quayside Apartments team and can generate with its 2,000 credits. Omar can turn anyone’s credit access on or off from the coin.',
          world: WORLD.quay,
          scene: { project: 'quay', members: [['omar', 'Owner', true], ['grace', 'Editor', true], ['aiko', 'Editor', true]], cc: { share: true } } },
        { board: 'Email.dc.html', role: 'member', title: 'Grace can start', email: 'access',
          text: 'Grace gets an email that she can use the project’s credits. Open in Veras takes her to generate.' },
        { board: 'Main.dc.html', role: 'member', title: 'Generate against the team budget',
          text: 'In Veras, the team picks 25-051 Quayside Apartments before rendering, and credits come from its 2,000-credit budget. Click Render to spend some.',
          wait: 'veras.render', world: WORLD.quay, scene: { project: 'quay', picker: true } },
      ],
    },
    {
      id: 'department', group: 'department', label: '2',
      title: 'A monthly budget for a department',
      summary: 'Maria creates a team for the Interiors department with a monthly budget and makes it the default for new projects. Its designers create projects in Collaboration and render in Veras without picking a team.',
      steps: [
        { board: 'MyChaos.dc.html', role: 'lm', title: 'Create a department team',
          text: 'Maria starts a new team for the Interiors department. It needs no projects yet: projects join it as its members create them.',
          scene: { removeTeams: ['Interiors'], draft: { name: 'Interiors', nameEdited: true } } },
        { board: 'MyChaos.dc.html', role: 'lm', title: 'Set a monthly budget and add the department',
          text: 'She adds the department’s designers, sets a monthly limit of 3,000 credits and makes Interiors the default team for new projects. Click Create team, or use the arrow.',
          wait: 'mychaos.save',
          scene: { removeTeams: ['Interiors'], draft: { name: 'Interiors', nameEdited: true, isDefault: true, members: ['u-omar', 'u-grace', 'u-aiko', 'u-daniel', 'u-elena'], budget: { amount: 3000, period: 'monthly' } } } },
        { board: 'MyChaos.dc.html', role: 'lm', title: 'The team is ready',
          text: 'Interiors has a shared balance of 3,000 credits that resets on the first of every month, across all of its projects.',
          scene: { save: true, draft: { name: 'Interiors', nameEdited: true, isDefault: true, members: ['u-omar', 'u-grace', 'u-aiko', 'u-daniel', 'u-elena'], budget: { amount: 3000, period: 'monthly' } } } },
        { board: 'Email.dc.html', role: 'member', title: 'The designers are told', email: 'department',
          text: 'Everyone added to the team gets an email about the budget and what happens to the projects they create.' },
        { board: 'Collaboration.dc.html', role: 'member', title: 'Create a project',
          text: 'Omar creates 25-053 Hotel Lobby Refurbishment in Collaboration. Interiors is his default team, so the project joins it without him picking anything. Credit balance shows the shared monthly budget.',
          world: WORLD.interiors, scene: { project: 'lobby', members: [['omar', 'Owner', true]], cc: { panel: true } } },
        { board: 'Main.dc.html', role: 'member', title: 'Render in Veras',
          text: 'Omar picks the project in Veras and renders. Every Interiors project draws on the same 3,000 credits a month. Click Render to spend some.',
          wait: 'veras.render', world: WORLD.interiors, scene: { project: 'lobby', picker: true } },
      ],
    },
  ];

  const GROUPS = [
    { id: 'project', title: 'Budgets per project', text: 'Assign a Project Team for each Project. Credit budget can be set for the lifetime of the project.' },
    { id: 'department', title: 'Budget per department', text: 'Set a monthly credit budget for each Department or Office, to be used by their projects.' },
  ];

  // Emails shown on the Email artboard. ctaBoard is where the button leads outside a walkthrough.
  const EMAILS = {
    request: {
      label: 'Credit request', to: 'maria', time: '10:24',
      subject: 'Omar Haddad requested 500 credits for 25-047 Oak Street Housing',
      preview: 'Review the request in My Chaos',
      heading: 'A project needs credits',
      paras: ['Omar Haddad asked for a credit budget for 25-047 Oak Street Housing. The project does not belong to a team yet, so it has no budget of its own.',
        'Create a team for the project, or link it to an existing one, and set a budget in My Chaos.'],
      details: [['Project', '25-047 Oak Street Housing'], ['Requested by', 'Omar Haddad, Project Owner'], ['Credits', '500'], ['Reason', 'Design development renders for the client review']],
      cta: 'Review in My Chaos', ctaBoard: 'MyChaos.dc.html',
      footer: 'Sent to the License Managers and Admins of Acme Studio.',
    },
    granted: {
      label: 'Budget granted', to: 'omar', time: '11:02',
      subject: '25-047 Oak Street Housing now has 500 credits',
      preview: 'You can generate in this project',
      heading: 'Your project has a budget',
      paras: ['Maria Petrova created the 25-047 Oak Street Housing team and gave it a one-time budget of 500 credits.',
        'You, Grace Kim and Aiko Tanaka can now generate in this project. Select it before you generate in Veras, Cosmos or Cloud rendering.'],
      details: [['Team', '25-047 Oak Street Housing'], ['Budget', '500 credits, one-time limit'], ['Members', 'Omar Haddad, Grace Kim, Aiko Tanaka']],
      cta: 'Open in Veras', ctaBoard: 'Main.dc.html',
      footer: 'You are receiving this because you are a member of the 25-047 Oak Street Housing team.',
    },
    owner: {
      label: 'Project Owner added', to: 'omar', time: '09:41',
      subject: 'You are the Project Owner of 25-051 Quayside Apartments',
      preview: 'Invite your colleagues and give them credit access',
      heading: 'You have a new project',
      paras: ['Maria Petrova created 25-051 Quayside Apartments with its own team and a one-time budget of 2,000 credits, and made you its Project Owner.',
        'Invite your colleagues in Collaboration, then give the ones who should generate credit access to the project.'],
      details: [['Project', '25-051 Quayside Apartments'], ['Budget', '2,000 credits, one-time limit'], ['Your role', 'Project Owner']],
      cta: 'Open in Collaboration', ctaBoard: 'Collaboration.dc.html',
      footer: 'You are receiving this because you were added to the 25-051 Quayside Apartments team.',
    },
    access: {
      label: 'Credit access given', to: 'grace', time: '10:15',
      subject: 'You can now use credits on 25-051 Quayside Apartments',
      preview: 'Omar Haddad gave you credit access',
      heading: 'You can generate in 25-051 Quayside Apartments',
      paras: ['Omar Haddad gave you credit access to 25-051 Quayside Apartments. Credits come from the team’s budget of 2,000 credits.',
        'Select the project before you generate in Veras, Cosmos or Cloud rendering.'],
      details: [['Project', '25-051 Quayside Apartments'], ['Budget', '2,000 credits, one-time limit'], ['Given by', 'Omar Haddad, Project Owner']],
      cta: 'Open in Veras', ctaBoard: 'Main.dc.html',
      footer: 'You are receiving this because you were added to the 25-051 Quayside Apartments team.',
    },
    department: {
      label: 'Added to department team', to: 'omar', time: '08:30',
      subject: 'You have been added to the Interiors team',
      preview: '3,000 credits a month, shared by the team',
      heading: 'Welcome to the Interiors team',
      paras: ['Maria Petrova added you to Interiors. The team has a monthly budget of 3,000 credits, shared by all of its projects.',
        'Interiors is your default team, so projects you create in Collaboration join it automatically.'],
      details: [['Team', 'Interiors'], ['Budget', '3,000 credits a month, limit'], ['Resets', 'On the first of every month']],
      cta: 'Open Collaboration', ctaBoard: 'Collaboration.dc.html',
      footer: 'You are receiving this because you were added to the Interiors team.',
    },
  };

  // State
  const read = () => {
    try {
      const t = JSON.parse(w.localStorage.getItem(KEY) || 'null');
      if (!t || Date.now() - (t.at || 0) > TTL) return null;
      const uc = USE_CASES.find((u) => u.id === t.uc);
      if (!uc || !uc.steps[t.step]) return null;
      return t;
    } catch (e) { return null; }
  };
  const write = (t) => { try { w.localStorage.setItem(KEY, JSON.stringify({ ...t, at: Date.now() })); } catch (e) {} };
  const clear = () => { try { w.localStorage.removeItem(KEY); } catch (e) {} };
  const ucOf = (t) => USE_CASES.find((u) => u.id === t.uc);

  const stepFor = (board) => {
    const t = read();
    if (!t) return null;
    const uc = ucOf(t);
    const s = uc.steps[t.step];
    if (s.board !== board) return null;
    return { ...s, key: `${uc.id}:${t.step}`, index: t.step, useCase: uc };
  };

  const start = (id) => {
    try { MYCHAOS_STORE_KEYS.forEach((k) => w.localStorage.removeItem(k)); } catch (e) {}
    write({ uc: id, step: 0, open: true, done: null });
  };

  // An action in the prototype that completes the current step marks it done.
  const did = (evt) => {
    const t = read();
    if (!t) return;
    const s = ucOf(t).steps[t.step];
    if (s.wait === evt && t.done !== t.step) write({ ...t, done: t.step });
  };

  // Veras and Collaboration read projects and budgets from window.CreditModel. A step's
  // world adds the teams and projects the walkthrough has created so far.
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const applyWorld = (M, world) => {
    if (!M) return;
    if (!M.__tourPristine) {
      if (!world) return;
      M.__tourPristine = { TEAMS: clone(M.TEAMS), PROJECTS: clone(M.PROJECTS) };
    }
    const p = M.__tourPristine;
    Object.keys(M.TEAMS).forEach((k) => delete M.TEAMS[k]);
    Object.assign(M.TEAMS, clone(p.TEAMS));
    M.PROJECTS.length = 0;
    clone(p.PROJECTS).forEach((x) => M.PROJECTS.push(x));
    if (!world) return;
    Object.entries(world.teams || {}).forEach(([k, v]) => { if (v) M.TEAMS[k] = clone(v); else delete M.TEAMS[k]; });
    (world.projects || []).forEach((x) => {
      const i = M.PROJECTS.findIndex((y) => y.id === x.id);
      if (i >= 0) M.PROJECTS[i] = clone(x); else M.PROJECTS.splice(1, 0, clone(x));
    });
  };

  // The step card shown at the bottom left of the artboard the step runs on.
  // hooks.apply runs when the step changes on this artboard, hooks.refresh for anything else.
  const card = (board, hooks) => {
    const t = read();
    const s = t && ucOf(t).steps[t.step];
    if (!s || s.board !== board) return { on: false };
    const uc = ucOf(t);
    const i = t.step, n = uc.steps.length;
    const h = hooks || {};
    const hrefFor = (j) => (j < 0 || j >= n ? START : uc.steps[j].board === board ? '#' : uc.steps[j].board);
    const move = (j) => (e) => {
      if (e && e.stopPropagation) e.stopPropagation();
      if (j < 0 || j >= n) { clear(); return; }
      write({ ...t, step: j, done: null });
      if (uc.steps[j].board === board) {
        if (e && e.preventDefault) e.preventDefault();
        if (h.apply) h.apply();
      }
    };
    const next = uc.steps[i + 1];
    const done = t.done === i;
    const role = ROLES[s.role];
    return {
      on: true, open: t.open !== false, closed: t.open === false,
      useCase: `${uc.label} · ${uc.title}`, stepLabel: `Step ${i + 1} of ${n}`, shortLabel: `Step ${i + 1} of ${n} · ${APPS[s.board]}`,
      role: role.label, roleBg: role.bg, app: APPS[s.board], title: s.title, text: s.text,
      done, doneText: 'Done. Use the arrow to continue.',
      nextRing: done ? '0 0 0 4px rgba(90,199,247,0.45)' : 'none',
      dots: uc.steps.map((x, j) => ({ bg: j <= i ? '#0B9EDD' : '#525252' })),
      prevHref: hrefFor(i - 1), prev: move(i - 1), prevLabel: i === 0 ? 'Back to the use cases' : 'Previous step',
      nextHref: hrefFor(i + 1), next: move(i + 1), nextLabel: next ? 'Next' : 'Finish',
      nextHint: next ? (next.board === board ? `Next: ${next.title}` : `Next in ${APPS[next.board]}: ${next.title}`) : 'Finish and go back to the use cases',
      exit: (e) => { if (e && e.stopPropagation) e.stopPropagation(); clear(); },
      toggle: (e) => { if (e && e.stopPropagation) e.stopPropagation(); write({ ...t, open: t.open === false }); if (h.refresh) h.refresh(); },
    };
  };

  // What the Tutorial artboard lists.
  const overview = () => GROUPS.map((g) => ({
    ...g,
    cases: USE_CASES.filter((u) => u.group === g.id).map((u) => ({
      id: u.id, label: u.label, title: u.title, summary: u.summary,
      meta: `${u.steps.length} steps`,
      href: u.steps[0].board,
      steps: u.steps.map((s, j) => ({ n: j + 1, title: s.title, who: `${ROLES[s.role].label} · ${APPS[s.board]}`, bg: ROLES[s.role].bg })),
    })),
  }));

  w.ChaosTour = { START, APPS, ROLES, PEOPLE, USE_CASES, GROUPS, EMAILS, read, stepFor, start, did, clear, applyWorld, card, overview };
})(window);
