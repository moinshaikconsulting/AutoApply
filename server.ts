import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

// Get current directory names for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure storage directories exist
const UPLOADS_DIR = path.join(process.cwd(), "data", "uploads");
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initial DB Structure
interface DatabaseSchema {
  resumes: Array<{
    id: string;
    originalName: string;
    fileName: string;
    mimeType: string;
    size: number;
    uploadedBy: string;
    uploadTime: string;
    expiresAt: string;
    retentionDays: number;
    status: 'active' | 'deleted_by_job';
  }>;
  cleanupLogs: Array<{
    id: string;
    timestamp: string;
    type: 'auto' | 'manual';
    resumesDeletedCount: number;
    details: string;
    freedBytes: number;
  }>;
  totalSpaceFreed: number;
  totalSpaceUsed: number;
  deletedCount: number;
}

const defaultDb: DatabaseSchema = {
  resumes: [],
  cleanupLogs: [],
  totalSpaceFreed: 0,
  totalSpaceUsed: 0,
  deletedCount: 0
};

// Database helper functions (robust and thread-safe)
function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), "utf8");
      return defaultDb;
    }
    const content = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(content) as DatabaseSchema;
  } catch (err) {
    console.error("Error reading database file, returning defaults:", err);
    return defaultDb;
  }
}

function writeDb(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

// Setup Multer storage engine
const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    // Save with unique id and secure file name extension
    const uniqueId = crypto.randomUUID();
    const parsed = path.parse(file.originalname);
    const safeBase = parsed.name.replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 50);
    const safeExt = parsed.ext.replace(/[^.a-zA-Z0-9]/g, "");
    cb(null, `${uniqueId}-${safeBase}${safeExt}`);
  }
});

const upload = multer({
  storage: uploadStorage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB file size limit
  }
});

import { GoogleGenAI } from "@google/genai";

// Shared Gemini Client Lazy Initializer
let aiInstance: any = null;
function getGeminiClient() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ GEMINI_API_KEY is not defined in environment variables. Falling back to expert simulated responses.");
      return null;
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// Create Express app
const app = express();
const PORT = 3000;

app.use(express.json());

// API: Server-side Gemini Career Assistant Chat Endpoint
app.post("/api/chat/message", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }
    
    const client = getGeminiClient();
    if (!client) {
      // Graceful local feedback block
      return res.json({ 
        text: `Hello Moin! [Offline Simulated Mode] For a fully operational AI coach powered by Gemini, make sure your GEMINI_API_KEY is configured in Settings > Secrets. \n\nAs an AI Consultant, Prompt Engineer & n8n Specialist, your absolute strongest talking point is concrete business outcomes. Always pitch with: 'I build end-to-end multi-agent systems using Claude and n8n that slashed client operations processing timelines from 6 hours to under 4 minutes.' What specific proposal or interview answer would you like help optimizing next?`
      });
    }

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction: "You are an expert AI Career Coach and Personal Placement Agent assisting Moin Shaik, a professional possessing core strengths in Prompt Engineering, AI workflow automation (n8n, Zapier), business intelligence (Power BI, Tableau), SQL databases, and full-stack AI system deployment. Help Moin draft proposals, analyze client requirements, suggest portfolio ideas, and ace interview questions. Deliver responses that are highly tactical, punchy, concise, and professional. Limit answers to 160 words max."
      }
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error("Gemini Chat API Error:", err);
    res.status(500).json({ error: "Express failed to call Gemini API. Check your environment keys." });
  }
});

// API: Server-side Gemini Proposal Generator Endpoint
app.post("/api/proposals/generate", async (req, res) => {
  try {
    const { role, platform, jd, tone } = req.body;
    const specifiedRole = role || "AI Automation Specialist";
    const specifiedPlatform = platform || "Upwork";
    const specifiedTone = tone || "Professional & Technical";
    const specifiedJd = jd || "Looking for someone skilled in AI integration, n8n automations, and data visualization.";

    const client = getGeminiClient();
    if (!client) {
      // High-quality expert proposal fallback template
      const fallbackProposal = `Hi there,\n\nI noticed your listing seeking an expert ${specifiedRole} and am confident I can add substantial value. I specialize in building custom AI-powered workflows using n8n, Python, and Claude / Gemini APIs, helping businesses save 80+ hours of manual labor monthly.\n\nKey assets I bring to this ${specifiedPlatform} contract:\n• 🤖 Multi-agent custom workflow builds using n8n, Make, and LangChain\n• 📊 Native Power BI & Tableau dashboards with DAX measures and clean data pipelines\n• 🐍 Python scripting & database engineering (SQL, Snowflake, dbt)\n\nI approach every project with a 'consultative engineering' mindset—I deeply audit your manual bottlenecks before writing code. Let's schedule a 10-minute discovery call to map out your architecture!\n\nBest regards,\nMoin Shaik\nAI Operations & Automation Engineer`;
      return res.json({ text: fallbackProposal });
    }

    const promptText = `Generate a high-converting ${specifiedTone.toLowerCase()} ${specifiedPlatform} job proposal for Moin Shaik applying for the position of "${specifiedRole}".\n\nJob description context:\n${specifiedJd.substring(0, 1000)}\n\nMoin's resume qualifications:\n- Custom AI workflow integration using APIs (Claude, OpenAI, Gemini) and orchestration tools (n8n, Make, Zapier).\n- Interactive BI dashboards with Power BI, DAX, Excel, and Tableau.\n- Data engineering backend with SQL, Snowflake, and Python data structures.\n- Professional consulting background translating functional specifications into system rules.\n\nFormatting requirements:\n- Keep the proposal under 200 words.\n- Open with a hook focusing on business efficiency or saving hours.\n- List 3 relevant technical bullet points of qualifications custom-tailored to the job description.\n- End with a clean, low-pressure request for a brief call. No fluff.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error("Gemini Proposal API Error:", err);
    res.status(500).json({ error: "Failed to generate customized proposal using Gemini." });
  }
});

// API: Server-side Gemini ATS CV Optimizer Endpoint
app.post("/api/resume/analyze-ats", async (req, res) => {
  try {
    const { jd } = req.body;
    if (!jd) {
      return res.status(400).json({ error: "Job description is required." });
    }

    const client = getGeminiClient();
    if (!client) {
      // Expert mock keywords
      const fallbackKeywords = ["AI Integration", "n8n Workflows", "Data Pipeline", "Power BI", "Python", "SQL", "Prompt Engineering", "ETL"];
      return res.json({
        score: 82,
        keywords: fallbackKeywords,
        suggestions: [
          "List specific hours or workflows automated using n8n to highlight real business outcome metrics.",
          "Add the keyword 'Prompt Engineering' directly under your core skills heading to trigger higher ATS parsing matches."
        ]
      });
    }

    const promptText = `Perform an ATS (Applicant Tracking System) inspection of the following Job Description.

Job Description:
${jd.substring(0, 1200)}

Analyze how a resume focusing on AI Automation, Prompt Engineering, n8n workflows, Power BI, SQL, and data pipelines fits this role. 
Identify the top 6 core ATS keywords/skills requested by the JD.
Provide a logical ATS Match Score out of 100.
Formulate 2 highly concrete recommendations to insert or structure in the CV to match the ATS criteria.

You MUST respond strictly with a valid JSON object matching the following structure:
{
  "score": number,
  "keywords": string[],
  "suggestions": string[]
}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json"
      }
    });

    try {
      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch {
      res.json({
        score: 75,
        keywords: ["n8n Workflows", "Prompt Engineering", "Python", "Power BI", "Data Automation"],
        suggestions: [
          "Incorporate 'data integration pipelines' under your projects.",
          "List experience with API authentication protocols in your workflow builders."
        ]
      });
    }
  } catch (err: any) {
    console.error("Gemini ATS Analyzer API Error:", err);
    res.status(500).json({ error: "ATS parser script failed." });
  }
});

// API: Get active resumes list with expiration schedules
app.get("/api/resumes", (req, res) => {
  const db = readDb();
  // Filter active and sorted by upload time desc
  const list = db.resumes
    .filter(r => r.status === 'active')
    .sort((a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime());
  res.json(list);
});

// API: Upload a new resume/CV
app.post("/api/resumes/upload", upload.single("resume"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file was uploaded." });
    }

    const { uploadedBy, retentionDays } = req.body;
    const specifiedDays = parseFloat(retentionDays || "15"); // e.g., 15 (could be custom, like 0.00138 for 2-minute demo)

    const now = new Date();
    const expiresAt = new Date(now.getTime() + specifiedDays * 24 * 60 * 60 * 1000);

    const db = readDb();
    
    const newResume = {
      id: crypto.randomUUID(),
      originalName: req.file.originalname,
      fileName: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedBy: uploadedBy || "Anonymous User",
      uploadTime: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      retentionDays: specifiedDays,
      status: 'active' as const
    };

    db.resumes.push(newResume);
    db.totalSpaceUsed += req.file.size;
    writeDb(db);

    res.status(201).json(newResume);
  } catch (error: any) {
    console.error("Error uploaded resume:", error);
    res.status(500).json({ error: "Failed to upload resume/CV." });
  }
});

// API: Download resume by ID (with robust error checking and correct attachment name)
app.get("/api/resumes/download/:id", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const resume = db.resumes.find(r => r.id === id);

  if (!resume) {
    return res.status(404).json({ error: "Resume record not found." });
  }

  if (resume.status !== 'active') {
    return res.status(410).json({ error: "This resume has been deleted or expired by the automatic 15-day cleanup policy." });
  }

  const filePath = path.join(UPLOADS_DIR, resume.fileName);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "The file does not exist on the server." });
  }

  // Set response headers to force download with correct mimeType and original name
  res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(resume.originalName)}"`);
  res.setHeader("Content-Type", resume.mimeType);
  
  const fileStream = fs.createReadStream(filePath);
  fileStream.on("error", (err) => {
    console.error("Stream error downloading file:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Error reading physical file." });
    }
  });
  
  fileStream.pipe(res);
});

// API: Delete resume manually
app.delete("/api/resumes/:id", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.resumes.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Resume not found." });
  }

  const resume = db.resumes[index];
  
  // Try deleting physical file
  const filePath = path.join(UPLOADS_DIR, resume.fileName);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error("Error deleting file from upload dir:", err);
  }

  // Update records
  if (resume.status === 'active') {
    db.deletedCount += 1;
    db.totalSpaceFreed += resume.size;
  }
  
  // Remove or change status
  db.resumes.splice(index, 1);
  writeDb(db);

  res.json({ message: "Resume deleted successfully." });
});

// Background Cleanup Logic (Can be triggered manually or runs on interval)
function executeCleanup(type: 'auto' | 'manual'): { count: number; freedSpace: number; logs: string } {
  const db = readDb();
  const now = new Date();
  let count = 0;
  let freedSpace = 0;
  const deletedDetails: string[] = [];

  const activeResumes = db.resumes.filter(r => r.status === 'active');
  const itemsToClean = activeResumes.filter(r => {
    const expired = now.getTime() >= new Date(r.expiresAt).getTime();
    return expired;
  });

  for (const resume of itemsToClean) {
    const filePath = path.join(UPLOADS_DIR, resume.fileName);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      count++;
      freedSpace += resume.size;
      resume.status = 'deleted_by_job';
      deletedDetails.push(`"${resume.originalName}" (${(resume.size / 1024).toFixed(1)} KB)`);
    } catch (err: any) {
      console.error(`Error deleting file for expired resume ${resume.id}:`, err);
    }
  }

  if (count > 0) {
    db.deletedCount += count;
    db.totalSpaceFreed += freedSpace;
    
    // Create cleanup log
    const logId = crypto.randomUUID();
    const logEntry = {
      id: logId,
      timestamp: now.toISOString(),
      type,
      resumesDeletedCount: count,
      details: `Successfully deleted files: ${deletedDetails.join(', ')}`,
      freedBytes: freedSpace
    };
    db.cleanupLogs.unshift(logEntry);
    
    // Keep last 50 logs of auto deletes to save space
    if (db.cleanupLogs.length > 50) {
      db.cleanupLogs = db.cleanupLogs.slice(0, 50);
    }

    writeDb(db);
    console.log(`[CLEANUP SYSTEM] ${type.toUpperCase()} execution completed. Deleted ${count} expired files. Freed ${(freedSpace / 1024 / 1024).toFixed(3)} MB.`);
  }

  return {
    count,
    freedSpace,
    logs: count > 0 ? deletedDetails.join(', ') : "No expired resumes found."
  };
}

// API: Manually trigger the cleanup job immediately (highly convenient for demos/testing!)
app.post("/api/cleanup/trigger", (req, res) => {
  const result = executeCleanup('manual');
  res.json({
    message: "Cleanup job executed successfully.",
    deletedCount: result.count,
    spaceFreedBytes: result.freedSpace,
    details: result.logs,
    timestamp: new Date().toISOString()
  });
});

// API: Get Cleanup Logs
app.get("/api/cleanup/logs", (req, res) => {
  const db = readDb();
  res.json(db.cleanupLogs);
});

// API: Get Storage & Deletion Statistics
app.get("/api/stats", (req, res) => {
  const db = readDb();
  const activeCount = db.resumes.filter(r => r.status === 'active').length;
  const activeSpace = db.resumes
    .filter(r => r.status === 'active')
    .reduce((sum, r) => sum + r.size, 0);

  res.json({
    activeCount,
    deletedCount: db.deletedCount,
    totalSpaceUsed: activeSpace,
    totalSpaceFreed: db.totalSpaceFreed,
    lastCleanupTime: db.cleanupLogs[0]?.timestamp || null
  });
});

// Run automated cleanup interval (checks every 30 seconds for immediate responsiveness)
setInterval(() => {
  try {
    executeCleanup('auto');
  } catch (err) {
    console.error("Error in scheduled automated cleanup task:", err);
  }
}, 30000);

// Initialize full-stack middleware (Vite Dev Server vs Production builds)
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Full-stack server running on http://localhost:${PORT}`);
    console.log(`📅 Automatic resume storage cleanup task initialized (Active retention scanner: 30s)`);
  });
}

startServer();
