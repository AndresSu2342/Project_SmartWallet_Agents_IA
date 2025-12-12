const AGENT_API_URL = import.meta.env.VITE_AGENT_API_URL || 'http://localhost:3000';

export interface AgentEvent {
  userId: string;
  type: string;
  description: string;
}

export interface AgentResponse {
  agentResponse: string;
  conversationId?: string;
}

class AgentService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = AGENT_API_URL;
  }

  /**
   * Obtiene el userId del localStorage y lo convierte a número para el agente
   */
  getUserId(): string {
    const uuid = localStorage.getItem('userId') || 'anonymous';
    // Convertir UUID a un número para el agente que espera bigint
    // Usamos los primeros 8 caracteres hexadecimales del UUID
    const numericId = parseInt(uuid.replace(/-/g, '').substring(0, 15), 16);
    return isNaN(numericId) ? '1' : numericId.toString();
  }

  /**
   * Envía un mensaje al agente para análisis
   */
  async sendMessage(
    description: string,
    type: string = 'FULL_ANALYSIS_PROMPT'
  ): Promise<AgentResponse> {
    const userId = this.getUserId();

    const response = await fetch(`${this.baseUrl}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        type,
        description,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al comunicarse con el agente');
    }

    return response.json();
  }

  /**
   * Envía un evento personalizado al agente
   */
  async sendEvent(event: AgentEvent): Promise<AgentResponse> {
    const response = await fetch(`${this.baseUrl}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al enviar evento');
    }

    return response.json();
  }
}

export const agentService = new AgentService();
export default agentService;
