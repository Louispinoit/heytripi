import {
  CreditCard,
  Globe,
  Hotel,
  MapPin,
  MessageCircle,
  Plane,
} from "lucide-react";

export const FEATURES = [
  {
    icon: Plane,
    title: "Recherche de vols",
    description:
      "Compare les meilleurs vols en temps réel. Tripy trouve les meilleures offres pour toi.",
  },
  {
    icon: Hotel,
    title: "Suggestions d'hôtels",
    description:
      "Des hôtels adaptés à ton budget et tes préférences. Réserve directement sur les sites partenaires.",
  },
  {
    icon: MapPin,
    title: "Activités locales",
    description:
      "Découvre les meilleures activités, restaurants et spots secrets de chaque destination.",
  },
  {
    icon: MessageCircle,
    title: "Conversation naturelle",
    description:
      "Parle à Tripy comme à un ami. Il comprend tes envies et s'adapte à toi.",
  },
  {
    icon: Globe,
    title: "Carte interactive",
    description:
      "Visualise ton itinéraire sur une carte. Optimise tes déplacements facilement.",
  },
  {
    icon: CreditCard,
    title: "Gestion du budget",
    description:
      "Suis tes dépenses en temps réel. Tripy t'alerte si tu dépasses ton budget.",
  },
];

export const STEPS = [
  {
    number: "1",
    title: "Dis où tu veux aller",
    description:
      "Parle à Tripy de ta destination idéale, tes dates et ton budget.",
  },
  {
    number: "2",
    title: "Tripy te propose",
    description:
      "Il recherche les meilleurs vols, hôtels et activités pour toi.",
  },
  {
    number: "3",
    title: "Organise et réserve",
    description: "Valide tes choix et réserve via nos partenaires en un clic.",
  },
];

export const PRICING_PLANS = [
  {
    title: "Gratuit",
    price: "0€",
    description: "Tripy Découverte",
    features: [
      "2 voyages par mois",
      "Chat IA (20 msg/voyage)",
      "Carte interactive basique",
      "1 collaborateur",
    ],
  },
  {
    title: "Tripy+",
    price: "5.99€",
    period: "/mois",
    description: "L'essentiel du voyage",
    features: [
      "Voyages illimités",
      "Chat IA illimité",
      "Prix temps réel",
      "5 collaborateurs",
      "Mode offline + Sync calendrier",
    ],
    highlighted: true,
  },
  {
    title: "Tripy Pro",
    price: "9.99€",
    period: "/mois",
    description: "Le compagnon ultime",
    features: [
      "Tout Tripy+",
      "10 collaborateurs",
      "Alertes prix illimitées",
      "Compagnon de voyage",
      "Journal auto + Score éco",
    ],
  },
];

export const FOOTER_LINKS = [
  { href: "#", label: "À propos" },
  { href: "#", label: "Blog" },
  { href: "#", label: "Contact" },
  { href: "#", label: "Confidentialité" },
  { href: "#", label: "CGU" },
];
