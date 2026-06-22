import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import {
    getProfile,
    updateProfile
} from '../api/users'

const MyProfile = () => {

    const navigate = useNavigate()

    const role = localStorage.getItem('role')
    const username = localStorage.getItem('username')

    const [profile, setProfile] = useState(null)

    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: ''
    })

    const [message, setMessage] = useState('')

    useEffect(() => {

        loadProfile()

    }, [])

    const loadProfile = async () => {

        try {

            const res = await getProfile()

            setProfile(res.data)

            setForm({
                first_name: res.data.first_name || '',
                last_name: res.data.last_name || '',
                email: res.data.email || '',
                phone: res.data.phone || ''
            })

        } catch (error) {

            console.log(error)

        }

    }

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        })

    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        try {

            await updateProfile(form)

            setMessage(
                'Perfil actualizado correctamente'
            )

            loadProfile()

        } catch (error) {

            console.log(error)

            setMessage(
                'Error al actualizar perfil'
            )

        }

    }

    return (

        <div className="min-h-screen bg-slate-50">

            <Navbar
                role={role}
                username={username}
            />

            <button
                onClick={() => navigate('/dashboard/patient')}
                className="mt-6 ml-6 text-teal-600 hover:text-teal-800 cursor-pointer"
            >
                ← Volver al dashboard
            </button>

            <main className="max-w-3xl mx-auto px-6 py-10">

                <h1 className="text-2xl font-bold text-slate-800 mb-6">
                    Mi perfil
                </h1>

                {
                    profile && (

                        <div className="bg-white rounded-2xl shadow p-6 border mb-6">

                            <p>
                                <strong>Usuario:</strong> {profile.username}
                            </p>

                            <p>
                                <strong>Documento:</strong> {profile.document}
                            </p>

                            <p>
                                <strong>EPS:</strong> {profile.eps}
                            </p>

                            <p>
                                <strong>Rol:</strong> {profile.role}
                            </p>

                        </div>

                    )
                }

                {
                    message && (
                        <p className="mb-4 text-teal-600 font-medium">
                            {message}
                        </p>
                    )
                }

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow p-6 border"
                >

                    <div className="mb-4">
                        <label>Nombre</label>

                        <input
                            type="text"
                            name="first_name"
                            value={form.first_name}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 mt-1"
                        />
                    </div>

                    <div className="mb-4">
                        <label>Apellido</label>

                        <input
                            type="text"
                            name="last_name"
                            value={form.last_name}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 mt-1"
                        />
                    </div>

                    <div className="mb-4">
                        <label>Correo</label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 mt-1"
                        />
                    </div>

                    <div className="mb-6">
                        <label>Teléfono</label>

                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 mt-1"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 cursor-pointer"
                    >
                        Guardar cambios
                    </button>

                </form>

            </main>

        </div>

    )

}

export default MyProfile