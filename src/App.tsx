import React, { useState, useEffect, useRef } from "react";
import { 
  LayoutDashboard, 
  Briefcase, 
  Send, 
  FileText, 
  Bot, 
  MessageSquare, 
  BarChart3, 
  Bolt, 
  Globe, 
  Settings as SettingsIcon,
  Upload,
  RefreshCw,
  Clock,
  Shield,
  Trash2,
  Download,
  CheckCircle2,
  AlertTriangle,
  Search,
  Sparkles,
  User,
  Activity,
  ChevronRight,
  TrendingUp,
  Mail,
  Zap,
  BookOpen,
  Copy,
  ChevronDown
} from "lucide-react";
import { Resume, SystemStats, CleanupLogEntry } from "./types";
import { 
  staticJobs, 
  staticApplications, 
  staticPlatforms, 
  staticWorkflows, 
  staticSchedule, 
  Job, 
  ApplicationRecord, 
  PlatformConfig, 
  WorkflowConfig 
} from "./data";

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "jobs" | "applications" | "proposals" | "resume" | "chat" | "analytics" | "workflows" | "platforms" | "settings"
  >("dashboard");

  // Core full-stack state (Resume Vault & Cron Cleaner logs)
  const [dbResumes, setDbResumes] = useState<Resume[]>([]);
  const [sysStats, setDbStats] = useState<SystemStats>({
    activeCount: 0,
    deletedCount: 0,
    totalSpaceUsed: 0,
    totalSpaceFreed: 0
  });
  const [sysLogs, setDbLogs] = useState<CleanupLogEntry[]>([]);
  const [currentTimeTick, setCurrentTimeTick] = useState<number>(0);

  // AutoApply Platform Mock State
  const [activeJobs, setActiveJobs] = useState<Job[]>(staticJobs);
  const [selectedJobIndex, setSelectedJobIndex] = useState<number>(0);
  const [appHistory, setAppHistory] = useState<ApplicationRecord[]>(staticApplications);
  const [platformsList, setPlatformsList] = useState<PlatformConfig[]>(staticPlatforms);
  const [workflowsList, setWorkflowsList] = useState<WorkflowConfig[]>(staticWorkflows);
  
  // Custom interactive state filters
  const [jobSearchQuery, setJobSearchQuery] = useState("");
  const [jobPlatformFilter, setJobPlatformFilter] = useState("All Platforms");
  const [jobScoreFilter, setJobScoreFilter] = useState("Score: Any");

  // Vault Upload Parameters
  const [uploaderName, setUploaderName] = useState("Moin Shaik");
  const [retentionDays, setRetentionDays] = useState<number>(15);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Proposal Generator Inputs
  const [propRole, setPropRole] = useState("AI Automation Consultant");
  const [propPlatform, setPropPlatform] = useState("Upwork");
  const [propTone, setPropTone] = useState("Professional & Technical");
  const [propJD, setPropJD] = useState(
    "Looking for someone to help automate client systems with n8n, Claude API, and design business dashboards using Power BI."
  );
  const [generatedProposalText, setGeneratedProposalText] = useState("");
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);

  // Chatbot State
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant', text: string }>>([
    { 
      sender: 'assistant', 
      text: "Hi Moin! I am your personal Gemini Career Assistant. I can help you draft customized proposals, prepare for consult engagements, extract keywords, or guide you on automating operations. How can I help you today?" 
    }
  ]);
  const [isSendingChat, setIsSendingChat] = useState(false);

  // ATS Scanner States
  const [atsJD, setAtsJD] = useState(
    "Accenture is hiring an AI Consultant. Must design automated workflows with n8n and build dashboards in Power BI. Knowledge of SQL databases is required."
  );
  const [atsMatchScore, setAtsMatchScore] = useState<number>(87);
  const [atsKeywords, setAtsKeywords] = useState<string[]>(["Prompt Engineering", "n8n Workflows", "Power BI DAX", "Claude API", "Workflow Automation"]);
  const [atsSuggestions, setAtsSuggestions] = useState<string[]>([
    "Insert concrete statistics of automated hours saved (e.g. 'Saved 100+ hours/month').",
    "List SQL data structure design experience clearly in your project histories to pass the ATS filter."
  ]);
  const [isAnalyzingATS, setIsAnalyzingATS] = useState(false);

  // User Profile Settings State
  const [settingName, setSettingName] = useState("Moin Shaik");
  const [settingRoles, setSettingRoles] = useState("Prompt Engineer, AI Automation Consultant, Power BI Consultant");
  const [settingMinSalary, setSettingMinSalary] = useState(80000);
  const [settingLimit, setSettingLimit] = useState(20);
  const [minMatchThreshold, setMinMatchThreshold] = useState(75);

  // Global Alert Message feedback
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [activeResumeVersionTab, setActiveResumeVersionTab] = useState<"active" | "next-guide">("active");

  // Fetch full data inventory from Express backend
  const fetchInventory = async () => {
    try {
      const [resumesRes, statsRes, logsRes] = await Promise.all([
        fetch("/api/resumes"),
        fetch("/api/stats"),
        fetch("/api/cleanup/logs")
      ]);

      if (resumesRes.ok) {
        const data = await resumesRes.json();
        setDbResumes(data);
      }
      if (statsRes.ok) {
        const data = await statsRes.json();
        setDbStats(data);
      }
      if (logsRes.ok) {
        const data = await logsRes.json();
        setDbLogs(data);
      }
    } catch (err) {
      console.error("Express DB Sync issue:", err);
    }
  };

  // Sync every second for countdown clocks and every 10s for stats
  useEffect(() => {
    fetchInventory();
    const intervalStats = setInterval(fetchInventory, 10000);
    const intervalTick = setInterval(() => {
      setCurrentTimeTick(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(intervalStats);
      clearInterval(intervalTick);
    };
  }, []);

  const triggerFeedback = (type: 'success' | 'error', text: string) => {
    setAlertMessage({ type, text });
    setTimeout(() => setAlertMessage(null), 5000);
  };

  // Drag-and-drop cv events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadDocument(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadDocument(e.target.files[0]);
    }
  };

  const uploadDocument = async (file: File) => {
    const safeExtensions = ['.pdf', '.docx', '.doc', '.xlsx', '.png', '.jpg', '.txt'];
    const isExtensionOk = safeExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    if (!isExtensionOk) {
      triggerFeedback("error", "Unsupported file extension! Please upload PDF, Word, Excel, or standard TXText document.");
      return;
    }

    setIsUploading(true);
    const formPayload = new FormData();
    formPayload.append("resume", file);
    formPayload.append("uploadedBy", uploaderName.trim() || "Anonymous Tracker");
    formPayload.append("retentionDays", retentionDays.toString());

    try {
      const res = await fetch("/api/resumes/upload", {
        method: "POST",
        body: formPayload
      });

      if (res.ok) {
        triggerFeedback("success", `Successfully uploaded "${file.name}" with a customized ${retentionDays >= 1 ? `${retentionDays}-day` : `${retentionDays * 1440} minutes`} auto-destruction guarantee!`);
        fetchInventory();
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        const errorData = await res.json();
        triggerFeedback("error", errorData.error || "Failed to upload to the server.");
      }
    } catch {
      triggerFeedback("error", "Failed to connect to express uploader endpoint.");
    } finally {
      setIsUploading(false);
    }
  };

  // Secure download trigger
  const handleDownload = (id: string, originalName: string) => {
    window.location.href = `/api/resumes/download/${id}`;
    triggerFeedback("success", `Downloading: "${originalName}"`);
  };

  // File manual removal
  const handleDeleteResume = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"? This removes it instantly from the server uploads directory.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/resumes/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        triggerFeedback("success", `Removed "${name}" from server.`);
        fetchInventory();
      } else {
        triggerFeedback("error", "Failed to delete file.");
      }
    } catch {
      triggerFeedback("error", "Network issue attempting CV deletion.");
    }
  };

  // Manual Trigger Force Cron Clean
  const handleForceCleanupIndex = async () => {
    try {
      const res = await fetch("/api/cleanup/trigger", {
        method: "POST"
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.deletedCount > 0) {
          triggerFeedback("success", `Automated cleanup simulation complete! Successfully wiped ${resData.deletedCount} expired resume files from folder.`);
        } else {
          triggerFeedback("success", "Cron cleaner scan: Checked directory, no files require garbage collection at this timestamp.");
        }
        fetchInventory();
      } else {
        triggerFeedback("error", "Error executing server-side cron cycle.");
      }
    } catch {
      triggerFeedback("error", "Server timed out running cleanup task.");
    }
  };

  // Gemini backend proposal generator
  const triggerProposalGenerator = async () => {
    setIsGeneratingProposal(true);
    try {
      const res = await fetch("/api/proposals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: propRole,
          platform: propPlatform,
          jd: propJD,
          tone: propTone
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedProposalText(data.text || "");
        triggerFeedback("success", "AI proposal customized successfully!");
      } else {
        triggerFeedback("error", "Backend AI returned error compiling proposal.");
      }
    } catch {
      triggerFeedback("error", "Failed to query server Gemini API.");
    } finally {
      setIsGeneratingProposal(false);
    }
  };

  // Chat message query to Express Gemini API
  const handleSendChatMessage = async () => {
    const textStr = chatInput.trim();
    if (!textStr) return;

    setChatMessages(prev => [...prev, { sender: 'user', text: textStr }]);
    setChatInput("");
    setIsSendingChat(true);

    try {
      const res = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textStr })
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [...prev, { sender: 'assistant', text: data.text || "I was unable to compile a guide." }]);
      } else {
        setChatMessages(prev => [...prev, { sender: 'assistant', text: "Server-side chat query failed. Double check your Gemini secrets configuration." }]);
      }
    } catch {
      setChatMessages(prev => [...prev, { sender: 'assistant', text: "Network error occurred. The Express AI assistant could not be reached." }]);
    } finally {
      setIsSendingChat(false);
    }
  };

  // ATS scanner call
  const triggerATSAnalysis = async () => {
    setIsAnalyzingATS(true);
    try {
      const res = await fetch("/api/resume/analyze-ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd: atsJD })
      });

      if (res.ok) {
        const data = await res.json();
        setAtsMatchScore(data.score || 80);
        setAtsKeywords(data.keywords || []);
        setAtsSuggestions(data.suggestions || []);
        triggerFeedback("success", "ATS analysis parsed with Gemini!");
      } else {
        triggerFeedback("error", "Failed to compile ATS matching scan.");
      }
    } catch {
      triggerFeedback("error", "Network issue compiling resume ATS optimizer.");
    } finally {
      setIsAnalyzingATS(false);
    }
  };

  // Helper format remaining count
  const renderExpirationsString = (expiresAtStr: string) => {
    const expDate = new Date(expiresAtStr).getTime();
    const currDate = new Date().getTime();
    const remainder = expDate - currDate;

    if (remainder <= 0) {
      return { msg: "Expired & Garbage Collected", urgent: true };
    }

    const secs = Math.floor(remainder / 1000) % 60;
    const mins = Math.floor(remainder / (1000 * 60)) % 60;
    const hours = Math.floor(remainder / (1000 * 60 * 60)) % 24;
    const days = Math.floor(remainder / (1000 * 60 * 60 * 24));

    let labelString = "";
    if (days > 0) {
      labelString += `${days} days ${hours}h`;
    } else if (hours > 0) {
      labelString += `${hours}h ${mins}m`;
    } else {
      labelString += `${mins}m ${secs}s`;
    }

    return { msg: labelString, urgent: days === 0 && hours < 1 };
  };

  // Filter jobs
  const getFilteredJobs = () => {
    return activeJobs.filter(j => {
      const searchMatch = searchQueryAndTags(j, jobSearchQuery);
      const valPlatform = jobPlatformFilter === "All Platforms" || j.platform === jobPlatformFilter;
      
      let valScore = true;
      if (jobScoreFilter === "85%+ Match") valScore = j.score >= 85;
      else if (jobScoreFilter === "90%+ Match") valScore = j.score >= 90;
      else if (jobScoreFilter === "75%+ Match") valScore = j.score >= 75;

      return searchMatch && valPlatform && valScore;
    });
  };

  const searchQueryAndTags = (j: Job, q: string) => {
    if (!q) return true;
    const term = q.toLowerCase();
    return (
      j.title.toLowerCase().includes(term) ||
      j.company.toLowerCase().includes(term) ||
      j.desc.toLowerCase().includes(term) ||
      j.tags.some(t => t.toLowerCase().includes(term))
    );
  };

  const bytesToStr = (b: number) => {
    if (b === 0) return "0 Bytes";
    const units = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(b) / Math.log(1024));
    return parseFloat((b / Math.pow(1024, i)).toFixed(2)) + " " + units[i];
  };

  const handleApplyNow = (job: Job, index: number) => {
    // Add visually to applications table list
    const isAlreadyPart = appHistory.some(app => app.company === job.company && app.position === job.title);
    if (isAlreadyPart) {
      triggerFeedback("success", `You have already recorded an application for ${job.title} at ${job.company}.`);
      return;
    }

    const newApplication: ApplicationRecord = {
      company: job.company,
      position: job.title,
      country: job.country,
      salary: job.salary,
      platform: job.platform,
      appliedDate: "Today",
      cvUsed: dbResumes[0]?.originalName || "Moin Shaik CV.pdf",
      status: 'Applied',
      followUp: 'Due in 3 days'
    };

    setAppHistory(prev => [newApplication, ...prev]);
    triggerFeedback("success", `✅ AI Applied! Formulated a tailored CV variation and cover letter for "${job.title}" at "${job.company}"`);
  };

  const handleQuickAssistantChoice = (promptText: string) => {
    setChatInput(promptText);
  };

  const copyToClipboardText = (text: string) => {
    navigator.clipboard.writeText(text);
    triggerFeedback("success", "Copied to clipboard!");
  };

  // Nav menus links mapping
  const navMenus = [
    { id: "dashboard", label: "Dashboard", count: null, icon: LayoutDashboard },
    { id: "jobs", label: "Job Discovery", count: 24, icon: Briefcase },
    { id: "applications", label: "Applications", count: appHistory.length, icon: Send },
    { id: "proposals", label: "AI Proposals", count: null, icon: FileText },
    { id: "resume", label: "Resume Vault", count: dbResumes.length > 0 ? dbResumes.length : null, icon: Upload },
    { id: "chat", label: "AI Assistant", count: null, icon: MessageSquare },
    { id: "analytics", label: "Insights", count: null, icon: BarChart3 },
    { id: "workflows", label: "Workflows", count: 7, icon: Bolt },
    { id: "platforms", label: "Platforms", count: null, icon: Globe },
    { id: "settings", label: "Settings", count: null, icon: SettingsIcon },
  ];

  return (
    <div className="bg-[#0a0d14] text-[#e8eaf0] min-h-screen flex font-sans antialiased text-sm">
      
      {/* SIDEBAR NAVIGATION PANEL */}
      <aside className="w-60 bg-[#111520] border-r border-white/5 flex flex-col fixed left-0 top-0 bottom-0 z-50 overflow-y-auto">
        <div className="p-5 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight block">AutoApply</span>
            <span className="text-[10px] text-[#555d73] uppercase tracking-widest font-semibold block -mt-0.5">AI Jobs Engine</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navMenus.map((menu) => {
            const IconComp = menu.icon;
            const matchesActive = activeTab === menu.id;
            return (
              <button
                key={menu.id}
                id={`nav-${menu.id}`}
                onClick={() => setActiveTab(menu.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-left transition duration-100 ${
                  matchesActive 
                    ? 'bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/15' 
                    : 'text-[#8b92a8] hover:text-[#e8eaf0] hover:bg-[#181e2e]'
                }`}
              >
                <IconComp className="w-4 h-4 shrink-0" />
                <span className="text-xs">{menu.label}</span>
                {menu.count !== null && (
                  <span className={`ml-auto font-mono text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    matchesActive ? 'bg-blue-500 text-white' : 'bg-[#181e2e] text-[#555d73]'
                  }`}>
                    {menu.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Running status daemon indicator */}
        <div className="p-4 border-t border-white/5">
          <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div>
              <span className="text-xs text-emerald-400 block font-bold leading-none">AI Agent Active</span>
              <span className="text-[10px] text-[#555d73] block mt-0.5 font-medium">Scans active: Every 30s</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER STREAM */}
      <div className="pl-60 flex-1 flex flex-col min-h-screen">
        
        {/* TOPBAR BANNER */}
        <header className="h-14 bg-[#111520]/80 border-b border-white/5 sticky top-0 backdrop-blur-md flex items-center justify-between px-6 z-40">
          <div className="flex items-center gap-2">
            <h2 className="text-xs uppercase tracking-widest font-extrabold text-[#555d73]">{activeTab} Workstation</h2>
            <span className="text-white/10">/</span>
            <span className="text-xs text-[#8b92a8] font-medium font-mono text-indigo-400">moinshaik.consulting@gmail.com</span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleForceCleanupIndex}
              className="bg-[#181e2e] hover:bg-slate-800 text-[11px] font-semibold text-slate-300 px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
              title="Force file vault background cron agent to scan"
            >
              <RefreshCw className="w-3 h-3 text-sky-400 animate-spin-hover" />
              Force Cleanup Cycle
            </button>
            <div className="w-7 h-7 bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 rounded-full flex items-center justify-center font-bold text-xs">
              MS
            </div>
          </div>
        </header>

        {/* INTERNAL VIEW WORKSPACE */}
        <main className="flex-1 p-6 flex flex-col gap-6">

          {/* Feedback alerts banner */}
          {alertMessage && (
            <div className={`p-4 rounded-xl flex items-center gap-3 border transition-all duration-300 ${
              alertMessage.type === 'success' 
                ? 'bg-emerald-500/5 border-emerald-400/20 text-emerald-300' 
                : 'bg-red-500/5 border-red-400/20 text-red-300'
            }`}>
              {alertMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              )}
              <span className="text-xs font-semibold">{alertMessage.text}</span>
              <button 
                onClick={() => setAlertMessage(null)}
                className="ml-auto font-bold opacity-60 hover:opacity-100 text-xs text-white/50 bg-[#181e2e] p-1 rounded-md"
              >
                ×
              </button>
            </div>
          )}

          {/* VIEW: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="flex flex-col gap-6">
              
              {/* Operational Stat Counters */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div onClick={() => setActiveTab("jobs")} className="bg-[#111520] border border-white/5 hover:border-blue-500/30 p-4 rounded-xl flex items-center gap-4 transition duration-150 cursor-pointer">
                  <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#555d73] uppercase tracking-wider font-extrabold block">Jobs Indexed</span>
                    <span className="text-2xl font-bold font-mono tracking-tight text-white block mt-0.5">247</span>
                    <span className="text-[9px] text-[#22c87a] font-bold block mt-1">↑ +38 added today</span>
                  </div>
                </div>

                <div onClick={() => setActiveTab("applications")} className="bg-[#111520] border border-white/5 hover:border-emerald-500/30 p-4 rounded-xl flex items-center gap-4 transition duration-150 cursor-pointer">
                  <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#555d73] uppercase tracking-wider font-extrabold block">Applications Paid</span>
                    <span className="text-2xl font-bold font-mono tracking-tight text-white block mt-0.5">{appHistory.length}</span>
                    <span className="text-[9px] text-[#22c87a] font-bold block mt-1">↑ Active tracking enabled</span>
                  </div>
                </div>

                <div onClick={() => setActiveTab("resume")} className="bg-[#111520] border border-white/5 hover:border-indigo-500/30 p-4 rounded-xl flex items-center gap-4 transition duration-150 cursor-pointer">
                  <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#555d73] uppercase tracking-wider font-extrabold block">Active Resumes</span>
                    <span className="text-2xl font-bold font-mono tracking-tight text-white block mt-0.5">{sysStats.activeCount}</span>
                    <span className="text-[9px] text-blue-400 inline-block bg-blue-500/10 px-1 py-0.5 rounded font-mono font-bold mt-1">Files filesystem storage</span>
                  </div>
                </div>

                <div onClick={() => setActiveTab("workflows")} className="bg-[#111520] border border-white/5 hover:border-rose-500/30 p-4 rounded-xl flex items-center gap-4 transition duration-150 cursor-pointer">
                  <div className="w-10 h-10 bg-rose-500/10 text-rose-450 rounded-lg flex items-center justify-center">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#555d73] uppercase tracking-wider font-extrabold block">Decayed Disks Wipes</span>
                    <span className="text-2xl font-bold font-mono tracking-tight text-rose-400 block mt-0.5">{sysStats.deletedCount}</span>
                    <span className="text-[9px] text-rose-400 font-bold block mt-1">✓ Storage freed: {bytesToStr(sysStats.totalSpaceFreed)}</span>
                  </div>
                </div>
              </div>

              {/* Bento Split Layout: Application Chart vs Agents List */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Visual Activity Tracker */}
                <div className="lg:col-span-8 bg-[#111520] border border-white/5 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-blue-500" />
                        Application Volume Trends
                      </h3>
                      <p className="text-[11px] text-[#8b92a8] mt-0.5">Visually tracking daily automated agent submissions over the last 12 days</p>
                    </div>
                  </div>

                  {/* Clean responsive visual SVG Graph */}
                  <div className="w-full h-44 bg-[#0a0d14]/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                    <div className="flex-1 flex items-end justify-between gap-2.5 pt-2">
                      {[3, 5, 8, 6, 11, 14, 7, 10, 12, 9, 13, 14].map((v, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group select-none">
                          <span className="text-[9px] font-mono font-bold text-blue-400 opacity-0 group-hover:opacity-100 transition duration-100">
                            {v}
                          </span>
                          <div 
                            style={{ height: `${(v / 16) * 100}%` }} 
                            className="w-full rounded-t bg-gradient-to-t from-blue-600/30 to-blue-500 group-hover:to-blue-400 group-hover:scale-x-105 transition-all duration-150 min-h-[4px]"
                          />
                          <span className="text-[9px] text-[#555d73] font-semibold border-t border-white/5 w-full text-center pt-1.5 font-mono">
                            {i + 1} Jun
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Automation Agents Monitor status panel */}
                <div className="lg:col-span-4 bg-[#111520] border border-white/5 rounded-xl p-5">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3.5">Workflow Agents Core</span>
                  
                  <div className="flex flex-col gap-3">
                    <div className="p-2.5 bg-[#181e2e]/50 border border-white/5 rounded-lg flex items-center gap-3">
                      <div className="w-7 h-7 bg-emerald-500/10 text-emerald-400 rounded-md flex items-center justify-center">
                        <Search className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-white block">Job Discovery Scanners</span>
                        <span className="text-[10px] text-[#8b92a8] truncate block">Scanning 14 platforms recursively</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">ACTIVE</span>
                    </div>

                    <div className="p-2.5 bg-[#181e2e]/50 border border-white/5 rounded-lg flex items-center gap-3">
                      <div className="w-7 h-7 bg-indigo-500/10 text-indigo-400 rounded-md flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-white block">Resume Tailor Bot</span>
                        <span className="text-[10px] text-[#8b92a8] truncate block">Customizing CV parameters</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#8b92a8] bg-slate-800 px-2 py-0.5 rounded-full">SLEEP</span>
                    </div>

                    <div className="p-2.5 bg-[#181e2e]/50 border border-white/5 rounded-lg flex items-center gap-3">
                      <div className="w-7 h-7 bg-rose-500/10 text-rose-400 rounded-md flex items-center justify-center">
                        <Trash2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-white block">Pruner Daemon</span>
                        <span className="text-[10px] text-rose-400 truncate block">Purges expired disks traces</span>
                      </div>
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full font-mono">30s Scan</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Applications table grid */}
              <div className="bg-[#111520] border border-white/5 rounded-xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Recent Dispatched Submissions</h3>
                  </div>
                  <button onClick={() => setActiveTab("applications")} className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer">
                    Manage Tracker ({appHistory.length})
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="py-2.5 text-xs text-[#555d73] uppercase tracking-wider font-extrabold w-1/4">Role Profile</th>
                        <th className="py-2.5 text-xs text-[#555d73] uppercase tracking-wider font-extrabold w-1/4">Company</th>
                        <th className="py-2.5 text-xs text-[#555d73] uppercase tracking-wider font-extrabold w-1/6">Matching Rate</th>
                        <th className="py-2.5 text-xs text-[#555d73] uppercase tracking-wider font-extrabold w-1/6">Status</th>
                        <th className="py-2.5 text-xs text-[#555d73] uppercase tracking-wider font-extrabold w-1/6 text-right">Applied</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {appHistory.slice(0, 4).map((app, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.01]">
                          <td className="py-3 text-xs font-bold text-white">{app.position}</td>
                          <td className="py-3 text-xs text-[#8b92a8]">{app.company}</td>
                          <td className="py-3 text-xs font-mono font-bold text-emerald-400 select-none">
                            {idx === 0 ? "94%" : idx === 1 ? "91%" : idx === 2 ? "88%" : "86%"} Match
                          </td>
                          <td className="py-3 text-xs font-semibold">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                              app.status === "Interview" ? "bg-amber-500/10 text-amber-400" :
                              app.status === "Rejected" ? "bg-rose-500/10 text-rose-400" :
                              "bg-blue-500/10 text-blue-400"
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="py-3 text-xs text-[#8b92a8] text-right font-mono font-medium">{app.appliedDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: JOB DISCOVERY */}
          {activeTab === "jobs" && (
            <div className="flex flex-col gap-5">
              
              {/* Custom Search & Filters Panel */}
              <div className="bg-[#111520] border border-white/5 rounded-xl p-4 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555d73]" />
                  <input 
                    type="text" 
                    placeholder="Search roles, organizations, target skills..."
                    value={jobSearchQuery}
                    onChange={(e) => setJobSearchQuery(e.target.value)}
                    className="w-full bg-[#0a0d14] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-[#555d73] focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>

                <select 
                  value={jobPlatformFilter}
                  onChange={(e) => setJobPlatformFilter(e.target.value)}
                  className="bg-[#111520] border border-white/10 rounded-lg px-3 py-2 text-xs font-semibold text-[#c8cbd9]"
                >
                  <option>All Platforms</option>
                  <option>LinkedIn</option>
                  <option>Indeed</option>
                  <option>Braintrust</option>
                  <option>Arc.dev</option>
                  <option>Upwork</option>
                </select>

                <select
                  value={jobScoreFilter}
                  onChange={(e) => setJobScoreFilter(e.target.value)}
                  className="bg-[#111520] border border-white/10 rounded-lg px-3 py-2 text-xs font-semibold text-[#c8cbd9]"
                >
                  <option>Score: Any</option>
                  <option>75%+ Match</option>
                  <option>85%+ Match</option>
                  <option>90%+ Match</option>
                </select>

                <button 
                  onClick={() => {
                    setJobSearchQuery("");
                    setJobPlatformFilter("All Platforms");
                    setJobScoreFilter("Score: Any");
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>

              {/* Main Job Split Layout: Left side selection List vs Right side Job Detail */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Selection Deck */}
                <div className="lg:col-span-6 flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
                  {getFilteredJobs().length === 0 ? (
                    <div className="bg-[#111520] border border-dashed border-white/10 rounded-xl p-10 text-center text-[#555d73]">
                      <Briefcase className="w-10 h-10 mx-auto mb-2 text-[#555d73]" />
                      <span className="font-bold text-xs text-[#8b92a8]">No Jobs Match These Filters</span>
                      <p className="text-[11px] mt-1">Try relaxing your search terms or filters.</p>
                    </div>
                  ) : (
                    getFilteredJobs().map((job, idx) => {
                      const computedIndexInSource = activeJobs.findIndex(x => x.company === job.company && x.title === job.title);
                      const isSelected = computedIndexInSource === selectedJobIndex;
                      return (
                        <div 
                          key={idx}
                          id={`job-card-${idx}`}
                          onClick={() => setSelectedJobIndex(computedIndexInSource)}
                          className={`p-4 rounded-xl border transition-all duration-100 cursor-pointer flex flex-col gap-2.5 ${
                            isSelected 
                              ? 'bg-[#181e2e]/70 border-blue-500/50 shadow-sm' 
                              : 'bg-[#111520] border-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="text-xs font-bold text-white block">{job.title}</h4>
                              <span className="text-[11px] text-[#8b92a8] mt-0.5 block">{job.company} · {job.country}</span>
                            </div>

                            {/* Score circular badge */}
                            <span className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded ${
                              job.score >= 88 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-400/20' : 'bg-blue-500/10 text-blue-400 border border-blue-400/10'
                            }`}>
                              {job.score}% Match
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="bg-[#181e2e] text-[#555d73] px-2 py-0.5 rounded text-[10px] font-bold border border-white/5">{job.platform}</span>
                            <span className="bg-[#181e2e] text-[#555d73] px-2 py-0.5 rounded text-[10px] font-bold border border-white/5">{job.type}</span>
                            <span className="bg-[#181e2e] text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold border border-white/5">{job.salary}</span>
                          </div>

                          <p className="text-[11px] text-[#8b92a8] line-clamp-2 mt-1 italic font-medium leading-relaxed">
                            "{job.desc}"
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Active Job Detail display */}
                <div className="lg:col-span-6">
                  {getFilteredJobs().length > 0 && selectedJobIndex >= 0 && selectedJobIndex < activeJobs.length ? (
                    <div className="bg-[#111520] border border-white/5 rounded-xl p-5 flex flex-col gap-4 sticky top-20" id="selected-job-details">
                      
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="text-sm font-black text-white">{activeJobs[selectedJobIndex].title}</h3>
                            <span className="text-xs text-[#8b92a8] mt-1 block font-semibold">{activeJobs[selectedJobIndex].company} · {activeJobs[selectedJobIndex].country} · {activeJobs[selectedJobIndex].type}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-400">{activeJobs[selectedJobIndex].posted}</span>
                        </div>

                        <div className="flex items-center gap-2 mt-3.5 flex-wrap">
                          <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded font-bold border border-emerald-400/10">Match Rate: {activeJobs[selectedJobIndex].score}%</span>
                          <span className="bg-[#181e2e] text-indigo-400 text-xs px-2.5 py-1 rounded font-bold border border-white/5">{activeJobs[selectedJobIndex].salary}</span>
                          <span className="bg-[#181e2e] text-[#8b92a8] text-xs px-2.5 py-1 rounded font-bold border border-white/5">{activeJobs[selectedJobIndex].platform}</span>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-4">
                        <span className="text-[10px] text-[#555d73] uppercase tracking-wider font-extrabold block mb-2">Job Description Context</span>
                        <p className="text-xs text-[#8b92a8] leading-relaxed italic">
                          "{activeJobs[selectedJobIndex].desc}"
                        </p>
                      </div>

                      <div className="border-t border-white/5 pt-4">
                        <span className="text-[10px] text-[#555d73] uppercase tracking-wider font-extrabold block mb-2">Required Core Stack</span>
                        <div className="flex flex-wrap gap-1.5 focus:outline-none select-none">
                          {activeJobs[selectedJobIndex].tags.map((tag, i) => (
                            <span key={i} className="bg-blue-500/10 text-blue-400 rounded-full px-2.5 py-0.5 text-[10px] font-bold border border-blue-500/10">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-4 flex gap-3">
                        <button 
                          onClick={() => handleApplyNow(activeJobs[selectedJobIndex], selectedJobIndex)}
                          className="flex-1 bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold py-2.5 rounded-lg border border-blue-600/20 cursor-pointer shadow-md select-none transition select-none active:scale-98"
                        >
                          🚀 Express Apply with AI Customizer
                        </button>
                        
                        <button 
                          onClick={() => {
                            setPropRole(activeJobs[selectedJobIndex].title);
                            setPropJD(activeJobs[selectedJobIndex].desc);
                            setPropPlatform(activeJobs[selectedJobIndex].platform);
                            setActiveTab("proposals");
                          }}
                          className="bg-[#181e2e] hover:bg-slate-800 text-xs font-bold text-indigo-400 border border-white/5 px-4 py-2 rounded-lg cursor-pointer transition select-none flex items-center gap-1 active:scale-98"
                          title="Generate a custom proposal instantly"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Build Proposal
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>

              </div>
            </div>
          )}

          {/* VIEW: APPLICATIONS TRACKER */}
          {activeTab === "applications" && (
            <div className="bg-[#111520] border border-white/5 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex justify-between items-center z-10">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">All Auto-Apply Dispatched Submissions</h3>
                  <p className="text-[11px] text-[#8b92a8] mt-0.5">Tracking responsive callbacks, interview queues, or follow-up milestones</p>
                </div>
                <button 
                  onClick={() => {
                    const csvRows = [
                      ["Company", "Position", "Country", "Salary", "Platform", "Applied Date", "CV Used", "Status"],
                      ...appHistory.map(a => [a.company, a.position, a.country, a.salary, a.platform, a.appliedDate, a.cvUsed, a.status])
                    ];
                    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", "AutoApply_Job_Applications.csv");
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    triggerFeedback("success", "Exported CSV successfully!");
                  }}
                  className="bg-[#181e2e] hover:bg-slate-800 text-xs font-bold text-[#c8cbd9] px-3.5 py-1.5 rounded-lg border border-white/5 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" /> Export Applications CSV
                </button>
              </div>

              <div className="overflow-x-auto mt-2">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="py-2.5 text-xs text-[#555d73] uppercase tracking-wider font-extrabold w-1/5">Context Group</th>
                      <th className="py-2.5 text-xs text-[#555d73] uppercase tracking-wider font-extrabold w-1/5">Designation</th>
                      <th className="py-2.5 text-xs text-[#555d73] uppercase tracking-wider font-extrabold w-1/12">Platform</th>
                      <th className="py-2.5 text-xs text-[#555d73] uppercase tracking-wider font-extrabold w-1/6">Custom CV Used</th>
                      <th className="py-2.5 text-xs text-[#555d73] uppercase tracking-wider font-extrabold w-1/12">Compensation</th>
                      <th className="py-2.5 text-xs text-[#555d73] uppercase tracking-wider font-extrabold w-1/12">Stage</th>
                      <th className="py-2.5 text-xs text-[#555d73] uppercase tracking-wider font-extrabold w-1/12">Dispatch</th>
                      <th className="py-2.5 text-xs text-[#555d73] uppercase tracking-wider font-extrabold w-1/12 text-right">Milestone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {appHistory.map((app, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.01]">
                        <td className="py-3 text-xs font-bold text-white">{app.company}</td>
                        <td className="py-3 text-xs text-[#8b92a8]">{app.position}</td>
                        <td className="py-3 text-xs">
                          <span className="bg-[#181e2e] text-[#8b92a8] rounded border border-white/5 px-2 py-0.5 text-[10px] font-bold">
                            {app.platform}
                          </span>
                        </td>
                        <td className="py-3 text-xs text-[#8b92a8] truncate max-w-[140px] font-mono" title={app.cvUsed}>
                          📁 {app.cvUsed}
                        </td>
                        <td className="py-3 text-xs font-semibold text-emerald-400 font-mono select-none">{app.salary}</td>
                        <td className="py-3 text-xs font-semibold">
                          <select 
                            value={app.status}
                            onChange={(e) => {
                              const newArr = [...appHistory];
                              newArr[idx].status = e.target.value as any;
                              setAppHistory(newArr);
                              triggerFeedback("success", `Updated application status for ${app.company} to ${e.target.value}.`);
                            }}
                            className="bg-[#181e2e] border border-white/10 rounded px-1.5 py-0.5 text-[11px] font-semibold text-slate-300"
                          >
                            <option>Applied</option>
                            <option>Interview</option>
                            <option>Rejected</option>
                            <option>Follow-up</option>
                          </select>
                        </td>
                        <td className="py-3 text-xs text-[#8b92a8] font-mono font-medium">{app.appliedDate}</td>
                        <td className="py-3 text-xs text-[#555d73] text-right font-semibold">{app.followUp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: PROPOSALS CUSTOMIZER */}
          {activeTab === "proposals" && (
            <div className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Proposal Inputs Form */}
                <div className="lg:col-span-5 bg-[#111520] border border-white/5 rounded-xl p-5 flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    Custom Prompt Proposal Generator
                  </h3>

                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-[10px] text-[#555d73] uppercase tracking-wider font-extrabold mb-1">Position / Role Profile</label>
                      <input 
                        type="text" 
                        value={propRole}
                        onChange={(e) => setPropRole(e.target.value)}
                        placeholder="e.g. Prompt Automation Lead"
                        className="w-full bg-[#0a0d14] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-[#555d73] uppercase tracking-wider font-extrabold mb-1">Platform Goal</label>
                        <select 
                          value={propPlatform}
                          onChange={(e) => setPropPlatform(e.target.value)}
                          className="w-full bg-[#0a0d14] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        >
                          <option>Upwork</option>
                          <option>LinkedIn</option>
                          <option>Braintrust</option>
                          <option>Freelancer</option>
                          <option>Email Outreach</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-[#555d73] uppercase tracking-wider font-extrabold mb-1">Tone & Format Style</label>
                        <select 
                          value={propTone}
                          onChange={(e) => setPropTone(e.target.value)}
                          className="w-full bg-[#0a0d14] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        >
                          <option>Professional & Technical</option>
                          <option>Consulting-Orientative</option>
                          <option>Results-Driven</option>
                          <option>Friendly & Approachable</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#555d73] uppercase tracking-wider font-extrabold mb-1">Job Description or Main Requirements</label>
                      <textarea 
                        value={propJD}
                        onChange={(e) => setPropJD(e.target.value)}
                        placeholder="Paste target job specification key guidelines..."
                        className="w-full h-24 bg-[#0a0d14] border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <button 
                      onClick={triggerProposalGenerator}
                      disabled={isGeneratingProposal}
                      className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold p-2.5 rounded-lg border border-blue-600/20 text-xs cursor-pointer shadow-md select-none transition select-none flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
                    >
                      {isGeneratingProposal ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Querying Gemini Server...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" /> Generate Tailored Cover Letter
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Proposal Result output panel */}
                <div className="lg:col-span-7 bg-[#111520] border border-white/5 rounded-xl p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-center z-10">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Custom Output Blueprint</span>
                    {generatedProposalText && (
                      <button 
                        onClick={() => copyToClipboardText(generatedProposalText)}
                        className="bg-[#181e2e] hover:bg-slate-800 text-[10px] font-bold text-blue-400 px-3 py-1 rounded-md border border-white/5 flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" /> Copy Material
                      </button>
                    )}
                  </div>

                  <div className="flex-1 bg-[#0a0d14]/40 border border-white/10 rounded-xl p-4 min-h-[300px] flex flex-col justify-center">
                    {generatedProposalText ? (
                      <pre className="text-xs text-[#c8cbd9] whitespace-pre-wrap leading-relaxed font-sans scroll-y-auto">
                        {generatedProposalText}
                      </pre>
                    ) : (
                      <div className="text-center py-10">
                        <Sparkles className="w-12 h-12 text-[#555d73] mx-auto mb-3" />
                        <h4 className="text-xs font-bold text-[#8b92a8]">Proposal Draft Awaiting Input</h4>
                        <p className="text-[11px] text-[#555d73] mt-1 max-w-sm mx-auto">
                          Fill in the parameter form and run the Gemini tool on the left to write a customized outreach template.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* VIEW: RESUME BUILDER & VAULT (FULL-STACK INTEGRATION) */}
          {activeTab === "resume" && (
            <div className="flex flex-col gap-6">
              
              {/* Segmented View Sub-Tabs */}
              <div className="flex bg-[#111520] border border-white/5 p-1 rounded-xl w-72">
                <button 
                  onClick={() => setActiveResumeVersionTab("active")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                    activeResumeVersionTab === "active" ? 'bg-blue-500 text-white shadow' : 'text-[#8b92a8] hover:text-white'
                  }`}
                >
                  Document Inventory ({dbResumes.length})
                </button>
                <button 
                  onClick={() => setActiveResumeVersionTab("next-guide")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                    activeResumeVersionTab === "next-guide" ? 'bg-blue-500 text-white shadow' : 'text-[#8b92a8] hover:text-white'
                  }`}
                >
                  Supabase & Next.js Guide
                </button>
              </div>

              {activeResumeVersionTab === "active" ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* UPLOADER DECK */}
                  <div className="lg:col-span-5 bg-[#111520] border border-white/5 rounded-xl p-5 flex flex-col gap-4">
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">Security Files Depositor</span>
                    
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block text-[10px] text-[#555d73] uppercase tracking-wider font-extrabold mb-1">Candidate Profile Name</label>
                        <input 
                          type="text" 
                          value={uploaderName}
                          onChange={(e) => setUploaderName(e.target.value)}
                          placeholder="Moin Shaik"
                          className="w-full bg-[#0a0d14] border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-[10px] text-[#555d73] uppercase tracking-wider font-extrabold">Auto-Purge Expiration Timer</label>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-[#181e2e] px-2 py-0.5 rounded border border-white/5">
                            {retentionDays === 0.00138 ? "2-min demo" : retentionDays === 0.0416 ? "1 Hour" : `${retentionDays} Days`}
                          </span>
                        </div>

                        {/* Segment Selection Grid */}
                        <div className="grid grid-cols-5 gap-1 bg-[#0a0d14] p-1 rounded-lg">
                          {[
                            { value: 0.00138, label: "2m demo" },
                            { value: 0.0416, label: "1 hour" },
                            { value: 1, label: "1 d" },
                            { value: 7, label: "7 d" },
                            { value: 15, label: "15 d" }
                          ].map((opt) => (
                            <button
                              key={opt.label}
                              type="button"
                              onClick={() => setRetentionDays(opt.value)}
                              className={`py-1 rounded text-[10px] font-extrabold tracking-tight transition duration-700 ${
                                retentionDays === opt.value ? 'bg-blue-500 text-white shadow' : 'text-[#8b92a8] hover:text-[#e8eaf0]'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Dropzone Wrapper */}
                      <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
                          isDragging 
                            ? 'border-blue-500 bg-blue-500/10 scale-98' 
                            : 'border-white/10 bg-[#0a0d14]/30 hover:bg-slate-900/40 hover:border-blue-500/30'
                        }`}
                      >
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          className="hidden" 
                          accept=".pdf,.docx,.doc,.xlsx,.png,.jpg,.txt"
                        />

                        {isUploading ? (
                          <div className="py-4">
                            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
                            <span className="text-xs font-bold text-white block">Securing on disk filesystem...</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-blue-400" />
                            <div>
                              <span className="text-xs text-white block font-bold">Select or drag & drop Resume File</span>
                              <span className="text-[10px] text-[#555d73] block mt-1">Supports PDF, DOCX, TXT (Maximum size: 15MB)</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ACTIVE DOCUMENTS DIRECTORY DECK */}
                  <div className="lg:col-span-7 bg-[#111520] border border-white/5 rounded-xl p-5 flex flex-col gap-4">
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">Active Files FS Directory</span>
                    
                    {dbResumes.length === 0 ? (
                      <div className="border border-dashed border-white/10 rounded-xl py-12 text-center text-[#555d73]">
                        <FileText className="w-10 h-10 mx-auto mb-2 text-[#555d73]" />
                        <h4 className="text-xs font-bold text-[#8b92a8]">Vault Directory Empty</h4>
                        <p className="text-[11px] text-[#555d73] mt-1 max-w-xs mx-auto">Upload candidate resumes using the left secure uploader files depositor to test live expirations.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto">
                        {dbResumes.map((resume) => {
                          const timerInfo = renderExpirationsString(resume.expiresAt);
                          return (
                            <div 
                              key={resume.id}
                              className="bg-[#0a0d14]/40 border border-white/5 p-3 rounded-lg flex items-center justify-between gap-4 hover:border-white/10 transition"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2 bg-slate-800 text-indigo-400 rounded-lg shrink-0">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <span className="text-xs text-white font-bold block truncate max-w-[190px]" title={resume.originalName}>
                                    {resume.originalName}
                                  </span>
                                  <span className="text-[10px] text-[#555d73] block mt-0.5">
                                    Size: {bytesToStr(resume.size)} · Owner: {resume.uploadedBy}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 shrink-0">
                                <div className="text-right">
                                  <div className="flex items-center gap-1 text-[11px] font-bold justify-end">
                                    <Clock className={`w-3.5 h-3.5 ${timerInfo.urgent ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`} />
                                    <span className={timerInfo.urgent ? 'text-rose-400' : 'text-emerald-400'}>
                                      {timerInfo.msg}
                                    </span>
                                  </div>
                                  <span className="text-[9px] text-[#555d73] block">Expiry schedule</span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button 
                                    onClick={() => handleDownload(resume.id, resume.originalName)}
                                    className="p-1.5 bg-[#181e2e] text-blue-400 hover:text-white rounded border border-white/5 transition"
                                    title="Download File securely via back-end proxy stream"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </button>
                                  
                                  <button 
                                    onClick={() => handleDeleteResume(resume.id, resume.originalName)}
                                    className="p-1.5 bg-[#181e2e] text-rose-400 hover:text-white rounded border border-white/5 transition"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="border-t border-white/5 pt-3.5">
                      <span className="text-[10px] text-[#555d73] uppercase tracking-wider font-extrabold block mb-2">ATS Keywords CV Optimizer</span>
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        <div className="lg:col-span-5 flex flex-col gap-2">
                          <textarea 
                            value={atsJD}
                            onChange={(e) => setAtsJD(e.target.value)}
                            placeholder="Paste job description..."
                            className="bg-slate-900 border border-white/10 rounded-lg p-2 text-xs text-slate-300 h-24 focus:outline-none"
                          />
                          <button 
                            onClick={triggerATSAnalysis}
                            disabled={isAnalyzingATS}
                            className="bg-blue-500 hover:bg-blue-400 text-white font-bold p-2 rounded-lg text-[10px] transition shrink-0 cursor-pointer text-center"
                          >
                            {isAnalyzingATS ? "Parsing..." : "Extract ATS Keywords"}
                          </button>
                        </div>
                        <div className="lg:col-span-7 bg-[#0a0d14]/40 p-3 rounded-lg border border-white/5 flex flex-col gap-2">
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-[#8b92a8]">Expected Match Score</span>
                            <span className="text-emerald-400 font-mono">{atsMatchScore}%</span>
                          </div>
                          <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-400 h-full rounded-full transition-all duration-300" style={{ width: `${atsMatchScore}%` }} />
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mt-1">
                            {atsKeywords.map((kw, i) => (
                              <span key={i} className="text-[9px] bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded border border-amber-400/15">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                /* Next.js Supabase integration blueprints cards */
                <div className="bg-[#111520] border border-white/5 rounded-xl p-5 flex flex-col gap-4">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                      Next.js Api Routing & Supabase S3 Bucket Cleaners
                    </h3>
                    <p className="text-[11px] text-[#8b92a8] mt-1">Implement this exact serverless route script daily using Vercel cron jobs for free.</p>
                  </div>

                  <div className="relative">
                    <pre className="bg-[#0a0d14] text-slate-300 text-[10px] font-mono p-4 rounded-xl overflow-x-auto max-h-[300px] leading-relaxed">
{`// app/api/cleanup/route.ts
// Next.js Route Handler for Automated DB and Storage Deletion after 15 days
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key deletes files directly
);

export async function GET() {
  try {
    const expiredCutoff = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString();
    
    // 1. Fetch expired resumes metadata from Postgres table
    const { data: records } = await supabase
      .from('resumes')
      .select('id, storage_path')
      .lt('expires_at', expiredCutoff);

    if (!records || records.length === 0) {
      return NextResponse.json({ message: "S3 Clean: No obsolete datasets." });
    }

    const filePaths = records.map(r => r.storage_path);

    // 2. Remove physical files assets from S3 bucket
    await supabase.storage.from('resumes-vault').remove(filePaths);

    // 3. Purge DB Row index traces
    await supabase.from('resumes').delete().in('id', records.map(r => r.id));

    return NextResponse.json({ success: true, purged: records.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}`}
                    </pre>
                    <button 
                      onClick={() => copyToClipboardText(`import { NextResponse } from 'next/server';`)}
                      className="absolute top-2.5 right-2.5 bg-slate-800 text-xs px-2.5 py-1 text-indigo-400 font-bold hover:text-white rounded border border-white/5 cursor-pointer active:scale-95"
                    >
                      Copy Logic Block
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW: AI ASSISTANT PANEL */}
          {activeTab === "chat" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
              
              {/* Chat Interface */}
              <div className="lg:col-span-8 bg-[#111520] border border-white/5 rounded-xl p-5 flex flex-col min-h-[450px]">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-emerald-400" />
                      Gemini Career Architect Co-Pilot
                    </h3>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-400 font-mono tracking-tight bg-emerald-400/10 px-2 py-0.5 rounded-full select-none">
                    Grounded with your CV Context
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto py-4 space-y-4 max-h-[300px] pr-1">
                  {chatMessages.map((msg, i) => (
                    <div 
                      key={i}
                      className={`flex gap-3 max-w-[85%] ${
                        msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs select-none shrink-0 ${
                        msg.sender === "user" ? "bg-blue-500 text-white" : "bg-indigo-500/10 text-indigo-400 border border-[#181e2e]"
                      }`}>
                        {msg.sender === "user" ? "MS" : "AI"}
                      </div>
                      
                      <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                        msg.sender === "user" 
                          ? 'bg-blue-500/10 border-blue-500/20 text-[#e8eaf0]' 
                          : 'bg-[#181e2e] border-white/5 text-[#c8cbd9]'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {isSendingChat && (
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="w-7 h-7 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center font-bold text-xs animate-pulse font-mono">
                        AI
                      </div>
                      <div className="p-3 bg-[#181e2e]/55 border border-white/5 rounded-xl text-xs text-slate-500 italic flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" /> Gemini is parsing and thinking...
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/5 pt-4 flex gap-2">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                    placeholder="Ask Gemini to write an invitation letter, review interview prep, or optimize a CV..."
                    className="flex-1 bg-[#0a0d14] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <button 
                    onClick={handleSendChatMessage}
                    className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2.5 rounded-lg border border-blue-600/20 text-xs font-bold cursor-pointer transition select-none flex items-center justify-center active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Sidebar helper shortcuts */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="bg-[#111520] border border-white/5 rounded-xl p-5">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3.5">AI Rapid Actions</span>
                  
                  <div className="flex flex-col gap-2">
                    {[
                      { l: "Upwork AI consultant bid cover letter", p: "Please help me write an Upwork proposal draft outline for an enterprise AI Consultant engagement where the focus is n8n pipelines." },
                      { l: "Simulate top MLOps interview questions", p: "Draft list of 3 tough interview questions focusing on workflow automation, MLOps, and Power BI DAX database designs. Provide recommended outlines to answer." },
                      { l: "Optimize my LinkedIn headline profile", p: "Provide ideas to write an outstanding LinkedIn headline emphasizing Prompt Engineering, AI Consulting and n8n." },
                      { l: "Identify Snowflake vs dbt skill gaps", p: "Compare standard skill gaps for a Senior AI Consultant dealing with data pipelines using Snowflake and dbt." }
                    ].map((opt, i) => (
                      <button 
                        key={i}
                        onClick={() => handleQuickAssistantChoice(opt.p)}
                        className="w-full bg-[#181e2e] hover:bg-[#1e2638] text-[#8b92a8] hover:text-white border border-white/5 p-2 rounded-lg text-left text-[11px] font-semibold transition"
                      >
                        ⚡ {opt.l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-[#111520] border border-white/5 rounded-xl p-5">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2.5">Candidate Match Strengths</span>
                  
                  <div className="space-y-3 mt-3">
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-[#8b92a8]">Automation engineering compatibility</span>
                        <span className="text-emerald-400 font-mono">91%</span>
                      </div>
                      <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden mt-1">
                        <div className="bg-emerald-400 h-full rounded-full transition-all duration-300" style={{ width: "91%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-[#8b92a8]">Functional consulting pitch rate</span>
                        <span className="text-indigo-400 font-mono">82%</span>
                      </div>
                      <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden mt-1">
                        <div className="bg-indigo-400 h-full rounded-full transition-all duration-300" style={{ width: "82%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-[#8b92a8]">Analytical dashboard design</span>
                        <span className="text-[#a78bfa] font-mono">75%</span>
                      </div>
                      <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden mt-1">
                        <div className="bg-[#a78bfa] h-full rounded-full transition-all duration-300" style={{ width: "75%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* VIEW: INSIGHTS & ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="flex flex-col gap-6">
              
              <div className="grid grid-[#111520] grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Platform Application ratio */}
                <div className="bg-[#111520] border border-white/5 rounded-xl p-5">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3.5">Applications by Platform Channel</span>
                  
                  {/* Clean percentage charts deck */}
                  <div className="space-y-3.5 mt-2">
                    {[
                      { p: "Upwork", pct: "32%", count: "32 files", color: "bg-emerald-500" },
                      { p: "LinkedIn Jobs", pct: "28%", count: "28 files", color: "bg-blue-500" },
                      { p: "Indeed Tracker", pct: "15%", count: "15 files", color: "bg-sky-500" },
                      { p: "Braintrust Premium", pct: "8%", count: "8 files", color: "bg-violet-500" },
                      { p: "Other channels", pct: "6%", count: "6 files", color: "bg-slate-500" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                          <span className="text-[#c8cbd9] font-medium">{item.p}</span>
                        </div>
                        <div className="flex items-center gap-3 font-mono">
                          <span className="text-[#8b92a8] text-[10px]">{item.count}</span>
                          <span className="text-white font-bold">{item.pct}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Demands Skills mapping */}
                <div className="bg-[#111520] border border-white/5 rounded-xl p-5">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3.5">In-Demand Skills Matching</span>
                  
                  <div className="space-y-3.5 mt-2">
                    {[
                      { skill: "Prompt Engineering", value: 89, color: "bg-blue-500" },
                      { skill: "n8n Workflow Design", value: 76, color: "bg-emerald-500" },
                      { skill: "Power BI / DAX Layouts", value: 68, color: "bg-indigo-500" },
                      { skill: "Claude API integrations", value: 61, color: "bg-[#a78bfa]" },
                      { skill: "LLM tuning parameters", value: 54, color: "bg-sky-500" }
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between items-center text-[11px] font-bold">
                          <span className="text-[#c8cbd9] font-medium">{item.skill}</span>
                          <span className="font-mono text-white text-[10px]">{item.value} openings</span>
                        </div>
                        <div className="w-full bg-[#0a0d14]/40 h-1.5 rounded-full overflow-hidden">
                          <div style={{ width: `${(item.value / 100) * 100}%` }} className={`h-full rounded-full ${item.color}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Response rate trends */}
                <div className="bg-[#111520] border border-white/5 rounded-xl p-5">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block mb-4 animate-pulse-slow">Response Rate Callback Trends</span>
                  
                  <div className="bg-[#0a0d14]/30 border border-white/5 rounded-xl p-4 flex flex-col justify-between h-40">
                    <div className="flex-grow flex items-end justify-between gap-3">
                      {[12, 15, 18, 19, 23, 26].map((rate, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">{rate}%</span>
                          <div style={{ height: `${(rate / 30) * 100}%` }} className="w-full rounded-t bg-gradient-to-t from-emerald-600/30 to-emerald-400 max-h-[80px]" />
                          <span className="text-[10px] text-[#555d73] font-bold font-mono">Wk {i + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* VIEW: WORKFLOWS */}
          {activeTab === "workflows" && (
            <div className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Active Workflows list toggles */}
                <div className="lg:col-span-6 bg-[#111520] border border-white/5 rounded-xl p-5 flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Configure Automation Daemon Actions</h3>

                  <div className="flex flex-col gap-3">
                    {workflowsList.map((wf, idx) => (
                      <div key={idx} className="p-3 bg-[#181e2e]/50 border border-white/5 rounded-lg flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 bg-slate-800 text-indigo-400 rounded-lg shrink-0`}>
                            <Bolt className="w-4 h-4 text-blue-400" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">{wf.name}</span>
                            <span className="text-[10px] text-[#8b92a8] mt-0.5 block">{wf.desc}</span>
                          </div>
                        </div>

                        {/* Custom switch slider */}
                        <div 
                          onClick={() => {
                            const newWf = [...workflowsList];
                            newWf[idx].on = !newWf[idx].on;
                            setWorkflowsList(newWf);
                            triggerFeedback("success", `Turned ${wf.name} ${newWf[idx].on ? 'ON' : 'OFF'}`);
                          }}
                          className={`w-9 h-5 rounded-full p-0.5 cursor-pointer transition ${
                            wf.on ? 'bg-blue-500' : 'bg-[#0a0d14] border border-white/10'
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full bg-white transition transform ${
                            wf.on ? 'translate-x-4' : 'translate-x-0'
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Server logs panel (DIRECT INVENTORY METADATA FROM CRUD EXPRESS SYSTEM) */}
                <div className="lg:col-span-6 bg-[#111520] border border-white/5 rounded-xl p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-center z-10">
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Express Cron Purges Daemon Logs</h3>
                      <p className="text-[11px] text-[#8b92a8] mt-0.5">Real-time reports detailing deleted assets and metadata purges</p>
                    </div>
                    <button 
                      onClick={fetchInventory}
                      className="p-1 px-2.5 bg-[#181e2e] text-[#8b92a8] hover:text-white border border-white/5 rounded text-[11px] font-bold cursor-pointer"
                    >
                      Refresh Logs
                    </button>
                  </div>

                  <div className="flex-1 bg-[#0a0d14]/40 border border-white/10 rounded-xl p-4 min-h-[350px] overflow-y-auto space-y-3">
                    {sysLogs.length === 0 ? (
                      <div className="text-center py-12 text-[#555d73] self-center">
                        <Clock className="w-10 h-10 mx-auto mb-2 text-[#555d73]" />
                        <h4 className="text-xs font-bold text-[#8b92a8]">No Purge Runs Yet</h4>
                        <p className="text-[11px] text-[#555d73] mt-1 max-w-xs mx-auto">
                          Upload files under '2m demo' or click 'Force Cleanup' to simulate background worker sweeps.
                        </p>
                      </div>
                    ) : (
                      sysLogs.map((log) => (
                        <div key={log.id} className="p-3 bg-[#181e2e]/40 border border-white/5 rounded-lg flex flex-col gap-2">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className={`px-2 py-0.5 rounded font-black font-mono tracking-tight uppercase ${
                              log.type === "auto" ? "bg-blue-500/10 text-blue-400" : "bg-emerald-500/10 text-emerald-400"
                            }`}>
                              {log.type === "auto" ? "🤖 Sched Cron" : "👤 Manual Overrule"}
                            </span>
                            <span className="text-[#555d73] font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                          </div>

                          <p className="text-xs text-[#c8cbd9] italic font-medium leading-relaxed bg-[#0a0d14]/50 p-2 rounded border border-white/5">
                            {log.details}
                          </p>

                          <div className="flex justify-between items-center text-[10px] font-mono font-bold text-[#8b92a8]">
                            <span>Files pruned: <span className="text-white font-mono">{log.resumesDeletedCount}</span></span>
                            <span>Freed disk space: <span className="text-emerald-400 font-mono">+{bytesToStr(log.freedBytes)}</span></span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* VIEW: PLATFORMS */}
          {activeTab === "platforms" && (
            <div className="bg-[#111520] border border-white/5 rounded-xl p-5 flex flex-col gap-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">Integrated Platforms Accounts</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                {platformsList.map((plat, idx) => (
                  <div key={idx} className="p-4 bg-[#181e2e]/50 border border-white/5 rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-white block">{plat.name}</span>
                      <span className="text-[10px] text-[#8b92a8] block mt-1">
                        {plat.status === "Connected" ? `${plat.apps} applications tracked` : "Disconnected"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        plat.status === "Connected" ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-[#8b92a8]'
                      }`}>
                        {plat.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: SETTINGS */}
          {activeTab === "settings" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Profile setup details */}
              <div className="lg:col-span-6 bg-[#111520] border border-white/5 rounded-xl p-5 flex flex-col gap-4">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">Candidate settings profile</span>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-[10px] text-[#555d73] uppercase tracking-wider font-extrabold mb-1">Full Legal Name</label>
                    <input 
                      type="text" 
                      value={settingName}
                      onChange={(e) => setSettingName(e.target.value)}
                      className="w-full bg-[#0a0d14] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#555d73] uppercase tracking-wider font-extrabold mb-1">Target Designations (Comma delimited)</label>
                    <input 
                      type="text" 
                      value={settingRoles}
                      onChange={(e) => setSettingRoles(e.target.value)}
                      className="w-full bg-[#0a0d14] border border-white/10 rounded-lg px-3 py-2 text-xs text-indigo-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-[#555d73] uppercase tracking-wider font-extrabold mb-1">Target Annual Base Sal (USD)</label>
                      <input 
                        type="number" 
                        value={settingMinSalary}
                        onChange={(e) => setSettingMinSalary(parseInt(e.target.value) || 0)}
                        className="w-full bg-[#0a0d14] border border-white/10 rounded-lg px-3 py-2 text-xs text-emerald-400 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#555d73] uppercase tracking-wider font-extrabold mb-1">Max Daily Dispatch Limit</label>
                      <input 
                        type="number" 
                        value={settingLimit}
                        onChange={(e) => setSettingLimit(parseInt(e.target.value) || 0)}
                        className="w-full bg-[#0a0d14] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[10px] font-extrabold text-[#555d73] uppercase tracking-wider mb-1">
                      <span>Minimum Job Match Alert Threshold</span>
                      <span className="text-blue-400 font-mono">{minMatchThreshold}% Match</span>
                    </div>
                    <input 
                      type="range" 
                      min="60" 
                      max="95" 
                      value={minMatchThreshold}
                      onChange={(e) => setMinMatchThreshold(parseInt(e.target.value))}
                      className="w-full accent-blue-500 bg-[#0a0d14] rounded-lg cursor-pointer"
                    />
                  </div>

                  <button 
                    onClick={() => {
                      setUploaderName(settingName);
                      triggerFeedback("success", "Profile settings saved recursively!");
                    }}
                    className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg mt-2 text-xs cursor-pointer select-none transition select-none flex items-center justify-center gap-1 shadow active:scale-95"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>

              {/* API and secrets keys references block */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="bg-[#111520] border border-white/5 rounded-xl p-5">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">Credential tokens vault</span>
                  
                  <div className="space-y-3 mt-3">
                    <div>
                      <label className="block text-[10px] text-[#555d73] uppercase tracking-wider font-extrabold mb-1">Gemini / Google AI API Key Token</label>
                      <input 
                        type="password" 
                        value="••••••••••••••••••••••••" 
                        disabled
                        className="w-full bg-[#0a0d14] border border-white/5 rounded-lg px-3 py-2 text-xs text-[#555d73] cursor-not-allowed select-none"
                      />
                      <p className="text-[10px] text-[#555d73] mt-2 leading-relaxed">
                        ℹ️ This full-stack container automatically parses and injects your Gemini keys server-side from your workspace secrets. You do not need to enter credentials in form builders.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#555d73] uppercase tracking-wider font-extrabold mb-1">LinkedIn Client Callback Secrets</label>
                      <input 
                        type="password" 
                        placeholder="OAuth token disabled"
                        className="w-full bg-[#0a0d14] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#111520] border border-white/5 rounded-xl p-5 flex flex-col gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block mb-1">System parameters diagnostic</span>
                  
                  <div className="flex justify-between items-center text-xs text-[#8b92a8] border-b border-white/5 py-1.5 font-medium">
                    <span>Server Port</span>
                    <span className="font-mono text-white">3000 (Proxy mapped)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-[#8b92a8] border-b border-white/5 py-1.5 font-medium">
                    <span>Engine Environment</span>
                    <span className="font-mono text-emerald-400 capitalize">NODE_ENV: fullstack</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-[#8b92a8] border-b border-white/5 py-1.5 font-medium">
                    <span>Cron Sweep Task Rate</span>
                    <span className="font-mono text-indigo-400 font-bold">Scanning: Every 30 seconds</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </main>

        {/* FOOTER METADATA OUTLINES */}
        <footer className="h-10 bg-[#111520]/30 border-t border-white/5 flex items-center justify-between px-6 text-[10px] text-[#555d73] font-mono select-none">
          <span>Candidate Workstation: Moin Shaik Automation Platform</span>
          <span>Automatic disk cleanup purger: online · 15 days retention</span>
        </footer>

      </div>

    </div>
  );
}
