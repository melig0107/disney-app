import axios from 'axios';

const API_URL = 'https://api.disneyapi.dev/character';

export default {
    async obtenerPersonajes() {
      try {
        const respuesta = await axios.get(API_URL);
        // Filtramos personajes con imágenes y solo datos necesarios
        return respuesta.data.data
          .filter(personaje => personaje.imageUrl)
          .map(personaje => ({
            id: personaje._id,
            nombre: personaje.name,
            imagen: personaje.imageUrl,
            peliculas: personaje.films || []
          }));
      } catch (error) {
        console.error('Error API Disney:', error);
        throw new Error('Error al cargar personajes de Disney');
      }
    }
  };