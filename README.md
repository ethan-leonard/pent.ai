# Pent.AI

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Python](https://img.shields.io/badge/python-3.9+-green.svg) ![Django](https://img.shields.io/badge/django-4.2+-green.svg) ![React](https://img.shields.io/badge/react-18.0+-61DAFB.svg) ![TypeScript](https://img.shields.io/badge/typescript-4.9+-blue.svg)

## Overview

Pent.AI is an advanced web application security platform that automatically identifies, validates, and documents SQL injection vulnerabilities. By combining the power of OWASP ZAP's scanning capabilities with proxy.lite validation and AI-driven risk assessment, Pent.AI provides comprehensive security insights for web applications.

### Key Features

- **Automated SQL Injection Detection**: Leverages OWASP ZAP API for thorough scanning and fuzzing  
- **Validation Engine**: Uses proxy.lite to confirm vulnerabilities and eliminate false positives  
- **AI-Powered Risk Assessment**: Generates detailed risk registers with actionable mitigation strategies  
- **Visual Evidence**: Captures and displays screenshots of identified vulnerabilities  
- **User-Friendly Interface**: Clean React TypeScript frontend for easy interaction  

## Architecture

Pent.AI follows a modern client-server architecture with these key components:

### Backend (Django)

- RESTful API endpoints for frontend communication  
- Integration with OWASP ZAP for vulnerability scanning  
- PostgreSQL database for vulnerability data persistence  
- Proxy.lite integration for vulnerability validation  
- AI integration for risk assessment and mitigation recommendations  

### Frontend (React TypeScript)

- Intuitive interface for initiating scans  
- Comprehensive dashboard for viewing vulnerability data  
- Risk register with detailed findings and recommendations  
- Visual evidence display with vulnerability screenshots  

## Project Structure

```plaintext
pent.ai/
├── backend/               # Django backend
│   ├── pentai/            # Main Django project
│   │   ├── settings.py    # Project settings
│   │   ├── urls.py        # URL routing
│   │   └── wsgi.py        # WSGI configuration
│   ├── vulnerability_scanner/ # App for ZAP integration
│   │   ├── models.py      # Data models for vulnerabilities
│   │   ├── services/      # Services for ZAP integration
│   │   └── tasks.py       # Background tasks for scanning
│   ├── api/               # REST API implementation
│   │   ├── views.py       # API endpoints
│   │   ├── serializers.py # Data serialization
│   │   └── urls.py        # API routing
│   ├── validation/        # Proxy.lite integration
│   ├── risk_assessment/   # AI-powered risk assessment
│   ├── manage.py          # Django management script
│   └── requirements.txt   # Python dependencies
│
├── frontend/              # React TypeScript frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── services/      # API communication services
│   │   ├── types/         # TypeScript type definitions
│   │   ├── utils/         # Utility functions
│   │   ├── App.tsx        # Main application component
│   │   └── index.tsx      # Entry point
│   ├── package.json       # Node.js dependencies
│   └── tsconfig.json      # TypeScript configuration
│
├── docs/                  # Documentation
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Python 3.9+  
- Node.js 16+  
- PostgreSQL  
- OWASP ZAP (can be run as Docker container)  

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/pent.ai.git
cd pent.ai

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Set up database
cd backend
python manage.py migrate

# Run development server
python manage.py runserver
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### OWASP ZAP Setup

```bash
# Run ZAP in daemon mode with Docker
docker run -p 2375:2375 -i owasp/zap2docker-stable zap.sh -daemon -port 2375 -host 0.0.0.0 -config api.disablekey=true
```

## Usage

1. Navigate to `http://localhost:3000` in your browser  
2. Enter the target URL (initially fixed to OWASP Juice Shop for testing)  
3. Initiate the scan by clicking "Start Scan"  
4. View the scan progress in real-time  
5. Once complete, explore the identified vulnerabilities, risk register, and screenshots  
6. Review AI-generated mitigation strategies for each vulnerability  

## Roadmap

### Phase 1: Foundation (Current)
- [x] Project structure setup  
- [x] Basic Django and React configuration  
- [ ] Database schema design  
- [ ] OWASP ZAP API integration  

### Phase 2: Core Functionality
- [ ] Implement vulnerability scanning  
- [ ] Develop basic frontend components  
- [ ] Create REST API endpoints  
- [ ] Implement vulnerability data storage  

### Phase 3: Advanced Features
- [ ] Integrate proxy.lite for validation  
- [ ] Implement screenshot capture  
- [ ] Develop risk register generation  
- [ ] Integrate AI for mitigation strategies  

### Phase 4: Refinement and Deployment
- [ ] Comprehensive testing  
- [ ] UI/UX improvements  
- [ ] Performance optimization  
- [ ] Documentation  
- [ ] CI/CD pipeline setup  

### Future Enhancements
- [ ] Support for additional vulnerability types  
- [ ] User authentication and role-based access  
- [ ] Scan history and comparison  
- [ ] Integration with CI/CD pipelines  
- [ ] Customizable scanning rules  

## Technologies Used

### Backend
- Django (Web framework)  
- Django REST Framework (API)  
- PostgreSQL (Database)  
- OWASP ZAP API (Security scanning)  
- Proxy.lite (Validation)  
- Python-OWASPZAPv2 (ZAP API client)  

### Frontend
- React (UI library)  
- TypeScript (Type-safe JavaScript)  
- Material-UI (Component library)  
- Axios (HTTP client)  
- React Router (Navigation)  
- React Query (Data fetching)  

### AI and Data Processing
- OpenAI API (Risk assessment)  
- Pandas (Data manipulation)  
- Celery (Background tasks)  

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository  
2. Create your feature branch (`git checkout -b feature/amazing-feature`)  
3. Commit your changes (`git commit -m 'Add some amazing feature'`)  
4. Push to the branch (`git push origin feature/amazing-feature`)  
5. Open a Pull Request  

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Link: [https://github.com/yourusername/pent.ai](https://github.com/yourusername/pent.ai)

---

**Note**: This project is currently under development. Features and capabilities are subject to change.