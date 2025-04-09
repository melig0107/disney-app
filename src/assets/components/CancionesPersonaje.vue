<template>
  <div class="canciones-personaje" v-if="personaje">
    <div class="cabecera-personaje">
      <h2 class="titulo-seccion">
        <i class="fas fa-music"></i> Canciones de {{ personaje.nombre }}
      </h2>
      <div class="etiquetas-peliculas" v-if="personaje.peliculas.length">
        <span class="etiqueta-pelicula" v-for="(pelicula, index) in personaje.peliculas.slice(0, 3)" :key="index">
          {{ pelicula }}
        </span>
      </div>
    </div>
    
    <div class="controles-busqueda">
      <input
        v-model="terminoBusqueda"
        placeholder="Filtrar canciones..."
        class="entrada-filtro"
      >
      <button @click="recargarCanciones" class="boton-recargar">
        <i class="fas fa-sync-alt"></i> Actualizar
      </button>
    </div>
    
    <div v-if="cargando" class="cargando">
      <div class="spinner"></div>
      <p>Buscando canciones mágicas...</p>
    </div>
    
    <div v-else>
      <div v-if="canciones.length === 0" class="sin-resultados">
        <i class="fas fa-music"></i>
        <p>No encontramos canciones para {{ personaje.nombre }}</p>
        <button @click="buscarCancionesGenericas" class="boton-alternativo">
          Buscar canciones de Disney
        </button>
      </div>
      
      <div class="grid-canciones">
        <div v-for="cancion in cancionesFiltradas" :key="cancion.id" class="tarjeta-cancion">
          <div class="imagen-cancion">
            <img :src="cancion.album.images[0].url" :alt="cancion.name">
            <div class="overlay-cancion">
              <i class="fas fa-play"></i>
            </div>
          </div>
          <div class="info-cancion">
            <h3>{{ cancion.name }}</h3>
            <div class="detalles-cancion">
              <p class="artista">
                <i class="fas fa-user"></i> {{ cancion.artists[0].name }}
              </p>
              <p class="album">
                <i class="fas fa-compact-disc"></i> {{ cancion.album.name }}
              </p>
            </div>
            <div class="acciones-cancion">
              <a :href="cancion.external_urls.spotify" target="_blank" class="boton-reproducir">
                <i class="fab fa-spotify"></i> Spotify
              </a>
              <button @click="verAlbum(cancion.album.id)" class="boton-album">
                <i class="fas fa-eye"></i> Álbum
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiSpotify from '@/services/apiSpotify';

export default {
  name: 'CancionesPersonaje',
  props: {
    personaje: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      canciones: [],
      cargando: false,
      terminoBusqueda: '',
      busquedaRealizada: false
    };
  },
  computed: {
    cancionesFiltradas() {
      if (!this.terminoBusqueda) return this.canciones;
      const termino = this.terminoBusqueda.toLowerCase();
      return this.canciones.filter(cancion => 
        cancion.name.toLowerCase().includes(termino) ||
        cancion.artists[0].name.toLowerCase().includes(termino) ||
        cancion.album.name.toLowerCase().includes(termino)
      );
    }
  },
  watch: {
    personaje: {
      immediate: true,
      async handler(nuevoValor) {
        if (nuevoValor) {
          await this.cargarCanciones();
        }
      }
    }
  },
  methods: {
    async cargarCanciones() {
      this.cargando = true;
      this.canciones = [];
      this.busquedaRealizada = true;
      
      try {
        // Primero buscamos por personaje + películas
        const cancionesPersonaje = await apiSpotify.obtenerCancionesPersonaje(
          this.personaje.nombre, 
          this.personaje.peliculas
        );
        
        // Si no hay suficientes resultados, buscamos solo por películas
        if (cancionesPersonaje.length < 5 && this.personaje.peliculas.length) {
          const cancionesPeliculas = await apiSpotify.buscarCancionesDisney(
            this.personaje.peliculas[0]
          );
          // Combinamos y eliminamos duplicados
          this.canciones = [...new Set([...cancionesPersonaje, ...cancionesPeliculas])];
        } else {
          this.canciones = cancionesPersonaje;
        }
      } catch (error) {
        console.error(error);
        this.$emit('error', 'Error al cargar canciones');
      } finally {
        this.cargando = false;
      }
    },
    
    recargarCanciones() {
      this.cargarCanciones();
    },
    
    buscarCancionesGenericas() {
      this.$emit('buscar-disney');
    },
    
    verAlbum(albumId) {
      window.open(`https://open.spotify.com/album/${albumId}`, '_blank');
    }
  }
};
</script>

<style scoped>
.canciones-personaje {
  padding: 2rem;
  background-color: #fff;
  border-radius: 12px;
  margin-top: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cabecera-personaje {
  text-align: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.titulo-seccion {
  color: var(--azul-disney);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.etiquetas-peliculas {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.etiqueta-pelicula {
  background-color: var(--amarillo-disney);
  color: #333;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.controles-busqueda {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.entrada-filtro {
  flex: 1;
  padding: 0.8rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.entrada-filtro:focus {
  border-color: var(--azul-disney);
  outline: none;
}

.boton-recargar {
  padding: 0 1.5rem;
  background-color: var(--azul-disney);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.boton-recargar:hover {
  background-color: #0066cc;
  transform: translateY(-2px);
}

.grid-canciones {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.tarjeta-cancion {
  display: flex;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #eaeaea;
}

.tarjeta-cancion:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.imagen-cancion {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  position: relative;
}

.imagen-cancion img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay-cancion {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tarjeta-cancion:hover .overlay-cancion {
  opacity: 1;
}

.overlay-cancion i {
  color: white;
  font-size: 2rem;
}

.info-cancion {
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.info-cancion h3 {
  color: var(--azul-disney);
  margin-bottom: 0.5rem;
  font-size: 1rem;
  line-height: 1.3;
}

.detalles-cancion {
  margin-top: auto;
}

.detalles-cancion p {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  margin-bottom: 0.3rem;
  color: #555;
}

.detalles-cancion i {
  color: var(--azul-disney);
  font-size: 0.8rem;
}

.acciones-cancion {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.8rem;
}

.boton-reproducir {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #1DB954;
  color: white;
  padding: 0.5rem 0.8rem;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  flex: 1;
  justify-content: center;
}

.boton-reproducir:hover {
  background-color: #1ed760;
  transform: scale(1.05);
}

.boton-album {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--purpura-disney);
  color: white;
  padding: 0.5rem 0.8rem;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  flex: 1;
  justify-content: center;
}

.boton-album:hover {
  background-color: #b399d4;
  transform: scale(1.05);
}

.sin-resultados {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.sin-resultados i {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--azul-disney);
}

.boton-alternativo {
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  background-color: var(--amarillo-disney);
  color: #333;
  border: none;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.boton-alternativo:hover {
  background-color: #ffd700;
  transform: translateY(-2px);
}

.cargando {
  text-align: center;
  padding: 3rem;
  color: var(--azul-disney);
}

.spinner {
  border: 5px solid rgba(0, 102, 204, 0.2);
  border-radius: 50%;
  border-top: 5px solid var(--azul-disney);
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .grid-canciones {
    grid-template-columns: 1fr;
  }
  
  .controles-busqueda {
    flex-direction: column;
  }
  
  .boton-recargar {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .tarjeta-cancion {
    flex-direction: column;
  }
  
  .imagen-cancion {
    width: 100%;
    height: 150px;
  }
}
</style>