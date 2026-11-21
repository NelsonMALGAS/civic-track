import { customType } from "drizzle-orm/pg-core";

/**
 * PostGIS geography(Point, 4326).
 *
 * Supply values as WKT, for example:
 *   SRID=4326;POINT(28.0473 -26.2041)
 *
 * IMPORTANT: Point order is longitude, latitude (X, Y).
 * Use the helper below to avoid accidentally reversing coordinates.
 */
export const geographyPoint = customType<{
  data: string;
  driverData: string;
}>({
  dataType() {
    return "geography(Point, 4326)";
  },
});

export function toGeographyPoint(longitude: number, latitude: number): string {
  if (longitude < -180 || longitude > 180) {
    throw new Error("Longitude must be between -180 and 180");
  }
  if (latitude < -90 || latitude > 90) {
    throw new Error("Latitude must be between -90 and 90");
  }
  return `SRID=4326;POINT(${longitude} ${latitude})`;
}
