(function (P) {
  const STORAGE_KEY = 'bsr-18201-ui-prototype-v9';
  const MAX_NAME_LENGTH = 100;

  const CONFLICT_MESSAGES = {
    TEAM_NAME_TAKEN: 'A team with this name already exists.',
    PROJECT_NAME_TAKEN: 'A project with this name already exists.',
    BUDGET_ALREADY_EXISTS: 'This team already has a budget.',
    BUDGET_RELEASED: 'This budget was released and can no longer be changed.',
    INSUFFICIENT_POOL: 'The shared pool does not have enough free credits for this allocation.',
    BUDGET_IMMUTABLE: 'The budget type and period cannot change once the budget exists.',
    PROJECT_IN_OTHER_TEAM: 'This project already belongs to another team. Change its team on the Projects page.',
  };

  const STATUS_MESSAGES = {
    400: 'The change was rejected. Check that the name is not blank and that the user belongs to the organization.',
    404: 'The project or team no longer exists. Refresh the page and try again.',
  };

  class ApiError extends Error {}

  const conflict = (code) => new ApiError(CONFLICT_MESSAGES[code]);
  const badRequest = () => new ApiError(STATUS_MESSAGES[400]);
  const notFound = () => new ApiError(STATUS_MESSAGES[404]);

  // Full and MVP keep separate prototype data, so switching does not mix them.
  const storageKey = () => `${STORAGE_KEY}-${P.release || 'Full'}`;
  let state = load();
  const listeners = [];

  function load() {
    try {
      return JSON.parse(window.localStorage.getItem(storageKey())) || P.seed(P.release);
    } catch (e) {
      return P.seed(P.release);
    }
  }

  function persist() {
    try {
      window.localStorage.setItem(storageKey(), JSON.stringify(state));
      return true;
    } catch (e) {
      return false;
    }
  }

  function commit() {
    persist();
    listeners.forEach((fn) => fn());
  }

  const org = () => state.orgs[state.activeOrg];
  const newGUID = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const sameName = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

  const findTeam = (guid) => {
    const team = org().teams.find((t) => t.guid === guid);
    if (!team) throw notFound();
    return team;
  };

  const findProject = (guid) => {
    const project = org().projects.find((p) => p.guid === guid);
    if (!project) throw notFound();
    return project;
  };

  const requireActiveMember = (userGUID) => {
    const member = org().members.find((m) => m.guid === userGUID);
    if (!member || member.disabled) throw badRequest();
    return member;
  };

  const validName = (name) => {
    const trimmed = (name || '').trim();
    if (!trimmed || trimmed.length > MAX_NAME_LENGTH) throw badRequest();
    return trimmed;
  };

  // Pool and budget figures

  const sum = (list, fn) => list.reduce((acc, item) => acc + fn(item), 0);
  const grantRemaining = (g) => Math.max(0, g.totalCredits - g.consumed);
  const budgetHold = (b) => Math.max(0, b.amount - b.usedAmount);
  const holdsCredits = (b) => b && b.mode === 'reservation' && b.status === 'active' && !b.degraded;

  const poolFigures = () => {
    const grants = org().sharedGrants;
    return {
      total: sum(grants, (g) => g.totalCredits),
      remaining: sum(grants, grantRemaining),
      wholeTermRemaining: sum(
        grants.filter((g) => g.wholeTerm),
        grantRemaining,
      ),
    };
  };

  const reservedFigures = (excludeBudgetID) => {
    const holding = org()
      .teams.map((t) => t.budget)
      .filter((b) => holdsCredits(b) && b.id !== excludeBudgetID);
    return {
      all: sum(holding, budgetHold),
      lifetime: sum(
        holding.filter((b) => b.period === 'lifetime'),
        budgetHold,
      ),
    };
  };

  const fitsInPool = (period, extra, excludeBudgetID) => {
    const pool = poolFigures();
    const reserved = reservedFigures(excludeBudgetID);
    if (pool.remaining < reserved.all + extra) return false;
    return period !== 'lifetime' || pool.wholeTermRemaining >= reserved.lifetime + extra;
  };

  const budgetSummary = () => {
    const pool = poolFigures();
    const budgets = org()
      .teams.map((t) => t.budget)
      .filter(Boolean);
    return {
      poolTotal: pool.total,
      poolRemaining: pool.remaining,
      reservedForTeams: reservedFigures().all,
      limitsTotal: sum(
        budgets.filter((b) => b.mode === 'limit' && b.status === 'active'),
        (b) => b.amount,
      ),
      consumedInWindows: sum(budgets, (b) => b.usedAmount),
    };
  };

  // Read models shaped like the my.chaos backend responses

  const memberIdentity = (guid) => {
    const m = org().members.find((x) => x.guid === guid);
    return {
      guid,
      email: m ? m.email : guid,
      firstName: m ? m.firstName : '',
      lastName: m ? m.lastName : '',
    };
  };

  const teamProjects = (teamGUID) => org().projects.filter((p) => p.teamGUID === teamGUID);

  const projectMemberGUIDs = (teamGUID) => [...new Set(teamProjects(teamGUID).flatMap((p) => p.members))];

  const kindOf = (t) => t.kind || 'project';

  const departmentOf = (userGUID, excludeTeamGUID) =>
    org().teams.find((t) => t.isDefault && t.guid !== excludeTeamGUID && t.members.includes(userGUID));

  const defaultTeamFor = (userGUID) => {
    const t = userGUID && departmentOf(userGUID);
    return t ? { guid: t.guid, name: t.name } : undefined;
  };

  const teamSummaries = () =>
    org().teams.map((t) => ({
      guid: t.guid,
      name: t.name,
      kind: 'project',
      isDefault: Boolean(t.isDefault),
      memberCount: t.members.length,
      projectCount: teamProjects(t.guid).length,
      budget: t.budget || undefined,
    }));

  const teamDetails = (guid) => {
    const t = findTeam(guid);
    return {
      guid: t.guid,
      name: t.name,
      kind: 'project',
      isDefault: Boolean(t.isDefault),
      members: t.members.map(memberIdentity),
      projectMembers: projectMemberGUIDs(guid).map(memberIdentity),
      projects: teamProjects(guid).map((p) => ({
        guid: p.guid,
        name: p.name,
        memberCount: p.members.length,
      })),
      budget: t.budget || undefined,
    };
  };

  const teamRef = (teamGUID) => {
    const t = org().teams.find((x) => x.guid === teamGUID);
    return t ? { guid: t.guid, name: t.name } : undefined;
  };

  const projectSummaries = () =>
    org().projects.map((p) => {
      const ownerGUID = p.ownerGUID || p.members[0];
      return {
        guid: p.guid,
        name: p.name,
        memberCount: p.members.length,
        owner: ownerGUID ? memberIdentity(ownerGUID) : undefined,
        members: p.members.map(memberIdentity),
        team: teamRef(p.teamGUID),
      };
    });

  const projectDetails = (guid) => {
    const p = findProject(guid);
    return {
      guid: p.guid,
      name: p.name,
      members: p.members.map(memberIdentity),
      team: teamRef(p.teamGUID),
    };
  };

  // Team mutations

  const createTeam = (name, opts) => {
    const trimmed = validName(name);
    if (org().teams.some((t) => sameName(t.name, trimmed))) throw conflict('TEAM_NAME_TAKEN');
    const guid = newGUID('t');
    org().teams.push({
      guid,
      name: trimmed,
      kind: 'project',
      isDefault: Boolean(opts && opts.isDefault),
      createdAt: new Date().toISOString(),
      members: [],
      budget: null,
    });
    commit();
    return guid;
  };

  const renameTeam = (guid, name) => {
    const team = findTeam(guid);
    const trimmed = validName(name);
    if (org().teams.some((t) => t.guid !== guid && sameName(t.name, trimmed))) throw conflict('TEAM_NAME_TAKEN');
    team.name = trimmed;
    commit();
  };

  const setTeamKind = (guid, kind, isDefault) => {
    const team = findTeam(guid);
    team.kind = 'project';
    team.isDefault = Boolean(isDefault);
    commit();
  };

  const deleteTeam = (guid) => {
    findTeam(guid);
    org().projects.forEach((p) => {
      if (p.teamGUID === guid) p.teamGUID = null;
    });
    org().teams = org().teams.filter((t) => t.guid !== guid);
    commit();
  };

  const addTeamMember = (guid, userGUID) => {
    const team = findTeam(guid);
    requireActiveMember(userGUID);
    if (!team.members.includes(userGUID)) team.members.push(userGUID);
    commit();
  };

  const removeTeamMember = (guid, userGUID) => {
    const team = findTeam(guid);
    team.members = team.members.filter((m) => m !== userGUID);
    commit();
  };

  const assignTeamProject = (guid, projectGUID) => {
    findTeam(guid);
    const project = findProject(projectGUID);
    if (project.teamGUID && project.teamGUID !== guid) throw conflict('PROJECT_IN_OTHER_TEAM');
    project.teamGUID = guid;
    commit();
  };

  const removeTeamProject = (guid, projectGUID) => {
    const project = findProject(projectGUID);
    if (project.teamGUID === guid) project.teamGUID = null;
    commit();
  };

  // Budget mutations

  const requireSharedPool = () => {
    if (poolFigures().total <= 0) throw conflict('INSUFFICIENT_POOL');
  };

  const createBudget = (team, body) => {
    requireSharedPool();
    if (body.amountType === 'set' && body.mode === 'reservation' && !fitsInPool(body.period, body.amount)) throw conflict('INSUFFICIENT_POOL');
    team.budget = {
      id: newGUID('b'),
      amountType: body.amountType || 'set',
      mode: body.mode,
      period: body.period,
      amount: body.amount,
      usedAmount: 0,
      onExhausted: body.onExhausted,
      overagePct: body.overagePct,
      notifyPcts: body.notifyPcts,
      status: 'active',
      degraded: false,
    };
  };

  const updateBudget = (budget, body) => {
    const wasSet = (budget.amountType || 'set') === 'set';
    if (wasSet && body.amountType === 'set' && (budget.mode !== body.mode || budget.period !== body.period)) throw conflict('BUDGET_IMMUTABLE');
    const next = {
      ...budget,
      amountType: body.amountType,
      mode: body.mode,
      period: body.period,
      amount: body.amount,
      onExhausted: body.onExhausted,
      overagePct: body.overagePct,
      notifyPcts: body.notifyPcts,
    };
    if (next.mode === 'reservation' && next.status === 'active') {
      if (fitsInPool(next.period, budgetHold(next), next.id)) {
        next.degraded = false;
        delete next.degradedReason;
      } else if (budgetHold(next) > (holdsCredits(budget) ? budgetHold(budget) : 0)) {
        throw conflict('INSUFFICIENT_POOL');
      }
    }
    Object.assign(budget, next);
  };

  const setTeamBudget = (guid, body) => {
    const team = findTeam(guid);
    if ((body.amountType || 'set') !== 'set') {
      team.budget = null;
    } else if (team.budget) {
      updateBudget(team.budget, body);
    } else {
      createBudget(team, body);
    }
    commit();
  };

  const setTeamBudgetStatus = (guid, status) => {
    const team = findTeam(guid);
    const { budget } = team;
    if (!budget) throw notFound();
    if (status === 'released') {
      team.budget = null;
      commit();
      return;
    }
    if (status === 'active' && budget.mode === 'reservation' && !fitsInPool(budget.period, budgetHold(budget), budget.id)) {
      throw conflict('INSUFFICIENT_POOL');
    }
    if (status === 'active') {
      budget.degraded = false;
      delete budget.degradedReason;
    }
    budget.status = status;
    commit();
  };

  // Project mutations

  const createProject = (name, teamGUID, ownerGUID) => {
    const trimmed = validName(name);
    if (teamGUID) findTeam(teamGUID);
    if (org().projects.some((p) => sameName(p.name, trimmed))) throw conflict('PROJECT_NAME_TAKEN');
    const guid = newGUID('p');
    org().projects.push({
      guid,
      name: trimmed,
      teamGUID: teamGUID || null,
      ownerGUID: ownerGUID || null,
      members: ownerGUID ? [ownerGUID] : [],
    });
    commit();
    return guid;
  };

  const renameProject = (guid, name) => {
    const project = findProject(guid);
    const trimmed = validName(name);
    if (org().projects.some((p) => p.guid !== guid && sameName(p.name, trimmed))) {
      throw conflict('PROJECT_NAME_TAKEN');
    }
    project.name = trimmed;
    commit();
  };

  const deleteProject = (guid) => {
    findProject(guid);
    org().projects = org().projects.filter((p) => p.guid !== guid);
    commit();
  };

  const addProjectMember = (guid, userGUID) => {
    const project = findProject(guid);
    requireActiveMember(userGUID);
    if (!project.members.includes(userGUID)) project.members.push(userGUID);
    commit();
  };

  const removeProjectMember = (guid, userGUID) => {
    const project = findProject(guid);
    project.members = project.members.filter((m) => m !== userGUID);
    commit();
  };

  const setProjectTeam = (guid, teamGUID) => {
    const project = findProject(guid);
    if (teamGUID) findTeam(teamGUID);
    project.teamGUID = teamGUID || null;
    commit();
  };

  // Personal limits

  const setUsageLimit = (userGUID, value) => {
    const member = requireActiveMember(userGUID);
    const usage = member.quota ? member.quota.usage : 0;
    member.quota = {
      maxAmount: value,
      usage,
    };
    commit();
  };

  // Prototype controls

  const switchOrg = (guid) => {
    state.activeOrg = guid;
    commit();
  };

  const reset = () => {
    const active = state.activeOrg;
    state = P.seed(P.release);
    state.activeOrg = active;
    commit();
  };

  const setRelease = (release) => {
    const next = release === 'MVP' ? 'MVP' : 'Full';
    if (next === P.release) return;
    P.release = next;
    state = load();
    listeners.forEach((fn) => fn());
  };

  P.ApiError = ApiError;
  P.store = {
    subscribe: (fn) => listeners.push(fn),
    org,
    orgs: () => Object.values(state.orgs).map((o) => ({ guid: o.guid, name: o.name })),
    poolFigures,
    budgetSummary,
    teamSummaries,
    teamDetails,
    departmentOf: (userGUID, excludeTeamGUID) => {
      const t = departmentOf(userGUID, excludeTeamGUID);
      return t ? { guid: t.guid, name: t.name } : undefined;
    },
    defaultTeamFor,
    setTeamKind,
    projectSummaries,
    projectDetails,
    createTeam,
    renameTeam,
    deleteTeam,
    addTeamMember,
    removeTeamMember,
    assignTeamProject,
    removeTeamProject,
    setTeamBudget,
    setTeamBudgetStatus,
    createProject,
    renameProject,
    deleteProject,
    addProjectMember,
    removeProjectMember,
    setProjectTeam,
    setUsageLimit,
    switchOrg,
    reset,
    setRelease,
  };
})(window.Proto = window.Proto || {});
