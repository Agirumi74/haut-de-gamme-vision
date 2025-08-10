// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // In production (deployed site), use relative paths
  if (window.location.hostname === 'makeup-neill.onrender.com' || window.location.hostname.includes('onrender.com')) {
    return '/api';
  }
  // In development, use localhost
  return 'http://localhost:3001/api';
};

const API_BASE_URL = getApiBaseUrl();

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    return response.json();
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    
    const data = await this.handleResponse(response);
    this.token = data.token;
    localStorage.setItem('authToken', data.token);
    return data;
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Formations methods
  async getFormations() {
    const response = await fetch(`${API_BASE_URL}/formations`);
    return this.handleResponse(response);
  }

  async getFormation(id: string) {
    const response = await fetch(`${API_BASE_URL}/formations/${id}`);
    return this.handleResponse(response);
  }

  async createFormation(formation: {
    title: string;
    description: string;
    duration: number;
    level: string;
    price: number;
    maxStudents?: number;
  }) {
    const response = await fetch(`${API_BASE_URL}/formations`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(formation),
    });
    return this.handleResponse(response);
  }

  async updateFormation(id: string, formation: Partial<{
    title: string;
    description: string;
    duration: number;
    level: string;
    price: number;
    maxStudents: number;
    isActive: boolean;
  }>) {
    const response = await fetch(`${API_BASE_URL}/formations/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(formation),
    });
    return this.handleResponse(response);
  }

  async deleteFormation(id: string) {
    const response = await fetch(`${API_BASE_URL}/formations/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Services methods
  async getServices() {
    const response = await fetch(`${API_BASE_URL}/services`);
    return this.handleResponse(response);
  }

  async createService(service: {
    name: string;
    description: string;
    price: number;
    duration: number;
  }) {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(service),
    });
    return this.handleResponse(response);
  }

  async updateService(id: string, service: Partial<{
    name: string;
    description: string;
    price: number;
    duration: number;
    isActive: boolean;
  }>) {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(service),
    });
    return this.handleResponse(response);
  }

  async deleteService(id: string) {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Reservations methods
  async getReservations() {
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateReservationStatus(id: string, status: string) {
    const response = await fetch(`${API_BASE_URL}/reservations/${id}/status`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ status }),
    });
    return this.handleResponse(response);
  }

  // Clients methods
  async getClients() {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async createClient(client: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(client),
    });
    return this.handleResponse(response);
  }

  async updateClient(id: string, client: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }>) {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(client),
    });
    return this.handleResponse(response);
  }

  async deleteClient(id: string) {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Enhanced reservations methods
  async createReservation(reservation: {
    date: string;
    time: string;
    clientId: string;
    serviceId?: string;
    formationId?: string;
    notes?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(reservation),
    });
    return this.handleResponse(response);
  }

  async updateReservation(id: string, reservation: Partial<{
    date: string;
    time: string;
    status: string;
    notes: string;
    clientId: string;
    serviceId: string;
    formationId: string;
  }>) {
    const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(reservation),
    });
    return this.handleResponse(response);
  }

  async deleteReservation(id: string) {
    const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }
}

export const apiClient = new ApiClient();