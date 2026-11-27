(function (P) {
  const s = document.currentScript;
  // In the design canvas the script has no src of its own, so fall back to the
  // prototype folder that sits next to MyChaos.dc.html.
  P.assetBase = s && s.src ? new URL('../', s.src).href : 'mychaos-prototype/assets/';
})(window.Proto = window.Proto || {});
(function (P) {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const ICON_PATHS = {
    moreVert:
      'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
    close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    arrowDropDown: 'M7 10l5 5 5-5z',
    arrowUp: 'M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z',
    arrowDown: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z',
    radioOff:
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
    radioOn:
      'M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
    coin:
      'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z',
  };

  const h = (tag, props, ...children) => {
    const el = document.createElement(tag);
    Object.entries(props || {}).forEach(([key, value]) => {
      if (value === undefined || value === null || value === false) return;
      if (key === 'className') el.className = value;
      else if (key === 'style') Object.assign(el.style, value);
      else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), value);
      else if (key === 'value') el.value = value;
      else el.setAttribute(key, value === true ? '' : value);
    });
    append(el, children);
    return el;
  };

  const append = (el, children) => {
    children.flat(Infinity).forEach((child) => {
      if (child === null || child === undefined || child === false) return;
      el.appendChild(child instanceof Node ? child : document.createTextNode(String(child)));
    });
    return el;
  };

  const icon = (name, className) => {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    if (className) svg.setAttribute('class', className);
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', ICON_PATHS[name]);
    svg.appendChild(path);
    return svg;
  };

  const formatCredits = (value) => Math.floor(value || 0).toLocaleString('en-US');
  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }) : '-';

  const memberName = (member) =>
    [member.firstName, member.lastName].filter(Boolean).join(' ').trim() || member.email || member.guid;

  const memberOptions = (orgMembers, excluded) => {
    const excludedGUIDs = new Set(excluded.map((member) => member.guid));
    return orgMembers
      .filter((member) => !excludedGUIDs.has(member.guid) && !member.disabled)
      .map((member) => ({
        value: member.guid,
        label: memberName(member),
      }));
  };

  // MUI v3 Button / IconButton

  const BUTTON_VARIANTS = {
    secondary: 'text-secondary',
    primary: 'contained-primary',
    error: 'contained-error',
    outlined: 'outlined-primary',
  };

  const button = (label, { variant = 'secondary', disabled, onClick } = {}) =>
    h('button', { type: 'button', className: `mui-button ${BUTTON_VARIANTS[variant]}`, disabled, onClick }, label);

  const iconButton = (iconName, { label, disabled, small, onClick } = {}) =>
    h(
      'button',
      {
        type: 'button',
        className: `mui-icon-button${small ? ' small' : ''}`,
        'aria-label': label,
        disabled,
        onClick,
      },
      icon(iconName),
    );

  // MUI v3 Menu (popover anchored over its trigger)

  let openPopover = null;

  const closePopover = () => {
    if (!openPopover) return;
    openPopover.forEach((el) => el.remove());
    openPopover = null;
  };

  const showPopover = (anchor, items, { matchWidth, selectedIndex } = {}) => {
    closePopover();
    const rect = anchor.getBoundingClientRect();
    const away = h('div', { className: 'mui-click-away', onClick: closePopover });
    const list = h(
      'ul',
      { role: 'menu' },
      items.map((item) =>
        h(
          'li',
          {
            role: 'menuitem',
            className: `mui-menu-item ${item.className || ''}${item.selected ? ' selected' : ''}`,
            onClick: () => {
              closePopover();
              item.onClick();
            },
          },
          item.label,
        ),
      ),
    );
    const paper = h('div', { className: 'mui-popover-paper' }, list);
    document.body.append(away, paper);
    const itemHeight = 46;
    const offset = selectedIndex > 0 ? selectedIndex * itemHeight : 0;
    const top = Math.max(16, Math.min(rect.top - 8 - offset, window.innerHeight - paper.offsetHeight - 16));
    const left = Math.max(16, Math.min(rect.left, window.innerWidth - paper.offsetWidth - 16));
    Object.assign(paper.style, {
      top: `${top}px`,
      left: `${left}px`,
      minWidth: matchWidth ? `${rect.width}px` : undefined,
    });
    openPopover = [away, paper];
  };

  const actionMenu = (label, actions) =>
    iconButton('moreVert', {
      label,
      onClick: (e) =>
        showPopover(
          e.currentTarget,
          actions.map((action) => ({
            label: action.label,
            className: 'allocate-product',
            onClick: action.onClick,
          })),
        ),
    });

  // MUI v3 Select

  const select = ({ options, value, placeholder, disabled, ariaLabel, className, onChange }) => {
    const all = placeholder === undefined ? options : [{ value: '', label: placeholder }, ...options];
    const current = all.find((o) => o.value === value) || all[0];
    const root = h(
      'div',
      { className: `mui-select ${className || ''}${disabled ? ' disabled' : ''}` },
      h('button', { type: 'button', className: 'mui-select-value', 'aria-label': ariaLabel, disabled }, current.label),
      icon('arrowDropDown'),
    );
    if (disabled) return root;
    root.addEventListener('click', () =>
      showPopover(
        root,
        all.map((option) => ({
          label: option.label,
          selected: option.value === current.value,
          onClick: () => onChange(option.value),
        })),
        {
          matchWidth: true,
          selectedIndex: all.indexOf(current),
        },
      ),
    );
    return root;
  };

  // MUI v3 RadioGroup

  const radioGroup = ({ name, options, value, disabled, onChange }) =>
    h(
      'div',
      { className: 'mui-radio-group', role: 'radiogroup' },
      options.map((option) => {
        const checked = option.value === value;
        return h(
          'label',
          { className: `mui-form-control-label${disabled ? ' disabled' : ''}` },
          h(
            'span',
            { className: `mui-radio${checked ? ' checked' : ''}` },
            h('input', {
              type: 'radio',
              name,
              value: option.value,
              checked,
              disabled,
              onChange: () => onChange(option.value),
            }),
            icon(checked ? 'radioOn' : 'radioOff'),
          ),
          h('span', null, option.label),
        );
      }),
    );

  // my.chaos Form/TextField

  const textField = ({ name, label, value, type = 'text', error, autoFocus, onInput, onEnter }) => {
    const input = h('input', {
      id: name,
      name,
      type,
      value,
      style: { borderRadius: '4px' },
      onInput: (e) => onInput(e.target.value),
      onKeydown: (e) => {
        if (e.key === 'Enter' && onEnter) onEnter();
      },
    });
    if (autoFocus) setTimeout(() => input.focus(), 0);
    return h(
      'div',
      { id: `input-${name}-wrapper`, className: `form-field-wrapper ${error ? 'has-error error-text' : ''}` },
      h('label', { for: name }, label),
      input,
      error && h('p', { className: 'error error-text' }, error),
    );
  };

  // my.chaos Helper/ModalDialog with the TeamDialog layout

  let openDialog = null;

  const renderDialog = () => {
    if (!openDialog) return;
    const spec = openDialog.component.render();
    const { pending } = openDialog;
    const close = () => !pending && closeDialog();
    const actions = [button(spec.closeLabel || 'Cancel', { onClick: close, disabled: pending })];
    if (spec.onConfirm) {
      actions.push(
        button(spec.confirmLabel, {
          variant: spec.destructive ? 'error' : 'primary',
          disabled: pending || spec.confirmDisabled,
          onClick: spec.onConfirm,
        }),
      );
    }
    const paper = h(
      'div',
      { className: 'mui-dialog-paper' },
      h(
        'div',
        { className: 'dialog-title variant3' },
        h('h6', null, spec.title),
        !pending && iconButton('close', { label: 'Close', onClick: close }),
      ),
      h(
        'div',
        { className: 'dialog-content' },
        spec.body,
        spec.error && h('p', { className: 'credit-team-dialog-error', role: 'alert' }, spec.error),
      ),
      h('div', { className: 'action-buttons' }, h('div', { className: 'mui-grid-container justify-end' }, actions)),
    );
    const root = h(
      'div',
      { className: `mui-dialog-root ${spec.className || 'credit-team-dialog'}`, role: 'dialog' },
      h('div', { className: 'mui-backdrop', onClick: close }),
      paper,
    );
    const previous = openDialog.root;
    const focused = previous && previous.contains(document.activeElement) ? document.activeElement : null;
    const scroll = previous ? previous.querySelector('.mui-dialog-paper').scrollTop : 0;
    const inner = previous ? [...previous.querySelectorAll('[data-keep-scroll]')].map((el) => [el.dataset.keepScroll, el.scrollTop]) : [];
    if (previous) previous.replaceWith(root);
    else document.body.appendChild(root);
    paper.scrollTop = scroll;
    inner.forEach(([key, top]) => {
      const el = root.querySelector(`[data-keep-scroll="${key}"]`);
      if (el) el.scrollTop = top;
    });
    openDialog.root = root;
    restoreFocus(root, focused);
  };

  const restoreFocus = (root, focused) => {
    if (!focused || !focused.name) return;
    const input = root.querySelector(`input[name="${focused.name}"]`);
    if (!input) return;
    input.focus();
    if (input.type === 'text') input.setSelectionRange(input.value.length, input.value.length);
  };

  const showDialog = (component) => {
    closeDialog();
    openDialog = {
      component,
      pending: false,
      root: null,
    };
    component.refresh = renderDialog;
    renderDialog();
  };

  const closeDialog = () => {
    closePopover();
    if (!openDialog) return;
    openDialog.root.remove();
    openDialog = null;
  };

  const mutate = (component, fn, { keepOpen, onSuccess } = {}) => {
    if (!openDialog || openDialog.component !== component) return;
    openDialog.pending = true;
    component.error = null;
    renderDialog();
    setTimeout(() => {
      if (!openDialog || openDialog.component !== component) return;
      openDialog.pending = false;
      try {
        fn();
      } catch (err) {
        if (!(err instanceof P.ApiError)) throw err;
        component.error = err.message;
        renderDialog();
        return;
      }
      if (keepOpen) renderDialog();
      else closeDialog();
      if (onSuccess) onSuccess();
    }, 250);
  };

  const isPending = () => Boolean(openDialog && openDialog.pending);

  // Tooltips: MUI Tooltip for [data-tooltip], my.chaos Helper/Tooltip for info icons

  let tooltipEl = null;

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest && e.target.closest('[data-tooltip]');
    if (!target) return;
    tooltipEl = tooltipEl || h('div', { className: 'mui-tooltip', role: 'tooltip' });
    tooltipEl.textContent = target.getAttribute('data-tooltip');
    document.body.appendChild(tooltipEl);
    const rect = target.getBoundingClientRect();
    const left = Math.max(8, Math.min(rect.left + rect.width / 2 - tooltipEl.offsetWidth / 2, window.innerWidth - tooltipEl.offsetWidth - 8));
    Object.assign(tooltipEl.style, {
      top: `${rect.bottom + 8}px`,
      left: `${left}px`,
    });
  });

  document.addEventListener('mouseout', (e) => {
    if (tooltipEl && e.target.closest && e.target.closest('[data-tooltip]')) tooltipEl.remove();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (openPopover) closePopover();
    else if (openDialog && !openDialog.pending) closeDialog();
  });

  const infoTooltip = (text) => {
    const host = h('span', { className: 'info-tooltip-host' }, h('span', { className: 'info-icon' }));
    host.addEventListener('mouseenter', () =>
      host.appendChild(h('div', { className: 'info-tooltip-paper' }, h('div', { className: 'custom-tooltip' }, h('p', null, text)))),
    );
    host.addEventListener('mouseleave', () => host.querySelectorAll('.info-tooltip-paper').forEach((el) => el.remove()));
    return host;
  };

  // MUI v3 Snackbar

  const snackbar = (message) => {
    document.querySelectorAll('.mui-snackbar').forEach((el) => el.remove());
    const el = h('div', { className: 'mui-snackbar', role: 'status' }, message);
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  };

  P.ui = {
    h,
    append,
    icon,
    formatCredits,
    formatDate,
    memberName,
    memberOptions,
    button,
    iconButton,
    actionMenu,
    select,
    radioGroup,
    textField,
    showDialog,
    closeDialog,
    renderDialog,
    mutate,
    isPending,
    infoTooltip,
    snackbar,
  };
})(window.Proto = window.Proto || {});
