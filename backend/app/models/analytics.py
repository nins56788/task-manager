from . import db
from datetime import datetime

class TaskAnalytics(db.Model):
    """Task analytics and performance tracking"""
    __tablename__ = 'task_analytics'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=False, index=True)
    
    # Time tracking
    actual_hours_spent = db.Column(db.Float)
    estimated_hours = db.Column(db.Float)
    time_accuracy = db.Column(db.Float)  # Percentage
    
    # Performance
    completed_on_time = db.Column(db.Boolean)
    completed_early = db.Column(db.Boolean)
    completion_delay_days = db.Column(db.Integer)
    
    # Patterns
    best_completion_time = db.Column(db.String(100))  # e.g., "Morning"
    day_of_week_completed = db.Column(db.String(20))  # e.g., "Monday"
    
    # Productivity
    interruptions = db.Column(db.Integer, default=0)
    flow_state_duration = db.Column(db.Float)  # minutes
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert analytics to dictionary"""
        return {
            'id': self.id,
            'task_id': self.task_id,
            'actual_hours_spent': self.actual_hours_spent,
            'estimated_hours': self.estimated_hours,
            'time_accuracy': self.time_accuracy,
            'completed_on_time': self.completed_on_time,
            'completed_early': self.completed_early,
            'completion_delay_days': self.completion_delay_days,
            'best_completion_time': self.best_completion_time,
            'day_of_week_completed': self.day_of_week_completed,
            'interruptions': self.interruptions,
            'flow_state_duration': self.flow_state_duration,
        }
    
    def __repr__(self):
        return f'<TaskAnalytics task_id={self.task_id}>'
