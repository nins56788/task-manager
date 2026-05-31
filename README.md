# TaskPro - AI-Powered Task Management System

A professional, full-stack task management application with intelligent ML/AI features for suggesting optimal task timing and frequency. Built with Python Flask backend, HTML/CSS frontend, and SQLite database.

## 🌟 Features

- **User Authentication**: Secure sign-up/login with JWT and bcrypt encryption
- **Task Management**: Create, read, update, and delete tasks with detailed attributes
- **AI/ML Engine**: Smart suggestions for:
  - Optimal task completion times (morning, afternoon, evening)
  - Recommended frequency (daily, weekly, as needed)
  - Priority scoring based on multiple factors
  - Productivity patterns and insights
- **Analytics Dashboard**: Track your performance and productivity metrics
- **Responsive Design**: Mobile-friendly interface with modern UI/UX
- **Real-time Updates**: Live task synchronization across sessions
- **Category Organization**: Organize tasks by work, personal, health, education
- **Priority Levels**: Critical, High, Medium, Low priority system

## 📋 Project Structure

```
TaskPro/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── user.py          # User model with authentication
│   │   │   ├── task.py          # Task model with ML fields
│   │   │   ├── analytics.py     # Analytics tracking model
│   │   │   └── __init__.py
│   │   ├── routes/
│   │   │   ├── auth.py          # Authentication endpoints
│   │   │   ├── tasks.py         # Task management endpoints
│   │   │   └── __init__.py
│   │   └── __init__.py          # Flask app factory
│   ├── ml/
│   │   ├── task_engine.py       # ML suggestion engine
│   │   └── __init__.py
│   ├── config.py                # Configuration settings
│   ├── run.py                   # Server entry point
│   ├── requirements.txt         # Python dependencies
│   └── .env.example             # Environment variables template
│
├── frontend/
│   ├── templates/
│   │   ├── auth.html            # Login/signup page
│   │   └── dashboard.html       # Main dashboard
│   ├── static/
│   │   ├── css/
│   │   │   ├── auth.css         # Auth page styles
│   │   │   └── dashboard.css    # Dashboard styles
│   │   └── js/
│   │       ├── auth.js          # Authentication logic
│   │       └── dashboard.js     # Dashboard functionality
│   └── index.html
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip package manager
- Modern web browser

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd TaskPro/backend
   ```

2. **Create virtual environment** (optional but recommended)
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Setup environment variables**
   ```bash
   # Copy example file
   cp .env.example .env
   
   # Edit .env with your settings (optional for development)
   ```

5. **Run the backend server**
   ```bash
   python run.py
   ```
   Server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd TaskPro/frontend
   ```

2. **Start a local web server**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or use any other HTTP server
   ```

3. **Access the application**
   - Open browser and go to `http://localhost:8000/templates/auth.html`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/update-profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Tasks
- `GET /api/tasks/` - Get all tasks with filters
- `POST /api/tasks/` - Create new task
- `GET /api/tasks/<id>` - Get specific task
- `PUT /api/tasks/<id>` - Update task
- `DELETE /api/tasks/<id>` - Delete task
- `GET /api/tasks/stats/summary` - Get task statistics
- `GET /api/tasks/recommendations` - Get AI recommendations

## 💾 Database

The system uses **SQLite** database by default (`task_management.db`).

### Models

**User Model**
- id, username, email, password_hash
- first_name, last_name, avatar, bio
- timezone, notification preferences
- created_at, updated_at timestamps

**Task Model**
- id, user_id, title, description
- status (pending, in_progress, completed, cancelled)
- priority (low, medium, high, critical)
- due_date, estimated_hours, category, tags
- ML fields: ml_suggested_best_time, ml_suggested_frequency, ml_priority_score
- timestamps

**TaskAnalytics Model**
- Tracks task completion patterns
- Time accuracy, on-time completion rates
- Best completion times, productivity metrics

## 🤖 ML/AI Features

The TaskSuggestionEngine analyzes tasks and provides:

### 1. **Best Time Suggestions**
- Analyzes task characteristics (priority, duration, category)
- Recommends optimal time slots:
  - Morning (5-12 PM): Best for long/important tasks
  - Afternoon (12-5 PM): Routine/administrative tasks
  - Evening (5-9 PM): Creative work

### 2. **Frequency Recommendations**
- Daily: Health, exercise, routine tasks
- Weekly: High-priority items
- As needed: Low-priority tasks

### 3. **Priority Scoring**
- Combines stated priority with deadline urgency
- Factors in estimated time requirements
- Scores from 0-100

### 4. **Productivity Recommendations**
- Identifies immediate action items
- Suggests weekly focus areas
- Provides personalized productivity tips

## 🔐 Security Features

- **Password Hashing**: Using bcrypt for secure password storage
- **JWT Authentication**: Token-based API security
- **CORS Support**: Cross-origin resource sharing configured
- **Input Validation**: All inputs validated server-side
- **Secure Headers**: Protection against common web vulnerabilities

## 🎨 User Interface

### Authentication Page
- Professional sign-in/sign-up form
- Real-time form switching animation
- Feature highlights section
- Responsive design for all devices

### Dashboard
- **Sidebar Navigation**: Quick access to all sections
- **Statistics Cards**: Real-time task metrics
- **Task Management**: Table view with filtering and sorting
- **Analytics**: Performance tracking and insights
- **AI Recommendations**: Smart suggestions based on patterns
- **Settings**: User profile and password management

## 📱 Responsive Design

- Desktop: Full-featured layout
- Tablet: Optimized grid layouts
- Mobile: Sidebar menu, stacked components

## 🔧 Configuration

Edit `backend/config.py` to customize:
- Database URL
- JWT expiration time
- Debug mode
- CORS settings

## 📊 Example Workflow

1. **Register**: Create account with email and password
2. **Login**: Sign in to dashboard
3. **Create Tasks**: Add tasks with priority, category, due date
4. **AI Suggestions**: Receive recommendations for:
   - Best time to complete each task
   - Frequency of recurring tasks
   - Priority adjustments
5. **Track Progress**: Monitor completion rates and patterns
6. **Optimize**: Use analytics to improve productivity

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Python version
python --version  # Should be 3.8+

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Check port 5000 is available
# If not, modify PORT in run.py
```

### Database issues
```bash
# Remove old database
rm task_management.db

# Restart server to create fresh database
python run.py
```

### CORS errors
- Ensure backend is running on `http://localhost:5000`
- Frontend should access from `http://localhost:8000`
- Check CORS configuration in `backend/app/__init__.py`

## 🚀 Deployment

### Production Checklist
- [ ] Update `.env` with production values
- [ ] Set `FLASK_ENV=production`
- [ ] Use PostgreSQL instead of SQLite
- [ ] Enable HTTPS/SSL
- [ ] Configure secure JWT secrets
- [ ] Set up proper logging
- [ ] Use production WSGI server (Gunicorn, uWSGI)

## 📚 Technologies Used

### Backend
- **Flask**: Lightweight Python web framework
- **SQLAlchemy**: ORM for database management
- **Flask-JWT-Extended**: JWT authentication
- **Bcrypt**: Password hashing
- **Scikit-learn**: Machine learning algorithms
- **Pandas**: Data analysis
- **NumPy**: Numerical computing

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with variables and grid
- **Vanilla JavaScript**: No framework dependencies
- **Fetch API**: Asynchronous HTTP requests

### Database
- **SQLite**: Development (default)
- **PostgreSQL**: Production (recommended)

## 📖 API Documentation

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "priority": "high",
    "estimated_hours": 4,
    "category": "work"
  }'
```

### Get All Tasks
```bash
curl -X GET "http://localhost:5000/api/tasks/?status=pending&priority=high" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get AI Recommendations
```bash
curl -X GET http://localhost:5000/api/tasks/recommendations \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 💡 Tips & Best Practices

1. **Be Specific**: More detailed task descriptions improve AI suggestions
2. **Set Realistic Estimates**: Accurate time estimates help with scheduling
3. **Use Categories**: Organize tasks for better analytics
4. **Regular Updates**: Mark tasks complete to improve pattern recognition
5. **Review Recommendations**: Check AI suggestions weekly

## 🤝 Support

For issues, questions, or suggestions:
1. Check troubleshooting section
2. Review error messages in browser console (F12)
3. Check backend logs in terminal

## 📄 License

This project is created for educational and professional use.

## 🎯 Future Enhancements

- [ ] Task subtasks/dependencies
- [ ] Recurring tasks scheduling
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Calendar view integration
- [ ] Pomodoro timer integration
- [ ] Voice task creation
- [ ] Advanced ML models (neural networks)

---

**Built with ❤️ for productive people**

Enjoy TaskPro! 🚀
