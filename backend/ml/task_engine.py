import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier

class TaskSuggestionEngine:
    """ML Engine for suggesting optimal task timing and frequency"""

    @staticmethod
    def _coerce_due_date(value):
        """Convert ISO date strings to datetime objects used by the ML logic."""
        if isinstance(value, datetime):
            return value
        if isinstance(value, str):
            try:
                return datetime.fromisoformat(value)
            except ValueError:
                return None
        return value
    
    HOURS_OF_DAY = {
        'early_morning': (5, 7),   # 5-7 AM
        'morning': (7, 12),         # 7 AM - 12 PM
        'afternoon': (12, 17),      # 12-5 PM
        'evening': (17, 21),        # 5-9 PM
        'night': (21, 24),          # 9 PM - 12 AM
    }
    
    PRIORITY_SCORES = {
        'critical': 100,
        'high': 75,
        'medium': 50,
        'low': 25,
    }
    
    def __init__(self):
        """Initialize the ML engine"""
        self.scaler = StandardScaler()
        self.priority_model = RandomForestClassifier(n_estimators=10, random_state=42)
        self.model_trained = False
    
    def suggest_best_time(self, task_data):
        """
        Suggest the best time to complete a task
        Returns: time period (e.g., "morning", "afternoon")
        """
        # Extract task features
        priority = task_data.get('priority', 'medium')
        estimated_hours = task_data.get('estimated_hours', 1)
        category = task_data.get('category', 'general')
        
        # Logic based on task characteristics
        if estimated_hours >= 4:
            # Long tasks better in morning when fresh
            return 'morning'
        elif priority == 'critical' or priority == 'high':
            # Important tasks in morning
            return 'morning'
        elif category in ['creative', 'brainstorm', 'planning']:
            # Creative work in morning
            return 'morning'
        elif category in ['admin', 'email', 'routine']:
            # Routine tasks in afternoon
            return 'afternoon'
        else:
            # Default: afternoon
            return 'afternoon'
    
    def suggest_frequency(self, task_data):
        """
        Suggest how often a task should be done
        Returns: frequency (e.g., "Daily", "Weekly", "Once")
        """
        # Extract features
        priority = task_data.get('priority', 'medium')
        estimated_hours = task_data.get('estimated_hours', 1)
        category = task_data.get('category', 'general')
        
        # Logic for frequency
        if category in ['health', 'exercise', 'routine']:
            return 'Daily'
        elif priority == 'critical':
            return 'Daily'
        elif priority == 'high':
            return 'Twice a week'
        elif estimated_hours >= 3:
            return 'Weekly'
        else:
            return 'As needed'
    
    def calculate_priority_score(self, task_data, user_analytics=None):
        """
        Calculate ML-based priority score (0-100)
        Considers: stated priority, deadlines, estimated time, category
        """
        score = 0
        
        # Base priority score
        priority = task_data.get('priority', 'medium')
        score += self.PRIORITY_SCORES.get(priority, 50)
        
        # Deadline urgency
        due_date = self._coerce_due_date(task_data.get('due_date'))
        if due_date:
            days_until_due = (due_date - datetime.utcnow()).days
            if days_until_due <= 1:
                score += 25  # Due soon
            elif days_until_due <= 3:
                score += 15
            elif days_until_due <= 7:
                score += 5
        
        # Time required factor
        estimated_hours = task_data.get('estimated_hours', 1)
        if estimated_hours > 4:
            score += 10  # Longer tasks need earlier planning
        
        # Normalize to 0-100
        score = min(100, max(0, score))
        
        return score
    
    def get_recommendations(self, tasks, analytics_data=None):
        """
        Get comprehensive recommendations for task management
        """
        recommendations = {
            'immediate_action': [],
            'this_week': [],
            'optimize_schedule': [],
            'patterns': {},
        }
        
        if not tasks:
            return recommendations
        
        # Find tasks needing immediate attention
        for task in tasks:
            if task.get('status') == 'pending':
                due_date = self._coerce_due_date(task.get('due_date'))
                if due_date:
                    days_until_due = (due_date - datetime.utcnow()).days
                    if days_until_due <= 1:
                        recommendations['immediate_action'].append({
                            'task_id': task.get('id'),
                            'title': task.get('title'),
                            'reason': 'Due soon'
                        })
                    elif days_until_due <= 7:
                        recommendations['this_week'].append(task.get('title'))
        
        # Schedule optimization suggestions
        high_priority_count = sum(1 for t in tasks if t.get('priority') == 'high')
        if high_priority_count > 3:
            recommendations['optimize_schedule'].append(
                'You have many high-priority tasks. Consider breaking them into smaller subtasks.'
            )
        
        # Find optimal working patterns
        morning_tasks = sum(1 for t in tasks if t.get('ml_suggested_best_time') == 'morning')
        if morning_tasks > len(tasks) * 0.6:
            recommendations['patterns']['morning_worker'] = True
        
        return recommendations
    
    def predict_completion_time(self, task_data, user_history=None):
        """
        Predict how long a task will actually take
        Uses historical data if available
        """
        estimated = task_data.get('estimated_hours', 1)
        
        # If we have user history, adjust prediction
        if user_history:
            # Calculate user's typical time variance
            variance = user_history.get('avg_time_variance', 1.0)
            return estimated * variance
        
        # Default: add 10% buffer
        return estimated * 1.1
