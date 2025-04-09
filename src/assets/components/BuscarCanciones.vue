<template>
    <div class="buscar-canciones">
      <h2 class="titulo-seccion">Buscar Canciones Disney</h2>
      
      <div class="contenedor-busqueda">
        <input 
          v-model="terminoBusqueda" 
          @keyup.enter="buscarCanciones" 
          placeholder="Busca canciones de Disney..."
          class="entrada-busqueda"
        >
        <button @click="buscarCanciones" class="boton-buscar">
          <i class="fas fa-search"></i> Buscar
        </button>
      </div>
      
      <div v-if="cargando" class="cargando">
        <div class="spinner"></div>
        <p>Cargando canciones...</p>
      </div>
      
      <div v-else>
        <div v-if="canciones.length === 0 && busquedaRealizada" class="sin-resultados">
          <i class="fas fa-music"></i>
          <p>No se encontraron canciones</p>
        </div>
        
        <div class="grid-canciones" v-if="canciones.length > 0">
          <div v-for="cancion in canciones" :key="cancion.id" class="tarjeta-cancion">
            <div class="imagen-cancion">
              <img :src="cancion.album.images[0].url" :alt="cancion.name">
            </div>
            <div class="info-cancion">
              <h3>{{ cancion.name }}</h3>
              <p class="artista">{{ cancion.artists[0].name }}</p>
              <p class="album">{{ cancion.album.name }}</p>
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
  import apiSpotify from '@/services/apiSpotify';
  
  export default {
    name: 'BuscarCanciones',
    data() {
      return {
        canciones: [],
        cargando: false,
        terminoBusqueda: '',
        busquedaRealizada: false
      };
    },
    methods: {
      async buscarCanciones() {
        if (!this.terminoBusqueda.trim()) return;
        
        this.cargando = true;
        this.canciones = [];
        this.busquedaRealizada = true;
        
        try {
          this.canciones = await apiSpotify.buscarCancionesDisney(this.terminoBusqueda);
        } catch (error) {
          console.error(error);
          this.$emit('error', 'Error al buscar canciones');
        } finally {
          this.cargando = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
.buscar-canciones {
  padding: 2rem;
  background-color: var(--gris-claro);
  border-radius: 12px;
  margin-top: 2rem;
}

.contenedor-busqueda {
  display: flex;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.entrada-busqueda {
  flex-grow: 1;
  padding: 1rem 1.5rem;
  border: 2px solid var(--azul-disney);
  border-radius: 50px 0 0 50px;
  font-size: 1rem;
  outline: none;
}

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

.boton-buscar i {
  margin-right: 0.5rem;
}

/* Reutilizamos estilos de CancionesPersonaje para la grid y tarjetas */
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
}

.tarjeta-cancion:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

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