(function (P) {
  // Release shown by the My Chaos artboard ('Full' or 'MVP'). Features and the
  // shared project/team data come from shared/credit-model.js.
  const M = window.CreditModel;
  P.release = P.release || 'Full';
  P.feature = (name) => !M || M.on(name, P.release);

  const member = (guid, firstName, lastName, email, extra) => ({
    guid,
    firstName,
    lastName,
    email,
    role: 'member',
    disabled: false,
    quota: null,
    ...extra,
  });

  const FIRST = ['Anna','Ben','Chloe','David','Eva','Felix','Hana','Ivan','Julia','Karim','Lea','Marco','Nadia','Oscar','Priya','Quinn','Rosa','Samir','Tara','Victor'];
  const LAST = ['Adams','Berg','Costa','Dimitrov','Engel','Fischer','Garcia'];
  const extraMembers = () =>
    Array.from({ length: 60 }, (_, i) => {
      const f = FIRST[i % FIRST.length];
      const l = LAST[Math.floor(i / FIRST.length) % LAST.length];
      return member(`u-x${i}`, f, l, `${f}.${l}`.toLowerCase() + '@acme-studio.com');
    });
  const seedProjects = () => {
    const ids = (from, to) => Array.from({ length: to - from }, (_, i) => `u-x${from + i}`);
    return [
      { guid: 'p-riverside', name: '24-031 Riverside Tower', teamGUID: null, members: ['u-daniel', 'u-elena', ...ids(0, 52)] },
      { guid: 'p-harbor', name: '24-018 Harbor Library', teamGUID: null, members: ['u-james', 'u-sofia', ...ids(45, 60)] },
      { guid: 'p-oak', name: '25-047 Oak Street Housing', teamGUID: null, members: ['u-omar', 'u-grace', 'u-aiko', 'u-lukas'] },
      ...['23-052 Canal Quarter Masterplan', '23-064 Northgate Campus', '24-009 Elm Park School', '24-022 Westbank Offices', '24-040 Marina Hotel Refit', '24-045 Pine Hill Clinic', '24-053 Station Square', '24-058 Cedar Court Residences', '25-003 Lakeside Pavilion', '25-011 Old Mill Conversion', '25-014 Granary Wharf', '25-019 Hillcrest Library', '25-022 Market Hall', '25-026 Bayview Towers', '25-030 Southfield Depot', '25-033 Kingsway Retail', '25-036 Museum Extension', '25-039 Airport Lounge Fit-out', '25-041 Civic Centre Competition', '25-044 Valley Bridge'].map((name, i) => ({
        guid: `p-s${i}`,
        name,
        teamGUID: null,
        members: ids((i * 3) % 50, ((i * 3) % 50) + 3 + (i % 6)),
      })),
    ].reverse();
  };

  const range = (from, to) => Array.from({ length: to - from }, (_, i) => `u-x${from + i}`);
  const budget = (id, b) => ({ id, amountType: 'set', mode: 'limit', period: 'monthly', amount: 0, usedAmount: 0, onExhausted: 'stop', notifyPcts: [75, 100], status: 'active', degraded: false, ...b });
  const team = (guid, name, kind, members, b, extra) => ({ guid, name, kind, isDefault: false, createdAt: '2026-06-01T09:00:00Z', members, budget: b, ...extra });
  // Teams the product mockups use take their name, kind and budget from the shared model.
  const modelTeam = (key, budgetID, members, extra) => {
    const t = M.TEAMS[key];
    const b = t.budget && (({ used, ...rest }) => budget(budgetID, { ...rest, usedAmount: used }))(t.budget);
    const shared = M.PROJECT_MEMBERS.filter((m) => m.teamMember).map((m) => M.PEOPLE[m.person].guid);
    return team(t.guid, t.name, t.kind, [...new Set([...shared, ...members])], b, extra);
  };
  const seedTeams = () => [
    modelTeam('riverside', 'b-riverside', ['u-daniel', 'u-elena', ...range(0, 12)]),
    modelTeam('sofia', 'b-sofia', range(12, 31), { isDefault: true }),
    team('t-harbor', '24-018 Harbor Library', 'project', ['u-james', 'u-sofia', ...range(45, 51)], budget('b-harbor', { mode: 'reservation', amount: 800, usedAmount: 310 })),
    team('t-viz', 'Visualization', 'department', ['u-grace', ...range(31, 41)], null),
    modelTeam('competitions', 'b-comp', ['u-omar', 'u-aiko']),
    team('t-marina', '24-040 Marina Hotel Refit', 'project', ['u-maria', 'u-x41', 'u-x42', 'u-x43'], budget('b-marina', { mode: 'reservation', amount: 500, usedAmount: 120 })),
    team('t-interns', 'Interns', 'department', range(51, 56), null),
    modelTeam('oak', null, ['u-omar', 'u-lukas']),
  ];
  const PROJECT_TEAMS = {
    'p-riverside': 't-riverside', 'p-harbor': 't-harbor', 'p-oak': 't-oak',
    'p-s0': 't-sofia', 'p-s1': 't-sofia', 'p-s2': 't-sofia', 'p-s5': 't-sofia',
    'p-s3': 't-viz', 'p-s16': 't-viz', 'p-s18': 't-competitions', 'p-s4': 't-marina',
  };
  // Projects the product mockups use: shared names, owned by the signed-in user,
  // with the same members the Collaboration mockup shows.
  const modelProject = (p) => {
    const m = M.PROJECTS.find((x) => x.guid === p.guid);
    if (!m) return p;
    const people = M.PROJECT_MEMBERS.map((x) => M.PEOPLE[x.person].guid);
    return { ...p, name: m.name, ownerGUID: M.PEOPLE.you.guid, members: [...new Set([...people, ...p.members])] };
  };
  const withTeams = (projects) => projects.map((p) => ({ ...modelProject(p), teamGUID: PROJECT_TEAMS[p.guid] || null }));

  const acmeBase = () => ({
    guid: 'org-acme',
    name: 'Acme Studio',
    windowEnd: '2026-11-01T00:00:00Z',
    sharedGrants: [
      {
        id: 'grant-vray-monthly',
        productName: 'V-Ray Premium',
        productCode: 'vray',
        grantType: 'floating',
        wholeTerm: false,
        numberOfSeats: 10,
        totalCredits: 5000,
        consumed: 1880,
        expireOn: '2026-11-01T00:00:00Z',
      },
      {
        id: 'grant-credits-pack',
        productName: 'Chaos Credits annual pack',
        productCode: 'chaoscredits',
        grantType: 'ela',
        wholeTerm: true,
        numberOfSeats: 0,
        totalCredits: 1000,
        consumed: 260,
        expireOn: '2027-03-31T00:00:00Z',
      },
    ],
    namedGrants: [
      {
        id: 'grant-veras-named',
        productName: 'Veras',
        productCode: 'veras',
        grantType: 'named',
        numberOfSeats: 5,
        unassignedSeats: 0,
        creditsPerSeat: 100,
        expireOn: '2026-11-01T00:00:00Z',
      },
    ],
    members: [
      member('u-maria', 'Maria', 'Petrova', 'maria.petrova@acme-studio.com', {
        role: 'admin',
        quota: {
          maxAmount: null,
          usage: 40,
        },
        named: 40,
      }),
      member('u-daniel', 'Daniel', 'Novak', 'daniel.novak@acme-studio.com', {
        quota: {
          maxAmount: 500,
          usage: 100,
        },
        named: 25,
      }),
      member('u-elena', 'Elena', 'Ivanova', 'elena.ivanova@acme-studio.com', {
        quota: {
          maxAmount: 1000,
          usage: 0,
        },
        named: 55,
      }),
      member('u-james', 'James', 'Carter', 'james.carter@acme-studio.com', {
        quota: {
          maxAmount: 500,
          usage: 0,
        },
      }),
      member('u-sofia', 'Sofia', 'Rossi', 'sofia.rossi@acme-studio.com', {
        quota: {
          maxAmount: 100,
          usage: 0,
        },
      }),
      member('u-lukas', 'Lukas', 'Weber', 'lukas.weber@acme-studio.com', {
        role: 'license_manager',
        quota: {
          maxAmount: null,
          usage: 0,
        },
      }),
      member('u-aiko', 'Aiko', 'Tanaka', 'aiko.tanaka@acme-studio.com', {
        quota: {
          maxAmount: 0,
          usage: 0,
        },
        named: 20,
      }),
      member('u-omar', 'Omar', 'Haddad', 'omar.haddad@acme-studio.com', {
        quota: {
          maxAmount: M.YOUR_LIMIT.amount,
          usage: M.YOUR_LIMIT.used,
        },
        named: M.YOUR_NAMED.used,
      }),
      member('u-grace', 'Grace', 'Kim', 'grace.kim@acme-studio.com', {
        quota: {
          maxAmount: 500,
          usage: 60,
        },
      }),
      member('u-peter', 'Peter', 'Georgiev', 'peter.georgiev@acme-studio.com', {
        disabled: true,
      }),
      ...extraMembers(),
    ],
    teams: seedTeams(),
    projects: withTeams(seedProjects()),
  });


  // Usage report data (made up). Each row is one user's spend on one product in
  // one project this month. Team totals match each team's budget usage.
  const PRODUCTS = ['veras', 'enhancer', 'upscaler', 'material', 'rendering', 'others'];
  const BASE_MIX = [0.56, 0.08, 0.04, 0.11, 0.17, 0.04];
  const hash = (str) => { let x = 2166136261; for (let i = 0; i < str.length; i++) { x ^= str.charCodeAt(i); x = Math.imul(x, 16777619); } return (x >>> 0) / 4294967296; };
  // Split a whole number by weights so the parts add up exactly.
  const split = (total, weights) => {
    const sum = weights.reduce((a, w) => a + w, 0) || 1;
    const raw = weights.map((w) => (total * w) / sum);
    const out = raw.map(Math.floor);
    let rest = total - out.reduce((a, n) => a + n, 0);
    raw.map((r, i) => [r - Math.floor(r), i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (rest > 0) { out[i] += 1; rest -= 1; } });
    return out;
  };
  // Credits spent this month per project; null is personal work in My Project.
  const PROJECT_SPEND = [
    ['p-riverside', null], ['p-s0', 410], ['p-s1', 260], ['p-s2', 520], ['p-s5', 150],
    ['p-harbor', 310], ['p-s18', null], ['p-s4', 120], ['p-s3', 280], ['p-s16', 170], ['p-oak', 95],
  ];
  const buildUsage = (org) => {
    const rows = [];
    const teamOf = (g) => org.teams.find((t) => t.guid === g);
    const add = (projectGUID, teamGUID, users, total, seed) => {
      const mix = BASE_MIX.map((w, i) => w * (0.45 + hash(seed + PRODUCTS[i]) * 1.1));
      split(total, mix).forEach((credits, i) => {
        if (!credits) return;
        const weights = users.map((u, k) => (users.length - k) * (0.6 + hash(seed + u + PRODUCTS[i])));
        split(credits, weights).forEach((c, k) => c && rows.push({ projectGUID, teamGUID, userGUID: users[k], product: PRODUCTS[i], credits: c }));
      });
    };
    PROJECT_SPEND.forEach(([guid, amount]) => {
      const project = org.projects.find((p) => p.guid === guid);
      if (!project) return;
      const team = teamOf(project.teamGUID);
      const total = amount != null ? amount : team && team.budget ? team.budget.usedAmount : 0;
      const pool = team ? team.members.filter((m) => project.members.includes(m)) : project.members;
      const users = (pool.length ? pool : project.members).slice(0, 3 + Math.floor(hash(guid) * 3));
      if (total > 0 && users.length) add(guid, project.teamGUID || null, users, total, guid);
    });
    // Personal work in each user's My Project, drawn from their own limit.
    org.members.filter((m) => m.quota && m.quota.usage > 0).forEach((m) => add(null, null, [m.guid], m.quota.usage, 'my-' + m.guid));
    return rows;
  };
  const acme = () => {
    const org = acmeBase();
    org.usage = buildUsage(org);
    return org;
  };

  const bluefin = () => ({
    guid: 'org-bluefin',
    name: 'Bluefin Interiors',
    windowEnd: null,
    sharedGrants: [],
    namedGrants: [],
    members: [
      member('b-nina', 'Nina', 'Hart', 'nina.hart@bluefin-interiors.com', {
        role: 'admin',
      }),
      member('b-tom', 'Tom', 'Becker', 'tom.becker@bluefin-interiors.com'),
      member('b-li', 'Li', 'Wei', 'li.wei@bluefin-interiors.com'),
      member('b-ana', 'Ana', 'Silva', 'ana.silva@bluefin-interiors.com'),
    ],
    teams: [],
    projects: [],
    usage: [],
  });

  // In the MVP every budget is a one-time limit that stops work when used up.
  const forRelease = (org, release) => ({
    ...org,
    teams: org.teams.map((t) => ({ ...t, budget: t.budget && M.effective(t.budget, release) })),
  });

  P.seed = (release) => ({
    version: 1,
    activeOrg: 'org-acme',
    orgs: {
      'org-acme': forRelease(acme(), release || P.release),
      'org-bluefin': bluefin(),
    },
  });
})(window.Proto = window.Proto || {});
