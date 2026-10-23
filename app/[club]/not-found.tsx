import { listClubSlugs } from "@/lib/api/home-page";
import { NotFoundView } from "@/components/layout/not-found-view";

// Reached for a missing page of a club, or for a club that doesn't exist.
export default async function ClubNotFound() {
  return <NotFoundView clubs={await listClubSlugs()} />;
}
