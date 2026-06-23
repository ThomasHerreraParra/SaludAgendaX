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

    const [toast, setToast] = useState(null)

    const showToast = (msg, type = 'success') => {

        setToast({ msg, type })

        setTimeout(() => {
            setToast(null)
        }, 3000)

    }

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

            showToast(
                "Perfil actualizado correctamente"
            )

            loadProfile()

        } catch (error) {

            console.log(error)

            showToast(
                "Error al actualizar perfil",
                "error"

            )

        }

    }

    return (

        <div className="min-h-screen bg-slate-50">

            <Navbar
                role={role}
                username={username}
            />

            {
                toast && (

                    <div
                        className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${toast.type === 'error'
                                ? 'bg-red-600 text-white'
                                : 'bg-teal-600 text-white'
                            }`}
                    >
                        {toast.msg}
                    </div>

                )
            }

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

                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 mb-8">

                            <h2 className="text-lg font-semibold text-slate-800 mb-4">
                                Información de la cuenta
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs text-slate-500">Usuario</p>
                                    <p className="font-semibold">{profile.username}</p>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs text-slate-500">Documento</p>
                                    <p className="font-semibold">{profile.document}</p>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs text-slate-500">EPS</p>
                                    <p className="font-semibold">{profile.eps}</p>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs text-slate-500">Rol</p>
                                    <p className="font-semibold">{profile.role}</p>
                                </div>

                            </div>

                        </div>

                    )
                }


                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8"
                >
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">Edita tu perfil</h2>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Nombre</label>

                        <input
                            type="text"
                            name="first_name"
                            value={form.first_name}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Apellido</label>

                        <input
                            type="text"
                            name="last_name"
                            value={form.last_name}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Correo</label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Teléfono</label>

                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-teal-600 text-white font-semibold py-3 rounded-xl hover:bg-teal-700 transition shadow-sm cursor-pointer"
                    >
                        Guardar cambios
                    </button>

                </form>

            </main>

        </div>

    )

}

export default MyProfile