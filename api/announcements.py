from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
from supabase import create_client, Client

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*", "methods": ["GET", "POST", "DELETE", "OPTIONS"]}})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Initialize Supabase client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables must be set")

supabase: Client = create_client(supabase_url, supabase_key)

@app.route('/api/announcements', methods=['GET'])
def get_announcements():
    """Get all announcements"""
    try:
        response = supabase.table('announcements').select('*').order('date', desc=True).execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/announcements', methods=['POST'])
def create_announcement():
    """Create a new announcement"""
    try:
        data = request.json
        
        # Validate required fields
        if not data.get('title') or not data.get('content'):
            return jsonify({'error': 'Title and content are required'}), 400
        
        # Create new announcement
        announcement = {
            'title': data['title'],
            'content': data['content'],
            'type': data.get('type', 'general'),
            'author': data.get('author', 'Admin'),
            'link': data.get('link', ''),
            'date': datetime.now().isoformat()
        }
        
        response = supabase.table('announcements').insert(announcement).execute()
        
        return jsonify(response.data[0]), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/announcements/<int:announcement_id>/delete', methods=['POST', 'OPTIONS'])
def delete_announcement(announcement_id):
    """Delete an announcement"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        supabase.table('announcements').delete().eq('id', announcement_id).execute()
        return jsonify({'message': 'Announcement deleted'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/announcements/clear', methods=['POST', 'OPTIONS'])
def clear_announcements():
    """Clear all announcements"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        # Get all announcement IDs
        response = supabase.table('announcements').select('id').execute()
        ids = [item['id'] for item in response.data]
        
        # Delete all
        for announcement_id in ids:
            supabase.table('announcements').delete().eq('id', announcement_id).execute()
        
        return jsonify({'message': 'All announcements cleared'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Vercel serverless handler
if __name__ == '__main__':
    app.run()