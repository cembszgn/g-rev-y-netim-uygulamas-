import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownUp, CalendarDays, Check, CheckCheck, Circle,
  CircleHelp, ClipboardList, Clock3, Filter, LayoutDashboard, ListTodo,
  Plus, Search, Sparkles, Trash2, X
} from "lucide-react";

const STORAGE_KEY = "gorev-akisi-v1";
const initialTasks = [
  { id: "t1", title: "Proje sunumunu tamamla", detail: "Son kontrolleri yap ve dosyaları düzenle.", category: "Okul", priority: "Yüksek", due: today(), done: false, createdAt: Date.now() },
  { id: "t2", title: "Haftalık çalışma planını hazırla", detail: "Öncelikli işleri sırala.", category: "Kişisel", priority: "Orta", due: today(), done: true, createdAt: Date.now() - 1000 },
  { id: "t3", title: "Yeni konu başlıklarını gözden geçir", detail: "Notları okuyup kısa özet çıkar.", category: "Okul", priority: "Düşük", due: addDays(1), done: false, createdAt: Date.now() - 2000 },
  { id: "t4", title: "E-postaları kontrol et", detail: "", category: "İş", priority: "Orta", due: addDays(2), done: false, createdAt: Date.now() - 3000 }
];

function today() { const d = new Date(); const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return local.toISOString().slice(0, 10); }
function addDays(n) { const d = new Date(); d.setDate(d.getDate() + n); const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return local.toISOString().slice(0, 10); }
function readTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialTasks;
  } catch { return initialTasks; }
}
function dateLabel(value) {
  if (!value) return "Tarih yok";
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }).format(new Date(`${value}T12:00:00`));
}

export default function App() {
  const [tasks, setTasks] = useState(readTasks);
  const [filter, setFilter] = useState("Tümü");
  const [category, setCategory] = useState("Hepsi");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({ title: "", detail: "", category: "Kişisel", priority: "Orta", due: today() });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }, [tasks]);

  const completed = tasks.filter(t => t.done).length;
  const pending = tasks.length - completed;
  const overdue = tasks.filter(t => !t.done && t.due && t.due < today()).length;
  const progress = tasks.length ? Math.round(completed / tasks.length * 100) : 0;

  const visibleTasks = useMemo(() => tasks
    .filter(t => {
      if (filter === "Aktif" && t.done) return false;
      if (filter === "Tamamlanan" && !t.done) return false;
      if (filter === "Bugün" && t.due !== today()) return false;
      if (category !== "Hepsi" && t.category !== category) return false;
      const q = query.trim().toLocaleLowerCase("tr-TR");
      return !q || `${t.title} ${t.detail} ${t.category}`.toLocaleLowerCase("tr-TR").includes(q);
    })
    .sort((a, b) => Number(a.done) - Number(b.done) || (a.due || "9999").localeCompare(b.due || "9999")),
  [tasks, filter, category, query]);

  function openNew() {
    setEditing(null);
    setForm({ title: "", detail: "", category: "Kişisel", priority: "Orta", due: today() });
    setShowForm(true);
  }
  function openEdit(task) {
    setEditing(task.id);
    setForm({ title: task.title, detail: task.detail || "", category: task.category, priority: task.priority, due: task.due || "" });
    setShowForm(true);
  }
  function saveTask(e) {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) return;
    if (editing) {
      setTasks(old => old.map(t => t.id === editing ? { ...t, ...form, title } : t));
      setNotice("Görev güncellendi.");
    } else {
      setTasks(old => [{ ...form, title, id: crypto.randomUUID(), done: false, createdAt: Date.now() }, ...old]);
      setNotice("Yeni görev eklendi.");
    }
    setShowForm(false);
  }
  function toggleTask(id) {
    setTasks(old => old.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }
  function deleteTask(id) {
    setTasks(old => old.filter(t => t.id !== id));
    setNotice("Görev silindi.");
  }
  function clearCompleted() {
    setTasks(old => old.filter(t => !t.done));
    setNotice("Tamamlanan görevler temizlendi.");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><ListTodo size={21}/></div><span>görev<span className="brand-light">akışı</span></span></div>
        <div className="workspace-label">ÇALIŞMA ALANI</div>
        <nav className="nav-list">
          <button className="nav-item active"><LayoutDashboard size={18}/> Genel Bakış</button>
          <button className={`nav-item ${filter === "Bugün" ? "selected" : ""}`} onClick={() => setFilter("Bugün")}><CalendarDays size={18}/> Bugün</button>
          <button className={`nav-item ${filter === "Aktif" ? "selected" : ""}`} onClick={() => setFilter("Aktif")}><ClipboardList size={18}/> Aktif görevler <span className="nav-count">{pending}</span></button>
          <button className={`nav-item ${filter === "Tamamlanan" ? "selected" : ""}`} onClick={() => setFilter("Tamamlanan")}><CheckCheck size={18}/> Tamamlananlar</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="tip-card"><div className="tip-icon"><Sparkles size={16}/></div><strong>Küçük adımlar, büyük işler.</strong><p>Bugün tek bir görevi bitirmek bile ilerlemedir.</p></div>
          <div className="profile"><div className="avatar">GA</div><div><strong>Çalışma Alanım</strong><small>Kişisel görev listesi</small></div><CircleHelp size={17} className="profile-help"/></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Çalışma Alanı <span>/</span> <b>Genel Bakış</b></div>
          <div className="top-actions"><span className="today-chip"><CalendarDays size={15}/>{new Intl.DateTimeFormat("tr-TR", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}</span><div className="avatar small">GA</div></div>
        </header>

        <section className="page-heading">
          <div><div className="eyebrow">PLANLA · ODAKLAN · TAMAMLA</div><h1>Genel Bakış</h1><p>Günün işlerini tek yerde topla ve ilerlemeni takip et.</p></div>
          <button className="primary-btn" onClick={openNew}><Plus size={18}/> Yeni görev</button>
        </section>

        <section className="stats-grid">
          <Stat icon={<ListTodo size={19}/>} label="Toplam görev" value={tasks.length} caption="Tüm listendeki görevler" tone="blue"/>
          <Stat icon={<Activity size={19}/>} label="Devam eden" value={pending} caption="Henüz tamamlanmadı" tone="violet"/>
          <Stat icon={<CheckCheck size={19}/>} label="Tamamlanan" value={completed} caption="Güzel ilerleme!" tone="green"/>
          <Stat icon={<Clock3 size={19}/>} label="Geciken" value={overdue} caption="Tarihi geçmiş görevler" tone="orange"/>
        </section>

        <section className="progress-panel">
          <div className="progress-copy"><div className="progress-icon"><Sparkles size={18}/></div><div><strong>Günlük ilerlemen</strong><p>{completed} / {tasks.length} görev tamamlandı. Böyle devam et!</p></div></div>
          <div className="progress-meter"><div className="progress-number">{progress}%</div><div className="progress-track"><span style={{ width: `${progress}%` }}/></div></div>
        </section>

        <section className="tasks-section">
          <div className="section-heading"><div><h2>Görevlerin</h2><p>İşlerini düzenle, önceliklendir ve tamamla.</p></div><button className="text-btn" onClick={clearCompleted} disabled={!completed}><Trash2 size={15}/> Tamamlananları temizle</button></div>
          <div className="toolbar">
            <div className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Görevlerde ara..." aria-label="Görevlerde ara"/></div>
            <div className="filter-control"><Filter size={16}/><select value={category} onChange={e => setCategory(e.target.value)} aria-label="Kategori filtresi"><option>Hepsi</option><option>İş</option><option>Okul</option><option>Kişisel</option></select></div>
            <div className="sort-label"><ArrowDownUp size={15}/> Tarihe göre</div>
          </div>
          <div className="tabs">
            {["Tümü", "Aktif", "Tamamlanan", "Bugün"].map(item => <button key={item} className={filter === item ? "tab active-tab" : "tab"} onClick={() => setFilter(item)}>{item}{item === "Tümü" && <span>{tasks.length}</span>}</button>)}
          </div>
          <div className="task-list">
            {visibleTasks.length ? visibleTasks.map(task => <TaskRow key={task.id} task={task} onToggle={toggleTask} onEdit={openEdit} onDelete={deleteTask}/>) :
              <div className="empty-state"><div className="empty-icon"><ClipboardList size={24}/></div><strong>Burada henüz görev yok</strong><p>Filtreyi değiştirebilir veya yeni bir görev ekleyebilirsin.</p><button className="primary-btn compact" onClick={openNew}><Plus size={16}/> Görev ekle</button></div>}
          </div>
          <div className="list-footer"><span>{visibleTasks.length} görev gösteriliyor</span><span><Circle size={7} fill="currentColor"/> Değişiklikler otomatik kaydedilir</span></div>
        </section>
        <footer className="footer">Görev Akışı <span>·</span> Basit planlama, net ilerleme.</footer>
      </main>

      {showForm && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setShowForm(false)}>
        <form className="task-modal" onSubmit={saveTask}>
          <div className="modal-head"><div><div className="eyebrow">GÖREV YÖNETİMİ</div><h2>{editing ? "Görevi düzenle" : "Yeni görev oluştur"}</h2></div><button type="button" className="icon-btn" onClick={() => setShowForm(false)} aria-label="Kapat"><X size={19}/></button></div>
          <label>Görev başlığı<input autoFocus required maxLength={90} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Örn. Sunum dosyasını hazırla"/></label>
          <label>Açıklama <span className="optional">(isteğe bağlı)</span><textarea rows="3" maxLength={300} value={form.detail} onChange={e => setForm({ ...form, detail: e.target.value })} placeholder="Görevle ilgili kısa not..."/></label>
          <div className="form-row"><label>Kategori<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option>Kişisel</option><option>İş</option><option>Okul</option></select></label><label>Öncelik<select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}><option>Düşük</option><option>Orta</option><option>Yüksek</option></select></label></div>
          <label>Son tarih<input type="date" value={form.due} onChange={e => setForm({ ...form, due: e.target.value })}/></label>
          <div className="modal-actions"><button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>Vazgeç</button><button type="submit" className="primary-btn"><Check size={17}/>{editing ? "Değişiklikleri kaydet" : "Görevi ekle"}</button></div>
        </form>
      </div>}
      {notice && <div className="toast"><Check size={16}/>{notice}<button onClick={() => setNotice("")} aria-label="Bildirimi kapat"><X size={14}/></button></div>}
    </div>
  );
}

function Stat({ icon, label, value, caption, tone }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-caption">{caption}</div></div>;
}
function TaskRow({ task, onToggle, onEdit, onDelete }) {
  return <article className={`task-row ${task.done ? "is-done" : ""}`}>
    <button className={`check-button ${task.done ? "checked" : ""}`} onClick={() => onToggle(task.id)} aria-label={task.done ? "Tamamlanmadı olarak işaretle" : "Tamamlandı olarak işaretle"}>{task.done && <Check size={14}/>}</button>
    <div className="task-main"><button className="task-title" onClick={() => onEdit(task)}>{task.title}</button>{task.detail && <p>{task.detail}</p>}<div className="task-meta"><span className={`category-pill ${task.category.toLowerCase()}`}>{task.category}</span><span className={`priority ${task.priority.toLowerCase()}`}><i/>{task.priority} öncelik</span></div></div>
    <div className="task-date"><CalendarDays size={14}/>{dateLabel(task.due)}</div>
    <div className="task-actions"><button className="icon-btn" onClick={() => onEdit(task)} aria-label="Düzenle"><span>✎</span></button><button className="icon-btn danger-hover" onClick={() => onDelete(task.id)} aria-label="Sil"><Trash2 size={16}/></button></div>
  </article>;
}