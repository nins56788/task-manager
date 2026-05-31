from . import db
from datetime import datetime
from enum import Enum

class TaskStatus(Enum):
    """Task status enumeration"""
    PENDING = 'pending'
    IN_PROGRESS = 'in_progress'
    COMPLETED = 'completed'
    CANCELLED = 'cancelled'

class TaskPriority(Enum):
    """Task priority enumeration"""
    LOW = 'low'
    MEDIUM = 'medium'
    HIGH = 'high'
    CRITICAL = 'critical'

class Task(db.Model):
    """Task model"""
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default=TaskStatus.PENDING.value)
    priority = db.Column(db.String(20), default=TaskPriority.MEDIUM.value)
    due_date = db.Column(db.DateTime)
    estimated_hours = db.Column(db.Float)  # ML will use this for timing
    category = db.Column(db.String(50))
    tags = db.Column(db.String(500))  # comma-separated
    completion_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # ML predictions
    ml_suggested_best_time = db.Column(db.String(100))  # e.g., "9:00 AM - 11:00 AM"
    ml_suggested_frequency = db.Column(db.String(100))  # e.g., "Daily", "Weekly"
    ml_priority_score = db.Column(db.Float)  # 0-100 score
    ml_confidence = db.Column(db.Float)  # 0-1 confidence level
    
    # Relationships
    analytics = db.relationship('TaskAnalytics', backref='task', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self, include_analytics=False):
        """Convert task to dictionary"""
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'estimated_hours': self.estimated_hours,
            'category': self.category,
            'tags': self.tags,
            'completion_date': self.completion_date.isoformat() if self.completion_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'ml_suggested_best_time': self.ml_suggested_best_time,
            'ml_suggested_frequency': self.ml_suggested_frequency,
            'ml_priority_score': self.ml_priority_score,
            'ml_confidence': self.ml_confidence,
        }
        return data
    
    def __repr__(self):
        return f'<Task {self.title}>'
