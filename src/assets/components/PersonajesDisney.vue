<template>
  <div class="personajes-disney">
    <div class="filtros">
      <div class="grupo-filtros">
        <input 
          v-model="terminoBusqueda" 
          placeholder="Buscar personaje..."
          class="entrada-busqueda"
          @input="reiniciarMensaje"
        >
        <select v-model="filtroOrden" class="selector-orden">
          <option value="nombre-asc">A-Z</option>
          <option value="nombre-desc">Z-A</option>
        </select>
      </div>
    </div>
    
    <div v-if="cargando" class="cargando">
      <div class="spinner"></div>
      <p>Cargando personajes...</p>
    </div>
    
    <div v-else>
      <div v-if="error" class="mensaje-error">
        <i class="fas fa-exclamation-circle"></i>
        <p>{{ error }}</p>
      </div>
      
      <div v-if="personajesFiltradosYOrdenados.length === 0 && busquedaRealizada" class="sin-resultados">
        <i class="fas fa-search"></i>
        <p>No se encontraron personajes con "{{ terminoBusqueda }}"</p>
        <button @click="reiniciarBusqueda" class="boton-reiniciar">
          <i class="fas fa-undo"></i> Mostrar todos
        </button>
      </div>
      
      <div class="contenedor-circular">
        <div 
          v-for="personaje in personajesFiltradosYOrdenados" 
          :key="personaje.id" 
          class="carta-circular"
          @click="seleccionarPersonaje(personaje)"
        >
          <div class="contenedor-imagen-circular">
            <img 
              :src="personaje.imagen" 
              :alt="personaje.nombre"
              class="imagen-circular"
              @error="manejarErrorImagen"
            >
          </div>
          <div class="info-circular">
            <h3>{{ personaje.nombre }}</h3>
            <div class="pelicula-circular" v-if="personaje.peliculas.length">
              {{ personaje.peliculas[0] }}
            </div>
            <button class="boton-ver-canciones">
              <i class="fas fa-music"></i> Ver canciones
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiDisney from '@/services/apiDisney';

export default {
  name: 'PersonajesDisney',
  data() {
    return {
      personajes: [],
      cargando: true,
      terminoBusqueda: '',
      filtroOrden: 'nombre-asc',
      error: null,
      busquedaRealizada: false
    };
  },
  computed: {
    personajesFiltradosYOrdenados() {
      let filtrados = this.personajes;
      
      if (this.terminoBusqueda) {
        this.busquedaRealizada = true;
        const termino = this.terminoBusqueda.toLowerCase();
        filtrados = filtrados.filter(p => 
          p.nombre.toLowerCase().includes(termino) ||
          (p.peliculas.length && p.peliculas.some(peli => 
            peli.toLowerCase().includes(termino)
          ))
        );
      } else {
        this.busquedaRealizada = false;
      }
      
      switch(this.filtroOrden) {
        case 'nombre-asc':
          return [...filtrados].sort((a, b) => a.nombre.localeCompare(b.nombre));
        case 'nombre-desc':
          return [...filtrados].sort((a, b) => b.nombre.localeCompare(a.nombre));
        case 'peliculas':
          return [...filtrados].sort((a, b) => {
            const peliA = a.peliculas.length ? a.peliculas[0] : '';
            const peliB = b.peliculas.length ? b.peliculas[0] : '';
            return peliA.localeCompare(peliB);
          });
        default:
          return filtrados;
      }
    }
  },
  async created() {
    try {
      this.personajes = await apiDisney.obtenerPersonajes();
      if (this.personajes.length === 0) {
        this.error = 'No se pudieron cargar los personajes. Intenta más tarde.';
      }
    } catch (error) {
      console.error(error);
      this.error = 'Error al conectar con el servidor. Verifica tu conexión.';
    } finally {
      this.cargando = false;
    }
  },
  methods: {
    manejarErrorImagen(evento) {
      evento.target.style.display = 'none';
      evento.target.parentElement.style.display = 'none';
    },
    seleccionarPersonaje(personaje) {
      this.$emit('personaje-seleccionado', personaje);
    },
    reiniciarBusqueda() {
      this.terminoBusqueda = '';
      this.busquedaRealizada = false;
      this.error = null;
    },
    reiniciarMensaje() {
      if (this.error) {
        this.error = null;
      }
    }
  }
};
</script>

<style scoped>

.info-circular h3 {
  color: #ffffff;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}


.mensaje-error {
  background-color: #ffebee;
  color: #d32f2f;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-left: 4px solid #d32f2f;
}

.mensaje-error i {
  font-size: 1.5rem;
}

.sin-resultados {
  text-align: center;
  padding: 2rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.sin-resultados i {
  font-size: 2rem;
  color: var(--purpura-disney);
  margin-bottom: 1rem;
}

.sin-resultados p {
  color: #616161;
  margin-bottom: 1rem;
}

.boton-reiniciar {
  background-color: var(--azul-disney);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.boton-reiniciar:hover {
  background-color: #0055a5;
  transform: translateY(-2px);
}

.personajes-disney {
  padding: 1rem;
}

.filtros {
  background: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.grupo-filtros {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.entrada-busqueda {
  flex: 1;
  padding: 0.8rem 1rem;
  border: 2px solid var(--borde);
  border-radius: 8px;
  font-size: 1rem;
}

.selector-orden {
  padding: 0.8rem 1rem;
  border: 2px solid var(--borde);
  border-radius: 8px;
  background: white;
  font-size: 1rem;
  min-width: 150px;
}

.contenedor-circular {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  justify-items: center;
}

.carta-circular {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 180px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.carta-circular:hover {
  transform: translateY(-5px) scale(1.05);
}

.contenedor-imagen-circular {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--amarillo-disney);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  position: relative;
}

.imagen-circular {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.carta-circular:hover .imagen-circular {
  transform: scale(1.1);
}

.info-circular {
  text-align: center;
  margin-top: 1rem;
  width: 100%;
}

.info-circular h3 {
  color: #ffffff;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pelicula-circular {
  background-color: var(--purpura-disney);
  color: rgb(255, 255, 255);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  display: inline-block;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.boton-ver-canciones {
  background-color: #814da1;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.boton-ver-canciones:hover {
  background-color: #ff3d47;
  transform: scale(1.05);
}

.cargando {
  text-align: center;
  padding: 4rem;
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
  .contenedor-circular {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1.5rem;
  }
  
  .contenedor-imagen-circular {
    width: 140px;
    height: 140px;
  }
  
  .grupo-filtros {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .contenedor-circular {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .contenedor-imagen-circular {
    width: 120px;
    height: 120px;
  }
  
  .info-circular h3 {
    font-size: 1rem;
  }
}
</style>