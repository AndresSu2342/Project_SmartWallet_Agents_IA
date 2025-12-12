# 🏦 Smart Wallet (Project AREP)

Sistema inteligente de gestión financiera personal impulsado por múltiples agentes de IA orquestados para ofrecer insigths, gestión de metas y coaching financiero.

## 🏗️ Arquitectura del Ecosistema

El proyecto está compuesto por una arquitectura de microservicios y agentes especializados, coordinados por un orquestador central.

```mermaid
graph TD
    Client[Client (React/Vite)] -->|HTTP| Core[App Core (NestJS)]
    Core -->|Events| Orch[Orchestrator Agent (NestJS)]
    
    subgraph "Agent Ecosystem"
        Orch -->|SQS| FinAgent[Financial Insight Agent (Node/TS)]
        Orch -->|SQS| GoalAgent[Goal Intelligence Agent (Python/CrewAI)]
        Orch -->|SQS| Coach[Motivational Coach (Make)]
        Orch -->|SQS| Budget[Budget Balancer (Make)]
    end

    FinAgent -->|Analysis| Orch
    GoalAgent -->|Updates| Orch
```

---

## 🧩 Componentes del Proyecto

### 1. 📱 Client (`/client`)
- **Tecnología:** React, Vite, TypeScript
- **Descripción:** Interfaz de usuario frontend. Provee la experiencia visual para que el usuario interactúe con su billetera, vea sus métricas y converse con el asistente.

### 2. 🧠 App Core (`/app-core`)
- **Tecnología:** NestJS, TypeORM, PostgreSQL
- **Descripción:** Backend principal "monolito modular". Maneja la autenticación de usuarios, la persistencia de datos transaccionales (ingresos, gastos) y expone la API REST para el cliente. Actúa como la fuente de verdad para los datos del usuario.

### 3. 🎼 Orchestrator Agent (`/agent_orchestrator`)
- **Tecnología:** NestJS, LangGraph, Redis, AWS SQS
- **Descripción:** El cerebro del sistema de IA.
    - Recibe eventos del Core.
    - Decide qué agente especializado debe actuar usando **LangGraph**.
    - Gestiona la memoria a corto y largo plazo (Episódica/Semántica).
    - Enruta mensajes a través de colas SQS.

### 4. 📊 Financial Insight Agent (`/agent-financial`)
- **Tecnología:** Node.js, TypeScript, OpenAI
- **Descripción:** Agente especializado en análisis de datos.
    - Detecta anomalías en gastos.
    - Identifica "gastos hormiga".
    - Genera resúmenes de salud financiera.

### 5. 🎯 Goal Intelligence Agent (`/agent-goals`)
- **Tecnología:** Python, CrewAI, OpenAI
- **Descripción:** Agente especializado en planificación estratégica.
    - Ayuda a descubrir y definir metas de ahorro.
    - Evalúa la viabilidad financiera de nuevas metas.
    - Realiza seguimiento del progreso y sugiere ajustes.

---

## 🚀 Inicio Rápido (Desarrollo)

Para levantar el entorno completo, necesitarás iniciar cada servicio independientemente (o configurar un docker-compose global si estuviera disponible).

### Prerrequisitos
- Node.js 20+
- Python 3.10+
- PostgreSQL
- Redis
- Cuenta AWS (para SQS) o LocalStack

### 1. App Core
```bash
cd app-core
npm install
npm run start:dev
```

### 2. Orchestrator
```bash
cd agent_orchestrator
npm install
npm run start:dev
```

### 3. Financial Agent
```bash
cd agent-financial
npm install
npm run dev
```

### 4. Goals Agent
```bash
cd agent-goals
python -m venv .venv
.\.venv\Scripts\Activate
pip install -r requirements.txt
python -m goal_agent.agent_runner
```

### 5. Client
```bash
cd client
npm install
npm run dev
```

---

## 🤝 Contribución

Cada componente tiene su propio `README.md` con detalles específicos de configuración y despliegue dentro de su carpeta. Por favor revísalos para más detalles técnicos.
