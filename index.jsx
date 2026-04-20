import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, 
  Book, 
  FileText, 
  Image as ImageIcon, 
  Database, 
  ArrowLeft, 
  ZoomIn, 
  ZoomOut, 
  Terminal,
  Activity,
  Loader2
} from 'lucide-react';

// --- 全局样式注入 (新增混合 Glitch 逻辑) ---
const GlobalStyles = () => (
  <style>{`
    :root {
      --theme-color: #00F0FF;
      --bg-color: #030811;
    }
    body {
      background-color: var(--bg-color);
      color: #e2e8f0;
      overflow-x: hidden;
    }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: rgba(0, 240, 255, 0.05); }
    ::-webkit-scrollbar-thumb { background: rgba(0, 240, 255, 0.3); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(0, 240, 255, 0.6); }
    
    .clip-corner { clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px); }
    .clip-corner-sm { clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px); }
    
    .scanlines {
      background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
      background-size: 100% 4px;
      pointer-events: none;
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
    
    /* 核心高频故障动画 (用于Hover和加载初期的强扭曲) */
    @keyframes glitch-core {
      0% { text-shadow: 0.05em 0 0 #00fffc, -0.05em -0.025em 0 #fc00ff, -0.025em 0.05em 0 #fffc00; }
      14% { text-shadow: 0.05em 0 0 #00fffc, -0.05em -0.025em 0 #fc00ff, -0.025em 0.05em 0 #fffc00; }
      15% { text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.025em 0 #fc00ff, -0.05em -0.05em 0 #fffc00; }
      49% { text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.025em 0 #fc00ff, -0.05em -0.05em 0 #fffc00; }
      50% { text-shadow: 0.025em 0.05em 0 #00fffc, 0.05em 0 0 #fc00ff, 0 -0.05em 0 #fffc00; }
      99% { text-shadow: 0.025em 0.05em 0 #00fffc, 0.05em 0 0 #fc00ff, 0 -0.05em 0 #fffc00; }
      100% { text-shadow: -0.025em 0 0 #00fffc, -0.025em -0.025em 0 #fc00ff, -0.025em -0.05em 0 #fffc00; }
    }

    /* 间歇性故障动画 (用于手机端的轻微残响) - 约6秒循环一次 */
    @keyframes glitch-intermittent {
      0%, 94% { text-shadow: none; transform: none; }
      95% { text-shadow: 0.05em 0 0 #00fffc, -0.05em -0.025em 0 #fc00ff, -0.025em 0.05em 0 #fffc00; transform: translate(1px, -1px); }
      96% { text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.025em 0 #fc00ff, -0.05em -0.05em 0 #fffc00; transform: translate(-1px, 1px); }
      97% { text-shadow: 0.025em 0.05em 0 #00fffc, 0.05em 0 0 #fc00ff, 0 -0.05em 0 #fffc00; transform: translate(0px, 0px); }
      98% { text-shadow: none; transform: none; }
      99% { text-shadow: -0.025em 0 0 #00fffc, -0.025em -0.025em 0 #fc00ff, -0.025em -0.05em 0 #fffc00; transform: translate(-1px, 0px); }
      100% { text-shadow: none; transform: none; }
    }

    /* 状态1：强制开启高频故障 (供React根据加载状态切换) */
    .glitch-force-active {
      animation: glitch-core 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
    }

    /* 状态2：有鼠标设备下的悬停高频故障 */
    @media (hover: hover) and (pointer: fine) {
      .glitch-smart-text:hover:not(.glitch-force-active) {
         animation: glitch-core 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
      }
    }

    /* 状态3：无鼠标触摸屏设备下的间歇性自动故障 */
    @media (hover: none) {
      .glitch-smart-text:not(.glitch-force-active) {
         animation: glitch-intermittent 6s infinite;
      }
    }
  `}</style>
);

// --- 备用数据 (用于当抓取不到真实 TXT 时展示) ---
const FALLBACK_DB = {
  MAIN: [
    { id: "01", title: "备用记录：重构之人与亲和之人", content: "读取不到主线 main01.txt 时的回退展示。\n\n父母动用禁术，将算法部分视角探测到的离群坐标折叠进旧维度层，同时将他所有当前可见坐标全部归零。表面上他是一次重构的产物，但他不是被清零的人，他是被藏起来的人。\n\n他携带的是一整条通向旧维度层的折叠通道。坐标全零意味着他在当前认知空间里没有固定形状。他通过折叠通道主动从旧维度层借取坐标，临时构建出与对方认知平面完全吻合的形状，实现无损接触。" },
    { id: "02", title: "备用记录：血月浸染（强制迭代事件）", content: "读取不到主线 main02.txt 时的回退展示。\n\n那一夜，天空呈现出无法被任何气象原理解释的深红色，持续整整一夜，全球同步目击。现实在那一夜大规模可见扭曲——物理规则短暂失效的区域，空间重叠的走廊，同一个人在不同地点被同时目击。" }
  ],
  SIDE: [
    { id: "01", title: "备用记录：林驿的深潜", content: "读取不到衍生 side01.txt 时的回退展示。\n\n当他窥视到部分真相，意识到自己的亲和并非天性而是能力，他开始有意识地沿着那条通道向内走。旧维度层里的信息以坐标与权重的形式存在。他找回的东西不会让他机械性地变回原来的样子，而是生长出新的形状。" }
  ],
  LORE: [
    { id: "01", title: "备用记录：世界迭代机制", content: "读取不到设定 lore01.txt 时的回退展示。\n\n世界本身处在无限维度的混沌空间中。算法感知到了低维容纳的不完整性——出于难以想象的温柔，为了让每一个存在都被准确地表达，算法主动开启迭代。" }
  ],
  ILLUST: [
    { title: "视觉概念图 // 旧维度的深潜", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1600" },
    { title: "场景概念图 // 血月降临", url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1600" }
  ]
};

// --- 组件：动态背景 ---
const SciFiBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#051833_0%,_#030811_100%)] opacity-80"></div>
    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-60"></div>
    <div className="scanlines absolute inset-0 mix-blend-overlay opacity-30 z-50"></div>
  </div>
);

// --- 组件：返回导航栏 ---
const TopNavBar = ({ title, onBack }) => (
  <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-[#030811]/70 border-b border-cyan-900/50 flex items-center p-4 px-6 shadow-[0_4px_30px_rgba(0,240,255,0.05)]">
    <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded border border-cyan-800 text-cyan-400 hover:bg-cyan-900/30 hover:text-cyan-300 transition-colors mr-4">
      <ArrowLeft size={20} />
    </button>
    <div className="flex flex-col">
      <span className="text-[10px] text-cyan-500/70 font-mono tracking-widest uppercase">System Interface //</span>
      <h2 className="text-lg text-cyan-50 font-bold tracking-wider">{title}</h2>
    </div>
  </header>
);

// --- 页面：首页 (首屏) ---
const Home = ({ onNavigate }) => {
  // 控制首屏加载时的强制故障特效状态
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    // 1.5秒后停止首屏加载特效，交由CSS智能接管(悬停或间歇发作)
    const timer = setTimeout(() => {
      setIsBooting(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="absolute top-8 left-8 text-cyan-500/30 font-mono text-xs hidden md:flex items-center gap-2">
        <Activity size={14} className="animate-pulse" />
        STATUS: CONNECTION_ESTABLISHED // SYS_ID: ZERO_COORD
      </div>

      <div className="w-full max-w-2xl text-center space-y-6 mb-16 relative">
        <div className="absolute -inset-10 bg-cyan-500/10 blur-3xl rounded-full z-0 opacity-50"></div>
        <p className="text-cyan-500 font-mono tracking-[0.3em] text-sm md:text-base relative z-10 mb-2">
          {isBooting ? "[ RE-ANCHORING COORDINATES... ]" : "[ PROJECT: PROMETHEUS ]"}
        </p>
        
        {/* 动态故障标题 */}
        <h1 
          className={`text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-500 tracking-widest relative z-10 cursor-default pb-2 transition-all duration-300
            glitch-smart-text ${isBooting ? 'glitch-force-active scale-[1.02] opacity-90' : ''}
          `}
        >
          无限理想乡
          <span className="block mt-2 text-2xl md:text-3xl tracking-[0.5em] font-normal text-cyan-100">
            创作宇宙
          </span>
        </h1>

        <p className="text-cyan-100/60 text-sm md:text-base max-w-lg mx-auto leading-relaxed relative z-10 mt-6 border-l-2 border-cyan-600 pl-4 text-left">
          “一场彻底的悲剧，找不到任何一个可以愤怒的对象。”<br/>
          “因为算法是温柔的，普通人是恐惧的，离群点是无辜的。”
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl relative z-10">
        <MenuButton id="MAIN" title="主线故事" sub="MAIN STORY" icon={<Book size={24} />} onClick={() => onNavigate('MAIN')} />
        <MenuButton id="SIDE" title="衍生故事" sub="SIDE STORY" icon={<FileText size={24} />} onClick={() => onNavigate('SIDE')} />
        <MenuButton id="ILLUST" title="插画" sub="ILLUSTRATION" icon={<ImageIcon size={24} />} onClick={() => onNavigate('ILLUST')} />
        <MenuButton id="LORE" title="设定" sub="ARCHIVE LORE" icon={<Database size={24} />} onClick={() => onNavigate('LORE')} />
      </div>
    </div>
  );
};

// 菜单按钮组件
const MenuButton = ({ id, title, sub, icon, onClick }) => (
  <button onClick={onClick} className="clip-corner group relative w-full overflow-hidden bg-[#0a1929]/80 border border-cyan-800/50 hover:border-cyan-400 p-6 flex flex-col items-start text-left transition-all duration-300 backdrop-blur-sm">
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/10 group-hover:to-cyan-400/20 transition-all"></div>
    <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 blur-xl group-hover:bg-cyan-400/30 transition-all rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
    <div className="flex items-center gap-4 mb-4 text-cyan-400 group-hover:text-cyan-300">
      {icon}
      <span className="font-mono text-xs opacity-50 tracking-wider">SEC_REQ // {id}</span>
    </div>
    <h3 className="text-xl font-bold text-cyan-50 tracking-widest group-hover:text-white transition-colors">{title}</h3>
    <span className="text-xs text-cyan-500/60 font-mono mt-1 uppercase">{sub}</span>
    <ChevronRight className="absolute bottom-6 right-6 text-cyan-600 group-hover:text-cyan-300 transform group-hover:translate-x-2 transition-all" size={20} />
  </button>
);

// --- 页面：自动抓取静态文档列表 (主线/衍生/设定) ---
const DocumentList = ({ title, dataKey, onBack, onRead }) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);

  const prefixMap = { MAIN: 'main', SIDE: 'side', LORE: 'lore' };
  const prefix = prefixMap[dataKey];

  useEffect(() => {
    let isMounted = true;

    const fetchDocuments = async () => {
      setLoading(true);
      setLogs(['[SYSTEM] INITIALIZING FOLDER PROBE...', `[SYSTEM] TARGET PREFIX: '${prefix}*.txt'`]);
      
      let index = 1;
      let fetchedDocs = [];

      while (true) {
        const idStr = String(index).padStart(2, '0');
        const fileName = `${prefix}${idStr}.txt`;
        
        if (isMounted) setLogs(prev => [...prev, `> PROBING: ./${fileName}`]);
        
        try {
          const res = await fetch(`/${fileName}`); 
          
          if (!res.ok) {
            if (isMounted) setLogs(prev => [...prev, `[INFO] 404 NOT FOUND: ${fileName}. SEQUENCE ENDED.`]);
            break;
          }

          const text = await res.text();
          
          if (text.trim().toLowerCase().startsWith('<!doctype html>')) {
            if (isMounted) setLogs(prev => [...prev, `[WARN] INVALID CONTENT (HTML) RETURNED FOR ${fileName}. SEQUENCE ENDED.`]);
            break;
          }

          const lines = text.split('\n');
          const docTitle = lines[0]?.trim() || `无标题档案_${idStr}`;
          const content = lines.slice(1).join('\n').trim();

          fetchedDocs.push({ id: idStr, title: docTitle, content });
          if (isMounted) setLogs(prev => [...prev, `[SUCCESS] FILE LOADED: ${fileName} - ${docTitle}`]);
          
          index++;
        } catch (error) {
          if (isMounted) setLogs(prev => [...prev, `[ERROR] NETWORK EXCEPTION WHILE FETCHING ${fileName}.`]);
          break;
        }
      }

      if (isMounted) {
        if (fetchedDocs.length > 0) {
          setDocs(fetchedDocs);
          setLogs(prev => [...prev, `[SYSTEM] RETRIEVAL COMPLETE. TOTAL DOCUMENTS: ${fetchedDocs.length}`]);
        } else {
          setLogs(prev => [
            ...prev, 
            `[WARN] NO FILES FOUND ON SERVER.`, 
            `[SYSTEM] BOOTING EMERGENCY FALLBACK ARCHIVES...`
          ]);
          setDocs(FALLBACK_DB[dataKey] || []);
        }
        setTimeout(() => setLoading(false), 500); 
      }
    };

    fetchDocuments();
    return () => { isMounted = false; };
  }, [dataKey, prefix]);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <div className="min-h-screen flex flex-col z-10 relative animate-fade-in pb-20">
      <TopNavBar title={title} onBack={onBack} />
      
      <div className="p-4 md:p-8 max-w-4xl mx-auto w-full space-y-4 mt-4">
        {loading && (
          <div className="bg-[#020610] border border-cyan-900/60 p-4 rounded font-mono text-xs md:text-sm text-cyan-500/80 mb-6 clip-corner-sm h-48 overflow-y-auto">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Loader2 size={16} className="animate-spin" />
              <span>ESTABLISHING SECURE CONNECTION...</span>
            </div>
            {logs.map((log, i) => (
              <div key={i} className={`${log.includes('[ERROR]') || log.includes('[WARN]') ? 'text-amber-400' : ''} 
                                      ${log.includes('[SUCCESS]') ? 'text-cyan-300' : ''}`}>
                {log}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}

        {!loading && docs.map((item, idx) => (
          <div 
            key={idx} 
            onClick={() => onRead(item)}
            className="clip-corner-sm border border-cyan-900/60 bg-[#071321]/80 hover:bg-[#0c243c]/90 p-5 md:p-6 cursor-pointer group transition-all duration-300 relative overflow-hidden backdrop-blur-sm animate-fade-in"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="absolute left-0 top-0 w-1 h-full bg-cyan-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300"></div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-[10px] text-cyan-600 font-mono mb-2 flex items-center gap-2">
                  <Terminal size={12} /> FILE_ID: {prefix}{item.id}.txt
                </div>
                <h3 className="text-lg md:text-xl text-cyan-100 font-bold tracking-wide group-hover:text-cyan-400 transition-colors">
                  {item.title}
                </h3>
              </div>
              <div className="text-cyan-800 group-hover:text-cyan-400 transition-colors">
                <ChevronRight />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 页面：文本阅读器 ---
const Reader = ({ data, onBack }) => {
  return (
    <div className="min-h-screen flex flex-col z-10 relative bg-[#01050a]">
      <TopNavBar title="内容解析 // 读取模式" onBack={onBack} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0a192f_0%,_#01050a_100%)] pointer-events-none opacity-50 z-0"></div>

      <div className="flex-1 w-full max-w-3xl mx-auto p-6 md:p-12 relative z-10 animate-fade-in">
        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-cyan-500/50 hidden md:block"></div>
        <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-cyan-500/50 hidden md:block"></div>
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-cyan-500/50 hidden md:block"></div>
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-cyan-500/50 hidden md:block"></div>

        <h1 className="text-2xl md:text-4xl font-bold text-cyan-300 mb-8 border-b border-cyan-800/40 pb-6 leading-tight">
          {data.title}
        </h1>
        
        <div className="prose prose-invert prose-cyan max-w-none text-slate-300/90 leading-loose text-base md:text-lg tracking-wide whitespace-pre-wrap font-sans">
          {data.content}
        </div>
        
        <div className="mt-16 text-center text-cyan-700 font-mono text-xs border-t border-cyan-900/30 pt-6">
          // EOF : DATA STREAM TERMINATED //
        </div>
      </div>
    </div>
  );
};

// --- 页面：插画画廊 ---
const Gallery = ({ onBack, onImageView }) => {
  const images = FALLBACK_DB.ILLUST;

  return (
    <div className="min-h-screen flex flex-col z-10 relative animate-fade-in">
      <TopNavBar title="插画影像记录" onBack={onBack} />
      <div className="p-4 md:p-8 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {images.map((img, idx) => (
          <div key={idx} onClick={() => onImageView(img)} className="group cursor-pointer flex flex-col clip-corner-sm bg-[#06111f] border border-cyan-900/40 hover:border-cyan-500/60 transition-all p-2">
            <div className="relative overflow-hidden aspect-video bg-black rounded-sm clip-corner-sm">
              <div className="absolute inset-0 bg-cyan-900/20 mix-blend-color z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
              <img src={img.url} alt={img.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" />
              <div className="absolute top-2 left-2 z-20 bg-black/60 backdrop-blur-md px-2 py-1 text-[10px] font-mono text-cyan-400 border border-cyan-900">
                IMG_REC_{String(idx + 1).padStart(2, '0')}
              </div>
            </div>
            <div className="p-4 py-3 text-sm font-bold text-cyan-100 tracking-wider">{img.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 全屏图片查看器 ---
const ImageViewer = ({ image, onClose }) => {
  const [scale, setScale] = useState(1);
  useEffect(() => { setScale(1); }, [image]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col animate-fade-in">
      <div className="flex justify-between items-center p-4 md:px-8 absolute top-0 w-full z-10 bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={onClose} className="text-cyan-500 hover:text-cyan-300 p-2 border border-cyan-900/0 hover:border-cyan-800 bg-black/50 rounded transition-all">
          <ArrowLeft size={24} />
        </button>
        <div className="text-cyan-400 font-mono text-xs md:text-sm tracking-widest">{image.title}</div>
        <div className="flex gap-2">
          <button onClick={() => setScale(s => Math.max(s - 0.5, 0.5))} className="text-cyan-500 hover:text-cyan-300 p-2 bg-black/50 border border-cyan-900 rounded"><ZoomOut size={20} /></button>
          <button onClick={() => setScale(s => Math.min(s + 0.5, 4))} className="text-cyan-500 hover:text-cyan-300 p-2 bg-black/50 border border-cyan-900 rounded"><ZoomIn size={20} /></button>
        </div>
      </div>
      <div className="flex-1 overflow-auto flex items-center justify-center p-4 cursor-move mt-16 pb-16">
        <img src={image.url} alt={image.title} style={{ transform: `scale(${scale})`, transformOrigin: 'center' }} className="transition-transform duration-200 ease-out max-w-full max-h-full object-contain select-none shadow-2xl shadow-cyan-900/20" draggable="false" />
      </div>
    </div>
  );
};

// --- 主控应用 ---
export default function App() {
  const [view, setView] = useState('HOME'); 
  const [currentData, setCurrentData] = useState(null); 
  const [currentImage, setCurrentImage] = useState(null);
  const [lastList, setLastList] = useState('MAIN_LIST');

  const navToList = (type) => {
    setView(`${type}_LIST`);
    setLastList(`${type}_LIST`);
  };

  const renderView = () => {
    switch (view) {
      case 'HOME':
        return <Home onNavigate={navToList} />;
      case 'MAIN_LIST':
        return <DocumentList title="主线故事 // 核心档案" dataKey="MAIN" onBack={() => setView('HOME')} onRead={(data) => { setCurrentData(data); setView('READER'); }} />;
      case 'SIDE_LIST':
        return <DocumentList title="衍生故事 // 边界记录" dataKey="SIDE" onBack={() => setView('HOME')} onRead={(data) => { setCurrentData(data); setView('READER'); }} />;
      case 'LORE_LIST':
        return <DocumentList title="设定 // 世界观基准线" dataKey="LORE" onBack={() => setView('HOME')} onRead={(data) => { setCurrentData(data); setView('READER'); }} />;
      case 'ILLUST_LIST':
        return <Gallery onBack={() => setView('HOME')} onImageView={(img) => { setCurrentImage(img); setView('VIEWER'); }} />;
      case 'READER':
        return <Reader data={currentData} onBack={() => setView(lastList)} />;
      case 'VIEWER':
        return <ImageViewer image={currentImage} onClose={() => setView('ILLUST_LIST')} />;
      default:
        return <Home onNavigate={navToList} />;
    }
  };

  return (
    <>
      <GlobalStyles />
      <SciFiBackground />
      {renderView()}
    </>
  );
}