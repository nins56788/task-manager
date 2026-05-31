#!/usr/bin/env python
"""TaskPro Backend Server"""

import os
from app import create_app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', True)
    
    print(f"🚀 Starting TaskPro Backend Server on http://localhost:{port}")
    print(f"📚 API Documentation: http://localhost:{port}/api/docs")
    print(f"💾 Database: {app.config['SQLALCHEMY_DATABASE_URI']}")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )
