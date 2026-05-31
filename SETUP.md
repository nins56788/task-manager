# TaskPro Setup Guide

## Step-by-Step Installation & Running Guide

### ✅ Prerequisites Check

Before starting, ensure you have:
- [ ] Python 3.8 or higher installed
- [ ] pip (Python package manager)
- [ ] A modern web browser (Chrome, Firefox, Edge, Safari)
- [ ] Terminal/Command Prompt access

### Check Python Installation

Open Terminal/Command Prompt and run:
```bash
python --version
```
Should show Python 3.8 or higher.

---

## 🔧 Installation Steps

### Step 1: Navigate to Project Directory

**Windows (Command Prompt)**
```bash
cd C:\Users\LENOVO\OneDrive\Documents\group-5\TaskPro
```

**macOS/Linux (Terminal)**
```bash
cd ~/OneDrive/Documents/group-5/TaskPro
```

### Step 2: Setup Backend

#### 2.1 Navigate to Backend
```bash
cd backend
```

#### 2.2 Create Virtual Environment (Recommended)

**Windows**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux**
```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` prefix in your terminal.

#### 2.3 Install Python Dependencies
```bash
pip install -r requirements.txt
```

This will take a few minutes. You'll see installation progress.

#### 2.4 Verify Installation
```bash
pip list
```

You should see: Flask, Flask-SQLAlchemy, Flask-JWT-Extended, etc.

#### 2.5 Create Environment File
```bash
# Copy the example file
cp .env.example .env

# For Windows Command Prompt:
copy .env.example .env
```

(Optional: Edit `.env` file with your settings, but defaults work for development)

### Step 3: Start Backend Server

While still in the `backend` directory:

```bash
python run.py
```

You should see:
```
🚀 Starting TaskPro Backend Server on http://localhost:5000
💾 Database: sqlite:///task_management.db
```

**Keep this terminal window open!** The backend must be running.

### Step 4: Setup Frontend

**Open a NEW terminal/command prompt window**

Navigate to frontend directory:
```bash
cd C:\Users\LENOVO\OneDrive\Documents\group-5\TaskPro\frontend
```

Start the web server:

**Python 3**
```bash
python -m http.server 8000
```

Or alternative Python 3 command:
```bash
python -m http.server 8000 --bind 127.0.0.1
```

You should see:
```
Serving HTTP on 0.0.0.0 port 8000 ...
```

**Keep this terminal window open too!** The web server must be running.

---

## 🌐 Accessing TaskPro

### 1. Open Web Browser

Go to: **http://localhost:8000/templates/auth.html**

Or simply: **http://localhost:8000**

### 2. You Should See:
- TaskPro logo
- Sign In form on the left
- Features section on the right
- Beautiful gradient background

### 3. Create Your Account

Click "Create New Account" and fill in:
- First Name: (e.g., John)
- Last Name: (e.g., Doe)
- Email: (e.g., john@example.com)
- Username: (e.g., johndoe)
- Password: (at least 6 characters)
- Timezone: Select your timezone

Click "Create Account"

### 4. You're Now Logged In!

You'll see the Dashboard with:
- Navigation sidebar on left
- Statistics cards showing task counts
- Task management section
- AI recommendations area

---

## 📝 Creating Your First Task

1. Click the **"+ New Task"** button (top right)
2. Fill in task details:
   - **Task Title**: "Learn TaskPro" (required)
   - **Description**: Add details
   - **Category**: Select category
   - **Priority**: Choose level
   - **Estimated Hours**: How long it takes
   - **Due Date**: When it's due
   - **Tags**: Keywords

3. Click **"Save Task"**

4. View your task in the **"My Tasks"** section with:
   - AI-suggested best time to complete
   - ML-calculated priority score
   - Task status tracking

---

## 🛠️ Troubleshooting

### Issue 1: "Port 5000 already in use"

**Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000  # Windows

# Or use different port - edit run.py
# Change: port=5000 to port=5001
```

### Issue 2: "ModuleNotFoundError"

**Solution:**
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Make sure virtual environment is active
```

### Issue 3: "Database locked" error

**Solution:**
```bash
# Delete old database
rm task_management.db

# Restart backend server
python run.py
```

### Issue 4: "CORS error" or blank page

**Solution:**
- Ensure backend is running on `http://localhost:5000`
- Ensure frontend is on `http://localhost:8000`
- Check browser console (F12) for error messages
- Refresh page (Ctrl+R or Cmd+R)

### Issue 5: Can't connect to localhost

**Solution:**
```bash
# Open URL exactly as:
http://localhost:8000/templates/auth.html

# NOT: http://127.0.0.1:8000
# NOT: http://192.168.x.x:8000
```

---

## 📊 Testing the Application

### Test Checklist

- [ ] Can create an account
- [ ] Can log in with credentials
- [ ] Can see dashboard statistics
- [ ] Can create a new task
- [ ] Can see AI suggestions (e.g., "morning")
- [ ] Can filter tasks by priority
- [ ] Can mark task as complete
- [ ] Can delete a task
- [ ] Can update profile in settings
- [ ] Can logout successfully

---

## 🚀 Advanced Usage

### View Database

The database file is: `backend/task_management.db`

To inspect with SQLite browser:
```bash
# On Windows, download SQLite browser or use:
sqlite3 task_management.db

# View tables:
.tables

# View users:
SELECT * FROM users;

# Exit:
.quit
```

### Check API Directly

Open a new terminal and test API:

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Get tasks (replace TOKEN with actual token from login)
curl -X GET http://localhost:5000/api/tasks/ \
  -H "Authorization: Bearer TOKEN"
```

---

## 📚 File Locations Quick Reference

| Component | Location |
|-----------|----------|
| Backend Server | `backend/run.py` |
| Frontend Login | `frontend/templates/auth.html` |
| Dashboard | `frontend/templates/dashboard.html` |
| Database | `backend/task_management.db` |
| Python Dependencies | `backend/requirements.txt` |
| API Routes | `backend/app/routes/` |
| ML Engine | `backend/ml/task_engine.py` |
| Styles | `frontend/static/css/` |
| Scripts | `frontend/static/js/` |

---

## 🎓 Learning Resources

### Understanding the Architecture

1. **Backend Flow:**
   - User submits task → Flask route processes → ML engine suggests time → Database stores → Response sent

2. **Frontend Flow:**
   - User fills form → JavaScript validates → API call to backend → Response displayed → UI updates

3. **ML Process:**
   - Task features analyzed → Suggestions generated → Confidence scored → Recommendations displayed

### API Response Example

```json
{
  "message": "Task created successfully",
  "task": {
    "id": 1,
    "title": "Learn TaskPro",
    "priority": "high",
    "ml_suggested_best_time": "morning",
    "ml_suggested_frequency": "Daily",
    "ml_priority_score": 75.5,
    "ml_confidence": 0.85
  }
}
```

---

## 🔐 Security Notes

For Development Only:
- ✓ Default secrets are fine
- ✓ SQLite database is local

For Production:
- ⚠️ Change JWT_SECRET_KEY in `.env`
- ⚠️ Use PostgreSQL instead of SQLite
- ⚠️ Enable HTTPS/SSL
- ⚠️ Set DEBUG=False
- ⚠️ Use strong passwords in `.env`

---

## 💪 Next Steps

1. ✅ Get the app running (follow this guide)
2. 📝 Create tasks and experiment
3. 📊 Check analytics and recommendations
4. ⚙️ Customize settings (timezone, notifications)
5. 🚀 Deploy to production (see README.md)

---

## 📞 Getting Help

If you encounter issues:

1. **Check the terminal for error messages** - They often tell you exactly what's wrong
2. **Check browser console** (Press F12) - Look for red error messages
3. **Review README.md** - Full documentation
4. **Verify all steps completed** - Go through this guide again

---

## ✨ Congratulations!

You now have a fully functional AI-powered task management system running locally! 🎉

Enjoy managing your tasks intelligently with TaskPro!
