import { notFound } from "next/navigation";

// Booking, account and the other club pages live outside this home page.
// Any sub-path renders the club's 404 instead of Next's default one. Nothing
// here ever renders, so there's no navigation to validate as instant.
export const instant = false;

export default function ClubSubPage() {
  notFound();
}
