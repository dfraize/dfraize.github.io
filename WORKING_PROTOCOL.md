# 🎯 PORTFOLIO SITE WORKING PROTOCOL

## ⚠️ CRITICAL: Directory Management

### **ALWAYS VERIFY CURRENT DIRECTORY FIRST:**
```bash
pwd
# Must show: /Users/dougfraize/Documents/Dev/Portfolio Site
```

### **CORRECT DIRECTORY INDICATORS:**
✅ **Correct Directory:** `/Users/dougfraize/Documents/Dev/Portfolio Site`
- Contains: `package.json`, `index.html`, `css/`, `js/`, `node_modules/`
- Terminal prompt shows: `dougfraize@Dougs-MacBook-Air Portfolio Site %`

❌ **Wrong Directory:** `/Users/dougfraize/Documents/Dev`
- Contains: `archive portfolio/`, `Portfolio Site/`
- Terminal prompt shows: `dougfraize@Dougs-MacBook-Air Dev %`

## 🚀 SERVER STARTUP PROTOCOL

### **Step 1: Navigate to Correct Directory**
```bash
cd "Portfolio Site"
```

### **Step 2: Verify Location**
```bash
pwd
# Must show: /Users/dougfraize/Documents/Dev/Portfolio Site
```

### **Step 3: Check for Required Files**
```bash
ls -la
# Must show: package.json, index.html, css/, js/, node_modules/
```

### **Step 4: Start Server**
```bash
npm run dev
# OR
npx live-server --port=3000 --open=/index.html --watch=.
```

## 📁 FILE PATH PROTOCOL

### **When Editing Files, ALWAYS Use:**
- ✅ `Portfolio Site/index.html`
- ✅ `Portfolio Site/css/style.css`
- ✅ `Portfolio Site/js/main.js`
- ✅ `Portfolio Site/package.json`

### **NEVER Use:**
- ❌ `index.html` (looks in parent directory)
- ❌ `css/style.css` (looks in parent directory)
- ❌ `js/main.js` (looks in parent directory)

## 🔧 TROUBLESHOOTING

### **If Server Won't Start:**
1. Check current directory: `pwd`
2. If wrong directory: `cd "Portfolio Site"`
3. Verify files exist: `ls -la`
4. Kill existing servers: `pkill -f live-server`
5. Start fresh: `npm run dev`

### **If "Cannot GET /index.html":**
- Server is running from wrong directory
- Solution: Navigate to Portfolio Site directory first

### **If "package.json not found":**
- Running from parent directory
- Solution: `cd "Portfolio Site"`

## 🎯 SUCCESS INDICATORS

### **Server Running Correctly:**
- URL: `http://localhost:3000` works
- Page shows: "Hello World"
- File changes reflect immediately
- Terminal shows: "Serving from Portfolio Site"

### **Wrong Directory Symptoms:**
- "Cannot GET /index.html"
- "package.json not found"
- Server serving from `/Users/dougfraize/Documents/Dev`

## 📝 DAILY WORKFLOW

1. **Open Terminal**
2. **Navigate:** `cd "Portfolio Site"`
3. **Verify:** `pwd` (must show Portfolio Site)
4. **Start Server:** `npm run dev`
5. **Work on Files:** Edit files in Portfolio Site directory
6. **Test Changes:** Browser auto-refreshes

## 🔒 LOCKED-IN RULES

1. **ALWAYS check directory first**
2. **ALWAYS use full relative paths**
3. **NEVER run commands from parent directory**
4. **ALWAYS verify files exist before editing**
5. **ALWAYS start server from Portfolio Site directory**

---
**Last Updated:** August 4, 2024
**Status:** ACTIVE PROTOCOL 