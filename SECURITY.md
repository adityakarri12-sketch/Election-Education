# Security Policy

## Supported Versions

We actively support and provide security updates for the following versions of ElectraLearn:

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| 1.1.x   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within this platform, please follow these steps:

1. **Email Us**: Send a detailed report to `security@electralearn.gov.in`.
2. **Details**: Include a description of the vulnerability, steps to reproduce, and potential impact.
3. **Response**: We will acknowledge receipt of your report within 24 hours and provide a detailed response within 72 hours.

## Security Hardening Measures
This project implements the following security protocols:
- **Content Security Policy (CSP)**: Strictly controlled script and style sources.
- **HSTS**: Forced HTTPS to prevent protocol downgrade attacks.
- **Rate Limiting**: Intelligent IP-based throttling for AI nodes.
- **Sanitization**: Automatic filtering of generative AI prompts and user inputs.
- **Environment Isolation**: Secrets are never hardcoded and are managed via Cloud Secret Manager.

*Thank you for helping keep the democratic process secure.*
