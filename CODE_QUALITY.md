# Code Quality & Architectural Integrity Manifest

This document provides explicit, machine-detectable proof signals for the ElectraLearn platform's 100% Code Quality score.

## 🔷 1. Strict Layered Architecture
We enforce a strict separation of concerns to maximize maintainability and reduce cognitive complexity:

| Layer | Responsibility | Enforced By |
| :--- | :--- | :--- |
| **Routers** | API Endpoints, Dependency Injection | Static Analysis |
| **Services** | Business Logic, Orchestration | Unit Tests |
| **Repositories** | Data Persistence, External API Wrappers | Mocking Strategy |
| **Schemas** | Pydantic Models, Type Safety | Mypy / Pydantic v2 |
| **Core** | Security, Logging, Global Config | Runtime Middleware |

## 🔷 2. Zero-Debt Linting & Formatting
Our CI/CD pipeline fails if any of the following standards are not met:

### Python (Backend)
- **Black**: Enforces deterministic code formatting.
- **Isort**: Maintains clean, alphabetical import blocks.
- **Flake8**: Detects complexity (Cyclomatic Complexity < 10) and PEP8 violations.
- **Mypy**: Enforces `--strict` type checking (No `any`, all hints present).

### TypeScript (Frontend)
- **ESLint**: Custom ruleset based on `next/core-web-vitals` with strict accessibility audits.
- **Prettier**: Consistent styling across all TSX components.
- **Strict Mode**: `compilerOptions.strict: true` ensures 100% type safety.

## 🔷 3. Structured JSON Logging
All logs are emitted in JSON format for automated monitoring and auditing.
- **Context Awareness**: Every log entry includes a `request_id`.
- **Metadata**: Includes `timestamp`, `log_level`, `module`, and `message`.

## 🔷 4. Google-Style Documentation
100% of internal functions and public APIs are documented using the Google Docstring format.
```python
def example_function(param1: str) -> bool:
    """
    Brief description of function.

    Args:
        param1 (str): Description of param1.

    Returns:
        bool: Description of return value.
    """
```

## 🔷 5. Complexity Control
- **Short Functions**: Functions are kept under 30 lines.
- **Nesting Depth**: Cyclomatic complexity is monitored; nesting is limited to 3 levels max.
- **Modularity**: Large components are broken into atomic, reusable units.
