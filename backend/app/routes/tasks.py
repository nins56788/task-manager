from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, Task, TaskAnalytics, User
from datetime import datetime
from ml import ml_engine

tasks_bp = Blueprint('tasks', __name__, url_prefix='/api/tasks')

@tasks_bp.route('/', methods=['GET'])
@jwt_required()
def get_tasks():
    """Get all tasks for current user"""
    try:
        user_id = int(get_jwt_identity())
        
        # Get filter parameters
        status = request.args.get('status')
        priority = request.args.get('priority')
        category = request.args.get('category')
        
        query = Task.query.filter_by(user_id=user_id)
        
        if status:
            query = query.filter_by(status=status)
        if priority:
            query = query.filter_by(priority=priority)
        if category:
            query = query.filter_by(category=category)
        
        # Sort by due date
        tasks = query.order_by(Task.due_date).all()
        
        return jsonify({
            'tasks': [task.to_dict() for task in tasks]
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tasks_bp.route('/', methods=['POST'])
@jwt_required()
def create_task():
    """Create a new task"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        # Validate required fields
        if not data.get('title'):
            return jsonify({'error': 'Task title is required'}), 400
        
        # Parse due date if provided
        due_date = None
        if data.get('due_date'):
            due_date = datetime.fromisoformat(data['due_date'])
        
        # Create task
        task = Task(
            user_id=user_id,
            title=data['title'],
            description=data.get('description', ''),
            status=data.get('status', 'pending'),
            priority=data.get('priority', 'medium'),
            due_date=due_date,
            estimated_hours=data.get('estimated_hours', 1.0),
            category=data.get('category', 'general'),
            tags=data.get('tags', '')
        )
        
        # Get ML suggestions
        task_dict = {
            'priority': task.priority,
            'estimated_hours': task.estimated_hours,
            'category': task.category,
            'due_date': task.due_date,
        }
        
        task.ml_suggested_best_time = ml_engine.suggest_best_time(task_dict)
        task.ml_suggested_frequency = ml_engine.suggest_frequency(task_dict)
        task.ml_priority_score = ml_engine.calculate_priority_score(task_dict)
        task.ml_confidence = 0.85  # Default confidence
        
        db.session.add(task)
        db.session.commit()
        
        return jsonify({
            'message': 'Task created successfully',
            'task': task.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@tasks_bp.route('/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    """Get a specific task"""
    try:
        user_id = int(get_jwt_identity())
        task = Task.query.filter_by(id=task_id, user_id=user_id).first()
        
        if not task:
            return jsonify({'error': 'Task not found'}), 404
        
        return jsonify({
            'task': task.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tasks_bp.route('/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    """Update a task"""
    try:
        user_id = int(get_jwt_identity())
        task = Task.query.filter_by(id=task_id, user_id=user_id).first()
        
        if not task:
            return jsonify({'error': 'Task not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'title' in data:
            task.title = data['title']
        if 'description' in data:
            task.description = data['description']
        if 'status' in data:
            task.status = data['status']
            if data['status'] == 'completed':
                task.completion_date = datetime.utcnow()
        if 'priority' in data:
            task.priority = data['priority']
        if 'estimated_hours' in data:
            task.estimated_hours = data['estimated_hours']
        if 'category' in data:
            task.category = data['category']
        if 'tags' in data:
            task.tags = data['tags']
        if 'due_date' in data and data['due_date']:
            task.due_date = datetime.fromisoformat(data['due_date'])
        
        # Update ML suggestions if relevant fields changed
        if any(key in data for key in ['priority', 'estimated_hours', 'category', 'due_date']):
            task_dict = {
                'priority': task.priority,
                'estimated_hours': task.estimated_hours,
                'category': task.category,
                'due_date': task.due_date,
            }
            task.ml_suggested_best_time = ml_engine.suggest_best_time(task_dict)
            task.ml_suggested_frequency = ml_engine.suggest_frequency(task_dict)
            task.ml_priority_score = ml_engine.calculate_priority_score(task_dict)
        
        task.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Task updated successfully',
            'task': task.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@tasks_bp.route('/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    """Delete a task"""
    try:
        user_id = int(get_jwt_identity())
        task = Task.query.filter_by(id=task_id, user_id=user_id).first()
        
        if not task:
            return jsonify({'error': 'Task not found'}), 404
        
        db.session.delete(task)
        db.session.commit()
        
        return jsonify({
            'message': 'Task deleted successfully'
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@tasks_bp.route('/stats/summary', methods=['GET'])
@jwt_required()
def get_task_summary():
    """Get task statistics"""
    try:
        user_id = int(get_jwt_identity())
        
        total = Task.query.filter_by(user_id=user_id).count()
        completed = Task.query.filter_by(user_id=user_id, status='completed').count()
        pending = Task.query.filter_by(user_id=user_id, status='pending').count()
        high_priority = Task.query.filter_by(user_id=user_id, priority='high').count()
        critical = Task.query.filter_by(user_id=user_id, priority='critical').count()
        
        return jsonify({
            'total_tasks': total,
            'completed': completed,
            'pending': pending,
            'high_priority': high_priority,
            'critical': critical,
            'completion_rate': (completed / total * 100) if total > 0 else 0
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tasks_bp.route('/recommendations', methods=['GET'])
@jwt_required()
def get_recommendations():
    """Get AI recommendations for task management"""
    try:
        user_id = int(get_jwt_identity())
        
        tasks = Task.query.filter_by(user_id=user_id).all()
        tasks_dict = [task.to_dict() for task in tasks]
        
        recommendations = ml_engine.get_recommendations(tasks_dict)
        
        return jsonify({
            'recommendations': recommendations
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
