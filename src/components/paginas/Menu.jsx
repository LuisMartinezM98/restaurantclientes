import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../../firebase'
import Platillo from '../ui/Platillo';

const Menu = () => {

  //definir los platillos en un state
  const [ platillos, setPlatillos ] = useState([]);

  const { firebase } = useContext(FirebaseContext);

  //COnsultar la base de datos al cargar
  useEffect(() => {
    const obtenerPlatillos =  () => {
      firebase.db.collection('productos').onSnapshot(handleSnapshot);

    }
    obtenerPlatillos();
  }, [])

  //Snapshot nos permite utlizar la base de datos en tiempo real de firestore
  function handleSnapshot(snapshot){
    const platillos = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    });

    setPlatillos(platillos)
  }

  return (
    <>
      <h1 className='text-3xl font-light mb-4'>Menu</h1>
      <Link to='/nuevo-platillo' className='bg-blue-900 hover:bg-blue-700 inline-block mb-5 p-2 text-white uppercase font-bold'>
          Agregar Platillo
      </Link>

      {platillos.map( platillo => (
        <Platillo
          key={platillo.id}
          platillo={platillo}
        />
      ))}
    </>
  )
}

export default Menu