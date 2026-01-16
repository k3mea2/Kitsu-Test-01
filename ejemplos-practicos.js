/**
 * EJEMPLOS PRÁCTICOS - API DE KITSU
 * 
 * Este archivo contiene ejemplos listos para usar de consultas a la API de Kitsu.
 * Puedes ejecutar estos ejemplos con: node ejemplos-practicos.js
 */

const axios = require('axios');

// Configuración de la API
const kitsuAPI = axios.create({
  baseURL: 'https://kitsu.io/api/edge',
  headers: {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json'
  }
});

// ============================================================================
// EJEMPLO 1: Obtener exactamente 10 animes
// ============================================================================
async function obtener10Animes() {
  console.log('\n━━━ EJEMPLO 1: Obtener 10 animes ━━━');
  try {
    const response = await kitsuAPI.get('/anime?page[limit]=10');
    const animes = response.data.data;
    
    console.log(`\nSe encontraron ${animes.length} animes:\n`);
    animes.forEach((anime, index) => {
      console.log(`${index + 1}. ${anime.attributes.canonicalTitle}`);
      console.log(`   Rating: ${anime.attributes.averageRating || 'N/A'}`);
      console.log(`   Episodios: ${anime.attributes.episodeCount || 'N/A'}`);
      console.log(`   Tipo: ${anime.attributes.subtype}\n`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// EJEMPLO 2: Obtener animes por categoría específica
// ============================================================================
async function obtenerPorCategoria(categoria, limite = 10) {
  console.log(`\n━━━ EJEMPLO 2: Animes de categoría "${categoria}" ━━━`);
  try {
    const response = await kitsuAPI.get(
      `/anime?filter[categories]=${categoria}&page[limit]=${limite}`
    );
    const animes = response.data.data;
    
    console.log(`\nEncontrados ${animes.length} animes de ${categoria}:\n`);
    animes.forEach((anime, index) => {
      console.log(`${index + 1}. ${anime.attributes.canonicalTitle}`);
      console.log(`   Rating: ${anime.attributes.averageRating || 'N/A'}`);
      console.log(`   Status: ${anime.attributes.status}\n`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// EJEMPLO 3: Top 10 animes más populares
// ============================================================================
async function top10Populares() {
  console.log('\n━━━ EJEMPLO 3: Top 10 animes más populares ━━━');
  try {
    const response = await kitsuAPI.get('/anime?sort=-userCount&page[limit]=10');
    const animes = response.data.data;
    
    console.log('\nTop 10 animes más populares:\n');
    animes.forEach((anime, index) => {
      console.log(`${index + 1}. ${anime.attributes.canonicalTitle}`);
      console.log(`   👥 ${anime.attributes.userCount.toLocaleString()} usuarios`);
      console.log(`   ⭐ Rating: ${anime.attributes.averageRating || 'N/A'}\n`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// EJEMPLO 4: Buscar animes por texto
// ============================================================================
async function buscarAnime(texto, limite = 10) {
  console.log(`\n━━━ EJEMPLO 4: Buscar "${texto}" ━━━`);
  try {
    const response = await kitsuAPI.get(
      `/anime?filter[text]=${encodeURIComponent(texto)}&page[limit]=${limite}`
    );
    const animes = response.data.data;
    
    console.log(`\nEncontrados ${animes.length} resultados para "${texto}":\n`);
    animes.forEach((anime, index) => {
      console.log(`${index + 1}. ${anime.attributes.canonicalTitle}`);
      console.log(`   Año: ${anime.attributes.startDate?.substring(0, 4) || 'N/A'}`);
      console.log(`   Tipo: ${anime.attributes.subtype}\n`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// EJEMPLO 5: Animes por múltiples filtros combinados
// ============================================================================
async function animesFiltrosMultiples() {
  console.log('\n━━━ EJEMPLO 5: Películas de acción del 2020 ━━━');
  try {
    const response = await kitsuAPI.get(
      '/anime?filter[subtype]=movie&filter[categories]=action&filter[seasonYear]=2020&page[limit]=10'
    );
    const animes = response.data.data;
    
    console.log(`\nEncontradas ${animes.length} películas de acción del 2020:\n`);
    animes.forEach((anime, index) => {
      console.log(`${index + 1}. ${anime.attributes.canonicalTitle}`);
      console.log(`   Rating: ${anime.attributes.averageRating || 'N/A'}`);
      console.log(`   Fecha: ${anime.attributes.startDate || 'N/A'}\n`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// EJEMPLO 6: Obtener anime específico con categorías incluidas
// ============================================================================
async function obtenerAnimeConCategorias(id) {
  console.log(`\n━━━ EJEMPLO 6: Anime ID ${id} con categorías ━━━`);
  try {
    const response = await kitsuAPI.get(`/anime/${id}?include=categories`);
    const anime = response.data.data;
    const categorias = response.data.included || [];
    
    console.log(`\nAnime: ${anime.attributes.canonicalTitle}`);
    console.log(`Sinopsis: ${anime.attributes.synopsis?.substring(0, 150)}...`);
    console.log(`Rating: ${anime.attributes.averageRating || 'N/A'}`);
    console.log(`Episodios: ${anime.attributes.episodeCount || 'N/A'}`);
    console.log(`\nCategorías:`);
    categorias.forEach(cat => {
      if (cat.type === 'categories') {
        console.log(`  • ${cat.attributes.title}`);
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// EJEMPLO 7: Listar todas las categorías disponibles
// ============================================================================
async function listarCategorias(limite = 20) {
  console.log(`\n━━━ EJEMPLO 7: Primeras ${limite} categorías ━━━`);
  try {
    const response = await kitsuAPI.get(`/categories?page[limit]=${limite}`);
    const categorias = response.data.data;
    
    console.log(`\nCategorías disponibles:\n`);
    categorias.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.attributes.title} (slug: ${cat.attributes.slug})`);
    });
    console.log(`\n💡 Usa estos slugs para filtrar animes por categoría`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// EJEMPLO 8: Animes de diferentes tipos (TV, Movie, OVA, etc.)
// ============================================================================
async function animesPorTipo(tipo, limite = 10) {
  console.log(`\n━━━ EJEMPLO 8: ${limite} animes tipo "${tipo}" ━━━`);
  try {
    const response = await kitsuAPI.get(
      `/anime?filter[subtype]=${tipo}&sort=-averageRating&page[limit]=${limite}`
    );
    const animes = response.data.data;
    
    console.log(`\nTop ${animes.length} ${tipo} mejor calificados:\n`);
    animes.forEach((anime, index) => {
      console.log(`${index + 1}. ${anime.attributes.canonicalTitle}`);
      console.log(`   ⭐ ${anime.attributes.averageRating || 'N/A'}`);
      console.log(`   📅 ${anime.attributes.startDate?.substring(0, 4) || 'N/A'}\n`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// EJEMPLO 9: Animes por temporada
// ============================================================================
async function animesPorTemporada(temporada, año, limite = 10) {
  console.log(`\n━━━ EJEMPLO 9: Animes de ${temporada} ${año} ━━━`);
  try {
    const response = await kitsuAPI.get(
      `/anime?filter[season]=${temporada}&filter[seasonYear]=${año}&page[limit]=${limite}`
    );
    const animes = response.data.data;
    
    console.log(`\nAnimes de ${temporada} ${año}:\n`);
    animes.forEach((anime, index) => {
      console.log(`${index + 1}. ${anime.attributes.canonicalTitle}`);
      console.log(`   Tipo: ${anime.attributes.subtype}`);
      console.log(`   Rating: ${anime.attributes.averageRating || 'N/A'}\n`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// EJEMPLO 10: Información resumida (solo campos específicos)
// ============================================================================
async function informacionResumida(limite = 10) {
  console.log(`\n━━━ EJEMPLO 10: Información resumida de ${limite} animes ━━━`);
  try {
    const response = await kitsuAPI.get(
      `/anime?fields[anime]=canonicalTitle,averageRating,episodeCount,subtype&page[limit]=${limite}`
    );
    const animes = response.data.data;
    
    console.log('\nAnimes (solo campos esenciales):\n');
    animes.forEach((anime, index) => {
      console.log(`${index + 1}. ${anime.attributes.canonicalTitle} | ⭐ ${anime.attributes.averageRating || 'N/A'} | 📺 ${anime.attributes.episodeCount || '?'} eps | ${anime.attributes.subtype}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// EJEMPLO 11: Animes más recientemente agregados a Kitsu
// ============================================================================
async function ultimosAnimesAgregados(limite = 20) {
  console.log(`\n━━━ EJEMPLO 11: Últimos ${limite} animes agregados a Kitsu ━━━`);
  try {
    const response = await kitsuAPI.get(
      `/anime?sort=-createdAt&page[limit]=${limite}`
    );
    const animes = response.data.data;
    
    console.log(`\n📅 Animes más recientemente agregados a la base de datos:\n`);
    animes.forEach((anime, index) => {
      const fechaCreacion = new Date(anime.attributes.createdAt);
      const fechaFormateada = fechaCreacion.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      console.log(`${index + 1}. ${anime.attributes.canonicalTitle}`);
      console.log(`   📅 Agregado: ${fechaFormateada}`);
      console.log(`   🎬 Tipo: ${anime.attributes.subtype}`);
      console.log(`   📺 Año: ${anime.attributes.startDate?.substring(0, 4) || 'N/A'}\n`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// EJEMPLO 12: Animes actualizados recientemente
// ============================================================================
async function ultimosAnimesActualizados(limite = 20) {
  console.log(`\n━━━ EJEMPLO 12: Últimos ${limite} animes actualizados ━━━`);
  try {
    const response = await kitsuAPI.get(
      `/anime?sort=-updatedAt&page[limit]=${limite}`
    );
    const animes = response.data.data;
    
    console.log(`\n🔄 Animes actualizados recientemente:\n`);
    animes.forEach((anime, index) => {
      const fechaActualizacion = new Date(anime.attributes.updatedAt);
      const fechaFormateada = fechaActualizacion.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      console.log(`${index + 1}. ${anime.attributes.canonicalTitle}`);
      console.log(`   🔄 Actualizado: ${fechaFormateada}`);
      console.log(`   📊 Status: ${anime.attributes.status}`);
      console.log(`   ⭐ Rating: ${anime.attributes.averageRating || 'N/A'}\n`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// EJEMPLO 13: Animes que están actualmente emitiéndose
// ============================================================================
async function animesEnEmision(limite = 20) {
  console.log(`\n━━━ EJEMPLO 13: Animes actualmente en emisión ━━━`);
  try {
    const response = await kitsuAPI.get(
      `/anime?filter[status]=current&sort=-userCount&page[limit]=${limite}`
    );
    const animes = response.data.data;
    
    console.log(`\n📡 Animes que están emitiéndose actualmente (ordenados por popularidad):\n`);
    animes.forEach((anime, index) => {
      console.log(`${index + 1}. ${anime.attributes.canonicalTitle}`);
      console.log(`   📅 Inicio: ${anime.attributes.startDate || 'N/A'}`);
      console.log(`   👥 ${anime.attributes.userCount?.toLocaleString() || 'N/A'} usuarios`);
      console.log(`   ⭐ Rating: ${anime.attributes.averageRating || 'N/A'}\n`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// EJEMPLO 14: Verificar actualización - Animes más recientes por año
// ============================================================================
async function animesRecientesPorAño(limite = 15) {
  console.log(`\n━━━ EJEMPLO 14: Animes más recientes (por año de estreno) ━━━`);
  try {
    const response = await kitsuAPI.get(
      `/anime?sort=-startDate&page[limit]=${limite}`
    );
    const animes = response.data.data;
    
    console.log(`\n🆕 Animes con fecha de estreno más reciente:\n`);
    animes.forEach((anime, index) => {
      console.log(`${index + 1}. ${anime.attributes.canonicalTitle}`);
      console.log(`   📅 Estreno: ${anime.attributes.startDate || 'Fecha no disponible'}`);
      console.log(`   🎬 Tipo: ${anime.attributes.subtype}`);
      console.log(`   📊 Status: ${anime.attributes.status}`);
      console.log(`   👥 ${anime.attributes.userCount?.toLocaleString() || '0'} usuarios\n`);
    });
    
    // Mostrar resumen de actualización
    const añoMasReciente = animes[0]?.attributes.startDate?.substring(0, 4);
    console.log(`\n💡 El anime más reciente data de: ${añoMasReciente || 'N/A'}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// EJEMPLO 15: Resumen completo de actualización de Kitsu
// ============================================================================
async function resumenActualizacionKitsu() {
  console.log(`\n━━━ EJEMPLO 15: Resumen de actualización de Kitsu ━━━`);
  try {
    // Obtener animes más recientes por diferentes criterios
    const [recientes, actualizados, enEmision] = await Promise.all([
      kitsuAPI.get('/anime?sort=-startDate&page[limit]=3'),
      kitsuAPI.get('/anime?sort=-updatedAt&page[limit]=3'),
      kitsuAPI.get('/anime?filter[status]=current&page[limit]=3')
    ]);
    
    console.log(`\n📊 ESTADO DE ACTUALIZACIÓN DE KITSU:\n`);
    
    // Animes más recientes por estreno
    console.log('🆕 Últimos estrenos agregados:');
    recientes.data.data.forEach((anime, i) => {
      console.log(`   ${i + 1}. ${anime.attributes.canonicalTitle} (${anime.attributes.startDate?.substring(0, 4) || 'N/A'})`);
    });
    
    // Última actualización
    const ultimaActualizacion = new Date(actualizados.data.data[0].attributes.updatedAt);
    console.log(`\n🔄 Última actividad en la base de datos:`);
    console.log(`   ${ultimaActualizacion.toLocaleString('es-ES')}`);
    console.log(`   (Hace ${Math.floor((Date.now() - ultimaActualizacion) / (1000 * 60 * 60))} horas)`);
    
    // Animes en emisión
    console.log(`\n📡 Animes actualmente en emisión: ${enEmision.data.meta.count || 'N/A'}`);
    console.log('   Top 3:');
    enEmision.data.data.forEach((anime, i) => {
      console.log(`   ${i + 1}. ${anime.attributes.canonicalTitle}`);
    });
    
    console.log(`\n✅ Kitsu está activo y actualizado!`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// EJEMPLO 16: Últimas noticias/posts en Kitsu
// ============================================================================
async function ultimasNoticias(limite = 10) {
  console.log(`\n━━━ EJEMPLO 16: Últimas ${limite} noticias/posts en Kitsu ━━━`);
  try {
    const response = await kitsuAPI.get(
      `/posts?sort=-createdAt&page[limit]=${limite}&include=user,targetUser,media`
    );
    const posts = response.data.data;
    const included = response.data.included || [];
    
    console.log(`\n📰 Últimas publicaciones en la comunidad de Kitsu:\n`);
    
    posts.forEach((post, index) => {
      const fechaCreacion = new Date(post.attributes.createdAt);
      const hace = Math.floor((Date.now() - fechaCreacion) / (1000 * 60));
      let tiempoTranscurrido;
      
      if (hace < 60) {
        tiempoTranscurrido = `hace ${hace} minutos`;
      } else if (hace < 1440) {
        tiempoTranscurrido = `hace ${Math.floor(hace / 60)} horas`;
      } else {
        tiempoTranscurrido = `hace ${Math.floor(hace / 1440)} días`;
      }
      
      // Buscar el usuario que creó el post
      const userId = post.relationships?.user?.data?.id;
      const user = included.find(i => i.type === 'users' && i.id === userId);
      const username = user?.attributes?.name || 'Usuario desconocido';
      
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`📝 POST #${index + 1}`);
      console.log(`👤 Usuario: ${username}`);
      console.log(`⏰ Publicado: ${tiempoTranscurrido}`);
      console.log(`💬 Comentarios: ${post.attributes.commentsCount || 0}`);
      console.log(`❤️  Likes: ${post.attributes.postLikesCount || 0}`);
      
      if (post.attributes.content) {
        const contenido = post.attributes.content.substring(0, 200);
        console.log(`📄 Contenido: ${contenido}${post.attributes.content.length > 200 ? '...' : ''}`);
      }
      
      if (post.attributes.nsfw) {
        console.log(`🔞 NSFW: Sí`);
      }
      
      if (post.attributes.spoiler) {
        console.log(`⚠️  SPOILER: Sí`);
      }
      
      console.log('');
    });
    
    console.log(`\n💡 Total de posts encontrados: ${posts.length}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// EJEMPLO 17: Actividad más reciente en Kitsu
// ============================================================================
async function actividadReciente(limite = 5) {
  console.log(`\n━━━ EJEMPLO 17: Actividad más reciente en Kitsu ━━━`);
  try {
    const response = await kitsuAPI.get(
      `/posts?sort=-createdAt&page[limit]=${limite}&include=user,media`
    );
    const posts = response.data.data;
    const included = response.data.included || [];
    
    if (posts.length === 0) {
      console.log('\n⚠️  No se encontraron posts recientes.');
      return;
    }
    
    const postMasReciente = posts[0];
    const fechaCreacion = new Date(postMasReciente.attributes.createdAt);
    const hace = Math.floor((Date.now() - fechaCreacion) / (1000 * 60));
    
    console.log(`\n🔥 ÚLTIMA ACTIVIDAD EN KITSU:\n`);
    
    const userId = postMasReciente.relationships?.user?.data?.id;
    const user = included.find(i => i.type === 'users' && i.id === userId);
    const username = user?.attributes?.name || 'Usuario desconocido';
    
    console.log(`👤 Usuario: ${username}`);
    console.log(`⏰ Hace: ${hace < 60 ? hace + ' minutos' : Math.floor(hace / 60) + ' horas'}`);
    console.log(`📅 Fecha exacta: ${fechaCreacion.toLocaleString('es-ES')}`);
    
    if (postMasReciente.attributes.content) {
      console.log(`\n📝 Contenido:`);
      console.log(`"${postMasReciente.attributes.content.substring(0, 300)}${postMasReciente.attributes.content.length > 300 ? '...' : ''}"`);
    }
    
    console.log(`\n💬 Comentarios: ${postMasReciente.attributes.commentsCount || 0}`);
    console.log(`❤️  Likes: ${postMasReciente.attributes.postLikesCount || 0}`);
    
    // Buscar si hay un anime/manga relacionado
    const mediaId = postMasReciente.relationships?.media?.data?.id;
    const media = included.find(i => i.id === mediaId);
    if (media) {
      console.log(`\n🎬 Relacionado con: ${media.attributes?.canonicalTitle || 'Título desconocido'}`);
    }
    
    console.log(`\n✅ Kitsu tiene actividad reciente de usuarios!`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// ============================================================================
// FUNCIÓN PRINCIPAL - Ejecuta todos los ejemplos
// ============================================================================
async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║         EJEMPLOS PRÁCTICOS - API DE KITSU                 ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');

  // Descomentar los ejemplos que quieras ejecutar:

  // await obtener10Animes();
  
  // await obtenerPorCategoria('action', 10);
  
  // await top10Populares();
  
  // await buscarAnime('naruto', 5);
  
  // await animesFiltrosMultiples();
  
  // await obtenerAnimeConCategorias(1); // Cowboy Bebop
  
  // await listarCategorias(15);
  
  // await animesPorTipo('movie', 5);
  
  // await animesPorTemporada('spring', 2020, 10);
  
  // await informacionResumida(10);
  
  // ========== NUEVOS EJEMPLOS PARA VER ACTUALIZACIÓN ==========
  
  // await resumenActualizacionKitsu();
  
  // await ultimosAnimesAgregados(10);
  
  // await ultimosAnimesActualizados(10);
  
  // await animesEnEmision(10);
  
  // await animesRecientesPorAño(10);
  
  // ========== ÚLTIMAS NOTICIAS/ACTIVIDAD ==========
  
  await actividadReciente(1);
  
  await ultimasNoticias(10);

  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║                  EJEMPLOS COMPLETADOS                     ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
}

// Ejecutar si se corre directamente
if (require.main === module) {
  main().catch(console.error);
}

// Exportar funciones para usar en otros archivos
module.exports = {
  obtener10Animes,
  obtenerPorCategoria,
  top10Populares,
  buscarAnime,
  animesFiltrosMultiples,
  obtenerAnimeConCategorias,
  listarCategorias,
  animesPorTipo,
  animesPorTemporada,
  informacionResumida,
  ultimosAnimesAgregados,
  ultimosAnimesActualizados,
  animesEnEmision,
  animesRecientesPorAño,
  resumenActualizacionKitsu,
  ultimasNoticias,
  actividadReciente
};
