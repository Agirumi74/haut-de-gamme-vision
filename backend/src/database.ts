// Database initialization and mock data setup
// This replaces the in-memory mock arrays with a simple local storage simulation
// In production, this would use the actual Prisma client

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Formation {
  id: string;
  title: string;
  description: string;
  duration: number;
  level: string;
  price: number;
  maxStudents: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Reservation {
  id: string;
  date: Date;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  clientId: string;
  serviceId?: string;
  formationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
  createdAt: Date;
  updatedAt: Date;
}

class DatabaseManager {
  private services: Service[] = [];
  private formations: Formation[] = [];
  private clients: Client[] = [];
  private reservations: Reservation[] = [];
  private users: User[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize with some default data
    this.services = [
      {
        id: '1',
        name: 'Maquillage Jour',
        description: 'Maquillage naturel pour tous les jours',
        price: 45,
        duration: 60,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Maquillage Soirée',
        description: 'Maquillage sophistiqué pour vos soirées',
        price: 65,
        duration: 90,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Maquillage Mariée',
        description: 'Maquillage parfait pour votre jour J',
        price: 120,
        duration: 120,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4',
        name: 'Consultation Beauté',
        description: 'Conseils personnalisés selon votre morphologie',
        price: 35,
        duration: 45,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.formations = [
      {
        id: '1',
        title: 'Formation Débutante',
        description: 'Apprenez les bases du maquillage pour un usage quotidien',
        duration: 4,
        level: 'débutant',
        price: 149,
        maxStudents: 8,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        title: 'Formation Professionnelle',
        description: 'Maîtrisez les techniques avancées pour devenir maquilleuse professionnelle',
        duration: 16,
        level: 'avancé',
        price: 599,
        maxStudents: 6,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        title: 'Formation Mariée',
        description: 'Spécialisez-vous dans le maquillage mariée',
        duration: 8,
        level: 'intermédiaire',
        price: 299,
        maxStudents: 10,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.clients = [
      {
        id: '1',
        firstName: 'Marie',
        lastName: 'Dupont',
        email: 'marie.dupont@email.com',
        phone: '06 12 34 56 78',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        firstName: 'Sarah',
        lastName: 'Martin',
        email: 'sarah.martin@email.com',
        phone: '06 98 76 54 32',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.reservations = [
      {
        id: '1',
        date: new Date('2024-12-20'),
        time: '14:00',
        status: 'CONFIRMED',
        notes: 'Première séance',
        clientId: '1',
        serviceId: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        date: new Date('2024-12-22'),
        time: '10:00',
        status: 'PENDING',
        clientId: '2',
        formationId: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.users = [
      {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@hautdegammevision.com',
        password: '$2b$10$h9kGcOWDFtQiqa8bzRewx.0iP3PicE792UJuX6uxz7FsTLdAOLf/6', // "admin123"
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  // Services CRUD
  getAllServices(): Service[] {
    return this.services.filter(s => s.isActive);
  }

  getServiceById(id: string): Service | undefined {
    return this.services.find(s => s.id === id);
  }

  createService(data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Service {
    const service: Service = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.services.push(service);
    return service;
  }

  updateService(id: string, data: Partial<Omit<Service, 'id' | 'createdAt'>>): Service | null {
    const index = this.services.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    this.services[index] = {
      ...this.services[index],
      ...data,
      updatedAt: new Date()
    };
    return this.services[index];
  }

  deleteService(id: string): boolean {
    const index = this.services.findIndex(s => s.id === id);
    if (index === -1) return false;
    
    // Soft delete
    this.services[index].isActive = false;
    this.services[index].updatedAt = new Date();
    return true;
  }

  // Formations CRUD
  getAllFormations(): Formation[] {
    return this.formations.filter(f => f.isActive);
  }

  getFormationById(id: string): Formation | undefined {
    return this.formations.find(f => f.id === id);
  }

  createFormation(data: Omit<Formation, 'id' | 'createdAt' | 'updatedAt'>): Formation {
    const formation: Formation = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.formations.push(formation);
    return formation;
  }

  updateFormation(id: string, data: Partial<Omit<Formation, 'id' | 'createdAt'>>): Formation | null {
    const index = this.formations.findIndex(f => f.id === id);
    if (index === -1) return null;
    
    this.formations[index] = {
      ...this.formations[index],
      ...data,
      updatedAt: new Date()
    };
    return this.formations[index];
  }

  deleteFormation(id: string): boolean {
    const index = this.formations.findIndex(f => f.id === id);
    if (index === -1) return false;
    
    // Soft delete
    this.formations[index].isActive = false;
    this.formations[index].updatedAt = new Date();
    return true;
  }

  // Clients CRUD
  getAllClients(): Client[] {
    return this.clients;
  }

  getClientById(id: string): Client | undefined {
    return this.clients.find(c => c.id === id);
  }

  getClientByEmail(email: string): Client | undefined {
    return this.clients.find(c => c.email === email);
  }

  createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client {
    const existingClient = this.getClientByEmail(data.email);
    if (existingClient) {
      throw new Error('Client with this email already exists');
    }

    const client: Client = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.clients.push(client);
    return client;
  }

  updateClient(id: string, data: Partial<Omit<Client, 'id' | 'createdAt'>>): Client | null {
    const index = this.clients.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    // Check email uniqueness if email is being updated
    if (data.email && data.email !== this.clients[index].email) {
      const existingClient = this.getClientByEmail(data.email);
      if (existingClient && existingClient.id !== id) {
        throw new Error('Client with this email already exists');
      }
    }
    
    this.clients[index] = {
      ...this.clients[index],
      ...data,
      updatedAt: new Date()
    };
    return this.clients[index];
  }

  deleteClient(id: string): boolean {
    const index = this.clients.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.clients.splice(index, 1);
    return true;
  }

  // Reservations CRUD
  getAllReservations(): Reservation[] {
    return this.reservations;
  }

  getReservationById(id: string): Reservation | undefined {
    return this.reservations.find(r => r.id === id);
  }

  createReservation(data: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>): Reservation {
    const reservation: Reservation = {
      ...data,
      id: Date.now().toString(),
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.reservations.push(reservation);
    return reservation;
  }

  updateReservation(id: string, data: Partial<Omit<Reservation, 'id' | 'createdAt'>>): Reservation | null {
    const index = this.reservations.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    this.reservations[index] = {
      ...this.reservations[index],
      ...data,
      updatedAt: new Date()
    };
    return this.reservations[index];
  }

  deleteReservation(id: string): boolean {
    const index = this.reservations.findIndex(r => r.id === id);
    if (index === -1) return false;
    
    this.reservations.splice(index, 1);
    return true;
  }

  updateReservationStatus(id: string, status: Reservation['status']): Reservation | null {
    return this.updateReservation(id, { status });
  }

  // Users
  getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }
}

// Singleton instance
export const db = new DatabaseManager();