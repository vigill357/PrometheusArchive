<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>无限理想乡 · 创作宇宙</title>
    <!-- 引入 Tailwind CSS 进行快速样式布局 -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- 引入 Lucide 图标库 -->
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <style>
        :root {
            --theme-color: #00F0FF;
            --bg-color: #030811;
        }
        body {
            background-color: var(--bg-color);
            color: #e2e8f0;
            overflow-x: hidden;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
            margin: 0;
            padding: 0;
        }
        
        /* 自定义滚动条 */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: rgba(0, 240, 255, 0.05); }
        ::-webkit-scrollbar-thumb { background: rgba(0, 240, 255, 0.3); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0, 240, 255, 0.6); }
        
        /* 科技感切角 */
        .clip-corner { clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px); }
        .clip-corner-sm { clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px); }
        
        /* 扫描线背景层 */
        .scanlines {
            background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
            background-size: 100% 4px;
            pointer-events: none;
            position: fixed;
            inset: 0;
            z-index: 50;
            opacity: 0.3;
            mix-blend-mode: overlay;
        }

        /* 动态背景 */
        .bg-grid {
            position: fixed;
            inset: 0;
            background: linear-gradient(rgba(0,240,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.03) 1px, transparent 1px);
            background-size: 40px 40px;
            opacity: 0.6;
            z-index: 0;
            pointer-events: none;
        }
        .bg-radial {
            position: fixed;
            inset: 0;
            background: radial-gradient(ellipse at center, #051833 0%, #030811 100%);
            opacity: 0.8;
            z-index: 0;
            pointer-events: none;
        }

        /* 动画效果 */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
        .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin 2s linear infinite; }
        
        /* 核心高频故障动画 */
        @keyframes glitch-core {
            0% { text-shadow: 0.05em 0 0 #00fffc, -0.05em -0.025em 0 #fc00ff, -0.025em 0.05em 0 #fffc00; }
            14% { text-shadow: 0.05em 0 0 #00fffc, -0.05em -0.025em 0 #fc00ff, -0.025em 0.05em 0 #fffc00; }
            15% { text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.025em 0 #fc00ff, -0.05em -0.05em 0 #fffc00; }
            49% { text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.025em 0 #fc00ff, -0.05em -0.05em 0 #fffc00; }
            50% { text-shadow: 0.025em 0.05em 0 #00fffc, 0.05em 0 0 #fc00ff, 0 -0.05em 0 #fffc00; }
            99% { text-shadow: 0.025em 0.05em 0 #00fffc, 0.05em 0 0 #fc00ff, 0 -0.05em 0 #fffc00; }
            100% { text-shadow: -0.025em 0 0 #00fffc, -0.025em -0.025em 0 #fc00ff, -0.025em -0.05em 0 #fffc00; }
        }

        /* 间歇性故障动画 (残响) */
        @keyframes glitch-intermittent {
            0%, 94% { text-shadow: none; transform: none; }
            95% { text-shadow: 0.05em 0 0 #00fffc, -0.05em -0.025em 0 #fc00ff, -0.025em 0.05em 0 #fffc00; transform: translate(1px, -1px); }
            96% { text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.025em 0 #fc00ff, -0.05em -0.05em 0 #fffc00; transform: translate(-1px, 1px); }
            97% { text-shadow: 0.025em 0.05em 0 #00fffc, 0.05em 0 0 #fc00ff, 0 -0.05em 0 #fffc00; transform: translate(0px, 0px); }
            98% { text-shadow: none; transform: none; }
            99% { text-shadow: -0.025em 0 0 #00fffc, -0.025em -0.025em 0 #fc00ff, -0.025em -0.05em 0 #fffc00; transform: translate(-1px, 0px); }
            100% { text-shadow: none; transform: none; }
        }

        .glitch-force-active {
            animation: glitch-core 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
        }

        @media (hover: hover) and (pointer: fine) {
            .glitch-smart-text:hover:not(.glitch-force-active) {
                animation: glitch-core 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
            }
        }

        @media (hover: none) {
            .glitch-smart-text:not(.glitch-force-active) {
                animation: glitch-intermittent 6s infinite;
            }
        }

        /* 隐藏所有视图，通过JS控制显示 */
        .view-section { display: none; }
        .view-section.active { display: block; }
    </style>
</head>
<body>

    <!-- 全局背景 -->
    <div class="bg-radial"></div>
    <div class="bg-grid"></div>
    <div class="scanlines"></div>

    <!-- 视图：首页 -->
    <div id="view-home" class="view-section active relative z-10 min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
        <div class="absolute top-8 left-8 text-cyan-500/30 font-mono text-xs hidden md:flex items-center gap-2">
            <i data-lucide="activity" class="w-3.5 h-3.5 animate-pulse-slow"></i>
            STATUS: CONNECTION_ESTABLISHED // SYS_ID: ZERO_COORD
        </div>

        <div class="w-full max-w-2xl text-center space-y-6 mb-16 relative">
            <div class="absolute -inset-10 bg-cyan-500/10 blur-3xl rounded-full z-0 opacity-50"></div>
            <p id="boot-status" class="text-cyan-500 font-mono tracking-[0.3em] text-sm md:text-base relative z-10 mb-2">
                [ RE-ANCHORING COORDINATES... ]
            </p>
            
            <h1 id="main-title" class="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-500 tracking-widest relative z-10 cursor-default pb-2 transition-all duration-300 glitch-smart-text glitch-force-active scale-[1.02] opacity-90">
                无限理想乡
                <span class="block mt-2 text-2xl md:text-3xl tracking-[0.5em] font-normal text-cyan-100">
                    创作宇宙
                </span>
            </h1>

            <p class="text-cyan-100/60 text-sm md:text-base max-w-lg mx-auto leading-relaxed relative z-10 mt-6 border-l-2 border-cyan-600 pl-4 text-left">
                “一场彻底的悲剧，找不到任何一个可以愤怒的对象。”<br/>
                “因为算法是温柔的，普通人是恐惧的，离群点是无辜的。”
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl relative z-10">
            <!-- 按钮：主线 -->
            <button onclick="navToList('MAIN', '主线故事 // 核心档案')" class="clip-corner group relative w-full overflow-hidden bg-[#0a1929]/80 border border-cyan-800/50 hover:border-cyan-400 p-6 flex flex-col items-start text-left transition-all duration-300 backdrop-blur-sm">
                <div class="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/10 group-hover:to-cyan-400/20 transition-all"></div>
                <div class="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 blur-xl group-hover:bg-cyan-400/30 transition-all rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                <div class="flex items-center gap-4 mb-4 text-cyan-400 group-hover:text-cyan-300">
                    <i data-lucide="book" class="w-6 h-6"></i>
                    <span class="font-mono text-xs opacity-50 tracking-wider">SEC_REQ // MAIN</span>
                </div>
                <h3 class="text-xl font-bold text-cyan-50 tracking-widest group-hover:text-white transition-colors">主线故事</h3>
                <span class="text-xs text-cyan-500/60 font-mono mt-1 uppercase">MAIN STORY</span>
                <i data-lucide="chevron-right" class="w-5 h-5 absolute bottom-6 right-6 text-cyan-600 group-hover:text-cyan-300 transform group-hover:translate-x-2 transition-all"></i>
            </button>

            <!-- 按钮：衍生 -->
            <button onclick="navToList('SIDE', '衍生故事 // 边界记录')" class="clip-corner group relative w-full overflow-hidden bg-[#0a1929]/80 border border-cyan-800/50 hover:border-cyan-400 p-6 flex flex-col items-start text-left transition-all duration-300 backdrop-blur-sm">
                <div class="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/10 group-hover:to-cyan-400/20 transition-all"></div>
                <div class="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 blur-xl group-hover:bg-cyan-400/30 transition-all rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                <div class="flex items-center gap-4 mb-4 text-cyan-400 group-hover:text-cyan-300">
                    <i data-lucide="file-text" class="w-6 h-6"></i>
                    <span class="font-mono text-xs opacity-50 tracking-wider">SEC_REQ // SIDE</span>
                </div>
                <h3 class="text-xl font-bold text-cyan-50 tracking-widest group-hover:text-white transition-colors">衍生故事</h3>
                <span class="text-xs text-cyan-500/60 font-mono mt-1 uppercase">SIDE STORY</span>
                <i data-lucide="chevron-right" class="w-5 h-5 absolute bottom-6 right-6 text-cyan-600 group-hover:text-cyan-300 transform group-hover:translate-x-2 transition-all"></i>
            </button>

            <!-- 按钮：插画 -->
            <button onclick="navToGallery()" class="clip-corner group relative w-full overflow-hidden bg-[#0a1929]/80 border border-cyan-800/50 hover:border-cyan-400 p-6 flex flex-col items-start text-left transition-all duration-300 backdrop-blur-sm">
                <div class="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/10 group-hover:to-cyan-400/20 transition-all"></div>
                <div class="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 blur-xl group-hover:bg-cyan-400/30 transition-all rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                <div class="flex items-center gap-4 mb-4 text-cyan-400 group-hover:text-cyan-300">
                    <i data-lucide="image" class="w-6 h-6"></i>
                    <span class="font-mono text-xs opacity-50 tracking-wider">SEC_REQ // ILLUST</span>
                </div>
                <h3 class="text-xl font-bold text-cyan-50 tracking-widest group-hover:text-white transition-colors">插画</h3>
                <span class="text-xs text-cyan-500/60 font-mono mt-1 uppercase">ILLUSTRATION</span>
                <i data-lucide="chevron-right" class="w-5 h-5 absolute bottom-6 right-6 text-cyan-600 group-hover:text-cyan-300 transform group-hover:translate-x-2 transition-all"></i>
            </button>

            <!-- 按钮：设定 -->
            <button onclick="navToList('LORE', '设定 // 世界观基准线')" class="clip-corner group relative w-full overflow-hidden bg-[#0a1929]/80 border border-cyan-800/50 hover:border-cyan-400 p-6 flex flex-col items-start text-left transition-all duration-300 backdrop-blur-sm">
                <div class="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/10 group-hover:to-cyan-400/20 transition-all"></div>
                <div class="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 blur-xl group-hover:bg-cyan-400/30 transition-all rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                <div class="flex items-center gap-4 mb-4 text-cyan-400 group-hover:text-cyan-300">
                    <i data-lucide="database" class="w-6 h-6"></i>
                    <span class="font-mono text-xs opacity-50 tracking-wider">SEC_REQ // LORE</span>
                </div>
                <h3 class="text-xl font-bold text-cyan-50 tracking-widest group-hover:text-white transition-colors">设定</h3>
                <span class="text-xs text-cyan-500/60 font-mono mt-1 uppercase">ARCHIVE LORE</span>
                <i data-lucide="chevron-right" class="w-5 h-5 absolute bottom-6 right-6 text-cyan-600 group-hover:text-cyan-300 transform group-hover:translate-x-2 transition-all"></i>
            </button>
        </div>
    </div>

    <!-- 视图：文档列表 (主线/衍生/设定 共用) -->
    <div id="view-list" class="view-section relative z-10 min-h-screen flex flex-col animate-fade-in pb-20">
        <header class="sticky top-0 z-40 w-full backdrop-blur-lg bg-[#030811]/70 border-b border-cyan-900/50 flex items-center p-4 px-6 shadow-[0_4px_30px_rgba(0,240,255,0.05)]">
            <button onclick="switchView('view-home')" class="w-10 h-10 flex items-center justify-center rounded border border-cyan-800 text-cyan-400 hover:bg-cyan-900/30 hover:text-cyan-300 transition-colors mr-4">
                <i data-lucide="arrow-left" class="w-5 h-5"></i>
            </button>
            <div class="flex flex-col">
                <span class="text-[10px] text-cyan-500/70 font-mono tracking-widest uppercase">System Interface //</span>
                <h2 id="list-title" class="text-lg text-cyan-50 font-bold tracking-wider">列表</h2>
            </div>
        </header>

        <div class="p-4 md:p-8 max-w-4xl mx-auto w-full space-y-4 mt-4">
            
            <!-- 终端日志区域 -->
            <div id="terminal-container" class="bg-[#020610] border border-cyan-900/60 p-4 rounded font-mono text-xs md:text-sm text-cyan-500/80 mb-6 clip-corner-sm h-48 overflow-y-auto">
                <div class="flex items-center gap-2 text-cyan-400 mb-2">
                    <i data-lucide="loader-2" class="w-4 h-4 animate-spin-slow"></i>
                    <span>ESTABLISHING SECURE CONNECTION...</span>
                </div>
                <div id="terminal-logs"></div>
            </div>

            <!-- 列表容器 -->
            <div id="doc-list-container" class="space-y-4 hidden"></div>
        </div>
    </div>

    <!-- 视图：阅读器 -->
    <div id="view-reader" class="view-section relative z-10 min-h-screen flex flex-col bg-[#01050a] animate-fade-in">
        <header class="sticky top-0 z-40 w-full backdrop-blur-lg bg-[#030811]/70 border-b border-cyan-900/50 flex items-center p-4 px-6 shadow-[0_4px_30px_rgba(0,240,255,0.05)]">
            <button onclick="switchView('view-list')" class="w-10 h-10 flex items-center justify-center rounded border border-cyan-800 text-cyan-400 hover:bg-cyan-900/30 hover:text-cyan-300 transition-colors mr-4">
                <i data-lucide="arrow-left" class="w-5 h-5"></i>
            </button>
            <div class="flex flex-col">
                <span class="text-[10px] text-cyan-500/70 font-mono tracking-widest uppercase">System Interface //</span>
                <h2 class="text-lg text-cyan-50 font-bold tracking-wider">内容解析 // 读取模式</h2>
            </div>
        </header>
        
        <div class="absolute inset-0" style="background: radial-gradient(ellipse at top, #0a192f 0%, #01050a 100%); pointer-events: none; opacity: 0.5; z-index: 0;"></div>

        <div class="flex-1 w-full max-w-3xl mx-auto p-6 md:p-12 relative z-10">
            <!-- 装饰角 -->
            <div class="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-cyan-500/50 hidden md:block"></div>
            <div class="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-cyan-500/50 hidden md:block"></div>
            <div class="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-cyan-500/50 hidden md:block"></div>
            <div class="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-cyan-500/50 hidden md:block"></div>

            <h1 id="reader-title" class="text-2xl md:text-4xl font-bold text-cyan-300 mb-8 border-b border-cyan-800/40 pb-6 leading-tight">
                标题
            </h1>
            
            <div id="reader-content" class="text-slate-300/90 leading-loose text-base md:text-lg tracking-wide whitespace-pre-wrap font-sans" style="word-break: break-word;">
                内容
            </div>
            
            <div class="mt-16 text-center text-cyan-700 font-mono text-xs border-t border-cyan-900/30 pt-6">
                // EOF : DATA STREAM TERMINATED //
            </div>
        </div>
    </div>

    <!-- 视图：画廊 -->
    <div id="view-gallery" class="view-section relative z-10 min-h-screen flex flex-col animate-fade-in">
        <header class="sticky top-0 z-40 w-full backdrop-blur-lg bg-[#030811]/70 border-b border-cyan-900/50 flex items-center p-4 px-6 shadow-[0_4px_30px_rgba(0,240,255,0.05)]">
            <button onclick="switchView('view-home')" class="w-10 h-10 flex items-center justify-center rounded border border-cyan-800 text-cyan-400 hover:bg-cyan-900/30 hover:text-cyan-300 transition-colors mr-4">
                <i data-lucide="arrow-left" class="w-5 h-5"></i>
            </button>
            <div class="flex flex-col">
                <span class="text-[10px] text-cyan-500/70 font-mono tracking-widest uppercase">System Interface //</span>
                <h2 class="text-lg text-cyan-50 font-bold tracking-wider">插画影像记录</h2>
            </div>
        </header>
        <div id="gallery-container" class="p-4 md:p-8 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            <!-- 图片列表将在这里生成 -->
        </div>
    </div>

    <!-- 视图：图片查看器 (全屏覆盖) -->
    <div id="view-image" class="view-section fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col animate-fade-in hidden">
        <div class="flex justify-between items-center p-4 md:px-8 absolute top-0 w-full z-10 bg-gradient-to-b from-black/80 to-transparent">
            <button onclick="closeImageView()" class="text-cyan-500 hover:text-cyan-300 p-2 border border-cyan-900/0 hover:border-cyan-800 bg-black/50 rounded transition-all">
                <i data-lucide="arrow-left" class="w-6 h-6"></i>
            </button>
            <div id="image-viewer-title" class="text-cyan-400 font-mono text-xs md:text-sm tracking-widest">标题</div>
            <div class="flex gap-2">
                <button onclick="changeZoom(-0.5)" class="text-cyan-500 hover:text-cyan-300 p-2 bg-black/50 border border-cyan-900 rounded">
                    <i data-lucide="zoom-out" class="w-5 h-5"></i>
                </button>
                <button onclick="changeZoom(0.5)" class="text-cyan-500 hover:text-cyan-300 p-2 bg-black/50 border border-cyan-900 rounded">
                    <i data-lucide="zoom-in" class="w-5 h-5"></i>
                </button>
            </div>
        </div>
        <div class="flex-1 overflow-auto flex items-center justify-center p-4 mt-16 pb-16">
            <img id="image-viewer-img" src="" alt="" style="transform: scale(1); transform-origin: center;" class="transition-transform duration-200 ease-out max-w-full max-h-full object-contain select-none shadow-2xl shadow-cyan-900/20" draggable="false" />
        </div>
    </div>

    <script>
        // --- 核心状态 ---
        let currentPrefix = '';
        let currentDocs = [];
        let imageScale = 1;

        // 备用数据库
        const FALLBACK_DB = {
            MAIN: [
                { id: "01", title: "备用记录：重构之人与亲和之人", content: "由于无法读取 main01.txt，系统启用了备用缓存。\n\n父母动用禁术，将算法部分视角探测到的离群坐标折叠进旧维度层，同时将他所有当前可见坐标全部归零。表面上他是一次重构的产物，但他不是被清零的人，他是被藏起来的人。" },
                { id: "02", title: "备用记录：血月浸染（强制迭代事件）", content: "由于无法读取 main02.txt，系统启用了备用缓存。\n\n那一夜，天空呈现出无法被任何气象原理解释的深红色，持续整整一夜，全球同步目击。现实在那一夜大规模可见扭曲。" }
            ],
            SIDE: [
                { id: "01", title: "备用记录：林驿的深潜", content: "当他窥视到部分真相，意识到自己的亲和并非天性而是能力，他开始有意识地沿着那条通道向内走。" }
            ],
            LORE: [
                { id: "01", title: "备用记录：世界迭代机制", content: "世界本身处在无限维度的混沌空间中。算法感知到了低维容纳的不完整性——出于难以想象的温柔，为了让每一个存在都被准确地表达，算法主动开启迭代。" }
            ],
            ILLUST: [
                { title: "视觉概念图 // 旧维度的深潜", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1600" },
                { title: "场景概念图 // 血月降临", url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1600" }
            ]
        };

        const prefixMap = { 'MAIN': 'main', 'SIDE': 'side', 'LORE': 'lore' };

        // --- 初始化 Lucide 图标 ---
        lucide.createIcons();

        // --- 首页加载特效处理 ---
        setTimeout(() => {
            document.getElementById('boot-status').innerText = '[ PROJECT: PROMETHEUS ]';
            const titleEl = document.getElementById('main-title');
            titleEl.classList.remove('glitch-force-active', 'scale-[1.02]', 'opacity-90');
        }, 1500);

        // --- 视图切换逻辑 ---
        function switchView(viewId) {
            document.querySelectorAll('.view-section').forEach(el => {
                el.classList.remove('active');
                if (el.id === 'view-image') el.classList.add('hidden'); // 图片查看器特殊处理
            });
            const target = document.getElementById(viewId);
            if (target) {
                target.classList.add('active');
                if (viewId === 'view-image') target.classList.remove('hidden');
            }
            window.scrollTo(0, 0);
        }

        // --- 导航：列表页并触发抓取 ---
        async function navToList(dataKey, titleText) {
            switchView('view-list');
            document.getElementById('list-title').innerText = titleText;
            
            const termContainer = document.getElementById('terminal-container');
            const termLogs = document.getElementById('terminal-logs');
            const listContainer = document.getElementById('doc-list-container');
            
            termContainer.style.display = 'block';
            listContainer.style.display = 'none';
            termLogs.innerHTML = '';
            
            currentPrefix = prefixMap[dataKey];
            currentDocs = [];
            
            function addLog(text, type = 'normal') {
                const div = document.createElement('div');
                div.innerText = text;
                if (type === 'error' || type === 'warn') div.classList.add('text-amber-400');
                if (type === 'success') div.classList.add('text-cyan-300');
                termLogs.appendChild(div);
                termContainer.scrollTop = termContainer.scrollHeight;
            }

            addLog('[SYSTEM] INITIALIZING FOLDER PROBE...');
            addLog(`[SYSTEM] TARGET PREFIX: '${currentPrefix}*.txt'`);

            let index = 1;
            while(true) {
                const idStr = String(index).padStart(2, '0');
                const fileName = `${currentPrefix}${idStr}.txt`;
                
                addLog(`> PROBING: ./${fileName}`);
                
                try {
                    // 使用 fetch 请求同级目录下的 txt
                    const res = await fetch('./' + fileName);
                    
                    if (!res.ok) {
                        addLog(`[INFO] 404 NOT FOUND: ${fileName}. SEQUENCE ENDED.`, 'warn');
                        break;
                    }
                    
                    const text = await res.text();
                    
                    // 防御 Github Pages 404 HTML 返回
                    if (text.trim().toLowerCase().startsWith('<!doctype html>')) {
                        addLog(`[WARN] HTML CONTENT DETECTED. SEQUENCE ENDED.`, 'warn');
                        break;
                    }

                    const lines = text.split('\n');
                    const docTitle = lines[0] ? lines[0].trim() : `档案_${idStr}`;
                    const content = lines.slice(1).join('\n').trim();

                    currentDocs.push({ id: idStr, title: docTitle, content: content });
                    addLog(`[SUCCESS] FILE LOADED: ${fileName}`, 'success');
                    
                    index++;
                } catch (e) {
                    addLog(`[ERROR] NETWORK EXCEPTION.`, 'error');
                    break;
                }
            }

            // 处理抓取结果
            if (currentDocs.length === 0) {
                addLog(`[WARN] NO FILES FOUND. BOOTING EMERGENCY FALLBACK...`, 'warn');
                currentDocs = FALLBACK_DB[dataKey] || [];
            } else {
                addLog(`[SYSTEM] RETRIEVAL COMPLETE. TOTAL: ${currentDocs.length}`, 'success');
            }

            // 延迟一点时间显示列表
            setTimeout(() => {
                termContainer.style.display = 'none';
                renderList();
                listContainer.style.display = 'block';
            }, 800);
        }

        // --- 渲染文档列表 ---
        function renderList() {
            const listContainer = document.getElementById('doc-list-container');
            listContainer.innerHTML = '';
            
            currentDocs.forEach((doc, idx) => {
                const div = document.createElement('div');
                div.className = "clip-corner-sm border border-cyan-900/60 bg-[#071321]/80 hover:bg-[#0c243c]/90 p-5 md:p-6 cursor-pointer group transition-all duration-300 relative overflow-hidden backdrop-blur-sm animate-fade-in";
                div.style.animationDelay = `${idx * 0.1}s`;
                div.onclick = () => openReader(idx);
                
                div.innerHTML = `
                    <div class="absolute left-0 top-0 w-1 h-full bg-cyan-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300"></div>
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div class="text-[10px] text-cyan-600 font-mono mb-2 flex items-center gap-2">
                                <i data-lucide="terminal" class="w-3 h-3"></i> FILE_ID: ${currentPrefix}${doc.id}.txt
                            </div>
                            <h3 class="text-lg md:text-xl text-cyan-100 font-bold tracking-wide group-hover:text-cyan-400 transition-colors">
                                ${doc.title}
                            </h3>
                        </div>
                        <div class="text-cyan-800 group-hover:text-cyan-400 transition-colors">
                            <i data-lucide="chevron-right" class="w-5 h-5"></i>
                        </div>
                    </div>
                `;
                listContainer.appendChild(div);
            });
            lucide.createIcons(); // 重新渲染图标
        }

        // --- 打开阅读器 ---
        function openReader(index) {
            const doc = currentDocs[index];
            document.getElementById('reader-title').innerText = doc.title;
            document.getElementById('reader-content').innerText = doc.content;
            switchView('view-reader');
        }

        // --- 导航：画廊 ---
        function navToGallery() {
            switchView('view-gallery');
            const container = document.getElementById('gallery-container');
            container.innerHTML = '';
            
            FALLBACK_DB.ILLUST.forEach((img, idx) => {
                const div = document.createElement('div');
                div.className = "group cursor-pointer flex flex-col clip-corner-sm bg-[#06111f] border border-cyan-900/40 hover:border-cyan-500/60 transition-all p-2";
                // 将对象转为JSON字符串存放在属性中供点击使用
                const imgData = encodeURIComponent(JSON.stringify(img));
                div.onclick = () => openImageViewer(imgData);
                
                div.innerHTML = `
                    <div class="relative overflow-hidden aspect-video bg-black rounded-sm clip-corner-sm">
                        <div class="absolute inset-0 bg-cyan-900/20 mix-blend-color z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
                        <img src="${img.url}" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" />
                        <div class="absolute top-2 left-2 z-20 bg-black/60 backdrop-blur-md px-2 py-1 text-[10px] font-mono text-cyan-400 border border-cyan-900">
                            IMG_REC_${String(idx + 1).padStart(2, '0')}
                        </div>
                    </div>
                    <div class="p-4 py-3 text-sm font-bold text-cyan-100 tracking-wider">${img.title}</div>
                `;
                container.appendChild(div);
            });
        }

        // --- 图片查看器逻辑 ---
        function openImageViewer(encodedData) {
            const img = JSON.parse(decodeURIComponent(encodedData));
            document.getElementById('image-viewer-title').innerText = img.title;
            const imgEl = document.getElementById('image-viewer-img');
            imgEl.src = img.url;
            
            imageScale = 1;
            imgEl.style.transform = `scale(${imageScale})`;
            
            switchView('view-image');
        }

        function closeImageView() {
            switchView('view-gallery');
        }

        function changeZoom(delta) {
            imageScale += delta;
            if (imageScale < 0.5) imageScale = 0.5;
            if (imageScale > 4) imageScale = 4;
            document.getElementById('image-viewer-img').style.transform = `scale(${imageScale})`;
        }

    </script>
</body>
</html>
