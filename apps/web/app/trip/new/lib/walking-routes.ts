import type { WalkingSegment, DayActivity } from "../types";

const OSRM_FOOT_API = "https://routing.openstreetmap.de/routed-foot/route/v1/foot";

export async function fetchWalkingRoute(
  from: { longitude: number; latitude: number },
  to: { longitude: number; latitude: number }
): Promise<WalkingSegment | null> {
  try {
    const url = `${OSRM_FOOT_API}/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?overview=full&geometries=geojson`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.code === "Ok" && data.routes?.[0]) {
      const route = data.routes[0];
      return {
        distanceMeters: Math.round(route.distance),
        durationMinutes: Math.round(route.duration / 60),
        coordinates: route.geometry.coordinates as [number, number][],
      };
    }
  } catch (error) {
    console.error("Failed to fetch walking route:", error);
  }

  return null;
}

export async function fetchAllWalkingRoutes(
  activities: DayActivity[]
): Promise<Map<string, WalkingSegment>> {
  const routes = new Map<string, WalkingSegment>();

  if (activities.length < 2) return routes;

  const promises = activities.slice(0, -1).map(async (from, index) => {
    const to = activities[index + 1];
    if (!from || !to) return;

    const segmentKey = `${from.id}-${to.id}`;
    const segment = await fetchWalkingRoute(
      { longitude: from.longitude, latitude: from.latitude },
      { longitude: to.longitude, latitude: to.latitude }
    );

    if (segment) {
      routes.set(segmentKey, segment);
    }
  });

  await Promise.all(promises);
  return routes;
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
}

export function calculateTotalWalking(
  walkingSegments: WalkingSegment[]
): { totalMinutes: number; totalMeters: number } {
  return walkingSegments.reduce(
    (acc, segment) => ({
      totalMinutes: acc.totalMinutes + segment.durationMinutes,
      totalMeters: acc.totalMeters + segment.distanceMeters,
    }),
    { totalMinutes: 0, totalMeters: 0 }
  );
}
