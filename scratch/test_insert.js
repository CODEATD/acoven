const url = 'https://jjesmcdxvjjlffhsxmbl.supabase.co/rest/v1/puntos_acopio';
const apikey = 'sb_publishable_BMJNv6n4UHEDkIs4bgSfcA_1H4A-l7T';

const body = {
  nombre: "Centro de Acopio de Prueba",
  estado: "Distrito Capital",
  descripcion: "Descripción de prueba para verificar conexión",
  lat: 10.5,
  lng: -66.9,
  direccion: "Av. Principal de Prueba",
  tipo_acopio: "Alimentos",
  estado_operativo: "activo"
};

fetch(url, {
  method: 'POST',
  headers: {
    'apikey': apikey,
    'Authorization': `Bearer ${apikey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify(body)
})
.then(res => res.json())
.then(data => {
  console.log('Success:', data);
})
.catch(err => {
  console.error('Error:', err);
});
