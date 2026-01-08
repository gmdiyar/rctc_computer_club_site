from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
from supabase import create_client, Client

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}})

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

@app.route('/api/events', methods=['GET', 'POST', 'OPTIONS'])
def handle_events():
    """Handle all event operations"""
    if request.method == 'OPTIONS':
        return '', 204
    
    # Check for action query parameter
    action = request.args.get('action')
    event_id = request.args.get('id')
    
    # DELETE single event
    if action == 'delete' and event_id:
        try:
            supabase.table('events').delete().eq('id', int(event_id)).execute()
            return jsonify({'message': 'Event deleted'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # CLEAR all events
    if action == 'clear':
        try:
            response = supabase.table('events').select('id').execute()
            ids = [item['id'] for item in response.data]
            for eid in ids:
                supabase.table('events').delete().eq('id', eid).execute()
            return jsonify({'message': 'All events cleared'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # GET all events
    if request.method == 'GET' and not action:
        try:
            response = supabase.table('events').select('*').order('start', desc=False).execute()
            return jsonify(response.data), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # POST new event
    if request.method == 'POST' and not action:
        try:
            data = request.json
            
            if not data.get('title') or not data.get('start'):
                return jsonify({'error': 'Title and start date are required'}), 400
            
            event = {
                'title': data['title'],
                'start': data['start'],
                'end': data.get('end', data['start']),
                'description': data.get('description', ''),
                'location': data.get('location', ''),
                'type': data.get('type', 'meeting'),
                'created': datetime.now().isoformat()
            }
            
            response = supabase.table('events').insert(event).execute()
            return jsonify(response.data[0]), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500