export interface GeoLocationResult {
  latitude: number;
  longitude: number;
  displayName: string;
  neighborhood?: string;
  city?: string;
}

export async function getCurrentUserLocation(): Promise<GeoLocationResult> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          // Attempt reverse geocoding via OpenStreetMap Nominatim (free, no auth required)
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3500);

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
            {
              signal: controller.signal,
              headers: { 'Accept-Language': 'en' },
            }
          );
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const place =
              addr.road ||
              addr.suburb ||
              addr.neighbourhood ||
              addr.residential ||
              addr.city_district ||
              'Current Street';
            const city = addr.city || addr.town || addr.county || addr.state || '';
            const full = city ? `${place}, ${city}` : place;

            resolve({
              latitude: lat,
              longitude: lng,
              displayName: full || `Near ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
              neighborhood: place,
              city,
            });
            return;
          }
        } catch {
          // Reverse geocoding failed or timed out, return coordinates display
        }

        resolve({
          latitude: lat,
          longitude: lng,
          displayName: `Location: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`,
        });
      },
      (err) => {
        reject(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000,
      }
    );
  });
}
