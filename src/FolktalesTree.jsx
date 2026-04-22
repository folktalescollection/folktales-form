import { useState, useEffect, useRef, useCallback } from "react";

const ep = () => ({ name: "", dates: "", birthplace: "" });
const emptyMarriage = () => ({ date: "", location: "", dedication: "" });
const emptyCustomer = () => ({ email: "", orderNumber: "", mailingList: false });
const has = (p) => !!(p.name || p.dates || p.birthplace);
const done = (p) => !!p.name;
const doneMar = (m) => !!(m.date);

const INIT = {
  customer: emptyCustomer(),
  spouse1: ep(), spouse2: ep(),
  s1_father: ep(), s1_mother: ep(),
  s2_father: ep(), s2_mother: ep(),
  s1_gf_father: ep(), s1_gf_mother: ep(),
  s1_gm_father: ep(), s1_gm_mother: ep(),
  s2_gf_father: ep(), s2_gf_mother: ep(),
  s2_gm_father: ep(), s2_gm_mother: ep(),
  marriage: emptyMarriage(),
  childEditionChild: ep(),
  coupleChildren: [ep()],
};

const COUPLE_IDS = ["spouse1", "spouse2"];
const PARENT_IDS = ["s1_father", "s1_mother", "s2_father", "s2_mother"];
const GP_IDS = ["s1_gf_father", "s1_gf_mother", "s1_gm_father", "s1_gm_mother", "s2_gf_father", "s2_gf_mother", "s2_gm_father", "s2_gm_mother"];

function Field({ label, value, onChange, placeholder, type = "text", autoFocus = false }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "#9a8468", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 4 }}>{label}</label>
      <input autoFocus={autoFocus} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", padding: "8px 11px", fontSize: 13.5, fontFamily: "'DM Sans',sans-serif", color: "#3d2e1e", border: "1px solid #e0d5c4", borderRadius: 8, background: "#faf7f2", outline: "none", boxSizing: "border-box" }}
        onFocus={e => e.target.style.borderColor = "#b8a080"} onBlur={e => e.target.style.borderColor = "#e0d5c4"} />
    </div>
  );
}

function PersonPopup({ person, label, onSave, anchorRect, containerRect }) {
  const [draft, setDraft] = useState({ ...person });
  const popRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  useEffect(() => {
    if (!anchorRect || !containerRect || !popRef.current) return;
    const popW = 300, popH = popRef.current.offsetHeight || 220;
    let left = anchorRect.left + anchorRect.width / 2 - containerRect.left - popW / 2;
    let top = anchorRect.bottom - containerRect.top + 12;
    if (left < 8) left = 8;
    if (left + popW > containerRect.width - 8) left = containerRect.width - popW - 8;
    if (top + popH > containerRect.height - 8) top = anchorRect.top - containerRect.top - popH - 12;
    setPos({ top, left });
  }, [anchorRect, containerRect]);
  useEffect(() => {
    const h = (e) => { if (popRef.current && !popRef.current.contains(e.target)) onSave(draft); };
    const t = setTimeout(() => document.addEventListener("mousedown", h), 50);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", h); };
  }, [draft, onSave]);
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onSave(draft); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [draft, onSave]);
  return (
    <div ref={popRef} style={{ position: "absolute", top: pos.top, left: pos.left, width: 300, zIndex: 100, background: "#fffdf9", border: "1px solid #d4c4ac", borderRadius: 14, boxShadow: "0 12px 48px rgba(80,60,30,.18), 0 2px 8px rgba(80,60,30,.08)", padding: "20px 18px 16px", fontFamily: "'DM Sans',sans-serif", animation: "popIn .2s ease-out" }}>
      <style>{`@keyframes popIn{from{opacity:0;transform:translateY(-6px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: "#5a3e28" }}>{label}</span>
        <button onClick={() => onSave(draft)} style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid #e0d5c4", background: "#f8f4ee", cursor: "pointer", fontSize: 14, color: "#9a8468", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
      </div>
      <Field label="Full name" value={draft.name} onChange={v => setDraft(p => ({ ...p, name: v }))} placeholder="e.g. Eleanor Mae Johnson" autoFocus />
      <Field label="Dates" value={draft.dates} onChange={v => setDraft(p => ({ ...p, dates: v }))} placeholder="e.g. 1920–1985 or Jul 12, 1948" />
      <div style={{ marginBottom: 0 }}>
        <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "#9a8468", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 4 }}>Birthplace</label>
        <input type="text" value={draft.birthplace} onChange={e => setDraft(p => ({ ...p, birthplace: e.target.value }))} placeholder="e.g. Atlanta, Georgia"
          style={{ width: "100%", padding: "8px 11px", fontSize: 13.5, fontFamily: "'DM Sans',sans-serif", color: "#3d2e1e", border: "1px solid #e0d5c4", borderRadius: 8, background: "#faf7f2", outline: "none", boxSizing: "border-box" }}
          onFocus={e => e.target.style.borderColor = "#b8a080"} onBlur={e => e.target.style.borderColor = "#e0d5c4"} />
      </div>
      <button onClick={() => onSave(draft)} style={{ width: "100%", marginTop: 14, padding: "9px 0", background: "#6b4c3b", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", cursor: "pointer" }}
        onMouseEnter={e => e.currentTarget.style.background = "#56392a"} onMouseLeave={e => e.currentTarget.style.background = "#6b4c3b"}>Done</button>
    </div>
  );
}

function MarriagePopup({ marriage, onSave, anchorRect, containerRect }) {
  const [draft, setDraft] = useState({ ...marriage });
  const popRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  useEffect(() => {
    if (!anchorRect || !containerRect || !popRef.current) return;
    const popW = 320, popH = popRef.current.offsetHeight || 280;
    let left = anchorRect.left + anchorRect.width / 2 - containerRect.left - popW / 2;
    let top = anchorRect.bottom - containerRect.top + 12;
    if (left < 8) left = 8;
    if (left + popW > containerRect.width - 8) left = containerRect.width - popW - 8;
    if (top + popH > containerRect.height - 8) top = anchorRect.top - containerRect.top - popH - 12;
    setPos({ top, left });
  }, [anchorRect, containerRect]);
  useEffect(() => {
    const h = (e) => { if (popRef.current && !popRef.current.contains(e.target)) onSave(draft); };
    const t = setTimeout(() => document.addEventListener("mousedown", h), 50);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", h); };
  }, [draft, onSave]);
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onSave(draft); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [draft, onSave]);
  return (
    <div ref={popRef} style={{ position: "absolute", top: pos.top, left: pos.left, width: 320, zIndex: 100, background: "#fffdf9", border: "1px solid #d4c4ac", borderRadius: 14, boxShadow: "0 12px 48px rgba(80,60,30,.18), 0 2px 8px rgba(80,60,30,.08)", padding: "20px 18px 16px", fontFamily: "'DM Sans',sans-serif", animation: "popIn .2s ease-out" }}>
      <style>{`@keyframes popIn{from{opacity:0;transform:translateY(-6px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: "#5a3e28" }}>Marriage details</span>
        <button onClick={() => onSave(draft)} style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid #e0d5c4", background: "#f8f4ee", cursor: "pointer", fontSize: 14, color: "#9a8468", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
      </div>
      <Field label="Marriage date" value={draft.date} onChange={v => setDraft(p => ({ ...p, date: v }))} placeholder="e.g. June 14, 2024" autoFocus />
      <Field label="Wedding location" value={draft.location} onChange={v => setDraft(p => ({ ...p, location: v }))} placeholder="e.g. Savannah, Georgia" />
      <div style={{ marginBottom: 0 }}>
        <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: "#9a8468", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 4 }}>Dedication or message</label>
        <textarea value={draft.dedication} onChange={e => setDraft(p => ({ ...p, dedication: e.target.value }))}
          placeholder={"e.g. Two families, one love.\nOr a short poem, quote, Bible verse\u2026"} rows={3}
          style={{ width: "100%", padding: "8px 11px", fontSize: 13, fontFamily: "'DM Sans',sans-serif", color: "#3d2e1e", border: "1px solid #e0d5c4", borderRadius: 8, background: "#faf7f2", outline: "none", boxSizing: "border-box", resize: "vertical", lineHeight: 1.5 }}
          onFocus={e => e.target.style.borderColor = "#b8a080"} onBlur={e => e.target.style.borderColor = "#e0d5c4"} />
      </div>
      <button onClick={() => onSave(draft)} style={{ width: "100%", marginTop: 14, padding: "9px 0", background: "#6b4c3b", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", cursor: "pointer" }}
        onMouseEnter={e => e.currentTarget.style.background = "#56392a"} onMouseLeave={e => e.currentTarget.style.background = "#6b4c3b"}>Done</button>
    </div>
  );
}

function TreeNode({ id, label, person, onClick, x, y, w = 98, h = 52 }) {
  const completed = done(person);
  const nodeRef = useRef(null);
  return (
    <g ref={nodeRef} className="tree-node-hover" onClick={() => { onClick(id, nodeRef.current?.getBoundingClientRect()); }}>
      <rect x={x - w / 2 + 2} y={y + 2} width={w} height={h} rx={10} fill="#00000008" />
      <rect x={x - w / 2} y={y} width={w} height={h} rx={10}
        fill={completed ? "#f9f6f0" : "#fff"} stroke={completed ? "#b8a47c" : "#ddd5c6"} strokeWidth={completed ? 1.5 : 1} />
      {completed && (
        <g>
          <circle cx={x + w / 2 - 8} cy={y + 8} r={9} fill="#6b4c3b" />
          <path d={`M${x + w / 2 - 12} ${y + 8} l3 3 5-5`} fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      <text x={x} y={completed ? y + h / 2 - 7 : y + h / 2 - 4} textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="600" fill="#5a3e28" fontFamily="'Playfair Display',serif">{label}</text>
      {completed ? (
        <text x={x} y={y + h / 2 + 8} textAnchor="middle" dominantBaseline="central" fontSize={9.5} fill="#9a8468" fontFamily="'DM Sans',sans-serif">
          {person.name.length > 16 ? person.name.slice(0, 15) + "\u2026" : person.name}
        </text>
      ) : (
        <text x={x} y={y + h / 2 + 8} textAnchor="middle" dominantBaseline="central" fontSize={9} fill="#c0b49e" fontFamily="'DM Sans',sans-serif" fontStyle="italic">click to add</text>
      )}
    </g>
  );
}

function MarriageNode({ marriage, onClick, x, y }) {
  const completed = doneMar(marriage);
  const nodeRef = useRef(null);
  const w = 170, h = 60, rx = 30;
  const preview = completed ? marriage.date + (marriage.location ? ` \u00b7 ${marriage.location}` : "") : null;
  const trimmed = preview && preview.length > 26 ? preview.slice(0, 25) + "\u2026" : preview;
  return (
    <g ref={nodeRef} className="tree-node-hover" onClick={() => { onClick("marriage", nodeRef.current?.getBoundingClientRect()); }}>
      <ellipse cx={x} cy={y + h / 2} rx={w / 2 + 6} ry={h / 2 + 6} fill="#c4a88220" />
      <rect x={x - w / 2 + 2} y={y + 2} width={w} height={h} rx={rx} fill="#00000006" />
      <rect x={x - w / 2} y={y} width={w} height={h} rx={rx} fill={completed ? "#fdf8ee" : "#fff"} stroke={completed ? "#c4a87c" : "#ddd5c6"} strokeWidth={completed ? 1.5 : 1} />
      <circle cx={x - w / 2 + 24} cy={y + h / 2} r={10} fill="none" stroke={completed ? "#c4a87c" : "#ddd5c6"} strokeWidth="1" />
      <circle cx={x - w / 2 + 24} cy={y + h / 2} r={6} fill="none" stroke={completed ? "#c4a87c" : "#ddd5c6"} strokeWidth="0.7" />
      {completed && (<g><circle cx={x + w / 2 - 10} cy={y + 10} r={9} fill="#6b4c3b" /><path d={`M${x + w / 2 - 14} ${y + 10} l3 3 5-5`} fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></g>)}
      <text x={x + 6} y={completed ? y + h / 2 - 7 : y + h / 2 - 3} textAnchor="middle" dominantBaseline="central" fontSize={11.5} fontWeight="600" fill="#5a3e28" fontFamily="'Playfair Display',serif">Marriage</text>
      {completed ? (
        <text x={x + 6} y={y + h / 2 + 8} textAnchor="middle" dominantBaseline="central" fontSize={8.5} fill="#9a8468" fontFamily="'DM Sans',sans-serif">{trimmed}</text>
      ) : (
        <text x={x + 6} y={y + h / 2 + 9} textAnchor="middle" dominantBaseline="central" fontSize={8.5} fill="#c0b49e" fontFamily="'DM Sans',sans-serif" fontStyle="italic">click to add details</text>
      )}
    </g>
  );
}

function HBranch({ parentX, parentY, childXs, childY }) {
  const midY = parentY + (childY - parentY) * 0.5;
  const paths = [];
  paths.push(<line key="pv" x1={parentX} y1={parentY} x2={parentX} y2={midY} stroke="#d4c4ac" strokeWidth="1.2" />);
  if (childXs.length > 1) paths.push(<line key="hb" x1={Math.min(...childXs)} y1={midY} x2={Math.max(...childXs)} y2={midY} stroke="#d4c4ac" strokeWidth="1.2" />);
  childXs.forEach((cx, i) => paths.push(<line key={`cv${i}`} x1={cx} y1={midY} x2={cx} y2={childY} stroke="#d4c4ac" strokeWidth="1.2" />));
  return <>{paths}</>;
}

/* Draws branch from a bottom node UP to multiple top nodes, with horizontal bar extending to bottom node */
function BranchUp({ bottomX, bottomY, topXs, topY }) {
  const midY = topY + (bottomY - topY) * 0.5;
  const allXs = [...topXs, bottomX];
  const minX = Math.min(...allXs);
  const maxX = Math.max(...allXs);
  const paths = [];
  paths.push(<line key="bv" x1={bottomX} y1={bottomY} x2={bottomX} y2={midY} stroke="#d4c4ac" strokeWidth="1.2" />);
  paths.push(<line key="hb" x1={minX} y1={midY} x2={maxX} y2={midY} stroke="#d4c4ac" strokeWidth="1.2" />);
  topXs.forEach((tx, i) => paths.push(<line key={`tv${i}`} x1={tx} y1={topY} x2={tx} y2={midY} stroke="#d4c4ac" strokeWidth="1.2" />));
  return <>{paths}</>;
}

function Toggle({ options, value, onChange }) {
  return (
    <div style={{ display: "inline-flex", background: "#f0ebe2", borderRadius: 10, padding: 3 }}>
      {options.map(o => {
        const active = value === o.key;
        return (
          <button key={o.key} onClick={() => onChange(o.key)} style={{
            padding: "7px 16px", borderRadius: 8, border: "none",
            background: active ? "#fff" : "transparent",
            boxShadow: active ? "0 1px 4px rgba(80,60,30,.12)" : "none",
            color: active ? "#3d2e1e" : "#9a8468",
            fontSize: 12, fontWeight: active ? 600 : 400,
            fontFamily: "'DM Sans',sans-serif", cursor: "pointer",
            transition: "all .2s", display: "flex", alignItems: "center", gap: 5,
          }}>
            {o.icon && <span style={{ fontSize: 13 }}>{o.icon}</span>} {o.label}
          </button>
        );
      })}
    </div>
  );
}

export default function FolktalesTree() {
  const [data, setData] = useState(INIT);
  const [edition, setEdition] = useState("child");
  const [genCount, setGenCount] = useState(2);
  const [editing, setEditing] = useState(null);
  const [submitState, setSubmitState] = useState("idle");
  const containerRef = useRef(null);
  const isCouple = edition === "couple";
  const showGP = genCount === 3;

  useEffect(() => {
    const handler = (e) => { if (submitState === "success") return; e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [submitState]);

  const handleSubmit = async () => {
    setSubmitState("submitting");
    try {
      const payload = {
        Edition: isCouple ? "Couple / Family Edition" : "Child Edition",
        Generations: genCount,
        Email: data.customer.email,
        EtsyOrderNumber: data.customer.orderNumber,
        MailingListOptIn: data.customer.mailingList,
        Spouse1_Name: data.spouse1.name, Spouse1_Dates: data.spouse1.dates, Spouse1_Birthplace: data.spouse1.birthplace,
        Spouse2_Name: data.spouse2.name, Spouse2_Dates: data.spouse2.dates, Spouse2_Birthplace: data.spouse2.birthplace,
        Marriage_Date: data.marriage.date, Marriage_Location: data.marriage.location, Marriage_Dedication: data.marriage.dedication,
        S1_Parent1_Name: data.s1_father.name, S1_Parent1_Dates: data.s1_father.dates, S1_Parent1_Birthplace: data.s1_father.birthplace,
        S1_Parent2_Name: data.s1_mother.name, S1_Parent2_Dates: data.s1_mother.dates, S1_Parent2_Birthplace: data.s1_mother.birthplace,
        S2_Parent1_Name: data.s2_father.name, S2_Parent1_Dates: data.s2_father.dates, S2_Parent1_Birthplace: data.s2_father.birthplace,
        S2_Parent2_Name: data.s2_mother.name, S2_Parent2_Dates: data.s2_mother.dates, S2_Parent2_Birthplace: data.s2_mother.birthplace,
        S1_GP1_Name: data.s1_gf_father.name, S1_GP1_Dates: data.s1_gf_father.dates, S1_GP1_Birthplace: data.s1_gf_father.birthplace,
        S1_GP2_Name: data.s1_gf_mother.name, S1_GP2_Dates: data.s1_gf_mother.dates, S1_GP2_Birthplace: data.s1_gf_mother.birthplace,
        S1_GP3_Name: data.s1_gm_father.name, S1_GP3_Dates: data.s1_gm_father.dates, S1_GP3_Birthplace: data.s1_gm_father.birthplace,
        S1_GP4_Name: data.s1_gm_mother.name, S1_GP4_Dates: data.s1_gm_mother.dates, S1_GP4_Birthplace: data.s1_gm_mother.birthplace,
        S2_GP1_Name: data.s2_gf_father.name, S2_GP1_Dates: data.s2_gf_father.dates, S2_GP1_Birthplace: data.s2_gf_father.birthplace,
        S2_GP2_Name: data.s2_gf_mother.name, S2_GP2_Dates: data.s2_gf_mother.dates, S2_GP2_Birthplace: data.s2_gf_mother.birthplace,
        S2_GP3_Name: data.s2_gm_father.name, S2_GP3_Dates: data.s2_gm_father.dates, S2_GP3_Birthplace: data.s2_gm_father.birthplace,
        S2_GP4_Name: data.s2_gm_mother.name, S2_GP4_Dates: data.s2_gm_mother.dates, S2_GP4_Birthplace: data.s2_gm_mother.birthplace,
        Child1_Name: isCouple ? (data.coupleChildren[0]?.name || "") : data.childEditionChild.name,
        Child1_Dates: isCouple ? (data.coupleChildren[0]?.dates || "") : data.childEditionChild.dates,
        Child1_Birthplace: isCouple ? (data.coupleChildren[0]?.birthplace || "") : data.childEditionChild.birthplace,
        Child2_Name: data.coupleChildren[1]?.name || "", Child2_Dates: data.coupleChildren[1]?.dates || "", Child2_Birthplace: data.coupleChildren[1]?.birthplace || "",
        Child3_Name: data.coupleChildren[2]?.name || "", Child3_Dates: data.coupleChildren[2]?.dates || "", Child3_Birthplace: data.coupleChildren[2]?.birthplace || "",
        Child4_Name: data.coupleChildren[3]?.name || "", Child4_Dates: data.coupleChildren[3]?.dates || "", Child4_Birthplace: data.coupleChildren[3]?.birthplace || "",
        Child5_Name: data.coupleChildren[4]?.name || "", Child5_Dates: data.coupleChildren[4]?.dates || "", Child5_Birthplace: data.coupleChildren[4]?.birthplace || "",
      };
      const response = await fetch("https://folktales-form-proxy.twilight-violet-b3b0.workers.dev/", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Server responded ${response.status}`);
      setSubmitState("success");
    } catch (err) { console.error("Submit error:", err); setSubmitState("error"); }
  };

  const handleNodeClick = useCallback((id, rect) => { setEditing({ id, rect }); }, []);
  const handleSavePerson = useCallback((id, draft) => {
    setData(prev => {
      if (id === "childEditionChild") return { ...prev, childEditionChild: draft };
      if (id.startsWith("coupleChild_")) { const idx = parseInt(id.split("_")[1]); const ch = [...prev.coupleChildren]; ch[idx] = draft; return { ...prev, coupleChildren: ch }; }
      return { ...prev, [id]: draft };
    });
    setEditing(null);
  }, []);
  const handleSaveMarriage = useCallback((draft) => { setData(prev => ({ ...prev, marriage: draft })); setEditing(null); }, []);

  // Child edition: exactly 1 child, no add/remove. Couple edition: add/remove children
  const addChild = () => { if (isCouple && data.coupleChildren.length < 10) setData(p => ({ ...p, coupleChildren: [...p.coupleChildren, ep()] })); };
  const removeChild = () => { if (isCouple && data.coupleChildren.length > 0) setData(p => ({ ...p, coupleChildren: p.coupleChildren.slice(0, -1) })); };

  const getPerson = (id) => {
    if (id === "childEditionChild") return data.childEditionChild;
    if (id.startsWith("coupleChild_")) return data.coupleChildren[parseInt(id.split("_")[1])];
    return data[id];
  };
  const getLabel = (id) => {
    const map = { spouse1: "Spouse", spouse2: "Spouse", s1_father: "Parent", s1_mother: "Parent", s2_father: "Parent", s2_mother: "Parent", s1_gf_father: "Grandparent", s1_gf_mother: "Grandparent", s1_gm_father: "Grandparent", s1_gm_mother: "Grandparent", s2_gf_father: "Grandparent", s2_gf_mother: "Grandparent", s2_gm_father: "Grandparent", s2_gm_mother: "Grandparent" };
    if (id === "childEditionChild" || id.startsWith("coupleChild_")) return "Child";
    return map[id] || id;
  };

  const activeChildren = isCouple ? data.coupleChildren : [data.childEditionChild];
  const childCount = activeChildren.length;
  const activeIds = [...COUPLE_IDS, ...PARENT_IDS, ...(showGP ? GP_IDS : [])];
  const totalNodes = activeIds.length + childCount + (isCouple ? 1 : 0);
  const completedNodes = activeIds.filter(id => done(data[id])).length + activeChildren.filter(c => done(c)).length + (isCouple && doneMar(data.marriage) ? 1 : 0);

  // Layout
  const svgW = 1100;
  const nodeW = 98, nodeH = 52;
  const genGap = 90;
  const cx = svgW / 2;

  const gpY = 40;
  const pY = showGP ? gpY + genGap + nodeH : 40;
  const cplY = pY + genGap + nodeH;
  const marriageY = cplY + nodeH + 36;
  const chY = isCouple ? marriageY + 60 + 36 : cplY + genGap + nodeH;

  // Spouse positions — each at the midpoint of its parent pair
  const sp1X = 308, sp2X = 792;
  const cplNodeW = 120, cplNodeH = 56;

  // Parents
  const s1fX = 190, s1mX = 426, s2fX = 674, s2mX = 910;

  // Grandparents
  const s1gf_fX = 133, s1gf_mX = 247, s1gm_fX = 369, s1gm_mX = 483;
  const s2gf_fX = 617, s2gf_mX = 731, s2gm_fX = 853, s2gm_mX = 967;

  const chSpread = Math.min(120, (svgW - 140) / Math.max(childCount, 1));
  const chStartX = cx - ((childCount - 1) * chSpread) / 2;
  const svgH = (childCount > 0 ? chY + nodeH + 50 : (isCouple ? marriageY + 60 + 40 : cplY + cplNodeH + 50));

  // Couple center for vertical connectors (true center of SVG)
  const coupleCenterX = cx;

  if (submitState === "success") {
    return (
      <div className="parchment-page" style={{ minHeight: "100vh", background: "#f5efe3", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <style>{`
          .parchment-page::before {
            content: '';
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 0;
            background-image:
              url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='6' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23a)' opacity='0.10'/%3E%3C/svg%3E"),
              url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='900'%3E%3Cfilter id='b'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.008' numOctaves='2' seed='7'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='900' height='900' filter='url(%23b)' opacity='0.06'/%3E%3C/svg%3E"),
              radial-gradient(ellipse at 50% 50%, rgba(245,239,227,0.6) 20%, transparent 70%),
              radial-gradient(ellipse at 50% 0%, transparent 40%, rgba(140,105,60,0.13) 100%),
              radial-gradient(ellipse at 0% 50%, rgba(120,85,45,0.11) 0%, transparent 50%),
              radial-gradient(ellipse at 100% 50%, rgba(120,85,45,0.11) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 100%, rgba(100,70,30,0.15) 0%, transparent 45%),
              radial-gradient(ellipse at 0% 0%, rgba(90,60,20,0.10) 0%, transparent 40%),
              radial-gradient(ellipse at 100% 0%, rgba(90,60,20,0.08) 0%, transparent 40%),
              radial-gradient(ellipse at 0% 100%, rgba(80,55,20,0.12) 0%, transparent 35%),
              radial-gradient(ellipse at 100% 100%, rgba(80,55,20,0.12) 0%, transparent 35%);
          }
          .parchment-page > * { position: relative; z-index: 1; }
        `}</style>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <div style={{ textAlign: "center", padding: "60px 28px", maxWidth: 500 }}>
          <img src="/Logo-HighRes.png" alt="Folktales Collection" style={{ width: 88, height: 88, borderRadius: "50%", display: "block", margin: "0 auto 20px" }} />
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: "#3d2e1e", margin: "0 0 12px" }}>Thank you!</h1>
          <p style={{ fontSize: 15, color: "#6b5a48", lineHeight: 1.6, margin: "0 0 12px" }}>Your family tree information has been submitted successfully.</p>
          <p style={{ fontSize: 13, color: "#9a8468", lineHeight: 1.7, margin: 0 }}>We'll begin working on your custom artwork and will be in touch with your proof soon. If you placed your order on Etsy, we will be in touch via Etsy messages; if you ordered from our website, we'll be in touch over email.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="parchment-page" style={{ minHeight: "100vh", background: "#f5efe3", fontFamily: "'DM Sans',sans-serif", position: "relative" }}>
      <style>{`
        .parchment-page::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='6' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23a)' opacity='0.10'/%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='900'%3E%3Cfilter id='b'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.008' numOctaves='2' seed='7'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='900' height='900' filter='url(%23b)' opacity='0.06'/%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.04 0.01' numOctaves='2' seed='12'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='500' height='500' filter='url(%23c)' opacity='0.04'/%3E%3C/svg%3E"),
            radial-gradient(ellipse at 50% 50%, rgba(245,239,227,0.6) 20%, transparent 70%),
            radial-gradient(ellipse at 50% 0%, transparent 40%, rgba(140,105,60,0.13) 100%),
            radial-gradient(ellipse at 0% 50%, rgba(120,85,45,0.11) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 50%, rgba(120,85,45,0.11) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 100%, rgba(100,70,30,0.15) 0%, transparent 45%),
            radial-gradient(ellipse at 0% 0%, rgba(90,60,20,0.10) 0%, transparent 40%),
            radial-gradient(ellipse at 100% 0%, rgba(90,60,20,0.08) 0%, transparent 40%),
            radial-gradient(ellipse at 0% 100%, rgba(80,55,20,0.12) 0%, transparent 35%),
            radial-gradient(ellipse at 100% 100%, rgba(80,55,20,0.12) 0%, transparent 35%);
        }
        .parchment-page > * { position: relative; z-index: 1; }
        .tree-node-hover:hover {
          filter: drop-shadow(3px 4px 6px rgba(40,30,15,0.35));
          transition: filter 0.2s ease;
        }
        .tree-node-hover { transition: filter 0.2s ease; cursor: pointer; }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {submitState === "error" && (
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "12px 28px 0" }}>
          <div style={{ padding: "12px 16px", background: "#fef2f2", border: "1px solid #e8c4c4", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 13, color: "#8b3a3a", margin: 0 }}>Something went wrong. Please try again.</p>
            <button onClick={() => setSubmitState("idle")} style={{ background: "none", border: "none", fontSize: 18, color: "#8b3a3a", cursor: "pointer" }}>{"\u00d7"}</button>
          </div>
        </div>
      )}

      {/* Header with progress + submit */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "20px 28px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/Logo-HighRes.png" alt="Folktales Collection" style={{ width: 52, height: 52, borderRadius: "50%", display: "block" }} />
          <div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: "#3d2e1e", margin: 0 }}>Folktales Collection</h1>
            <p style={{ fontSize: 11, color: "#9a8468", margin: 0, fontStyle: "italic", fontFamily: "'Playfair Display',serif" }}>Artworks that tell your family story</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#5a3e28", fontFamily: "'Playfair Display',serif", lineHeight: 1 }}>{completedNodes}/{totalNodes}</div>
            <div style={{ fontSize: 9, color: "#9a8468", letterSpacing: "1px", textTransform: "uppercase", marginTop: 2 }}>completed</div>
          </div>
          <button onClick={handleSubmit} disabled={completedNodes < totalNodes || submitState === "submitting"}
            style={{ padding: "10px 22px", borderRadius: 8, border: "none", background: submitState === "submitting" ? "#c4b8a4" : completedNodes >= totalNodes ? "#b43d09" : "#c4b8a4", color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", cursor: completedNodes >= totalNodes && submitState !== "submitting" ? "pointer" : "not-allowed", transition: "background .3s" }}>
            {submitState === "submitting" ? "Submitting..." : "Submit order \u2192"}
          </button>
        </div>
      </div>

      {/* Customer fields — top, before steps */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "16px 28px 0" }}>
        <div style={{ padding: "14px 16px 10px", border: "1px solid #e0d5c4", borderRadius: 12, background: "rgba(255,253,249,0.85)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Field label="Email address" value={data.customer.email} onChange={v => setData(p => ({ ...p, customer: { ...p.customer, email: v } }))} placeholder="your@email.com" type="email" />
            <div>
              <Field label="Etsy order number (if applicable)" value={data.customer.orderNumber} onChange={v => setData(p => ({ ...p, customer: { ...p.customer, orderNumber: v } }))} placeholder="e.g. #1234567890" />
              <p style={{ fontSize: 10.5, color: "#b8a890", margin: "-6px 0 4px", fontStyle: "italic" }}>Find this in your Etsy order confirmation email</p>
            </div>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12.5, color: "#6b5a48", userSelect: "none" }}>
            <input type="checkbox" checked={data.customer.mailingList} onChange={e => setData(p => ({ ...p, customer: { ...p.customer, mailingList: e.target.checked } }))}
              style={{ width: 16, height: 16, accentColor: "#6b4c3b", cursor: "pointer" }} />
            Keep me updated on new collections, designs, and sales
          </label>
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "18px 28px 0" }}><div style={{ height: 1, background: "linear-gradient(90deg, transparent, #c4a882, transparent)" }} /></div>

      {/* Step 1 */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "16px 28px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#5a3e28", margin: 0, letterSpacing: "0.3px", fontFamily: "'Playfair Display',serif" }}>1. Select number of generations</p>
        <Toggle options={[{ key: 2, label: "2 generations" }, { key: 3, label: "3 generations" }]} value={genCount} onChange={setGenCount} />
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "14px 28px 0" }}><div style={{ height: 1, background: "linear-gradient(90deg, transparent, #d4c4ac, transparent)" }} /></div>

      {/* Step 2 */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "14px 28px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#5a3e28", margin: 0, letterSpacing: "0.3px", fontFamily: "'Playfair Display',serif" }}>2. Select edition</p>
        <Toggle options={[{ key: "child", label: "Child edition", icon: "\ud83c\udf33" }, { key: "couple", label: "Couple / family edition", icon: "\ud83d\udc8d" }]} value={edition} onChange={setEdition} />
        <p style={{ fontSize: 12, color: "#9a8468", margin: 0, textAlign: "center" }}>
          {isCouple ? "Couple / family edition \u2014 celebrate the union with marriage details at the heart of your tree" : "Child edition \u2014 the child's name anchors the tree trunk"}
        </p>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "14px 28px 0" }}><div style={{ height: 1, background: "linear-gradient(90deg, transparent, #d4c4ac, transparent)" }} /></div>

      {/* Step 3 */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "14px 28px 0", textAlign: "center" }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#5a3e28", margin: 0, letterSpacing: "0.3px", fontFamily: "'Playfair Display',serif" }}>3. Click any node to enter family member details</p>
      </div>

      {/* Tree */}
      <div ref={containerRef} style={{ maxWidth: 1120, margin: "12px auto 0", padding: "0 10px 20px", position: "relative" }}>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" style={{ display: "block" }}>
          {showGP && <text x={16} y={gpY + nodeH / 2} textAnchor="start" dominantBaseline="central" fontSize={9} fill="#bfb49e" fontFamily="'DM Sans',sans-serif" fontWeight="600" letterSpacing="1.5" transform={`rotate(-90 16 ${gpY + nodeH / 2})`}>GEN 3</text>}
          <text x={16} y={pY + nodeH / 2} textAnchor="start" dominantBaseline="central" fontSize={9} fill="#bfb49e" fontFamily="'DM Sans',sans-serif" fontWeight="600" letterSpacing="1.5" transform={`rotate(-90 16 ${pY + nodeH / 2})`}>GEN 2</text>
          <text x={16} y={cplY + cplNodeH / 2} textAnchor="start" dominantBaseline="central" fontSize={9} fill="#bfb49e" fontFamily="'DM Sans',sans-serif" fontWeight="600" letterSpacing="1.5" transform={`rotate(-90 16 ${cplY + cplNodeH / 2})`}>GEN 1</text>

          {/* GP → Parent branches */}
          {showGP && <>
            <HBranch parentX={s1fX} parentY={pY} childXs={[s1gf_fX, s1gf_mX]} childY={gpY + nodeH} />
            <HBranch parentX={s1mX} parentY={pY} childXs={[s1gm_fX, s1gm_mX]} childY={gpY + nodeH} />
            <HBranch parentX={s2fX} parentY={pY} childXs={[s2gf_fX, s2gf_mX]} childY={gpY + nodeH} />
            <HBranch parentX={s2mX} parentY={pY} childXs={[s2gm_fX, s2gm_mX]} childY={gpY + nodeH} />
          </>}

          {/* Parent → Spouse branches (using BranchUp: spouse at bottom, parents at top) */}
          <BranchUp bottomX={sp1X} bottomY={cplY} topXs={[s1fX, s1mX]} topY={pY + nodeH} />
          <BranchUp bottomX={sp2X} bottomY={cplY} topXs={[s2fX, s2mX]} topY={pY + nodeH} />

          {/* Couple connector */}
          <line x1={sp1X + cplNodeW / 2} y1={cplY + cplNodeH / 2} x2={sp2X - cplNodeW / 2} y2={cplY + cplNodeH / 2} stroke="#c4a882" strokeWidth="1.5" strokeDasharray="4 3" />
          <circle cx={cx} cy={cplY + cplNodeH / 2} r={4} fill="#f5f0e6" stroke="#c4a882" strokeWidth="1" />
          <text x={cx} y={cplY + cplNodeH / 2 + 0.5} textAnchor="middle" dominantBaseline="central" fontSize={7} fill="#c4a882">{"\u2665"}</text>

          {/* Couple → Marriage → Children */}
          {isCouple && <>
            <line x1={coupleCenterX} y1={cplY + cplNodeH} x2={coupleCenterX} y2={marriageY} stroke="#c4a882" strokeWidth="1.2" />
            {childCount > 0 && <line x1={coupleCenterX} y1={marriageY + 60} x2={coupleCenterX} y2={chY - 14} stroke="#d4c4ac" strokeWidth="1.2" />}
            {childCount > 0 && <HBranch parentX={coupleCenterX} parentY={chY - 14} childXs={activeChildren.map((_, i) => chStartX + i * chSpread)} childY={chY} />}
          </>}
          {!isCouple && <>
            <line x1={coupleCenterX} y1={cplY + cplNodeH} x2={coupleCenterX} y2={chY} stroke="#d4c4ac" strokeWidth="1.2" />
          </>}

          {/* Side labels */}
          <text x={(s1fX + s1mX) / 2} y={pY - 10} textAnchor="middle" fontSize={8.5} fill="#bfb49e" fontFamily="'DM Sans',sans-serif" fontWeight="600" letterSpacing="1.5">
            {data.spouse1.name ? data.spouse1.name.split(" ")[0].toUpperCase() + "'S SIDE" : "SPOUSE 1'S SIDE"}
          </text>
          <text x={(s2fX + s2mX) / 2} y={pY - 10} textAnchor="middle" fontSize={8.5} fill="#bfb49e" fontFamily="'DM Sans',sans-serif" fontWeight="600" letterSpacing="1.5">
            {data.spouse2.name ? data.spouse2.name.split(" ")[0].toUpperCase() + "'S SIDE" : "SPOUSE 2'S SIDE"}
          </text>
          <line x1={cx} y1={showGP ? gpY : pY} x2={cx} y2={pY + nodeH} stroke="#e8dfd0" strokeWidth="0.5" strokeDasharray="3 5" />

          {/* GP nodes */}
          {showGP && <>
            <TreeNode id="s1_gf_father" label="Grandparent" person={data.s1_gf_father} onClick={handleNodeClick} x={s1gf_fX} y={gpY} />
            <TreeNode id="s1_gf_mother" label="Grandparent" person={data.s1_gf_mother} onClick={handleNodeClick} x={s1gf_mX} y={gpY} />
            <TreeNode id="s1_gm_father" label="Grandparent" person={data.s1_gm_father} onClick={handleNodeClick} x={s1gm_fX} y={gpY} />
            <TreeNode id="s1_gm_mother" label="Grandparent" person={data.s1_gm_mother} onClick={handleNodeClick} x={s1gm_mX} y={gpY} />
            <TreeNode id="s2_gf_father" label="Grandparent" person={data.s2_gf_father} onClick={handleNodeClick} x={s2gf_fX} y={gpY} />
            <TreeNode id="s2_gf_mother" label="Grandparent" person={data.s2_gf_mother} onClick={handleNodeClick} x={s2gf_mX} y={gpY} />
            <TreeNode id="s2_gm_father" label="Grandparent" person={data.s2_gm_father} onClick={handleNodeClick} x={s2gm_fX} y={gpY} />
            <TreeNode id="s2_gm_mother" label="Grandparent" person={data.s2_gm_mother} onClick={handleNodeClick} x={s2gm_mX} y={gpY} />
          </>}

          {/* Parents */}
          <TreeNode id="s1_father" label="Parent" person={data.s1_father} onClick={handleNodeClick} x={s1fX} y={pY} />
          <TreeNode id="s1_mother" label="Parent" person={data.s1_mother} onClick={handleNodeClick} x={s1mX} y={pY} />
          <TreeNode id="s2_father" label="Parent" person={data.s2_father} onClick={handleNodeClick} x={s2fX} y={pY} />
          <TreeNode id="s2_mother" label="Parent" person={data.s2_mother} onClick={handleNodeClick} x={s2mX} y={pY} />

          {/* Couple */}
          <TreeNode id="spouse1" label="Spouse" person={data.spouse1} onClick={handleNodeClick} x={sp1X} y={cplY} w={cplNodeW} h={cplNodeH} />
          <TreeNode id="spouse2" label="Spouse" person={data.spouse2} onClick={handleNodeClick} x={sp2X} y={cplY} w={cplNodeW} h={cplNodeH} />

          {/* Marriage node */}
          {isCouple && <MarriageNode marriage={data.marriage} onClick={handleNodeClick} x={coupleCenterX} y={marriageY} />}

          {/* Children */}
          {!isCouple && (
            <TreeNode id="childEditionChild" label="Child" person={data.childEditionChild} onClick={handleNodeClick} x={coupleCenterX} y={chY} />
          )}
          {isCouple && data.coupleChildren.map((child, i) => (
            <TreeNode key={i} id={`coupleChild_${i}`} label="Child" person={child} onClick={handleNodeClick} x={chStartX + i * chSpread} y={chY} />
          ))}
          {childCount > 0 && isCouple && <text x={cx} y={chY + nodeH + 20} textAnchor="middle" fontSize={8.5} fill="#bfb49e" fontFamily="'DM Sans',sans-serif" fontWeight="600" letterSpacing="1.5">CHILDREN</text>}
        </svg>

        {/* Add/remove children — couple edition only */}
        {isCouple && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 4 }}>
            <button onClick={removeChild} disabled={data.coupleChildren.length <= 0}
              style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #ddd5c6", background: "#fff", fontSize: 16, color: "#9a8468", cursor: data.coupleChildren.length <= 0 ? "not-allowed" : "pointer", opacity: data.coupleChildren.length <= 0 ? 0.3 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>{"\u2212"}</button>
            <span style={{ fontSize: 11, color: "#9a8468", alignSelf: "center" }}>{data.coupleChildren.length} child{data.coupleChildren.length !== 1 ? "ren" : ""}</span>
            <button onClick={addChild} disabled={data.coupleChildren.length >= 10}
              style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid #c4a882", background: "rgba(196,168,130,.08)", fontSize: 16, color: "#6b4c3b", cursor: data.coupleChildren.length >= 10 ? "not-allowed" : "pointer", opacity: data.coupleChildren.length >= 10 ? 0.3 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
          </div>
        )}

        {/* Popups */}
        {editing && editing.id === "marriage" && (
          <MarriagePopup marriage={data.marriage} anchorRect={editing.rect} containerRect={containerRef.current?.getBoundingClientRect()} onSave={handleSaveMarriage} />
        )}
        {editing && editing.id !== "marriage" && (
          <PersonPopup person={getPerson(editing.id)} label={getLabel(editing.id)} anchorRect={editing.rect} containerRect={containerRef.current?.getBoundingClientRect()} onSave={(draft) => handleSavePerson(editing.id, draft)} />
        )}
      </div>

      {/* Exit warning at bottom */}
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "4px 28px 32px", textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "#c4a882", margin: 0, fontStyle: "italic" }}>
          Please do not close or refresh this page {"\u2014"} your information will not be saved until you submit.
        </p>
      </div>

    </div>
  );
}
