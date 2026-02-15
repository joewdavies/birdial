import { useMemo } from "react";
import type { Bird } from "../types";
import type { FeatureCollection, Feature, LineString, Point } from "geojson";

interface BirdMigrationGeoJSON {
  tracks: FeatureCollection<LineString>;
  positions: FeatureCollection<Point>;
}

/**
 * Normalizes a sequence of coordinates to handle antimeridian crossing.
 * When consecutive points cross the ±180° boundary, we adjust longitudes
 * to exceed ±180° so the line renders correctly across the dateline.
 */
function normalizeCoordinatesForAntimeridian(
  coords: [number, number][],
): [number, number][] {
  if (coords.length < 2) return coords;

  const result: [number, number][] = [coords[0]];
  let offset = 0;

  for (let i = 1; i < coords.length; i++) {
    const prevLng = coords[i - 1][0] + offset;
    const currLng = coords[i][0];
    const currLat = coords[i][1];

    // Check if we crossed the antimeridian
    const diff = currLng - (prevLng - offset);

    if (diff > 180) {
      // Jumped from east to west (e.g., 170 to -170)
      offset -= 360;
    } else if (diff < -180) {
      // Jumped from west to east (e.g., -170 to 170)
      offset += 360;
    }

    result.push([currLng + offset, currLat]);
  }

  return result;
}

function interpolatePosition(
  route: Bird["route"],
  monthProgress: number,
): [number, number] {
  const totalMonths = 12;
  const normalizedProgress =
    ((monthProgress % totalMonths) + totalMonths) % totalMonths;

  const floorMonth = Math.floor(normalizedProgress);
  const ceilMonth = (floorMonth + 1) % totalMonths;
  const fraction = normalizedProgress - floorMonth;

  const start = route.find((p) => p.month === floorMonth);
  const end = route.find((p) => p.month === ceilMonth);

  if (!start || !end) {
    return route[0].coordinates;
  }

  // Handle antimeridian for interpolation
  let startLng = start.coordinates[0];
  let endLng = end.coordinates[0];

  const lngDiff = endLng - startLng;
  if (lngDiff > 180) {
    endLng -= 360;
  } else if (lngDiff < -180) {
    endLng += 360;
  }

  let lng = startLng + (endLng - startLng) * fraction;
  const lat =
    start.coordinates[1] +
    (end.coordinates[1] - start.coordinates[1]) * fraction;

  // Normalize longitude back to -180 to 180 range for the marker
  while (lng > 180) lng -= 360;
  while (lng < -180) lng += 360;

  return [lng, lat];
}

function getTrackUpToMonth(
  route: Bird["route"],
  monthProgress: number,
): [number, number][] {
  const points: [number, number][] = [];
  const currentMonth = Math.floor(monthProgress);

  for (let i = 0; i <= currentMonth && i < route.length; i++) {
    const point = route.find((p) => p.month === i);
    if (point) {
      points.push(point.coordinates);
    }
  }

  // Add interpolated current position
  const floorMonth = Math.floor(monthProgress);
  const ceilMonth = (floorMonth + 1) % 12;
  const fraction = monthProgress - floorMonth;

  const start = route.find((p) => p.month === floorMonth);
  const end = route.find((p) => p.month === ceilMonth);

  if (start && end && fraction > 0) {
    let startLng = start.coordinates[0];
    let endLng = end.coordinates[0];

    const lngDiff = endLng - startLng;
    if (lngDiff > 180) {
      endLng -= 360;
    } else if (lngDiff < -180) {
      endLng += 360;
    }

    const lng = startLng + (endLng - startLng) * fraction;
    const lat =
      start.coordinates[1] +
      (end.coordinates[1] - start.coordinates[1]) * fraction;
    points.push([lng, lat]);
  }

  return normalizeCoordinatesForAntimeridian(points);
}

export function useBirdMigrations(
  birds: Bird[],
  visibility: Record<string, boolean>,
  monthProgress: number,
): BirdMigrationGeoJSON {
  return useMemo(() => {
    const visibleBirds = birds.filter((bird) => visibility[bird.id]);

    const trackFeatures: Feature<LineString>[] = visibleBirds.map((bird) => ({
      type: "Feature",
      properties: {
        id: bird.id,
        name: bird.name,
        color: bird.color,
      },
      geometry: {
        type: "LineString",
        coordinates: getTrackUpToMonth(bird.route, monthProgress),
      },
    }));

    const positionFeatures: Feature<Point>[] = visibleBirds.map((bird) => ({
      type: "Feature",
      properties: {
        id: bird.id,
        name: bird.name,
        color: bird.color,
      },
      geometry: {
        type: "Point",
        coordinates: interpolatePosition(bird.route, monthProgress),
      },
    }));

    return {
      tracks: {
        type: "FeatureCollection",
        features: trackFeatures,
      },
      positions: {
        type: "FeatureCollection",
        features: positionFeatures,
      },
    };
  }, [birds, visibility, monthProgress]);
}
