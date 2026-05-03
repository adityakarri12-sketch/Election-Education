# 🛠️ Development & Engineering Guide

## 📐 High-Level Architecture
ElectraLearn uses a **Modular Clean Architecture** pattern.
- **Frontend**: Next.js 15 (App Router) + Tailwind CSS + Framer Motion.
- **Backend**: FastAPI + Pydantic V2 + Gemini AI Cluster.
- **Infrastructure**: Google Cloud Run (Serverless) + Artifact Registry.

## 🧪 Testing Workflow
We utilize a multi-layer testing strategy:
1. **Unit Tests**: Found in `backend/tests/`.
2. **Integration Tests**: Verification of AI failover and security headers.
3. **Autonomous Audit**: A real-time audit runner integrated into the `TestingEvaluation` component.

### Running Tests
```bash
# Backend Tests
cd backend
pip install -r requirements.txt
pytest tests/test_production.py -v
```

## 🔐 Security Protocols
- **Secrets Management**: All sensitive keys must be stored in `.env` (excluded from Git).
- **Hardening**: Every API request passes through the `SecurityHardeningMiddleware`.
- **Sanitization**: Prompts are sanitized in `app/services/ai_cluster.py` before model execution.

## ♿ Accessibility Compliance
This project adheres to **WCAG 2.1 Level AA** standards.
- All dynamic updates use `aria-live`.
- Modals implement `role="dialog"` and `aria-modal="true"`.
- Contrast ratios are verified for readability on dark-mode backgrounds.

---
*For architectural inquiries, contact the Lead Architect.*
