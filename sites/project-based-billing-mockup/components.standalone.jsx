// Components.jsx — Eris UI kit components for the Chaos desktop app surface.
// All components share the light-theme tokens and 4pt spacing rhythm of the system.

const erisStyles = {
  // shared style helpers
  row: { display: 'flex', alignItems: 'center', gap: 8 },
  col: { display: 'flex', flexDirection: 'column' },
};

// ───────────────────────── Button ─────────────────────────
function Button({ size='m', variant='primary', icon=null, children, onClick, disabled }) {
  const heights = { xs:24, s:28, m:32, l:36, xl:40 };
  const radii   = { xs:2,  s:4,  m:6,  l:6,  xl:8  };
  const padX    = { xs:8,  s:10, m:12, l:14, xl:16 };
  const fontSz  = { xs:11, s:12, m:14, l:14, xl:14 };
  const variants = {
    primary:   { background:'#0B9EDD', color:'#fff', border:'1px solid transparent' },
    secondary: { background:'#fff', color:'#1C1C1C', border:'1px solid #DBDBDB' },
    tertiary:  { background:'transparent', color:'#1C1C1C', border:'1px solid transparent' },
    danger:    { background:'#E74549', color:'#fff', border:'1px solid transparent' },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      height: heights[size],
      padding: `0 ${padX[size]}px`,
      borderRadius: radii[size],
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      fontSize: fontSz[size],
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      whiteSpace: 'nowrap',
      transition: 'filter .12s ease',
      ...variants[variant],
    }}
    onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = 'brightness(1.12)'; }}
    onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; }}>
      {icon && <img src={__R(icon)} style={{ width: 14, height: 14, filter: (variant==='primary'||variant==='danger') ? 'invert(1)' : 'none' }} alt=""/>}
      {children}
    </button>
  );
}

// ───────────────────────── IconButton ─────────────────────────
function IconButton({ icon, size=32, active=false, onClick, title }) {
  return (
    <button onClick={onClick} title={title} style={{
      width: size, height: size, padding: 0,
      borderRadius: 6,
      background: active ? '#0B9EDD' : 'transparent',
      border: '1px solid transparent',
      cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background .12s',
    }}
    onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#F6F6F6'; }}
    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
      <img src={__R(icon)} alt="" style={{ width: 16, height: 16, filter: active ? 'invert(1)' : 'invert(25%)' }}/>
    </button>
  );
}

// ───────────────────────── Input ─────────────────────────
function Input({ label, value, onChange, placeholder, error, help, icon }) {
  return (
    <label style={{ display:'flex', flexDirection:'column', gap:4, fontFamily:'Inter,sans-serif' }}>
      {label && <span style={{ fontSize:11, fontWeight:600, color:'#303030' }}>{label}</span>}
      <span style={{ position:'relative', display:'flex' }}>
        {icon && <img src={__R(icon)} alt="" style={{
          position:'absolute', left:8, top:'50%', transform:'translateY(-50%)',
          width:14, height:14, filter:'invert(50%)'
        }}/>}
        <input value={value} onChange={onChange} placeholder={placeholder}
          style={{
            flex:1, height:32, padding: icon ? '0 10px 0 28px' : '0 10px',
            background:'#fff',
            border:'1px solid ' + (error ? '#E74549' : '#DBDBDB'),
            borderRadius:6,
            color:'#1C1C1C',
            fontFamily:'Inter,sans-serif',
            fontSize:13,
            outline:'none',
          }}
          onFocus={e => { if (!error) e.target.style.border = '1px solid #0B9EDD'; e.target.style.boxShadow = '0 0 0 2px rgba(11,158,221,.3)'; }}
          onBlur={e => { e.target.style.border = '1px solid ' + (error ? '#E74549' : '#DBDBDB'); e.target.style.boxShadow = 'none'; }}
        />
      </span>
      {(help || error) && <span style={{ fontSize:11, color: error ? '#D12F33' : '#828282' }}>{error || help}</span>}
    </label>
  );
}

// ───────────────────────── Toggle ─────────────────────────
function Toggle({ checked, onChange, label }) {
  return (
    <label style={{ display:'inline-flex', alignItems:'center', gap:8, cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:13, color:'#1C1C1C' }}>
      <span onClick={() => onChange(!checked)} style={{
        width:28, height:16, borderRadius:8,
        background: checked ? '#0B9EDD' : '#ABABAB',
        position:'relative', transition:'.15s', flex:'none',
      }}>
        <span style={{
          position:'absolute', top:2, left: checked ? 14 : 2,
          width:12, height:12, borderRadius:'50%',
          background:'#fff', transition:'.15s',
        }}/>
      </span>
      {label}
    </label>
  );
}

// ───────────────────────── Badge ─────────────────────────
function Badge({ tone='blue', children }) {
  const tones = {
    blue:   { background:'#0B9EDD', color:'#fff' },
    green:  { background:'#77B22A', color:'#fff' },
    amber:  { background:'#F3B830', color:'#1C1C1C' },
    red:    { background:'#E74549', color:'#fff' },
    grey:   { background:'#DBDBDB', color:'#1C1C1C' },
    outline:{ background:'transparent', color:'#525252', border:'1px solid #DBDBDB' },
  };
  return <span style={{
    display:'inline-flex', alignItems:'center', height:20, padding:'0 8px',
    borderRadius:4, fontFamily:'Inter,sans-serif', fontWeight:600, fontSize:11,
    ...tones[tone],
  }}>{children}</span>;
}

// ───────────────────────── Avatar ─────────────────────────
function Avatar({ initials='??', tone='#1681BD', size=28 }) {
  return <span style={{
    width:size, height:size, borderRadius:'50%',
    background: tone, color:'#fff',
    display:'inline-flex', alignItems:'center', justifyContent:'center',
    fontFamily:'Inter,sans-serif', fontWeight:600, fontSize: size*0.4,
    flex:'none',
  }}>{initials}</span>;
}

// ───────────────────────── ProductLogo ─────────────────────────
function ProductLogo({ name='vray', size=36 }) {
  const meta = {
    vray:    { color:'#2857AF', src:'../../assets/logos/vray.svg' },
    corona:  { color:'#77B22A', src:'../../assets/logos/corona.svg' },
    enscape: { color:'#F7941D', src:'../../assets/logos/enscape.svg' },
    phoenix: { color:'#F3B830', src:'../../assets/logos/phoenix.svg' },
    vantage: { color:'#17A2DF', src:'../../assets/logos/vantage.svg' },
    anima:   { color:'#12988B', src:'../../assets/logos/anima.svg' },
    cylindo: { color:'#00B0BD', src:'../../assets/logos/cylindo.svg' },
    cloud:   { color:'#714AB5', src:'../../assets/logos/cloud.svg' },
    scans:   { color:'#9E3988', src:'../../assets/logos/scans.svg' },
  }[name];
  return <span style={{
    width:size, height:size, borderRadius:6,
    background: meta.color,
    display:'inline-flex', alignItems:'center', justifyContent:'center',
    flex:'none',
  }}><img src={__R(meta.src)} alt={name} style={{ width: size*0.6, height: size*0.6 }}/></span>;
}

// ───────────────────────── Modal ─────────────────────────
function Modal({ open, title, children, footer, onClose, accent='#0B9EDD', icon=null }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position:'absolute', inset:0,
      background:'rgba(17,17,17,0.4)',
      display:'flex', alignItems:'center', justifyContent:'center',
      zIndex: 50,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width:400, background:'#fff',
        border:'1px solid #DBDBDB', borderRadius:8,
        boxShadow:'0 24px 48px -12px rgba(17,17,17,.24)',
        overflow:'hidden',
        fontFamily:'Inter,sans-serif',
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px 0' }}>
          {icon ? <span style={{
            width:24, height:24, borderRadius:'50%', background: accent, color:'#fff',
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            fontWeight:700, fontSize:14,
          }}>{icon}</span> : <span/>}
          <span onClick={onClose} style={{ color:'#828282', cursor:'pointer', fontSize:18, lineHeight:1 }}>×</span>
        </div>
        <div style={{ padding:'14px 20px 16px' }}>
          <h3 style={{ margin:'0 0 6px', fontSize:16, fontWeight:600, color:'#1C1C1C' }}>{title}</h3>
          <div style={{ fontSize:13, lineHeight:1.45, color:'#525252' }}>{children}</div>
        </div>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:8, padding:'0 20px 18px' }}>
          {footer}
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── Tabs ─────────────────────────
function Tabs({ items, value, onChange }) {
  return (
    <div style={{ display:'flex', borderBottom:'1px solid #DBDBDB' }}>
      {items.map(it => (
        <div key={it} onClick={() => onChange(it)} style={{
          padding:'8px 14px',
          fontFamily:'Inter,sans-serif', fontWeight:600, fontSize:13,
          color: value === it ? '#1C1C1C' : '#828282',
          cursor:'pointer',
          borderBottom: '2px solid ' + (value === it ? '#0B9EDD' : 'transparent'),
          marginBottom:-1,
        }}>{it}</div>
      ))}
    </div>
  );
}

// ───────────────────────── ProgressBar ─────────────────────────
function ProgressBar({ value=0, label }) {
  return (
    <div style={{ fontFamily:'Inter,sans-serif' }}>
      {label && <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#525252', marginBottom:4 }}>
        <span>{label}</span><span style={{ fontFamily:'ui-monospace,monospace' }}>{Math.round(value)}%</span>
      </div>}
      <div style={{ height:6, background:'#DBDBDB', borderRadius:3, overflow:'hidden' }}>
        <div style={{ height:'100%', width: value+'%', background:'#0B9EDD', transition:'width .3s ease' }}/>
      </div>
    </div>
  );
}

// ───────────────────────── Card ─────────────────────────
function RenderCard({ thumb, title, meta, status, statusTone='grey', onClick }) {
  return (
    <div onClick={onClick} style={{
      background:'#fff', border:'1px solid #DBDBDB', borderRadius:6,
      overflow:'hidden', cursor:'pointer',
      transition:'border-color .12s, transform .12s',
      fontFamily:'Inter,sans-serif',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = '#ABABAB'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = '#DBDBDB'; }}>
      <div style={{ height:120, background: thumb || 'linear-gradient(135deg,#4A5A62,#272727)' }}/>
      <div style={{ padding:'10px 12px' }}>
        <div style={{ fontSize:13, fontWeight:600, color:'#1C1C1C', marginBottom:2 }}>{title}</div>
        <div style={{ fontSize:11, color:'#828282', marginBottom:8 }}>{meta}</div>
        {status && <Badge tone={statusTone}>{status}</Badge>}
      </div>
    </div>
  );
}

Object.assign(window, {
  Button, IconButton, Input, Toggle, Badge, Avatar, ProductLogo,
  Modal, Tabs, ProgressBar, RenderCard,
});
