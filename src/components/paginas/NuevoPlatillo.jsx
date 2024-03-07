import { useContext, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FirebaseContext } from '../../firebase'
import { useNavigate } from 'react-router-dom';
import FileUploader from 'react-firebase-file-uploader'

const NuevoPlatillo = () => {

    const [subiendo, setSubiendo] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const [ urlImagen, setUrlImage] = useState('')

    //Context con las operaciones de firebase
    const { firebase } = useContext(FirebaseContext);

    //Hook para redireccionar
    const navigate = useNavigate();

    //Validacion y leer los datos del formulario
    const formik = useFormik({
        initialValues: {
            nombre: '',
            precio: '',
            categoria: '',
            imagen: '',
            descripcion: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                    .min(3, 'Los Platillos deben tener al menos 3 caracteres')
                    .required('El nombre del platillo es obligatorio'),
            precio: Yup.string()
            .min(1, 'Debes agregar un numero')
            .required('El precio del platillo es obligatorio'),
            categoria: Yup.string()
                    .required('La categoria es obligatoria'),
            descripcion: Yup.string()
                    .min(10, "La descripción debe ser más larga")
                    .required('La descripción es oblogatoria'),
        }),
        onSubmit: platillo => {
            try {
                platillo.existencia = true
                platillo.imagen = urlImagen
                firebase.db.collection('productos').add(platillo);

                //redireccionar
                navigate('/menu');
            } catch (error) {
                console.log(error)
            }
        }
    })

    // Todo sobre las imagenes
    const handleUploadStart = () =>{
        setProgreso(0);
        setSubiendo(true);

    }

    const handleUploadError = error => {
        setSubiendo(false);
        console.log(error)
    }

    const handleUploadSuccess = async name => {
        setProgreso(100);
        setSubiendo(false);

        // Almacenar la URL 
        const url = await firebase 
                    .storage
                    .ref("productos")
                    .child(name)
                    .getDownloadURL();
        console.log(url)
        setUrlImage(url)
    }

    const handleProgress = progreso => {
        setProgreso(progreso);
        console.log(progreso)
    }

  return (
    <>
    <h1 className='text-3xl font-light mb-4'>Agregar Platillo</h1>
    <div className='flex justify-center mt-10'>
        <div className='w-full max-w-3xl'>
            <form
                onSubmit={formik.handleSubmit}
            >
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bol mb-2' htmlFor='nombre'>Nombre</label>
                    <input
                        id='nombre'
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-none'
                        type='text'
                        placeholder='Nombre Platillo'
                        value={formik.values.nombre}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    </div>
                    { formik.touched.nombre && formik.errors.nombre ? (
                        <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4' role='alert'>
                            <p className='font-bold'>Hubo un error</p>
                            <p>{formik.errors.nombre}</p>
                        </div>
                    ) : null }
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bol mb-2' htmlFor='precio'>Precio</label>
                        <input
                            id='precio'
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-none'
                            type='number'
                            placeholder='$20'
                            value={formik.values.precio}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    { formik.touched.precio && formik.errors.precio ? (
                        <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4' role='alert'>
                            <p className='font-bold'>Hubo un error</p>
                            <p>{formik.errors.precio}</p>
                        </div>
                    ) : null }
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bol mb-2' htmlFor='categoria'>Categoria</label>
                        <select
                            name='categoria'
                            value={formik.values.categoria}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-none'
                        >
                            <option value="">--Seleccione--</option>
                            <option value="desayuno">Desayuno</option>
                            <option value="comida">Comida</option>
                            <option value="cena">Cena</option>
                            <option value="bebida">Bebida</option>
                            <option value="postre">Postre</option>
                            <option value="ensalada">Ensalada</option>
                        </select>
                    </div>
                    { formik.touched.categoria && formik.errors.categoria ? (
                        <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4' role='alert'>
                            <p className='font-bold'>Hubo un error</p>
                            <p>{formik.errors.categoria}</p>
                        </div>
                    ) : null }
                    <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bol mb-2' htmlFor='imagen'>Imagen</label>
                    <FileUploader
                        accept="image/*"
                        id='imagen'
                        name='imagen'
                        randomizeFilename
                        storageRef={firebase.storage.ref('productos')}
                        onUploadStart={handleUploadStart}
                        onUploadError={handleUploadError}
                        onUploadSuccess={handleUploadSuccess}
                        onProgress={handleProgress}
                    />
                    </div>
                    { subiendo && (
                        <div className='h-12 relative w-full border'>
                            <div className='bg-green-500 absolute left-0 top-0 text-white px-2 text-sm h-12 flex items-center' style={{ width: `${progreso}%`}}>
                                {progreso} %
                            </div>
                        </div>
                    )}

                    {urlImagen &&(
                        <p className='bg-green-500 text-white p-3 text-center my-5'>
                            La imagen se cargó correctamente
                        </p>
                    )}
                    <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bol mb-2' htmlFor='descripcion'>Descripcion</label>
                    <textarea
                        id='descripcion'
                        className='h-40 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-none'
                        type='text'
                        placeholder='Descripcion Platillo'
                        value={formik.values.descripcion}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    ></textarea>
                    </div>
                    { formik.touched.descripcion && formik.errors.descripcion ? (
                        <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4' role='alert'>
                            <p className='font-bold'>Hubo un error</p>
                            <p>{formik.errors.descripcion}</p>
                        </div>
                    ) : null }
                    <input
                    type='submit'
                    className='bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold'
                    value='Agregar Platillo'
                    />
            </form>
        </div>
    </div>
    </>
  )
}

export default NuevoPlatillo
