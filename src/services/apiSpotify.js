import axios from 'axios';

const CLIENTE_ID = '9fffcd8682c0418ebf1c16d511047f62';
const CLIENTE_SECRETO = '2c748966005445b4bd0eb92baee4668a';
let tokenAcceso = '';

export default {
  async obtenerToken() {
    try {
      const respuesta = await axios.post(
        'https://accounts.spotify.com/api/token',
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(CLIENTE_ID + ':' + CLIENTE_SECRETO)
          }
        }
      );
      tokenAcceso = respuesta.data.access_token;
    } catch (error) {
      console.error('Error token Spotify:', error);
      throw new Error('Error al obtener token de Spotify');
    }
  },

  async obtenerCancionesPersonaje(nombrePersonaje, peliculas = []) {
    if (!tokenAcceso) await this.obtenerToken();
    
    try {
      // Buscamos canciones de las películas del personaje
      const queryPeliculas = peliculas.length > 0 ? 
        ` O ${peliculas.map(peli => `soundtrack:${peli}`).join(' O ')}` : '';
      
      const respuesta = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(nombrePersonaje + ' Disney' + queryPeliculas)}&type=track&limit=10`,
        {
          headers: {
            'Authorization': `Bearer ${tokenAcceso}`
          }
        }
      );
      return respuesta.data.tracks.items;
    } catch (error) {
      console.error('Error búsqueda Spotify:', error);
      throw new Error('Error al buscar canciones');
    }
  },

  async buscarCancionesDisney(consulta) {
    if (!tokenAcceso) await this.obtenerToken();
    
    try {
      const respuesta = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent('Disney ' + consulta)}&type=track&limit=20`,
        {
          headers: {
            'Authorization': `Bearer ${tokenAcceso}`
          }
        }
      );
      return respuesta.data.tracks.items;
    } catch (error) {
      console.error('Error búsqueda Spotify:', error);
      throw new Error('Error al buscar canciones de Disney');
    }
  }
};