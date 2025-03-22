# Pent.AI

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Python](https://img.shields.io/badge/python-3.9+-green.svg) ![Django](https://img.shields.io/badge/django-5.1+-green.svg) ![React](https://img.shields.io/badge/react-19.0+-61DAFB.svg) ![TypeScript](https://img.shields.io/badge/typescript-4.9+-blue.svg)

## Overview

Pent.AI is an advanced web application security platform that automatically identifies, validates, and documents web vulnerabilities. By combining the power of OWASP ZAP's scanning capabilities with proxy-lite validation and AI-driven risk assessment, Pent.AI provides comprehensive security insights for web applications.

### Key Features

- **Automated Vulnerability Detection**: Leverages OWASP ZAP API for thorough scanning and fuzzing  
- **Validation Engine**: Uses proxy-lite to confirm vulnerabilities and eliminate false positives  
- **AI-Powered Risk Assessment**: Generates detailed risk registers with actionable mitigation strategies  
- **Visual Simulation**: Interactive vulnerability simulations for better understanding  
- **User-Friendly Interface**: Clean React TypeScript frontend with elegant animations  

## Architecture

Pent.AI follows a modern microservices architecture with these key components:

### Backend (Django)

- RESTful API endpoints using Django REST Framework
- Integration with OWASP ZAP for vulnerability scanning
- Multiple scanning APIs (traditional, AJAX, active)
- SQLite database for vulnerability persistence 
- Docker containerization for easy deployment

### Frontend (React TypeScript)

- Modern React 19 with TypeScript for type safety
- Elegant UI with custom animations and transitions
- Responsive design for all device sizes
- Interactive vulnerability analysis tools

## Project Timeline

The development of Pent.AI has followed these key milestones:

### Phase 1: Foundation (Completed)
1. **Infrastructure Setup**
   - Created Django and React application structure
   - Established basic project architecture
   - Set up development environment

2. **Containerization**
   - Created Docker containers for OWASP ZAP and Juice Shop
   - Implemented Docker networking for inter-service communication
   - Developed startup script for one-command deployment

3. **Core Scanning Integration**
   - Integrated OWASP ZAP API with Django backend
   - Implemented multiple scanning modes (traditional, AJAX, active)
   - Created vulnerability data model and storage

### Phase 2: Enhancement (In Progress)
4. **AI Integration & Visualization**
   - Added visual simulation for vulnerability demonstration
   - Created interactive UI for vulnerability exploration
   - Implemented initial proxy-lite support for validation

### Phase 3: Advanced Features (Upcoming)
5. **Proxy-lite Integration**
   - Properly host local instance of proxy-lite
   - Connect via API and Docker network to Django application
   - Implement validation workflow for detected vulnerabilities

6. **Extended AI Capabilities**
   - Incorporate OpenAI prompting for wider range of vulnerability simulations
   - Generate custom mitigation strategies based on application context
   - Develop risk assessment module with AI recommendations

7. **User Experience Improvements**
   - Implement real-time loading status for active scans
   - Display vulnerability alerts as they are detected during active scanning
   - Add interactive dashboard for scan monitoring
   - Enhance visual reporting capabilities
   
## Project Structure

```plaintext
pent.ai/
├── backend/               # Django backend
│   ├── pentai/            # Main Django project
│   │   ├── api/           # REST API implementation
│   │   ├── vulnerability_scanner/ # ZAP integration
│   │   ├── simulate/      # Simulation capabilities
│   │   ├── pentai/        # Django settings & config
│   │   └── proxy-lite-docker/ # Dockerfile for proxy-lite
│   └── requirements.txt   # Python dependencies
│
├── frontend/              # React frontend
│   ├── public/            # Static assets
│   │   └── videos/        # Simulation videos
│   ├── src/
│   │   ├── components/    # UI components
│   │   │   ├── Popup.tsx  # Simulation popup
│   │   │   └── DetailsPopup.tsx # Vulnerability details
│   │   ├── App.tsx        # Main application
│   │   └── index.tsx      # Entry point
│   └── package.json       # Node.js dependencies
│
├── startup.sh             # One-command startup script
├── LICENSE                # MIT License file
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Python 3.9+  
- Node.js 16+  
- Docker & Docker Compose
- OWASP ZAP (included in Docker setup)

### One-Command Setup

The easiest way to run Pent.AI is using the included startup script:

```bash
# Clone the repository
git clone https://github.com/ethan-leonard/pent.ai.git
cd pent.ai

# Make the startup script executable
chmod +x startup.sh

# Run the startup script
./startup.sh
```

This will:
1. Create a Docker network for the containers
2. Start the OWASP Juice Shop as a vulnerable test application
3. Start OWASP ZAP in daemon mode
4. Start the Django backend
5. Start the React frontend

### Manual Backend Setup

```bash
# Create and activate virtual environment
python -m venv backend/venv
source backend/venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Set up database
cd backend/pentai
python manage.py migrate

# Run development server
python manage.py runserver 0.0.0.0:8000
```

### Manual Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## Usage

1. Navigate to `http://localhost:3000` in your browser  
2. Enter the target URL (default is the Juice Shop running at http://juice-shop:3000)  
3. Select a scan mode:
   - Complete Scan: Runs all scan types
   - Traditional Crawler: Simple URL discovery
   - AJAX Crawler: Discovers JavaScript-based pages
   - Active Analysis: Tests for vulnerabilities
4. Initiate the scan by clicking "Initiate Scan"  
5. View the scan progress in real-time  
6. Once complete, explore the identified vulnerabilities in the Threat Intelligence section
7. For each vulnerability, you can:
   - View technical Details
   - Run an AI-powered Analysis with visual simulation

## Technologies Used

### Backend
- Django 5.1+ (Web framework)  
- Django REST Framework (API)  
- SQLite (Database)  
- OWASP ZAP API (Security scanning)  
- proxy-lite (AI validation)
- Python-OWASPZAPv2 (ZAP API client)  
- Docker (Containerization)

### Frontend
- React 19.0+ (UI library)  
- TypeScript 4.9+ (Type-safe JavaScript)  
- Axios (HTTP client)  
- CSS-in-JS (Custom styling)

### Infrastructure
- Docker (Containerization)
- OWASP Juice Shop (Test target)
- OWASP ZAP (Scanner)

## Commit Message Guidelines

We follow a simple commit message format to make the project history readable. Each commit message should be structured as follows:

`<emoji> <type>: <subject>`

### Types and Emojis

| Emoji | Type | Description |
|-------|------|-------------|
| ✨ | `feat` | New feature or enhancement |
| 🐛 | `fix` | Bug fix |
| 📝 | `docs` | Documentation changes |
| 💄 | `style` | Code formatting, styling (no code change) |

### Examples

- ✨ feat: add SQL injection pattern detection
- 🐛 fix: resolve false positive in XSS detection
- 📝 docs: update installation instructions
- 💄 style: format code according to style guide

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Project Link: [https://github.com/ethan-leonard/pent.ai](https://github.com/ethan-leonard/pent.ai)

---

**Note**: This project is currently under development. Features and capabilities are subject to change.