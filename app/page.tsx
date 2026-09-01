"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Camera, ChevronRight, Computer, FileImage, FileText, Folder, Globe2,
  Image as ImageIcon, Menu, Monitor, Network, Power, Search,
  Settings, UserRound, Volume2, X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type WindowId = "documents" | "computer" | "network" | "internet" | "works" | "photo" | "lab" | "profile";
type OpenWindow = { id: WindowId; minimized: boolean; z: number; x: number; y: number };

const classicIconPaths = {
  computer: "/classic-icons/computer.png",
  documents: "/classic-icons/documents.png",
  internet: "/classic-icons/internet.png",
  network: "/classic-icons/network.png",
} as const;

const classicIcon = (id: keyof typeof classicIconPaths, mini = false) => (
  <img className={mini ? "classic-mini-icon" : undefined} src={classicIconPaths[id]} alt="" draggable={false} />
);

const windowInfo: Record<WindowId, { title: string; icon: React.ReactNode }> = {
  documents: { title: "牛肉丸的文档", icon: classicIcon("documents", true) },
  computer: { title: "牛肉丸的电脑", icon: classicIcon("computer", true) },
  network: { title: "网上邻居", icon: classicIcon("network", true) },
  internet: { title: "Internet Explorer", icon: classicIcon("internet", true) },
  works: { title: "我的作品", icon: <ImageIcon size={16} color="#315ca8" /> },
  photo: { title: "摄影", icon: <Camera size={16} color="#6e536d" /> },
  lab: { title: "视觉实验", icon: <FileImage size={16} color="#c54e68" /> },
  profile: { title: "个人档案", icon: <UserRound size={16} color="#397358" /> },
};

const desktopIcons: { id: WindowId; label: string; icon: React.ReactNode }[] = [
  { id: "computer", label: "牛肉丸的电脑", icon: classicIcon("computer") },
  { id: "documents", label: "牛肉丸的文档", icon: classicIcon("documents") },
  { id: "internet", label: "Internet Explorer", icon: classicIcon("internet") },
  { id: "network", label: "网上邻居", icon: classicIcon("network") },
];

const portfolioItems: { id: WindowId; name: string; detail: string; icon: React.ReactNode }[] = [
  { id: "works", name: "我的作品", detail: "品牌、平面与数字设计", icon: <ImageIcon /> },
  { id: "photo", name: "摄影档案", detail: "城市、人物与日常切片", icon: <Camera /> },
  { id: "lab", name: "视觉实验", detail: "动态图形与生成式练习", icon: <FileImage /> },
  { id: "profile", name: "个人档案", detail: "关于牛肉丸", icon: <UserRound /> },
];

const projects = [
  { no: "01", title: "NO SIGNAL", type: "视觉识别 · 2026", tone: "pink" },
  { no: "02", title: "NIGHT SHIFT", type: "摄影系列 · 2025", tone: "blue" },
  { no: "03", title: "SOFT ERROR", type: "动态实验 · 2025", tone: "green" },
];

export default function Home() {
  const [booting, setBooting] = useState(true);
  const [startOpen, setStartOpen] = useState(false);
  const [windows, setWindows] = useState<OpenWindow[]>([]);
  const [clock, setClock] = useState("");
  const topZ = useMemo(() => Math.max(1, ...windows.map((w) => w.z)), [windows]);

  useEffect(() => {
    const boot = window.setTimeout(() => setBooting(false), 3500);
    const tick = () => setClock(new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()));
    tick();
    const timer = window.setInterval(tick, 30000);
    return () => { window.clearTimeout(boot); window.clearInterval(timer); };
  }, []);

  const openWindow = (id: WindowId) => {
    setStartOpen(false);
    setWindows((current) => {
      const found = current.find((item) => item.id === id);
      if (found) return current.map((item) => item.id === id ? { ...item, minimized: false, z: topZ + 1 } : item);
      const offset = current.length % 5;
      return [...current, { id, minimized: false, z: topZ + 1, x: 128 + offset * 28, y: 76 + offset * 24 }];
    });
  };

  const focusWindow = (id: WindowId) => setWindows((ws) => ws.map((w) => w.id === id ? { ...w, minimized: false, z: topZ + 1 } : w));
  const closeWindow = (id: WindowId) => setWindows((ws) => ws.filter((w) => w.id !== id));
  const minimizeWindow = (id: WindowId) => setWindows((ws) => ws.map((w) => w.id === id ? { ...w, minimized: true } : w));

  return (
    <main className="os-shell" onMouseDown={() => startOpen && setStartOpen(false)}>
      <AnimatePresence>{booting && <BootScreen onSkip={() => setBooting(false)} />}</AnimatePresence>
      <div className="desktop" aria-label="beefboll 2004 桌面">
        <div className="desktop-brand" aria-hidden="true">
          <span>beefboll</span><strong>2004</strong><small>PROFESSIONAL</small>
        </div>

        <div className="desktop-icons">
          {desktopIcons.map((item) => (
            <button className="desktop-icon" key={item.id} onDoubleClick={() => openWindow(item.id)} onClick={() => {}} aria-label={`打开${item.label}`}>
              <span className={`pixel-icon icon-${item.id}`}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {windows.map((item) => !item.minimized && (
          <DesktopWindow key={item.id} window={item} active={item.z === topZ} onFocus={() => focusWindow(item.id)} onClose={() => closeWindow(item.id)} onMinimize={() => minimizeWindow(item.id)} onMove={(x, y) => setWindows((ws) => ws.map((w) => w.id === item.id ? { ...w, x, y } : w))} onOpen={openWindow} />
        ))}

        <AnimatePresence>{startOpen && <StartMenu onOpen={openWindow} onClose={() => setStartOpen(false)} />}</AnimatePresence>

        <footer className="taskbar" onMouseDown={(e) => e.stopPropagation()}>
          <button className={`start-button ${startOpen ? "pressed" : ""}`} onClick={() => setStartOpen((v) => !v)}><span className="mini-flag"><i/><i/><i/><i/></span><b>开始</b></button>
          <div className="task-divider" />
          <div className="tasks">
            {windows.map((item) => (
              <button key={item.id} className={`task-button ${!item.minimized && item.z === topZ ? "active" : ""}`} onClick={() => item.minimized ? focusWindow(item.id) : minimizeWindow(item.id)}>
                {windowInfo[item.id].icon}<span>{windowInfo[item.id].title}</span>
              </button>
            ))}
          </div>
          <div className="tray"><Volume2 size={14}/><span>中</span><time>{clock}</time></div>
        </footer>
      </div>
    </main>
  );
}

function BootScreen({ onSkip }: { onSkip: () => void }) {
  return (
    <motion.section className="boot" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .35 }} onClick={onSkip}>
      <div className="boot-logo"><span className="boot-mark" aria-hidden="true"><i>W</i></span><div><h1>beefboll <i>2004</i></h1></div></div>
      <div className="boot-copy"><b>基于 NT 技术构建</b><span>正在启动……</span></div>
      <div className="boot-progress"><motion.i initial={{ x: -90 }} animate={{ x: 330 }} transition={{ duration: 1.15, repeat: Infinity, ease: "linear" }} /></div>
      <p className="boot-hint">单击可跳过启动画面</p>
      <div className="boot-footer"><span>© 2026 beefboll.exe</span><strong>beefboll</strong></div>
    </motion.section>
  );
}

function StartMenu({ onOpen, onClose }: { onOpen: (id: WindowId) => void; onClose: () => void }) {
  const items: { label: string; id?: WindowId; icon: React.ReactNode }[] = [
    { label: "我的作品", id: "works", icon: <ImageIcon/> }, { label: "牛肉丸的文档", id: "documents", icon: <Folder/> },
    { label: "Internet Explorer", id: "internet", icon: <Globe2/> }, { label: "个人档案", id: "profile", icon: <UserRound/> },
  ];
  return (
    <motion.div className="start-menu" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: .12 }} onMouseDown={(e) => e.stopPropagation()}>
      <div className="start-rail"><span>beefboll</span><b>2004</b></div>
      <div className="start-content">
        {items.map((item) => <button key={item.label} onClick={() => item.id && onOpen(item.id)}><span>{item.icon}</span>{item.label}</button>)}
        <div className="menu-rule" />
        <button><span><Settings/></span>设置 <ChevronRight className="arrow"/></button>
        <button><span><Search/></span>查找 <ChevronRight className="arrow"/></button>
        <div className="menu-rule" />
        <button onClick={onClose}><span><Power/></span>关闭 beefboll...</button>
      </div>
    </motion.div>
  );
}

function DesktopWindow({ window: win, active, onFocus, onClose, onMinimize, onMove, onOpen }: { window: OpenWindow; active: boolean; onFocus: () => void; onClose: () => void; onMinimize: () => void; onMove: (x: number, y: number) => void; onOpen: (id: WindowId) => void }) {
  const [dragging, setDragging] = useState(false);
  const startDrag = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    onFocus(); setDragging(true);
    const dx = e.clientX - win.x, dy = e.clientY - win.y;
    const move = (ev: PointerEvent) => onMove(Math.max(0, Math.min(window.innerWidth - 260, ev.clientX - dx)), Math.max(0, Math.min(window.innerHeight - 110, ev.clientY - dy)));
    const up = () => { setDragging(false); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
  };
  return (
    <motion.section className={`window ${active ? "focused" : ""} ${dragging ? "dragging" : ""}`} style={{ left: win.x, top: win.y, zIndex: win.z }} initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} onMouseDown={onFocus}>
      <header className="titlebar" onPointerDown={startDrag}><span>{windowInfo[win.id].icon}{windowInfo[win.id].title}</span><div><button aria-label="最小化" onClick={onMinimize}>_</button><button aria-label="关闭" onClick={onClose}><X/></button></div></header>
      <nav className="menu-bar"><span>文件(<u>F</u>)</span><span>编辑(<u>E</u>)</span><span>查看(<u>V</u>)</span><span>收藏(<u>A</u>)</span><span>帮助(<u>H</u>)</span></nav>
      <div className="address"><b>地址</b><span>{windowInfo[win.id].icon} C:\beefboll.exe\{windowInfo[win.id].title}</span></div>
      <div className="window-body">{renderWindowContent(win.id, onOpen)}</div>
      <footer className="statusbar"><span>{win.id === "documents" ? "4 个对象" : "beefboll.exe"}</span><span>牛肉丸的电脑</span></footer>
    </motion.section>
  );
}

function renderWindowContent(id: WindowId, onOpen: (id: WindowId) => void) {
  if (id === "documents") return <div className="folder-grid">{portfolioItems.map((item) => <button key={item.id} onDoubleClick={() => onOpen(item.id)} onClick={() => {}}><span>{item.icon}</span><b>{item.name}</b><small>{item.detail}</small></button>)}</div>;
  if (id === "works") return <div className="project-list"><div className="intro-line"><span>SELECTED WORK</span><p>选择一个项目，打开我的工作痕迹。</p></div>{projects.map((p) => <article key={p.no} className={p.tone}><div><small>{p.no}</small><strong>{p.title}</strong><span>{p.type}</span></div><ChevronRight/></article>)}</div>;
  if (id === "photo") return <div className="photo-grid"><div/><div/><div/><div/><p>在霓虹、噪点和凌晨四点之间，保存一些没有被命名的瞬间。</p></div>;
  if (id === "lab") return <div className="lab"><div className="lab-orbit"><i/><i/><i/></div><h2>SOFT ERROR / 视觉实验室</h2><p>把排版、代码、偶然性和一点坏品味混在一起。</p></div>;
  if (id === "profile") return <div className="profile"><div className="avatar">w</div><div><small>USER PROFILE</small><h2>关于牛肉丸</h2><p>视觉设计师 / 摄影爱好者 / 互联网考古员。正在收集旧系统里那些诚实、直接又有点笨拙的美。</p><a href="mailto:atepraylove@gmail.com">atepraylove@gmail.com</a></div></div>;
  if (id === "computer") return <div className="system-panel"><Monitor/><div><h2>beefboll 2004 Professional</h2><p>系统：beefboll NT</p><p>注册给：访客</p><p>内存：无限创意可用</p></div></div>;
  if (id === "network") return <EmptyState icon={<Network/>} title="整个网络" text="正在寻找同样奇怪的人……"/>;
  return <div className="browser-page"><div className="browser-logo"><Globe2/><span>beefboll<sup>.exe</sup></span></div><h2>欢迎来到个人主页</h2><p>此页面最好使用好奇心与 800 × 600 分辨率浏览。</p><button onClick={() => onOpen("documents")}>进入牛肉丸的文档</button></div>;
}

function EmptyState({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="empty-state"><span>{icon}</span><div><h2>{title}</h2><p>{text}</p></div></div>;
}
