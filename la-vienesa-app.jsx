
const { useState, useEffect, useRef, useMemo, useContext, createContext } = React;

// ── Design tokens ──────────────────────────────────────────────────────────
const C = {
  bg: '#FAF7F2', surface: '#FFFFFF', border: '#E8DFD0',
  text: '#2A1A08', muted: '#8A7A65', faint: '#F3EDE3',
  accent: '#C8873A', accentL: '#FEF0DC', accentD: '#A06828',
  danger: '#B83232', dangerL: '#FFF0F0',
  ok: '#3D7A52', okL: '#EDFAF3',
  nav: '#FFFFFF',
};

const NAV_H = 64;

// ── Helpers ────────────────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().slice(0, 10);
const fmtDate = d => { if (!d) return ''; const [y,m,dd] = d.split('-'); return `${dd}/${m}/${y}`; };
const uid = () => Math.random().toString(36).slice(2, 9);
const storKey = (s, f) => `lv__${s}__${f}`;
const defaultData = () => ({ comida: {}, devolucion: [], sobreventas: [], stock: {} });

// ── Context ────────────────────────────────────────────────────────────────
const Ctx = createContext();
const useCtx = () => useContext(Ctx);

// ── Shared components ──────────────────────────────────────────────────────
function Stepper({ value = 0, onChange, accent }) {
  const base = {
    width: 38, height: 38, borderRadius: 10, border: `1.5px solid ${C.border}`,
    background: C.surface, color: C.text, fontSize: 20, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    transition: 'all .15s',
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <button style={base} onClick={() => onChange(Math.max(0, value - 1))}>−</button>
      <span style={{
        minWidth: 38, textAlign: 'center', fontWeight: 700, fontSize: 16,
        color: value > 0 ? (accent || C.accent) : C.muted,
      }}>{value}</span>
      <button style={{ ...base, background: value > 0 ? C.accentL : C.surface, borderColor: value > 0 ? C.accent : C.border }}
        onClick={() => onChange(value + 1)}>+</button>
    </div>
  );
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 200,
    }} onClick={onClose}>
      <div style={{
        background: C.surface, borderRadius: '20px 20px 0 0',
        width: '100%', maxWidth: 640, maxHeight: '90dvh', overflow: 'auto',
        boxShadow: '0 -8px 40px rgba(0,0,0,.12)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 14px', borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: C.text }}>{title}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, color: C.muted, cursor: 'pointer', lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ padding: '16px 20px 32px' }}>{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children, half }) {
  return (
    <div style={{ marginBottom: 14, width: half ? '48%' : '100%' }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}

const inp = {
  width: '100%', padding: '11px 13px', border: `1.5px solid ${C.border}`,
  borderRadius: 10, fontSize: 15, color: C.text, background: C.bg,
  fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none',
};

function Autocomplete({ value, onChange, options, placeholder }) {
  const [q, setQ] = useState(value || '');
  const [open, setOpen] = useState(false);
  const filtered = useMemo(() => options.filter(o => o.toLowerCase().includes(q.toLowerCase())).slice(0, 8), [q, options]);

  function pick(o) { setQ(o); onChange(o); setOpen(false); }

  return (
    <div style={{ position: 'relative' }}>
      <input style={inp} value={q} placeholder={placeholder}
        onChange={e => { setQ(e.target.value); onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {open && filtered.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 300,
          background: C.surface, border: `1.5px solid ${C.border}`, borderTop: 'none',
          borderRadius: '0 0 10px 10px', maxHeight: 220, overflow: 'auto',
          boxShadow: '0 8px 24px rgba(0,0,0,.1)',
        }}>
          {filtered.map(o => (
            <div key={o} onMouseDown={() => pick(o)}
              style={{ padding: '11px 14px', cursor: 'pointer', fontSize: 14, color: C.text, borderBottom: `1px solid ${C.border}` }}
              onMouseOver={e => e.currentTarget.style.background = C.faint}
              onMouseOut={e => e.currentTarget.style.background = ''}
            >{o}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function FAB({ onClick }) {
  return (
    <button onClick={onClick} style={{
      position: 'fixed', bottom: NAV_H + 16, right: 20, width: 54, height: 54,
      borderRadius: 27, background: C.accent, color: '#fff', border: 'none',
      fontSize: 28, fontWeight: 700, cursor: 'pointer', zIndex: 100,
      boxShadow: '0 4px 18px rgba(200,135,58,.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'inherit',
    }}>+</button>
  );
}

function SectionHeader({ label }) {
  return (
    <div style={{ padding: '10px 16px 6px', fontSize: 11, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '.1em', background: C.bg, borderBottom: `1px solid ${C.border}` }}>{label}</div>
  );
}

function Tag({ children, color = C.accent, bg = C.accentL }) {
  return <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: bg, color, letterSpacing: '.03em' }}>{children}</span>;
}

function PrimaryBtn({ onClick, children, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', padding: '13px', borderRadius: 12, border: 'none',
      background: disabled ? C.border : C.accent, color: disabled ? C.muted : '#fff',
      fontSize: 15, fontWeight: 700, cursor: disabled ? 'default' : 'pointer',
      fontFamily: 'inherit', marginTop: 8,
    }}>{children}</button>
  );
}

// ── Home screen ────────────────────────────────────────────────────────────
function HomeScreen({ setScreen }) {
  const { sucursal, setSucursal, fecha, setFecha, data, currentUser, setShowUsers, setShowHistorial } = useCtx();
  const comidaFilled = Object.values(data.comida).some(v => (v.entrada||0) + (v.salida||0) > 0);
  const stockFilled = Object.values(data.stock).some(v => v.cantidad || v.peso);

  const isSaved = tipo => !!getLastRecord(tipo, sucursal, fecha);

  const statusOf = (tipo, filled) => {
    if (isSaved(tipo)) return 'guardado';
    if (filled) return 'completo';
    return 'pendiente';
  };

  const STATUS_LABEL = { guardado: 'Guardado ✓', completo: 'Sin guardar', pendiente: 'Pendiente' };
  const STATUS_COLOR = { guardado: C.ok, completo: C.accent, pendiente: C.muted };
  const STATUS_BG    = { guardado: C.okL, completo: C.accentL, pendiente: C.faint };

  const cards = [
    { id: 'comida', label: 'Planilla de Comida', desc: 'Entradas y salidas de productos', status: statusOf('comida', comidaFilled) },
    { id: 'devolucion', label: 'Devolución de Mercadería', desc: 'Registro de bajas', status: statusOf('devolucion', data.devolucion.length > 0) },
    { id: 'sobreventas', label: 'Sobreventas', desc: 'Alta y baja de sobreventas', status: statusOf('sobreventas', data.sobreventas.length > 0) },
    { id: 'stock', label: 'Stock Lista', desc: 'Inventario de pastelería y cuartelería', status: statusOf('stock', stockFilled) },
  ];

  return (
    <div style={{ padding: '20px 16px', paddingBottom: NAV_H + 20 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 2 }}>Reportes</div>
        <div style={{ fontSize: 14, color: C.muted }}>{fmtDate(fecha)}</div>
      </div>

      {/* Sucursal + Fecha */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>Sucursal</label>
          <select value={sucursal} onChange={e => setSucursal(e.target.value)} style={{ ...inp }}>
            {SUCURSALES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>Fecha</label>
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ ...inp }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {cards.map(c => (
          <button key={c.id} onClick={() => setScreen(c.id)} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            background: C.surface, border: `1.5px solid ${c.status === 'guardado' ? C.ok : C.border}`,
            borderRadius: 14, padding: '15px 16px', cursor: 'pointer',
            textAlign: 'left', fontFamily: 'inherit',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 2 }}>{c.label}</div>
              <div style={{ fontSize: 13, color: C.muted }}>{c.desc}</div>
            </div>
            <Tag color={STATUS_COLOR[c.status]} bg={STATUS_BG[c.status]}>
              {STATUS_LABEL[c.status]}
            </Tag>
          </button>
        ))}
        <button onClick={() => setShowHistorial(true)} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            background: C.faint, border: `1.5px dashed ${C.border}`,
            borderRadius: 14, padding: '15px 16px', cursor: 'pointer',
            textAlign: 'left', fontFamily: 'inherit', marginTop: 4,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: C.accentL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🗂️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 2 }}>Historial de registros</div>
              <div style={{ fontSize: 13, color: C.muted }}>Ver planillas guardadas</div>
            </div>
          </button>
          {currentUser && currentUser.rol === 'admin' && (
          <button onClick={() => setShowUsers(true)} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            background: C.faint, border: `1.5px dashed ${C.border}`,
            borderRadius: 14, padding: '15px 16px', cursor: 'pointer',
            textAlign: 'left', fontFamily: 'inherit', marginTop: 4,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: C.accentL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>👥</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 2 }}>Gestión de usuarios</div>
              <div style={{ fontSize: 13, color: C.muted }}>Crear y administrar empleados</div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}

// ── Comida screen ──────────────────────────────────────────────────────────
function ComidaScreen() {
  const { data, setDataKey } = useCtx();

  const cats = useMemo(() => {
    const m = {};
    COMIDA_PRODUCTOS.forEach(p => { if (!m[p.cat]) m[p.cat] = []; m[p.cat].push(p); });
    return m;
  }, []);

  function updateProd(id, field, val) {
    const prev = data.comida[id] || { entrada: 0, salida: 0 };
    setDataKey('comida', { ...data.comida, [id]: { ...prev, [field]: val } });
  }

  return (
    <div style={{ paddingBottom: NAV_H + 68 }}>
      <SaveButton tipo="comida" data={data.comida} />
      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 130px', padding: '10px 16px', borderBottom: `1px solid ${C.border}`, background: C.bg, position: 'sticky', top: 0, zIndex: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.06em' }}>Producto</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.ok, textTransform: 'uppercase', letterSpacing: '.06em', textAlign: 'center' }}>Entradas</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.danger, textTransform: 'uppercase', letterSpacing: '.06em', textAlign: 'center' }}>Salidas</span>
      </div>

      {Object.entries(cats).map(([cat, prods]) => (
        <div key={cat}>
          <SectionHeader label={cat} />
          {prods.map(p => {
            const v = data.comida[p.id] || { entrada: 0, salida: 0 };
            return (
              <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1fr 130px 130px', alignItems: 'center', padding: '10px 16px', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
                <span style={{ fontSize: 14, color: C.text, paddingRight: 8 }}>{p.nombre}</span>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Stepper value={v.entrada} onChange={val => updateProd(p.id, 'entrada', val)} accent={C.ok} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Stepper value={v.salida} onChange={val => updateProd(p.id, 'salida', val)} accent={C.danger} />
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── Devolución screen ──────────────────────────────────────────────────────
function DevolucionScreen() {
  const { data, setDataKey } = useCtx();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ producto: '', peso: '', fechaElab: '', motivo: MOTIVOS_BAJA[0] });
  const [editId, setEditId] = useState(null);

  function save() {
    if (!form.producto) return;
    if (editId) {
      setDataKey('devolucion', data.devolucion.map(r => r.id === editId ? { ...r, ...form } : r));
    } else {
      setDataKey('devolucion', [...data.devolucion, { ...form, id: uid() }]);
    }
    setForm({ producto: '', peso: '', fechaElab: '', motivo: MOTIVOS_BAJA[0] });
    setEditId(null);
    setOpen(false);
  }

  function del(id) { setDataKey('devolucion', data.devolucion.filter(r => r.id !== id)); }

  function edit(r) { setForm({ producto: r.producto, peso: r.peso, fechaElab: r.fechaElab, motivo: r.motivo }); setEditId(r.id); setOpen(true); }

  return (
    <div style={{ paddingBottom: NAV_H + 72 }}>
      <SaveButton tipo="devolucion" data={data.devolucion} />
      {data.devolucion.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '70px 20px', color: C.muted }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>📦</div>
          <div style={{ fontSize: 15 }}>No hay devoluciones registradas</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Tocá + para agregar una</div>
        </div>
      ) : (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px 100px 100px 40px', gap: 0, padding: '8px 14px', background: C.bg, borderBottom: `1px solid ${C.border}` }}>
            {['Producto','Peso (g)','F. Elab.','Motivo',''].map((h, i) => (
              <span key={i} style={{ fontSize: 10, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</span>
            ))}
          </div>
          {data.devolucion.map(r => (
            <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '1fr 70px 100px 100px 40px', alignItems: 'center', padding: '12px 14px', borderBottom: `1px solid ${C.border}`, background: C.surface }} onClick={() => edit(r)}>
              <span style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{r.producto}</span>
              <span style={{ fontSize: 13, color: C.muted }}>{r.peso}g</span>
              <span style={{ fontSize: 13, color: C.muted }}>{fmtDate(r.fechaElab)}</span>
              <Tag>{r.motivo}</Tag>
              <button onClick={e => { e.stopPropagation(); del(r.id); }} style={{ background: 'none', border: 'none', color: C.danger, fontSize: 18, cursor: 'pointer', padding: 4 }}>✕</button>
            </div>
          ))}
        </div>
      )}
      <FAB onClick={() => { setForm({ producto: '', peso: '', fechaElab: '', motivo: MOTIVOS_BAJA[0] }); setEditId(null); setOpen(true); }} />
      <Modal open={open} onClose={() => setOpen(false)} title={editId ? 'Editar devolución' : 'Nueva devolución'}>
        <Field label="Producto">
          <Autocomplete value={form.producto} onChange={v => setForm(f => ({...f, producto: v}))} options={TODOS_PRODUCTOS} placeholder="Buscar producto..." />
        </Field>
        <div style={{ display: 'flex', gap: '4%' }}>
          <Field label="Peso (gramos)" half>
            <input type="number" style={inp} value={form.peso} onChange={e => setForm(f => ({...f, peso: e.target.value}))} placeholder="0" />
          </Field>
          <Field label="Fecha elaboración" half>
            <input type="date" style={inp} value={form.fechaElab} onChange={e => setForm(f => ({...f, fechaElab: e.target.value}))} />
          </Field>
        </div>
        <Field label="Motivo de baja">
          <select style={inp} value={form.motivo} onChange={e => setForm(f => ({...f, motivo: e.target.value}))}>
            {MOTIVOS_BAJA.map(m => <option key={m}>{m}</option>)}
          </select>
        </Field>
        <PrimaryBtn onClick={save} disabled={!form.producto}>Guardar</PrimaryBtn>
      </Modal>
    </div>
  );
}

// ── Sobreventas screen ─────────────────────────────────────────────────────
function SobreventasScreen() {
  const { data, setDataKey } = useCtx();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ tipo: 'alta', fechaProducto: '', concepto: '', cantidad: '', precio: '' });

  function save() {
    if (!form.concepto) return;
    setDataKey('sobreventas', [...data.sobreventas, { ...form, id: uid() }]);
    setForm({ tipo: 'alta', fechaProducto: '', concepto: '', cantidad: '', precio: '' });
    setOpen(false);
  }

  function del(id) { setDataKey('sobreventas', data.sobreventas.filter(r => r.id !== id)); }

  const altas = data.sobreventas.filter(r => r.tipo === 'alta');
  const bajas = data.sobreventas.filter(r => r.tipo === 'baja');

  function List({ items, color, bg }) {
    if (!items.length) return <div style={{ padding: '20px 16px', color: C.muted, fontSize: 14 }}>Sin registros</div>;
    return items.map(r => (
      <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{r.concepto}</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Fecha prod: {fmtDate(r.fechaProducto)}</div>
        </div>
        <div style={{ textAlign: 'right', marginRight: 6 }}>
          {r.cantidad && <div style={{ fontSize: 13, fontWeight: 700, color }}>{r.cantidad} ud.</div>}
          {r.precio && <div style={{ fontSize: 12, color: C.muted }}>${r.precio}</div>}
        </div>
        <button onClick={() => del(r.id)} style={{ background: 'none', border: 'none', color: C.danger, fontSize: 18, cursor: 'pointer', padding: 4 }}>✕</button>
      </div>
    ));
  }

  return (
    <div style={{ paddingBottom: NAV_H + 72 }}>
      <SaveButton tipo="sobreventas" data={data.sobreventas} />
      {data.sobreventas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '70px 20px', color: C.muted }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>📊</div>
          <div style={{ fontSize: 15 }}>Sin sobreventas registradas</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Tocá + para agregar</div>
        </div>
      ) : (
        <>
          <SectionHeader label={`Altas (${altas.length})`} />
          <List items={altas} color={C.ok} bg={C.okL} />
          <SectionHeader label={`Bajas (${bajas.length})`} />
          <List items={bajas} color={C.danger} bg={C.dangerL} />
        </>
      )}

      <FAB onClick={() => setOpen(true)} />
      <Modal open={open} onClose={() => setOpen(false)} title="Nueva sobreventa">
        <Field label="Tipo">
          <div style={{ display: 'flex', gap: 8 }}>
            {['alta','baja'].map(t => (
              <button key={t} onClick={() => setForm(f => ({...f, tipo: t}))} style={{
                flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer',
                border: `1.5px solid ${form.tipo === t ? C.accent : C.border}`,
                background: form.tipo === t ? C.accentL : C.surface,
                color: form.tipo === t ? C.accentD : C.text,
                fontWeight: 700, fontSize: 14, fontFamily: 'inherit', textTransform: 'capitalize',
              }}>{t === 'alta' ? '↑ Alta' : '↓ Baja'}</button>
            ))}
          </div>
        </Field>
        <Field label="Concepto / Producto">
          <input style={inp} value={form.concepto} onChange={e => setForm(f => ({...f, concepto: e.target.value}))} placeholder="Descripción del producto" />
        </Field>
        <div style={{ display: 'flex', gap: '4%' }}>
          <Field label="Fecha del producto" half>
            <input type="date" style={inp} value={form.fechaProducto} onChange={e => setForm(f => ({...f, fechaProducto: e.target.value}))} />
          </Field>
          <Field label="Cantidad" half>
            <input type="number" style={inp} value={form.cantidad} onChange={e => setForm(f => ({...f, cantidad: e.target.value}))} placeholder="0" />
          </Field>
        </div>
        <Field label="Precio">
          <input type="number" style={inp} value={form.precio} onChange={e => setForm(f => ({...f, precio: e.target.value}))} placeholder="$0.00" />
        </Field>
        <PrimaryBtn onClick={save} disabled={!form.concepto}>Guardar</PrimaryBtn>
      </Modal>
    </div>
  );
}

// ── Stock screen ───────────────────────────────────────────────────────────
function StockScreen() {
  const { data, setDataKey } = useCtx();
  const [tab, setTab] = useState('pasteleria');
  const [subTab, setSubTab] = useState('postres');

  function update(id, field, val) {
    const prev = data.stock[id] || { cantidad: '', peso: '' };
    setDataKey('stock', { ...data.stock, [id]: { ...prev, [field]: val } });
  }

  function ItemRow({ id, nombre }) {
    const v = data.stock[id] || { cantidad: '', peso: '' };
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px', alignItems: 'center', padding: '9px 14px', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <span style={{ fontSize: 13, color: C.text }}>{nombre}</span>
        <input type="number" value={v.cantidad} onChange={e => update(id, 'cantidad', e.target.value)}
          placeholder="0" style={{ ...inp, padding: '7px 9px', fontSize: 14, textAlign: 'center' }} />
        <input type="number" value={v.peso} onChange={e => update(id, 'peso', e.target.value)}
          placeholder="—" style={{ ...inp, padding: '7px 9px', fontSize: 14, textAlign: 'center', marginLeft: 6 }} />
      </div>
    );
  }

  const tabBtn = (id, label) => (
    <button key={id} onClick={() => setTab(id)} style={{
      flex: 1, padding: '9px 4px', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
      background: tab === id ? C.accent : C.surface,
      color: tab === id ? '#fff' : C.muted,
      fontWeight: tab === id ? 700 : 500, fontSize: 13,
      borderBottom: `2px solid ${tab === id ? C.accent : C.border}`,
    }}>{label}</button>
  );

  const subBtn = (id, label) => (
    <button key={id} onClick={() => setSubTab(id)} style={{
      padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
      background: subTab === id ? C.accentL : 'transparent',
      color: subTab === id ? C.accentD : C.muted,
      fontWeight: subTab === id ? 700 : 500, fontSize: 12, flexShrink: 0,
    }}>{label}</button>
  );

  const currentGrupo = STOCK_GRUPOS_PASTELERIA.find(g => g.id === subTab);

  return (
    <div style={{ paddingBottom: NAV_H + 68 }}>
      <SaveButton tipo="stock" data={data.stock} />
      {/* Main tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 10, background: C.surface }}>
        {tabBtn('pasteleria', 'Pastelería')}
        {tabBtn('cuarterio', 'Cuartelería')}
      </div>

      {tab === 'pasteleria' && (
        <>
          {/* Sub tabs */}
          <div style={{ display: 'flex', overflowX: 'auto', gap: 4, padding: '8px 10px', borderBottom: `1px solid ${C.border}`, background: C.bg }}>
            {STOCK_GRUPOS_PASTELERIA.map(g => subBtn(g.id, g.label))}
          </div>

          {/* Column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px', padding: '7px 14px', background: C.faint, borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '.06em' }}>Producto</span>
            <span style={{ fontSize: 10, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '.06em', textAlign: 'center' }}>Cantidad</span>
            <span style={{ fontSize: 10, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '.06em', textAlign: 'center', marginLeft: 6 }}>Peso</span>
          </div>

          {currentGrupo && currentGrupo.items.map((nombre, i) => {
            const id = `ps_${currentGrupo.id}_${i}`;
            return <ItemRow key={id} id={id} nombre={nombre} />;
          })}
        </>
      )}

      {tab === 'cuarterio' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px', padding: '7px 14px', background: C.faint, borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '.06em' }}>Producto</span>
            <span style={{ fontSize: 10, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '.06em', textAlign: 'center' }}>Cantidad</span>
            <span style={{ fontSize: 10, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '.06em', textAlign: 'center', marginLeft: 6 }}>Peso</span>
          </div>
          {STOCK_CUARTERIO.map((nombre, i) => {
            const id = `cu_${i}`;
            return <ItemRow key={id} id={id} nombre={nombre} />;
          })}
        </>
      )}
    </div>
  );
}

// ── Bottom Nav ─────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'home', label: 'Inicio', icon: '⌂' },
  { id: 'comida', label: 'Comida', icon: '🥪' },
  { id: 'devolucion', label: 'Devolución', icon: '↩' },
  { id: 'sobreventas', label: 'Sobreventas', icon: '↕' },
  { id: 'stock', label: 'Stock', icon: '▦' },
];

function BottomNav({ screen, setScreen }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, height: NAV_H,
      background: C.nav, borderTop: `1px solid ${C.border}`,
      display: 'flex', zIndex: 150,
      boxShadow: '0 -2px 16px rgba(0,0,0,.06)',
    }}>
      {NAV_ITEMS.map(item => (
        <button key={item.id} onClick={() => setScreen(item.id)} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 2, border: 'none', cursor: 'pointer',
          background: 'transparent', fontFamily: 'inherit',
          color: screen === item.id ? C.accent : C.muted,
          transition: 'color .15s',
        }}>
          <span style={{ fontSize: 20, lineHeight: 1 }}>{item.icon}</span>
          <span style={{ fontSize: 10, fontWeight: screen === item.id ? 700 : 500, letterSpacing: '.02em' }}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

// ── Screen Header ──────────────────────────────────────────────────────────
const SCREEN_TITLES = {
  home: null,
  comida: 'Planilla de Comida',
  devolucion: 'Devolución de Mercadería',
  sobreventas: 'Sobreventas',
  stock: 'Stock Lista',
};

function Header({ screen, setScreen, sucursal, fecha }) {
  const title = SCREEN_TITLES[screen];
  if (!title) return null;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '14px 16px', borderBottom: `1px solid ${C.border}`,
      background: C.surface, position: 'sticky', top: 0, zIndex: 20,
    }}>
      <button onClick={() => setScreen('home')} style={{
        background: 'none', border: 'none', fontSize: 22, cursor: 'pointer',
        color: C.muted, padding: '0 4px', lineHeight: 1,
      }}>‹</button>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>{title}</div>
        <div style={{ fontSize: 12, color: C.muted }}>{sucursal} · {fmtDate(fecha)}</div>
      </div>
    </div>
  );
}

// ── Records helpers ────────────────────────────────────────────────────────
function getRecords() {
  try { return JSON.parse(localStorage.getItem('lv_registros')) || []; }
  catch { return []; }
}
function addRecord(record) {
  const records = getRecords();
  localStorage.setItem('lv_registros', JSON.stringify([record, ...records]));
}
function getLastRecord(tipo, sucursal, fecha) {
  return getRecords().find(r => r.tipo === tipo && r.sucursal === sucursal && r.fecha === fecha) || null;
}

// ── Save Button ────────────────────────────────────────────────────────────
function SaveButton({ tipo, data }) {
  const { sucursal, fecha, currentUser } = useCtx();
  const [saved, setSaved] = useState(false);
  const [last, setLast] = useState(() => getLastRecord(tipo, sucursal, fecha));

  useEffect(() => { setLast(getLastRecord(tipo, sucursal, fecha)); setSaved(false); }, [tipo, sucursal, fecha]);

  function handleSave() {
    const record = {
      id: uid(), tipo, sucursal, fecha,
      guardadoPor: currentUser ? currentUser.nombre : 'Desconocido',
      guardadoEn: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(data)),
    };
    addRecord(record);
    setLast(record);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const fmtTime = iso => {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };

  return (
    <div style={{
      position: 'fixed', bottom: NAV_H, left: 0, right: 0,
      background: C.surface, borderTop: `1px solid ${C.border}`,
      padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12,
      maxWidth: 680, margin: '0 auto', zIndex: 90,
      boxShadow: '0 -2px 12px rgba(0,0,0,.05)',
    }}>
      {last && (
        <div style={{ flex: 1, fontSize: 12, color: C.muted }}>
          Último guardado: <strong style={{ color: C.ok }}>{fmtTime(last.guardadoEn)}</strong> por {last.guardadoPor}
        </div>
      )}
      {!last && <div style={{ flex: 1 }} />}
      <button onClick={handleSave} style={{
        padding: '11px 24px', borderRadius: 12, border: 'none', cursor: 'pointer',
        background: saved ? C.ok : C.accent, color: '#fff',
        fontWeight: 700, fontSize: 14, fontFamily: 'inherit',
        transition: 'background .3s', flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 7,
      }}>
        {saved ? '✓ Guardado' : 'Guardar planilla'}
      </button>
    </div>
  );
}

// ── History screen ─────────────────────────────────────────────────────────
const TIPO_LABEL = { comida: 'Planilla de Comida', devolucion: 'Devolución', sobreventas: 'Sobreventas', stock: 'Stock Lista' };
const TIPO_ICON  = { comida: '🥪', devolucion: '📦', sobreventas: '📊', stock: '▦' };

function HistorialScreen({ onBack }) {
  const { sucursal, currentUser } = useCtx();
  const [filtroSucursal, setFiltroSucursal] = useState(currentUser?.rol === 'admin' ? 'Todas' : sucursal);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [expanded, setExpanded] = useState(null);

  const allRecords = getRecords();

  const filtered = allRecords.filter(r => {
    if (filtroSucursal !== 'Todas' && r.sucursal !== filtroSucursal) return false;
    if (filtroTipo !== 'todos' && r.tipo !== filtroTipo) return false;
    return true;
  });

  const fmtDT = iso => {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };

  return (
    <div style={{ minHeight: '100dvh', background: C.bg, fontFamily: "'DM Sans', system-ui, sans-serif", color: C.text }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: C.surface, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 20 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: C.muted, lineHeight: 1, padding: 0 }}>‹</button>
        <span style={{ fontSize: 16, fontWeight: 800 }}>Historial de registros</span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: C.muted }}>{filtered.length} registros</span>
      </div>

      {/* Filters */}
      <div style={{ padding: '12px 14px', background: C.surface, borderBottom: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {currentUser?.rol === 'admin' && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['Todas', ...SUCURSALES].map(s => (
              <button key={s} onClick={() => setFiltroSucursal(s)} style={{
                padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
                background: filtroSucursal === s ? C.accent : C.faint,
                color: filtroSucursal === s ? '#fff' : C.muted,
                fontWeight: filtroSucursal === s ? 700 : 500, fontSize: 12, fontFamily: 'inherit',
              }}>{s}</button>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[['todos','Todos'], ['comida','Comida'], ['devolucion','Devolución'], ['sobreventas','Sobreventas'], ['stock','Stock']].map(([id, label]) => (
            <button key={id} onClick={() => setFiltroTipo(id)} style={{
              padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
              background: filtroTipo === id ? C.accentL : C.faint,
              color: filtroTipo === id ? C.accentD : C.muted,
              fontWeight: filtroTipo === id ? 700 : 500, fontSize: 12, fontFamily: 'inherit',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Records list */}
      <div style={{ paddingBottom: 32 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: C.muted }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🗂️</div>
            <div style={{ fontSize: 15 }}>Sin registros guardados</div>
          </div>
        )}
        {filtered.map(r => (
          <div key={r.id}>
            <div onClick={() => setExpanded(expanded === r.id ? null : r.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
              borderBottom: `1px solid ${C.border}`, background: C.surface, cursor: 'pointer',
            }}>
              <div style={{ fontSize: 22, width: 36, textAlign: 'center' }}>{TIPO_ICON[r.tipo]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{TIPO_LABEL[r.tipo]}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                  {fmtDate(r.fecha)} · {r.sucursal}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.ok }}>{fmtDT(r.guardadoEn).split(' ')[1]}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{r.guardadoPor}</div>
              </div>
              <span style={{ fontSize: 14, color: C.muted, marginLeft: 4 }}>{expanded === r.id ? '▲' : '▼'}</span>
            </div>
            {expanded === r.id && (
              <div style={{ padding: '14px 16px', background: C.faint, borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Detalle del registro</div>
                <RecordDetail tipo={r.tipo} data={r.data} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RecordDetail({ tipo, data }) {
  if (tipo === 'comida') {
    const filled = COMIDA_PRODUCTOS.filter(p => data[p.id] && (data[p.id].entrada > 0 || data[p.id].salida > 0));
    if (!filled.length) return <div style={{ fontSize: 13, color: C.muted }}>Sin movimientos registrados</div>;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {filled.map(p => (
          <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: C.text }}>{p.nombre}</span>
            <span style={{ color: C.muted }}>
              <span style={{ color: C.ok }}>+{data[p.id].entrada}</span>
              {' / '}
              <span style={{ color: C.danger }}>-{data[p.id].salida}</span>
            </span>
          </div>
        ))}
      </div>
    );
  }
  if (tipo === 'devolucion') {
    if (!data.length) return <div style={{ fontSize: 13, color: C.muted }}>Sin devoluciones</div>;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.map((r, i) => (
          <div key={i} style={{ fontSize: 13, color: C.text }}>
            <strong>{r.producto}</strong> — {r.peso}g · {r.motivo} {r.fechaElab && `· Elab: ${fmtDate(r.fechaElab)}`}
          </div>
        ))}
      </div>
    );
  }
  if (tipo === 'sobreventas') {
    if (!data.length) return <div style={{ fontSize: 13, color: C.muted }}>Sin sobreventas</div>;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.map((r, i) => (
          <div key={i} style={{ fontSize: 13, display: 'flex', justifyContent: 'space-between' }}>
            <span><Tag color={r.tipo === 'alta' ? C.ok : C.danger} bg={r.tipo === 'alta' ? C.okL : C.dangerL}>{r.tipo}</Tag> {r.concepto}</span>
            <span style={{ color: C.muted }}>{r.cantidad && `${r.cantidad} ud.`} {r.precio && `$${r.precio}`}</span>
          </div>
        ))}
      </div>
    );
  }
  if (tipo === 'stock') {
    const keys = Object.keys(data).filter(k => data[k].cantidad || data[k].peso);
    if (!keys.length) return <div style={{ fontSize: 13, color: C.muted }}>Sin stock registrado</div>;
    return (
      <div style={{ fontSize: 13, color: C.muted }}>
        {keys.length} producto{keys.length !== 1 ? 's' : ''} con datos registrados
      </div>
    );
  }
  return null;
}

// ── Users helpers ──────────────────────────────────────────────────────────
const DEFAULT_USERS = [
  { id: 'u1', nombre: 'Administrador', usuario: 'admin', password: 'admin123', rol: 'admin', sucursal: null },
];

function getUsers() {
  try { return JSON.parse(localStorage.getItem('lv_users')) || DEFAULT_USERS; }
  catch { return DEFAULT_USERS; }
}
function saveUsers(users) { localStorage.setItem('lv_users', JSON.stringify(users)); }

// ── Login screen ───────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleLogin() {
    const users = getUsers();
    const user = users.find(u => u.usuario === usuario.trim() && u.password === password);
    if (user) { setError(''); onLogin(user); }
    else setError('Usuario o contraseña incorrectos');
  }

  return (
    <div style={{
      minHeight: '100dvh', background: C.bg, display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{ marginBottom: 36, textAlign: 'center' }}>
        <div style={{ fontSize: 32, fontWeight: 900, color: C.accent, letterSpacing: '-.02em', marginBottom: 4 }}>La Vienesa</div>
        <div style={{ fontSize: 14, color: C.muted }}>Sistema de planillas</div>
      </div>
      <div style={{ background: C.surface, borderRadius: 18, padding: '28px 24px', width: '100%', maxWidth: 360, boxShadow: '0 4px 32px rgba(0,0,0,.07)' }}>
        <Field label="Usuario">
          <input style={inp} value={usuario} onChange={e => setUsuario(e.target.value)}
            placeholder="tu usuario" autoCapitalize="none" autoComplete="username"
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </Field>
        <Field label="Contraseña">
          <input type="password" style={inp} value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" autoComplete="current-password"
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </Field>
        {error && <div style={{ fontSize: 13, color: C.danger, marginBottom: 10, textAlign: 'center' }}>{error}</div>}
        <PrimaryBtn onClick={handleLogin} disabled={!usuario || !password}>Ingresar</PrimaryBtn>
      </div>
    </div>
  );
}

// ── Users management screen ────────────────────────────────────────────────
function UsersScreen({ onBack }) {
  const [users, setUsers] = useState(getUsers());
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nombre: '', usuario: '', password: '', rol: 'empleado', sucursal: SUCURSALES[0] });
  const [editId, setEditId] = useState(null);
  const [delConfirm, setDelConfirm] = useState(null);

  function persist(u) { setUsers(u); saveUsers(u); }

  function save() {
    if (!form.nombre || !form.usuario || (!editId && !form.password)) return;
    if (editId) {
      persist(users.map(u => u.id === editId ? { ...u, ...form, password: form.password || u.password } : u));
    } else {
      persist([...users, { ...form, id: uid() }]);
    }
    setForm({ nombre: '', usuario: '', password: '', rol: 'empleado', sucursal: SUCURSALES[0] });
    setEditId(null); setOpen(false);
  }

  function startEdit(u) {
    setForm({ nombre: u.nombre, usuario: u.usuario, password: '', rol: u.rol, sucursal: u.sucursal || SUCURSALES[0] });
    setEditId(u.id); setOpen(true);
  }

  function del(id) { persist(users.filter(u => u.id !== id)); setDelConfirm(null); }

  const rolColor = r => r === 'admin' ? { color: C.accentD, bg: C.accentL } : { color: C.ok, bg: C.okL };

  return (
    <div style={{ minHeight: '100dvh', background: C.bg, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: C.muted, lineHeight: 1, padding: 0 }}>‹</button>
        <span style={{ fontSize: 16, fontWeight: 800, color: C.text }}>Gestión de usuarios</span>
      </div>

      <div style={{ padding: '16px', paddingBottom: 80 }}>
        {users.map(u => (
          <div key={u.id} style={{ background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: '14px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 21, background: C.faint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: C.accent, flexShrink: 0 }}>
              {u.nombre.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{u.nombre}</div>
              <div style={{ fontSize: 12, color: C.muted }}>@{u.usuario}{u.sucursal && u.rol === 'empleado' ? ` · ${u.sucursal}` : ''}</div>
            </div>
            <Tag color={rolColor(u.rol).color} bg={rolColor(u.rol).bg}>{u.rol}</Tag>
            <button onClick={() => startEdit(u)} style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: C.muted, padding: 4 }}>✎</button>
            <button onClick={() => setDelConfirm(u.id)} style={{ background: 'none', border: 'none', fontSize: 17, cursor: 'pointer', color: C.danger, padding: 4 }}>✕</button>
          </div>
        ))}
      </div>

      <FAB onClick={() => { setForm({ nombre: '', usuario: '', password: '', rol: 'empleado', sucursal: SUCURSALES[0] }); setEditId(null); setOpen(true); }} />

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? 'Editar usuario' : 'Nuevo usuario'}>
        <Field label="Nombre completo">
          <input style={inp} value={form.nombre} onChange={e => setForm(f => ({...f, nombre: e.target.value}))} placeholder="Ej: María García" />
        </Field>
        <div style={{ display: 'flex', gap: '4%' }}>
          <Field label="Usuario" half>
            <input style={inp} value={form.usuario} onChange={e => setForm(f => ({...f, usuario: e.target.value.toLowerCase().replace(/\s/g,'')}))} placeholder="maria.garcia" autoCapitalize="none" />
          </Field>
          <Field label={editId ? 'Nueva contraseña' : 'Contraseña'} half>
            <input type="password" style={inp} value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} placeholder={editId ? 'Sin cambios' : '••••••••'} />
          </Field>
        </div>
        <Field label="Rol">
          <div style={{ display: 'flex', gap: 8 }}>
            {['admin','empleado'].map(r => (
              <button key={r} onClick={() => setForm(f => ({...f, rol: r}))} style={{
                flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer',
                border: `1.5px solid ${form.rol === r ? C.accent : C.border}`,
                background: form.rol === r ? C.accentL : C.surface,
                color: form.rol === r ? C.accentD : C.text,
                fontWeight: 700, fontSize: 14, fontFamily: 'inherit', textTransform: 'capitalize',
              }}>{r}</button>
            ))}
          </div>
        </Field>
        {form.rol === 'empleado' && (
          <Field label="Sucursal asignada">
            <select style={inp} value={form.sucursal} onChange={e => setForm(f => ({...f, sucursal: e.target.value}))}>
              {SUCURSALES.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
        )}
        <PrimaryBtn onClick={save} disabled={!form.nombre || !form.usuario || (!editId && !form.password)}>Guardar</PrimaryBtn>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!delConfirm} onClose={() => setDelConfirm(null)} title="Eliminar usuario">
        <p style={{ color: C.text, fontSize: 15, marginBottom: 16 }}>¿Estás seguro que querés eliminar este usuario?</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setDelConfirm(null)} style={{ flex: 1, padding: 12, borderRadius: 12, border: `1.5px solid ${C.border}`, background: C.surface, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, color: C.muted }}>Cancelar</button>
          <button onClick={() => del(delConfirm)} style={{ flex: 1, padding: 12, borderRadius: 12, border: 'none', background: C.danger, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}>Eliminar</button>
        </div>
      </Modal>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────
function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('lv_session')) || null; }
    catch { return null; }
  });
  const [showUsers, setShowUsers] = useState(false);
  const [showHistorial, setShowHistorial] = useState(false);
  const [screen, setScreen] = useState('home');
  const [sucursal, setSucursal] = useState(SUCURSALES[0]);
  const [fecha, setFecha] = useState(todayStr());
  const [data, setData] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storKey(SUCURSALES[0], todayStr()))) || defaultData(); }
    catch { return defaultData(); }
  });

  function handleLogin(user) {
    sessionStorage.setItem('lv_session', JSON.stringify(user));
    setCurrentUser(user);
    if (user.rol === 'empleado' && user.sucursal) setSucursal(user.sucursal);
  }

  function handleLogout() {
    sessionStorage.removeItem('lv_session');
    setCurrentUser(null);
    setScreen('home');
  }



  // Load data when sucursal or fecha changes
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storKey(sucursal, fecha)));
      setData(saved || defaultData());
    } catch { setData(defaultData()); }
  }, [sucursal, fecha]);

  // Persist data
  useEffect(() => {
    localStorage.setItem(storKey(sucursal, fecha), JSON.stringify(data));
  }, [data, sucursal, fecha]);

  function setDataKey(key, val) {
    setData(d => ({ ...d, [key]: val }));
  }

  const ctx = { sucursal, setSucursal, fecha, setFecha, data, setDataKey, currentUser, setShowUsers, setShowHistorial };

  if (!currentUser) return <LoginScreen onLogin={handleLogin} />;
  if (showUsers) return <Ctx.Provider value={ctx}><UsersScreen onBack={() => setShowUsers(false)} /></Ctx.Provider>;
  if (showHistorial) return <Ctx.Provider value={ctx}><HistorialScreen onBack={() => setShowHistorial(false)} /></Ctx.Provider>;

  return (
    <Ctx.Provider value={ctx}>
      <div style={{
        minHeight: '100dvh', background: C.bg,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        color: C.text, maxWidth: 680, margin: '0 auto',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 18px 10px',
          background: C.surface, borderBottom: screen === 'home' ? `1px solid ${C.border}` : 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: C.accent, letterSpacing: '-.02em' }}>La Vienesa</span>
            <span style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>Planillas</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {screen !== 'home' && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{sucursal}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{fmtDate(fecha)}</div>
              </div>
            )}
            <button onClick={handleLogout} title="Cerrar sesión" style={{
              background: C.faint, border: 'none', borderRadius: 20, padding: '5px 11px',
              fontSize: 11, fontWeight: 700, color: C.muted, cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <span style={{ fontSize: 14 }}>👤</span>
              <span>{currentUser.nombre.split(' ')[0]}</span>
            </button>
          </div>
        </div>

        {screen !== 'home' && (
          <div style={{ padding: '10px 16px 6px', background: C.bg, display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setScreen('home')} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: C.muted, lineHeight: 1, padding: 0 }}>‹</button>
            <span style={{ fontSize: 16, fontWeight: 800, color: C.text }}>{SCREEN_TITLES[screen]}</span>
          </div>
        )}

        <div style={{ overflowY: 'auto' }}>
          {screen === 'home' && <HomeScreen setScreen={setScreen} />}
          {screen === 'comida' && <ComidaScreen />}
          {screen === 'devolucion' && <DevolucionScreen />}
          {screen === 'sobreventas' && <SobreventasScreen />}
          {screen === 'stock' && <StockScreen />}
        </div>

        <BottomNav screen={screen} setScreen={setScreen} />
      </div>
    </Ctx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
