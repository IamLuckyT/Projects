
import React, { useState } from 'react';

const SourceCodeView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'python' | 'mysql' | 'html' | 'css'>('python');

  const pythonCode = `import os
from flask import Flask, render_template, request, redirect, session, flash, jsonify
import mysql.connector
from google.generativeai import GoogleGenAI

app = Flask(__name__)
app.secret_key = 'eday_super_secret_key'

# Gemini AI Setup
ai = GoogleGenAI(api_key=os.environ.get("API_KEY"))

def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='',
        database='eday_voting'
    )

@app.route('/')
def index():
    if 'user_id' in session:
        return redirect('/vote')
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    
    # Admin Credentials
    if username == 'Obakeng@Admin' and password == 'Obakeng@Admin':
        session['user_id'] = 'admin'
        session['is_admin'] = True
        return redirect('/admin')
    
    # Database Auth (Simplified)
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
    user = cursor.fetchone()
    
    if user:
        session['user_id'] = user['id']
        session['is_admin'] = False
        return redirect('/vote')
    
    flash("Invalid Credentials")
    return redirect('/')

@app.route('/vote', methods=['GET', 'POST'])
def vote():
    if 'user_id' not in session: return redirect('/')
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    if request.method == 'POST':
        candidate_id = request.form.get('candidate_id')
        cursor.execute("UPDATE candidates SET votes = votes + 1 WHERE id = %s", (candidate_id,))
        cursor.execute("UPDATE users SET has_voted = 1 WHERE id = %s", (session['user_id'],))
        conn.commit()
        return redirect('/results')

    cursor.execute("SELECT * FROM candidates")
    candidates = cursor.fetchall()
    return render_template('vote.html', candidates=candidates)

@app.route('/ai-analysis')
def ai_analysis():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT name, language, votes FROM candidates")
    data = cursor.fetchall()
    
    stats = "\\n".join([f"{c['name']} ({c['language']}): {c['votes']} votes" for c in data])
    
    response = ai.models.generateContent(
        model='gemini-3-flash-preview',
        contents=f"Analyze these election results and summarize trends:\\n{stats}"
    )
    return jsonify({"analysis": response.text})

if __name__ == '__main__':
    app.run(debug=True)`;

  const mysqlCode = `-- Database Schema for E-Day
CREATE DATABASE eday_voting;
USE eday_voting;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    has_voted BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE candidates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    language ENUM('Tswana', 'Zulu') NOT NULL,
    votes INT DEFAULT 0,
    bio TEXT
);

-- Seed Data
INSERT INTO candidates (name, language, bio) VALUES
('Thabo Molefe', 'Tswana', 'Champion for local education and Tswana heritage preservation.'),
('Kagiso Mpho', 'Tswana', 'Advocating for sustainable agriculture and rural development.'),
('Sibusiso Dlamini', 'Zulu', 'Focused on urban infrastructure and Zulu cultural outreach.'),
('Nokuthula Zungu', 'Zulu', 'Dedicated to women\\'s empowerment and small business grants.');`;

  const htmlCode = `<!-- templates/layout.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>E-Day Voting</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50">
    <nav class="bg-white border-b px-8 py-4 flex justify-between">
        <h1 class="font-bold text-indigo-600">E-Day Online</h1>
        <a href="/logout">Logout</a>
    </nav>
    <main class="max-w-4xl mx-auto p-8">
        {% block content %}{% endblock %}
    </main>
</body>
</html>`;

  const cssCode = `/* static/style.css */
body {
    font-family: 'Inter', sans-serif;
    background-color: #f8fafc;
}

.vote-card {
    background: white;
    padding: 1.5rem;
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
    transition: all 0.2s;
}

.vote-card:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}`;

  const currentCode = activeTab === 'python' ? pythonCode : activeTab === 'mysql' ? mysqlCode : activeTab === 'html' ? htmlCode : cssCode;

  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
      <div className="flex bg-slate-800 p-2 gap-2">
        {(['python', 'mysql', 'html', 'css'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'python' ? 'app.py' : tab === 'mysql' ? 'database.sql' : tab === 'html' ? 'layout.html' : 'style.css'}
          </button>
        ))}
      </div>
      <div className="p-6 relative">
        <button 
          onClick={() => {
            navigator.clipboard.writeText(currentCode);
            alert('Code copied to clipboard!');
          }}
          className="absolute top-4 right-4 p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-xs transition-colors"
        >
          Copy Code
        </button>
        <pre className="text-sm font-mono text-indigo-300 overflow-x-auto whitespace-pre p-4">
          <code>{currentCode}</code>
        </pre>
      </div>
    </div>
  );
};

export default SourceCodeView;
