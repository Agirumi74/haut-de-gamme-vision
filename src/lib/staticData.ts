// Static fallback data for when the API is not available
// This ensures the frontend works standalone without a backend

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
}

export interface Formation {
  id: string;
  title: string;
  description: string;
  duration: number;
  level: string;
  price: number;
  maxStudents: number;
  isActive: boolean;
}

export const staticServices: Service[] = [
  {
    id: "1",
    name: "Maquillage Mariée",
    description: "Un maquillage sublime et longue tenue pour le plus beau jour de votre vie. Essai inclus.",
    price: 250,
    duration: 120,
    isActive: true,
  },
  {
    id: "2",
    name: "Maquillage Événement",
    description: "Sublimez-vous pour vos soirées, galas, et occasions spéciales avec un look sur-mesure.",
    price: 120,
    duration: 60,
    isActive: true,
  },
  {
    id: "3",
    name: "Consultation VIP",
    description: "Analyse morphologique personnalisée et conseils beauté adaptés à votre style de vie.",
    price: 180,
    duration: 90,
    isActive: true,
  },
  {
    id: "4",
    name: "Shooting Photo",
    description: "Maquillage professionnel optimisé pour la photographie et la vidéo haute définition.",
    price: 150,
    duration: 75,
    isActive: true,
  },
];

export const staticFormations: Formation[] = [
  {
    id: "1",
    title: "Initiation au Maquillage",
    description: "Apprenez les bases essentielles du maquillage pour sublimer votre beauté au quotidien. Techniques de teint, regard et lèvres.",
    duration: 4,
    level: "Débutant",
    price: 290,
    maxStudents: 4,
    isActive: true,
  },
  {
    id: "2",
    title: "Perfectionnement Avancé",
    description: "Maîtrisez les techniques avancées : contouring, smoky eye, et looks sophistiqués pour toutes les occasions.",
    duration: 6,
    level: "Intermédiaire",
    price: 450,
    maxStudents: 3,
    isActive: true,
  },
  {
    id: "3",
    title: "Formation Pro Complète",
    description: "Formation intensive pour devenir maquilleuse professionnelle. Certification incluse avec portfolio personnel.",
    duration: 35,
    level: "Avancé",
    price: 2500,
    maxStudents: 2,
    isActive: true,
  },
];
