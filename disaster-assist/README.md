# DisasterAssist — Smart Disaster Detection & Emergency Assistance
A beginner-friendly full-stack prototype built with HTML, CSS, JavaScript and Python (Flask). It has a responsive dashboard, situation analysis, and an emergency report flow saved locally in `data/reports.json`.

## Features
- Submit an incident description and location.
- Analyze text for flood, fire, earthquake, cyclone, landslide and medical emergencies.
- Show a suggested hazard and urgency level.
- Save reports locally and display recent incidents and dashboard counts.
- REST API endpoints: `/api/health`, `/api/analyze`, `/api/reports`, `/api/stats`.

## Run in VS Code (Windows)
1. Extract the ZIP, then open the extracted `disaster-assist` folder in VS Code.
2. Open **Terminal → New Terminal**.
3. Create and activate a virtual environment:
   ```powershell
   py -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```
   If PowerShell blocks activation, run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in that terminal, then activate again. Or use Command Prompt terminal: `.venv\Scripts\activate.bat`.
4. Install Python packages:
   ```powershell
   py -m pip install -r requirements.txt
   ```
5. Start the backend:
   ```powershell
   py app.py
   ```
6. Open **http://127.0.0.1:5000** in a browser. Keep the terminal running while using the app. Press **Ctrl+C** to stop.

## தமிழ் — VS Code Terminal-ல் இயக்குவது எப்படி
1. ZIP-ஐ Extract செய்து, Extract ஆன `disaster-assist` folder-ஐ VS Code-ல் Open செய்யவும்.
2. **Terminal → New Terminal** திறக்கவும்.
3. Virtual environment உருவாக்கி activate செய்யவும்:
   ```powershell
   py -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```
   PowerShell activation block செய்தால், முதலில் `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` இயக்கி, activate command-ஐ மறுபடியும் இயக்கவும். Command Prompt பயன்படுத்தினால் `.venv\Scripts\activate.bat` இயக்கவும்.
4. தேவையான package-ஐ install செய்யவும்:
   ```powershell
   py -m pip install -r requirements.txt
   ```
5. Python backend-ஐ start செய்யவும்:
   ```powershell
   py app.py
   ```
6. Browser-ல் **http://127.0.0.1:5000** திறக்கவும். App பயன்படுத்தும் வரை terminal-ஐ திறந்தே வைக்கவும். நிறுத்த **Ctrl+C** அழுத்தவும்.

## Important notes
This is an educational demonstration, not a real emergency-response service. The analyzer uses simple keyword rules; it is not a trained AI model and cannot detect disasters from live sensors, images, or the internet. It does not contact emergency services. In a real emergency, contact your local emergency number. Do not enter sensitive personal information; reports are stored in a local JSON file.

## Project structure
```
disaster-assist/
  app.py
  requirements.txt
  README.md
  data/reports.json
  frontend/
    index.html
    styles.css
    extra.css
    app.js
```
