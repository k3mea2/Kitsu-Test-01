const axios = require('axios');

// Configuración base para la API de Kitsu
const kitsuAPI = axios.create({
  baseURL: 'https://kitsu.io/api/edge',
  headers: {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json'
  }
});

describe('Kitsu API - Endpoints de Anime', () => {
  
  test('GET /anime - Debe devolver una lista de animes', async () => {
    const response = await kitsuAPI.get('/anime');
    
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.data.data).toBeInstanceOf(Array);
    expect(response.data.data.length).toBeGreaterThan(0);
    
    // Verificar estructura JSON:API
    expect(response.data.data[0]).toHaveProperty('id');
    expect(response.data.data[0]).toHaveProperty('type', 'anime');
    expect(response.data.data[0]).toHaveProperty('attributes');
    
    console.log('✅ Primer anime:', response.data.data[0].attributes.canonicalTitle);
  }, 10000);

  test('GET /anime - Debe tener atributos esperados de anime', async () => {
    const response = await kitsuAPI.get('/anime?page[limit]=1');
    const anime = response.data.data[0];
    
    expect(anime.attributes).toHaveProperty('canonicalTitle');
    expect(anime.attributes).toHaveProperty('synopsis');
    expect(anime.attributes).toHaveProperty('averageRating');
    expect(anime.attributes).toHaveProperty('startDate');
    expect(anime.attributes).toHaveProperty('endDate');
    expect(anime.attributes).toHaveProperty('episodeCount');
    expect(anime.attributes).toHaveProperty('posterImage');
    
    console.log('✅ Anime completo:', {
      title: anime.attributes.canonicalTitle,
      rating: anime.attributes.averageRating,
      episodes: anime.attributes.episodeCount
    });
  }, 10000);

  test('GET /anime/:id - Debe devolver un anime específico', async () => {
    // ID 1 es "Cowboy Bebop" en Kitsu
    const response = await kitsuAPI.get('/anime/1');
    
    expect(response.status).toBe(200);
    expect(response.data.data).toBeDefined();
    expect(response.data.data.id).toBe('1');
    expect(response.data.data.type).toBe('anime');
    expect(response.data.data.attributes.canonicalTitle).toBeDefined();
    
    console.log('✅ Anime ID 1:', response.data.data.attributes.canonicalTitle);
  }, 10000);

  test('GET /anime?filter[text] - Debe buscar animes por texto', async () => {
    const response = await kitsuAPI.get('/anime?filter[text]=naruto');
    
    expect(response.status).toBe(200);
    expect(response.data.data).toBeInstanceOf(Array);
    expect(response.data.data.length).toBeGreaterThan(0);
    
    // Verificar que los resultados contienen "naruto" en el título
    const hasNaruto = response.data.data.some(anime => 
      anime.attributes.canonicalTitle.toLowerCase().includes('naruto')
    );
    expect(hasNaruto).toBe(true);
    
    console.log('✅ Encontrados', response.data.data.length, 'animes con "naruto"');
  }, 10000);

  test('GET /anime?filter[categories] - Debe filtrar por categoría', async () => {
    const response = await kitsuAPI.get('/anime?filter[categories]=adventure&page[limit]=5');
    
    expect(response.status).toBe(200);
    expect(response.data.data).toBeInstanceOf(Array);
    
    console.log('✅ Encontrados', response.data.data.length, 'animes de aventura');
  }, 10000);

  test('GET /anime?sort - Debe ordenar por popularidad', async () => {
    const response = await kitsuAPI.get('/anime?sort=-userCount&page[limit]=3');
    
    expect(response.status).toBe(200);
    expect(response.data.data).toBeInstanceOf(Array);
    expect(response.data.data.length).toBeGreaterThan(0);
    
    console.log('✅ Top 3 animes más populares:');
    response.data.data.forEach((anime, index) => {
      console.log(`   ${index + 1}. ${anime.attributes.canonicalTitle} - ${anime.attributes.userCount} usuarios`);
    });
  }, 10000);

  test('GET /anime?include - Debe incluir relaciones', async () => {
    const response = await kitsuAPI.get('/anime/1?include=categories');
    
    expect(response.status).toBe(200);
    expect(response.data.data).toBeDefined();
    expect(response.data.included).toBeDefined();
    expect(response.data.included.length).toBeGreaterThan(0);
    
    console.log('✅ Relaciones incluidas:', response.data.included.length, 'recursos');
  }, 10000);

  test('GET /anime?page - Debe paginar correctamente', async () => {
    const response = await kitsuAPI.get('/anime?page[limit]=5&page[offset]=10');
    
    expect(response.status).toBe(200);
    expect(response.data.data.length).toBeLessThanOrEqual(5);
    expect(response.data.links).toBeDefined();
    expect(response.data.links).toHaveProperty('first');
    expect(response.data.links).toHaveProperty('next');
    expect(response.data.links).toHaveProperty('last');
    
    console.log('✅ Paginación funcionando correctamente');
  }, 10000);

  test('GET /anime?fields - Debe devolver solo campos específicos', async () => {
    const response = await kitsuAPI.get('/anime/1?fields[anime]=canonicalTitle,averageRating');
    
    expect(response.status).toBe(200);
    const anime = response.data.data;
    
    expect(anime.attributes).toHaveProperty('canonicalTitle');
    expect(anime.attributes).toHaveProperty('averageRating');
    
    // No debe tener otros campos como synopsis
    const keys = Object.keys(anime.attributes);
    expect(keys.length).toBeLessThanOrEqual(3); // canonicalTitle, averageRating y posiblemente algún campo más
    
    console.log('✅ Campos sparse funcionando:', keys);
  }, 10000);

  test('Debe manejar errores 404 correctamente', async () => {
    try {
      await kitsuAPI.get('/anime/999999999');
      fail('Debería haber lanzado un error 404');
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data.errors).toBeDefined();
      expect(error.response.data.errors[0]).toHaveProperty('title');
      expect(error.response.data.errors[0]).toHaveProperty('status', '404');
      
      console.log('✅ Error 404 manejado correctamente');
    }
  }, 10000);
});
