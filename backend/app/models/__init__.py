from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User
from .task import Task
from .analytics import TaskAnalytics

__all__ = ['db', 'User', 'Task', 'TaskAnalytics']
