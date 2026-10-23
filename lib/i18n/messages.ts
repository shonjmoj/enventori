/*
 * UI copy, keyed by the tenant's locale. Only French ships today; another
 * locale is one more object with the same shape.
 */

const fr = {
  timeSeparator: "h",
  dateAtTime: (date: string, time: string) => `${date} à ${time}`,
  skipToContent: "Aller au contenu",
  header: {
    home: (club: string) => `${club}, accueil billetterie`,
    /** Appended, for screen readers, to the visible club name. */
    homeSuffix: ", accueil billetterie",
    menu: "Menu",
    closeMenu: "Fermer le menu",
    account: "Mon compte",
    cart: "Panier",
    newTab: "(s’ouvre dans un nouvel onglet)",
  },
  meta: {
    description: (club: string) =>
      `Billetterie officielle de ${club} : réservez vos places pour les prochains matchs et événements.`,
  },
  notice: { dismiss: "Masquer ce message" },
  hero: {
    browse: "Voir les dates",
    versus: "contre",
  },
  events: {
    headingMatches: "Prochains matchs",
    headingEvents: "Prochains événements",
    filterLabel: "Filtrer par compétition",
    all: "Tout",
    /** Plural templates, `#` = count. Plain strings so client components can use them. */
    showMore: { one: "Afficher # autre date", other: "Afficher # autres dates" } as Partial<
      Record<Intl.LDMLPluralRule, string>
    > & { other: string },
    emptyTitle: "Aucune date en vente pour le moment",
    emptyBody: "Les prochains matchs apparaîtront ici dès leur mise en vente.",
    dateTbc: "Date à confirmer",
    dateTbcShort: "À confirmer",
    around: (date: string) => `prévu autour du ${date}`,
    away: (city: string) => `Déplacement à ${city}`,
    localTime: (time: string, city: string) => `${time} à ${city}`,
    priceFrom: (price: string) => `À partir de ${price}`,
  },
  kinds: {
    EXPERIENCE: "Expériences",
  } as Record<string, string>,
  otherKind: "Autres événements",
  sale: {
    book: "Réserver",
    details: "Plus d’infos",
    soldOut: "Complet",
    onSale: "En vente",
    presaleOpen: (audience: string, end: string) => `Prévente ${audience} jusqu’au ${end}`,
    presaleSoon: (audience: string, start: string) => `Prévente ${audience} le ${start}`,
    publicSale: (date: string) => `grand public le ${date}`,
    opensAt: (date: string) => `Ouverture de la vente le ${date}`,
    notAnnounced: "Mise en vente prochainement",
  },
  audiences: {
    MEMBERS: "abonnés",
  } as Record<string, string>,
  audienceFallback: "réservée",
  video: { play: (title: string) => `Lire la vidéo : ${title}`, fallbackTitle: "Vidéo" },
  partners: { fallbackTitle: "Partenaires" },
  footer: {
    navigation: "Navigation",
    help: "Aide et informations",
    legal: [
      { label: "Conditions générales de vente", href: "/cgv" },
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "Données personnelles", href: "/confidentialite" },
    ],
    poweredBy: "Billetterie Eventori",
  },
};

export type Messages = typeof fr;

const catalog: Record<string, Messages> = { fr };

export function getMessages(locale: string): Messages {
  const language = locale.split("-")[0].toLowerCase();
  return catalog[language] ?? fr;
}

export function audienceLabel(messages: Messages, audience: string): string {
  return messages.audiences[audience] ?? messages.audienceFallback;
}
