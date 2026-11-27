// One source for the Veras, Collaboration and My Chaos artboards: the project and
// team names, their credit budgets, and the release each feature ships in.
// Change a name or a budget here and every artboard picks it up.
(function (w) {
  // Releases in delivery-plan order. The MVP is R0 + R1.
  const RELEASES = ['R0', 'R1', 'R2', 'R3', 'R4'];
  const MVP = 'R1';

  // Features that ship after the MVP. Anything not listed is in the MVP.
  const FEATURES = {
    suggestedMembers: 'R2',      // members of linked projects suggested as team members
    projectOwnerAccess: 'R2',    // project owners manage who has credit access
    createProjectFromTeam: 'R2', // admins create a project from the team screen
    moveProject: 'R2',           // move a project to another team
    defaultTeam: 'R2',           // a default team that new projects join automatically
    allocation: 'R3',            // a budget that holds credits for the team
    monthlyRefresh: 'R3',        // budgets that refresh every month
    warnings: 'R3',              // low-balance warning thresholds and notifications
    overage: 'R3',               // warn, or allow an overage, when a budget is used up
    directorySync: 'R4',         // team membership from SCIM
  };

  // release: 'Full' or 'MVP'
  const on = (feature, release) =>
    release !== 'MVP' || !FEATURES[feature] || RELEASES.indexOf(FEATURES[feature]) <= RELEASES.indexOf(MVP);

  const ORG = { name: 'Acme Studio', domain: 'acme-studio.com', nextReset: 'Nov 1, 2026', nextResetShort: 'Nov 1' };

  // People from the Acme Studio organization in My Chaos. "you" is the user
  // signed in to Veras and Collaboration.
  const PEOPLE = {
    you: { guid: 'u-omar', name: 'Omar Haddad', email: 'omar.haddad@acme-studio.com' },
    maria: { guid: 'u-maria', name: 'Maria Petrova', email: 'maria.petrova@acme-studio.com' },
    grace: { guid: 'u-grace', name: 'Grace Kim', email: 'grace.kim@acme-studio.com' },
  };

  // Members of the projects shown in Collaboration: their project role, and
  // whether they are members of the project's team (credit access).
  const PROJECT_MEMBERS = [
    { person: 'you', role: 'Owner', teamMember: true },
    { person: 'maria', role: 'Editor', teamMember: true },
    { person: 'grace', role: 'Viewer', teamMember: false },
  ];

  // The signed-in user's own credit limit, used where no team budget applies.
  // My Chaos shows the same limit and usage for this user.
  const YOUR_LIMIT = { amount: 500, used: 30 };
  // The signed-in user's named credits (one seat of the monthly named allowance).
  const YOUR_NAMED = { amount: 100, used: 0 };

  // Teams shown in the products. My Chaos has more teams; these are the ones the
  // product mockups use, and My Chaos takes their names and budgets from here.
  const TEAMS = {
    riverside: {
      guid: 't-riverside', name: '24-031 Riverside Tower', kind: 'project',
      budget: { mode: 'limit', period: 'monthly', amount: 1200, used: 860, onExhausted: 'stop', notifyPcts: [50, 75, 90, 100] },
    },
    sofia: {
      guid: 't-sofia', name: 'Architects Sofia', kind: 'department',
      budget: { mode: 'limit', period: 'monthly', amount: 1500, used: 1340, onExhausted: 'overage', overagePct: 10, notifyPcts: [75, 100] },
    },
    competitions: {
      guid: 't-competitions', name: 'Competitions', kind: 'project',
      budget: { mode: 'limit', period: 'lifetime', amount: 600, used: 600, onExhausted: 'stop', notifyPcts: [75, 100] },
    },
    oak: { guid: 't-oak', name: '25-047 Oak Street Housing', kind: 'project', budget: null },
  };

  // Projects in the product pickers, in picker order.
  const PROJECTS = [
    { id: 'my', guid: null, name: 'My Project', team: null },
    { id: 'riverside', guid: 'p-riverside', name: '24-031 Riverside Tower', team: 'riverside' },
    { id: 'elm', guid: 'p-s2', name: '24-009 Elm Park School', team: 'sofia' },
    { id: 'civic', guid: 'p-s18', name: '25-041 Civic Centre Competition', team: 'competitions' },
    { id: 'oak', guid: 'p-oak', name: '25-047 Oak Street Housing', team: 'oak' },
  ];

  // A budget as it behaves in a release: in the MVP every budget is a one-time
  // limit that stops work when used up, with no notifications.
  const effective = (b, release) =>
    b && {
      ...b,
      mode: on('allocation', release) ? b.mode : 'limit',
      period: on('monthlyRefresh', release) ? b.period : 'lifetime',
      onExhausted: on('overage', release) ? b.onExhausted : 'stop',
      overagePct: on('overage', release) ? b.overagePct : undefined,
      notifyPcts: on('warnings', release) ? b.notifyPcts || [] : [],
    };

  // What a project draws on: its team budget, or the user's own limit.
  const balance = (projectId, release) => {
    const project = PROJECTS.find((p) => p.id === projectId) || PROJECTS[0];
    const team = project.team ? TEAMS[project.team] : null;
    const budget = team && effective(team.budget, release);
    const src = budget || YOUR_LIMIT;
    const monthly = budget ? budget.period === 'monthly' : true;
    return {
      project,
      team,
      budget,
      key: budget ? `team:${project.team}` : 'you',
      amount: src.amount,
      left: src.amount - src.used,
      monthly,
      resetText: monthly ? `Monthly · next reset ${ORG.nextReset}` : 'One-time budget',
      overageAllowance: budget && budget.onExhausted === 'overage' ? Math.round((budget.amount * (budget.overagePct || 0)) / 100) : 0,
      warnings: on('warnings', release),
    };
  };

  w.CreditModel = { RELEASES, MVP, FEATURES, on, ORG, PEOPLE, PROJECT_MEMBERS, YOUR_LIMIT, YOUR_NAMED, TEAMS, PROJECTS, effective, balance };
})(window);
