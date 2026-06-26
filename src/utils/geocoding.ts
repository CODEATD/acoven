export interface GeocodeResult {
  lat: number;
  lng: number;
  label: string;
}

export async function fetchByAddress(address: string): Promise<GeocodeResult | null> {
  const query = encodeURIComponent(`${address}, Venezuela`);
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1&countrycodes=ve`
  );
  const data = await res.json();
  if (!data || data.length === 0) return null;
  return {
    lat: parseFloat(parseFloat(data[0].lat).toFixed(5)),
    lng: parseFloat(parseFloat(data[0].lon).toFixed(5)),
    label: data[0].display_name.split(',')[0],
  };
}
