from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
from supabase import create_client, Client

app = Flask(__name__)
CORS(app)

# Initialize Supabase client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables must be set")

supabase: Client = create_client(supabase_url, supabase_key)

@app.route('/api/events', methods=['GET'])
def get_events():
    """Get all events"""
    try:
        response = supabase.table('events').select('*').order('start', desc=False).execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events', methods=['POST'])
def create_event():
    """Create a new event"""
    try:
        data = request.json
        
        # Validate required fields
        if not data.get('title') or not data.get('start'):
            return jsonify({'error': 'Title and start date are required'}), 400
        
        # Create new event
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

@app.route('/api/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    """Delete an event"""
    try:
        supabase.table('events').delete().eq('id', event_id).execute()
        return jsonify({'message': 'Event deleted'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    """Update an event"""
    try:
        data = request.json
        
        # Get existing event
        response = supabase.table('events').select('*').eq('id', event_id).execute()
        
        if not response.data:
            return jsonify({'error': 'Event not found'}), 404
        
        # Update fields
        updated_event = {
            'title': data.get('title'),
            'start': data.get('start'),
            'end': data.get('end'),
            'description': data.get('description'),
            'location': data.get('location'),
            'type': data.get('type')
        }
        
        # Remove None values
        updated_event = {k: v for k, v in updated_event.items() if v is not None}
        
        response = supabase.table('events').update(updated_event).eq('id', event_id).execute()
        
        return jsonify(response.data[0]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500