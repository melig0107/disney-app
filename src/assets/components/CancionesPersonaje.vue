<template>
  <div class="buscar-canciones">
    <!-- Título de la sección -->
    <h2 class="titulo-seccion">Buscar Canciones Disney</h2>
    
    <!-- Contenedor de búsqueda -->
    <div class="contenedor-busqueda">
      <!-- Campo de entrada para buscar canciones -->
      <input 
        v-model="terminoBusqueda" 
        @keyup.enter="buscarCanciones" 
        placeholder="Busca canciones de Disney..."
        class="entrada-busqueda"
      >
      <!-- Botón para iniciar la búsqueda -->
      <button @click="buscarCanciones" class="boton-buscar">
        <i class="fas fa-search"></i> Buscar
      </button>
    </div>
    
    <!-- Indicador de carga mientras se buscan canciones -->
    <div v-if="cargando" class="cargando">
      <div class="spinner"></div>
      <p>Cargando canciones...</p>
    </div>
    
    <div v-else>
      <!-- Mensaje si no se encuentran resultados -->
      <div v-if="canciones.length === 0 && busquedaRealizada" class="sin-resultados">
        <i class="fas fa-music"></i>
        <p>No se encontraron canciones</p>
      </div>
      
      <!-- Lista de canciones encontradas -->
      <div class="grid-canciones" v-if="canciones.length > 0">
        <div v-for="cancion in canciones" :key="cancion.id" class="tarjeta-cancion">
          <!-- Imagen del álbum de la canción -->
          <div class="imagen-cancion">
            <img :src="cancion.album.images[0].url" :alt="cancion.name">
          </div>
          <!-- Información de la canción -->
          <div class="info-cancion">
            <h3>{{ cancion.name }}</h3>
            <p class="artista">{{ cancion.artists[0].name }}</p>
            <p class="album">{{ cancion.album.name }}</p>
            <!-- Enlace para escuchar la canción en Spotify -->
            <a :href="cancion.external_urls.spotify" target="_blank" class="boton-reproducir">
              <i class="fab fa-spotify"></i> Escuchar en Spotify
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Importamos el servicio para buscar canciones en Spotify
import apiSpotify from '@/services/apiSpotify';

export default {
  name: 'BuscarCanciones',
  data() {
    return {
      canciones: [], // Lista de canciones encontradas
      cargando: false, // Indicador de carga
      terminoBusqueda: '', // Término ingresado por el usuario
      busquedaRealizada: false // Indica si ya se realizó una búsqueda
    };
  },
  methods: {
    // Método para buscar canciones
    async buscarCanciones() {
      // Si el término de búsqueda está vacío, no hacemos nada
      if (!this.terminoBusqueda.trim()) return;
      
      this.cargando = true; // Mostramos el indicador de carga
      this.canciones = []; // Limpiamos la lista de canciones
      this.busquedaRealizada = true; // Marcamos que se realizó una búsqueda
      
      try {
        // Llamamos al servicio para buscar canciones de Disney
        this.canciones = await apiSpotify.buscarCancionesDisney(this.terminoBusqueda);
      } catch (error) {
        console.error(error);
        // Emitimos un evento de error si algo falla
        this.$emit('error', 'Error al buscar canciones');
      } finally {
        this.cargando = false; // Ocultamos el indicador de carga
      }
    }
  }
};
</script>

<style scoped>
/* Contenedor principal de la sección */
.buscar-canciones {
  padding: 2rem;
  background-color: var(--gris-claro);
  border-radius: 12px;
  margin-top: 2rem;
}

/* Contenedor de la barra de búsqueda */
.contenedor-busqueda {
  display: flex;
  max-width: 600px;
  margin: 0 auto 2rem;
}

/* Campo de entrada de búsqueda */
.entrada-busqueda {
  flex-grow: 1;
  padding: 1rem 1.5rem;
  border: 2px solid var(--azul-disney);
  border-radius: 50px 0 0 50px;
  font-size: 1rem;
  outline: none;
}

/* Botón de búsqueda */
.boton-buscar {
  padding: 0 1.5rem;
  background-color: var(--azul-disney);
  color: white;
  border: none;
  border-radius: 0 50px 50px 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.boton-buscar:hover {
  background-color: #6d7fb8;
}

/* Icono dentro del botón */
.boton-buscar i {
  margin-right: 0.5rem;
}

/* Contenedor de las canciones encontradas */
.grid-canciones {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

/* Tarjeta de cada canción */
.tarjeta-cancion {
  display: flex;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.tarjeta-cancion:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

/* Imagen del álbum */
.imagen-cancion {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.imagen-cancion img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Información de la canción */
.info-cancion {
  padding: 1rem;
  flex-grow: 1;
}

.info-cancion h3 {
  color: var(--azul-disney);
  margin-bottom: 0.3rem;
  font-size: 1rem;
}

.info-cancion .artista {
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
}

.info-cancion .album {
  color: #777;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  font-style: italic;
}

/* Botón para reproducir en Spotify */
.boton-reproducir {
  display: inline-block;
  background-color: #1DB954;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  transition: all 0.3s ease;
}

.boton-reproducir:hover {
  background-color: #1ed760;
  transform: scale(1.05);
}

.boton-reproducir i {
  margin-right: 0.5rem;
}

/* Mensaje cuando no hay resultados */
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

/* Indicador de carga */
.cargando {
  text-align: center;
  padding: 2rem;
  color: var(--azul-disney);
}

.spinner {
  border: 5px solid rgba(17, 60, 207, 0.3);
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

/* Estilos responsivos */
@media (max-width: 768px) {
  .grid-canciones {
    grid-template-columns: 1fr;
  }
  
  .tarjeta-cancion {
    flex-direction: column;
  }
  
  .imagen-cancion {
    width: 100%;
    height: auto;
  }
  
  .contenedor-busqueda {
    flex-direction: column;
  }
  
  .entrada-busqueda {
    border-radius: 50px;
    margin-bottom: 1rem;
  }
  
  .boton-buscar {
    border-radius: 50px;
    padding: 1rem;
  }
}
</style>