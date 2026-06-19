import { Link, Navigate } from 'react-router-dom'
import loginBanner from '../assets/loginbannerderecho.jpg'
import logoSaludAgenda from '../assets/Logo Salud Agenda X.png'

const Landing = () => {
    const token = localStorage.getItem('access_token')
    const role = localStorage.getItem('role')
    const username = localStorage.getItem('username')

    const handleLogout = () => {
        localStorage.clear()
        window.location.reload()
    }

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link
                        to="/"
                        className="flex items-center gap-3 hover:opacity-80 transition"
                    >
                        <img
                            src={logoSaludAgenda}
                            alt="SaludAgendaX"
                            className="w-12 h-12 object-contain"
                        />

                        <span className="text-2xl font-bold text-slate-800">
                            SaludAgendaX
                        </span>
                    </Link>


                    <div className="flex items-center gap-3">

                        {token ? (
                            <>
                                <span className="hidden md:block text-slate-600 font-medium">
                                    Hola, {username}
                                </span>

                                <Link
                                    to={`/dashboard/${role}`}
                                    className="px-5 py-2 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition"
                                >
                                    Ir a mi panel
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="px-5 py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 transition"
                                >
                                    Cerrar sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-5 py-2 rounded-xl border border-teal-600 text-teal-600 font-medium hover:bg-teal-50 transition"
                                >
                                    Iniciar Sesión
                                </Link>

                                <Link
                                    to="/register"
                                    className="px-5 py-2 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}

                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative overflow-hidden">

                <img
                    src={loginBanner}
                    alt="Banner"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-teal-900/80"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">

                    <div className="max-w-3xl">

                        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
                            Gestión médica
                            <br />
                            inteligente y segura
                        </h1>

                        <p className="text-xl text-teal-100 mb-10 leading-relaxed">
                            Agenda citas médicas, administra pacientes,
                            médicos, especialidades y EPS desde una sola
                            plataforma moderna y centralizada.
                        </p>

                        <div className="flex flex-wrap gap-4">

                            {token ? (
                                <>
                                    <Link
                                        to={`/dashboard/${role}`}
                                        className="bg-white text-teal-700 px-8 py-4 rounded-xl font-semibold hover:bg-slate-100 transition"
                                    >
                                        Ir a mi panel
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="border border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition"
                                    >
                                        Cerrar sesión
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/register"
                                        className="bg-white text-teal-700 px-8 py-4 rounded-xl font-semibold hover:bg-slate-100 transition"
                                    >
                                        Crear Cuenta
                                    </Link>

                                    <Link
                                        to="/login"
                                        className="border border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                </>
                            )}

                        </div>

                    </div>
                </div>
            </section>

            {/* Características */}
            <section className="max-w-7xl mx-auto px-6 py-24">

                <div className="text-center mb-16">

                    <h2 className="text-4xl font-bold text-slate-800 mb-4">
                        Todo lo que necesitas para gestionar la atención médica
                    </h2>

                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        SaludAgendaX integra pacientes, médicos,
                        administrativos y EPS en una sola solución.
                    </p>

                </div>

                <div className="grid md:grid-cols-3 gap-8">

                    <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100">
                        <div className="text-5xl mb-5">📅</div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">
                            Agendamiento de citas
                        </h3>
                        <p className="text-slate-500">
                            Solicita y administra citas médicas de forma
                            rápida, sencilla y completamente remota.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100">
                        <div className="text-5xl mb-5">👨‍⚕️</div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">
                            Gestión de médicos
                        </h3>
                        <p className="text-slate-500">
                            Asigna especialidades, consulta agendas y
                            administra la disponibilidad médica.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm p-8 border border-slate-100">
                        <div className="text-5xl mb-5">🏥</div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">
                            Control de EPS
                        </h3>
                        <p className="text-slate-500">
                            Gestiona topes, presupuestos y afiliaciones
                            desde un único sistema centralizado.
                        </p>
                    </div>

                </div>

            </section>

            {/* Roles */}
            <section className="bg-white py-24">

                <div className="max-w-7xl mx-auto px-6">

                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-800 mb-4">
                            Usuarios del sistema
                        </h2>

                        <p className="text-slate-500">
                            Diferentes roles con funcionalidades específicas.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">

                        {[
                            {
                                title: 'Pacientes',
                                icon: '🧑',
                                text: 'Solicitan y gestionan sus citas.'
                            },
                            {
                                title: 'Médicos',
                                icon: '👨‍⚕️',
                                text: 'Visualizan agenda y atención.'
                            },
                            {
                                title: 'Administrativos',
                                icon: '📋',
                                text: 'Gestionan usuarios y recursos.'
                            },
                            {
                                title: 'Superadministradores',
                                icon: '⚙️',
                                text: 'Control global del sistema.'
                            }
                        ].map((role) => (
                            <div
                                key={role.title}
                                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center"
                            >
                                <div className="text-5xl mb-4">
                                    {role.icon}
                                </div>

                                <h3 className="font-bold text-slate-800 text-lg mb-2">
                                    {role.title}
                                </h3>

                                <p className="text-slate-500 text-sm">
                                    {role.text}
                                </p>
                            </div>
                        ))}

                    </div>

                </div>
            </section>

            {/* CTA */}
            <section className="bg-teal-700 py-20">

                <div className="max-w-4xl mx-auto px-6 text-center">

                    <h2 className="text-4xl font-bold text-white mb-6">
                        Comienza a gestionar la salud de forma eficiente
                    </h2>

                    <p className="text-teal-100 text-lg mb-10">
                        Únete a SaludAgendaX y centraliza toda la gestión
                        médica desde una única plataforma.
                    </p>

                    {token ? (
                        <Link
                            to={`/dashboard/${role}`}
                            className="bg-white text-teal-700 px-8 py-4 rounded-xl font-bold hover:bg-slate-100 transition"
                        >
                            Ir a mi panel
                        </Link>
                    ) : (
                        <Link
                            to="/register"
                            className="bg-white text-teal-700 px-8 py-4 rounded-xl font-bold hover:bg-slate-100 transition"
                        >
                            Crear cuenta ahora
                        </Link>
                    )}

                </div>

            </section>

            {/* Footer */}
            <footer className="bg-slate-900 py-8">

                <div className="max-w-7xl mx-auto px-6 text-center">

                    <p className="text-slate-400">
                        © 2026 SaludAgendaX · Yoel Montoya · Daniel Micolta · Andres Muñoz · Thomas Herrera · Brandon · Desarrollo de Software I
                    </p>

                </div>

            </footer>

        </div>
    )
}

export default Landing