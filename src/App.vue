<template>
  <div id="app">
    <header class="cabecera">
      <div class="contenido-cabecera">
        <h1>El Mágico Mundo de Disney</h1>
        <p class="subtitulo">Personajes y Canciones</p>
        <nav class="menu-principal">
          <button 
            @click="seccionActiva = 'personajes'" 
            :class="{ activo: seccionActiva === 'personajes' }"
          >
            <i class="fas fa-users"></i> Personajes
          </button>
          <button 
            @click="seccionActiva = 'musica'" 
            :class="{ activo: seccionActiva === 'musica' }"
          >
            <i class="fas fa-music"></i> Música
          </button>
        </nav>
      </div>
    </header>
    
    <main class="contenido-principal">
      <div v-if="error" class="mensaje-error">
        <i class="fas fa-exclamation-triangle"></i>
        <p>{{ error }}</p>
      </div>
      
      <div v-if="seccionActiva === 'personajes'">
        <personajes-disney 
          @personaje-seleccionado="mostrarCancionesPersonaje"
          @error="manejarError"
        />
        
        <canciones-personaje 
          v-if="personajeSeleccionado"
          :personaje="personajeSeleccionado"
          @error="manejarError"
          @buscar-disney="seccionActiva = 'musica'"
        />
      </div>
      
      <buscar-canciones 
        v-else
        @error="manejarError"
      />
    </main>
    
    <footer class="pie-pagina">
      <p>© {{ anioActual }} Disney - Todos los derechos reservados</p>
    </footer>
  </div>
</template>

<script>
import PersonajesDisney from '@/assets/components/PersonajesDisney.vue';
import BuscarCanciones from '@/assets/components/BuscarCanciones.vue';
import CancionesPersonaje from '@/assets/components/CancionesPersonaje.vue';

export default {
  name: 'App',
  components: {
    PersonajesDisney,
    BuscarCanciones,
    CancionesPersonaje
  },
  data() {
    return {
      seccionActiva: 'personajes',
      personajeSeleccionado: null,
      error: null,
      anioActual: new Date().getFullYear()
    };
  },
  methods: {
    manejarError(mensaje) {
      this.error = mensaje;
      setTimeout(() => {
        this.error = null;
      }, 5000);
    },
    mostrarCancionesPersonaje(personaje) {
      this.personajeSeleccionado = personaje;
      setTimeout(() => {
        const seccionCanciones = document.querySelector('.canciones-personaje');
        if (seccionCanciones) {
          seccionCanciones.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Walter+Turncoat&family=Montserrat:wght@400;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

:root {
  --azul-disney: #93c5f8;
  --amarillo-disney: #ffde59;
  --rojo-disney: #ff1d25;
  --purpura-disney: #7a296f; /* Cambiado a morado Disney */
  --fondo: #f9f5f0;
  --borde: #e0d6c2;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #app {
  height: 100%;
  width: 100%;
}

body {
  font-family: 'Montserrat', sans-serif;
  background-color: var(--fondo);
  color: #333;
  line-height: 1.6;
  overflow-x: hidden;
  background-color:#b1d3ff
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.cabecera {
  background: linear-gradient(135deg, var(--azul-disney), #7a38ff);
  color: white;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.contenido-cabecera {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-family: 'Walter Turncoat', cursive;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitulo {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

.menu-principal {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.menu-principal button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 50px;
  background-color: rgba(46, 239, 253, 0.2);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.menu-principal button.activo {
  background-color: white;
  color: var(--azul-disney);
}

.menu-principal button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.contenido-principal {
  flex: 1;
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.mensaje-error {
  background-color: #ffebee;
  color: #ff0000;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mensaje-error i {
  font-size: 1.5rem;
}

.pie-pagina {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }
  
  .menu-principal {
    flex-direction: column;
    align-items: center;
  }
  
  .menu-principal button {
    width: 100%;
    max-width: 250px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  
  .contenido-principal {
    padding: 1rem;
  }
}
</style>