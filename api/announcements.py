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

@app.route('/api/announcements', methods=['GET', 'POST', 'OPTIONS'])
def handle_announcements():
    """Handle all announcement operations"""
    if request.method == 'OPTIONS':
        return '', 204
    
    # Check for action query parameter
    action = request.args.get('action')
    announcement_id = request.args.get('id')
    
    # DELETE single announcement
    if action == 'delete' and announcement_id:
        try:
            supabase.table('announcements').delete().eq('id', int(announcement_id)).execute()
            return jsonify({'message': 'Announcement deleted'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # CLEAR all announcements
    if action == 'clear':
        try:
            response = supabase.table('announcements').select('id').execute()
            ids = [item['id'] for item in response.data]
            for aid in ids:
                supabase.table('announcements').delete().eq('id', aid).execute()
            return jsonify({'message': 'All announcements cleared'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # GET all announcements
    if request.method == 'GET':
        try:
            response = supabase.table('announcements').select('*').order('date', desc=True).execute()
            return jsonify(response.data), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # POST new announcement
    if request.method == 'POST':
        try:
            data = request.json
            
            if not data.get('title') or not data.get('content'):
                return jsonify({'error': 'Title and content are required'}), 400
            
            announcement = {
                'title': data['title'],
                'content': data['content'],
                'type': data.get('type', 'general'),
                'author': data.get('author', 'Admin'),
                'link': data.get('link', ''),
                'date': data.get('date', datetime.now().isoformat())  # Use client date if provided
            }
            
            response = supabase.table('announcements').insert(announcement).execute()
            return jsonify(response.data[0]), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500

# Vercel serverless handler
if __name__ == '__main__':
    app.run()