import React, { useState } from 'react';
import { Project, ContactMessage, ServiceItem, ProjectCategory, ProjectStatus } from '../types';
import { Logo } from '../components/Logo';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Mail,
  Settings,
  LogOut,
  Plus,
  TrendingUp,
  Building2,
  Clock,
  MoreVertical,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Edit3,
  X,
  Send,
  Eye,
} from 'lucide-react';

interface AdminDashboardViewProps {
  projects: Project[];
  messages: ContactMessage[];
  services: ServiceItem[];
  onAddProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onSelectProject: (project: Project) => void;
  onToggleMessageStatus: (messageId: string) => void;
  onDeleteMessage: (messageId: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  projects,
  messages,
  services,
  onAddProject,
  onDeleteProject,
  onSelectProject,
  onToggleMessageStatus,
  onDeleteMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'proyectos' | 'contenidos' | 'mensajes' | 'ajustes'>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // New project form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ProjectCategory>('Residencial');
  const [newDescription, setNewDescription] = useState('');
  const [newYear, setNewYear] = useState('2024');
  const [newArea, setNewArea] = useState('320 m²');
  const [newScope, setNewScope] = useState('Obra Nueva');
  const [newMaterials, setNewMaterials] = useState('Hormigón Visto, Vidrio Doble, Acero');
  const [newImage, setNewImage] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuD_202zA_K2qRLLCh_afcYWWM4IHRLXNpbCEYwr71bbgtgvtycbV9VM6z4cg78I_yy-zvhEkm1Xg-ncoox_PcWQSPsd1XjsXF_6EFxGjpjlmpxweFUoJkaPSgNAtuYo0nJUJj7NqRv3xnsXSaiHtNVrnH33Zejl6_9kdbjiOKvZBHyVFrugji_0Rdi1xBIP0XM5_NeoNSrUlRxsBtQJZTCGv79-dy6ZheWNboQrhcCRBA354_GYr4FOPA');

  const unreadCount = messages.filter((m) => m.status === 'Pendiente').length;

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const project: Project = {
      id: `proj-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      description: newDescription || 'Proyecto de arquitectura integral de alta gama.',
      year: newYear,
      area: newArea,
      scope: newScope,
      materials: newMaterials,
      heroImage: newImage,
      status: 'En curso',
      featured: true,
    };

    onAddProject(project);
    setIsAddModalOpen(false);
    // Reset
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col md:flex-row pt-16 md:pt-20">
      {/* 1. SIDEBAR (Matching Screen 4) */}
      <aside className="w-full md:w-64 bg-white border-r border-[#e5e5e5] p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="pb-6 border-b border-[#f3f3f3]">
            <Logo variant="dark" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5e5e5e] block mt-2">
              Panel de Gestión CMS
            </span>
          </div>

          {/* Nav List */}
          <nav className="mt-6 space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-[#5e5e5e] hover:bg-[#f9f9f9] hover:text-[#111111]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('proyectos')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'proyectos'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-[#5e5e5e] hover:bg-[#f9f9f9] hover:text-[#111111]'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderKanban className="w-4 h-4" />
                <span>Proyectos</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activeTab === 'proyectos' ? 'bg-white/20 text-white' : 'bg-[#f3f3f3] text-[#5e5e5e]'
              }`}>
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('mensajes')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'mensajes'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-[#5e5e5e] hover:bg-[#f9f9f9] hover:text-[#111111]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>Mensajes</span>
              </div>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('contenidos')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'contenidos'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-[#5e5e5e] hover:bg-[#f9f9f9] hover:text-[#111111]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Gestión de Contenidos</span>
            </button>

            <button
              onClick={() => setActiveTab('ajustes')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'ajustes'
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'text-[#5e5e5e] hover:bg-[#f9f9f9] hover:text-[#111111]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Ajustes del Sitio</span>
            </button>
          </nav>
        </div>

        {/* User profile footer */}
        <div className="pt-6 border-t border-[#f3f3f3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-bold">
              AR
            </div>
            <div>
              <span className="block text-xs font-bold text-[#111111]">Arq. Romero</span>
              <span className="block text-[10px] text-[#5e5e5e]">Director Técnico</span>
            </div>
          </div>
          <button
            title="Cerrar Sesión"
            onClick={() => setActiveTab('dashboard')}
            className="p-1.5 text-[#5e5e5e] hover:text-black transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {/* TAB: DASHBOARD (Matching Screen 4) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 max-w-6xl">
            {/* Top Bar Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111]">
                  Panel de Gestión
                </h1>
                <p className="text-xs text-[#5e5e5e] mt-1">
                  Resumen operativo, control de obras activas y consultas de clientes.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  id="admin-add-project-btn"
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2.5 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Proyecto</span>
                </button>
              </div>
            </div>

            {/* 3 Metric Cards (Screen 4 exact values) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5e5e5e]">
                    Gestión de Obras Activas
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#f3f3f3] flex items-center justify-center text-[#111111]">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#111111]">
                  12
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+2 obras este mes</span>
                </p>
              </div>

              {/* Card 2 */}
              <div
                onClick={() => setActiveTab('mensajes')}
                className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-xs cursor-pointer hover:border-black/30 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5e5e5e]">
                    Mensajes Nuevos
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#111111]">
                  {messages.length}
                </div>
                <p className="text-[11px] text-amber-600 font-semibold mt-2 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{unreadCount} pendientes de respuesta</span>
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5e5e5e]">
                    Visitas del Sitio
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#f3f3f3] flex items-center justify-center text-[#111111]">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#111111]">
                  2.4k
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18% vs mes anterior</span>
                </p>
              </div>
            </div>

            {/* Obras y Proyectos Recientes (Screen 4 exact section) */}
            <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#111111]">
                    Obras y Proyectos Recientes
                  </h3>
                  <p className="text-xs text-[#5e5e5e]">
                    Listado dinámico cargado en el frontend.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('proyectos')}
                  className="text-xs font-bold uppercase tracking-wider text-[#111111] hover:underline cursor-pointer"
                >
                  Ver Todos
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f9f9f9] text-[#5e5e5e] font-bold uppercase tracking-wider border-b border-[#e5e5e5]">
                    <tr>
                      <th className="py-3 px-4">Proyecto</th>
                      <th className="py-3 px-4">Categoría</th>
                      <th className="py-3 px-4">Superficie</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f3f3f3]">
                    {projects.slice(0, 5).map((proj) => (
                      <tr key={proj.id} className="hover:bg-[#fcfcfc] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={proj.heroImage}
                              alt={proj.title}
                              className="w-10 h-10 rounded-lg object-cover bg-neutral-200"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <span className="font-bold text-sm text-[#111111] block">
                                {proj.title}
                              </span>
                              <span className="text-[11px] text-[#5e5e5e]">
                                {proj.scope} • {proj.year}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#444748]">
                          {proj.category}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#444748]">
                          {proj.area}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              proj.status === 'Completado'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {proj.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onSelectProject(proj)}
                              className="p-1.5 text-[#5e5e5e] hover:text-black hover:bg-[#f3f3f3] rounded-lg transition-colors cursor-pointer"
                              title="Ver Ficha Técnica"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteProject(proj.id)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Acciones Rápidas (Screen 4 exact section) */}
            <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6 shadow-xs">
              <h3 className="text-lg font-bold text-[#111111] mb-4">
                Acciones Rápidas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('contenidos')}
                  className="p-4 rounded-xl border border-[#e5e5e5] hover:border-black/30 hover:bg-[#f9f9f9] text-left transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-xs text-[#111111] block">
                      Editar Texto Inicio
                    </span>
                    <span className="text-[11px] text-[#5e5e5e]">
                      Actualizar eslogan y héroe
                    </span>
                  </div>
                  <Edit3 className="w-4 h-4 text-[#5e5e5e]" />
                </button>

                <button
                  onClick={() => setActiveTab('contenidos')}
                  className="p-4 rounded-xl border border-[#e5e5e5] hover:border-black/30 hover:bg-[#f9f9f9] text-left transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-xs text-[#111111] block">
                      Gestionar Servicios
                    </span>
                    <span className="text-[11px] text-[#5e5e5e]">
                      Modificar entregables y plazos
                    </span>
                  </div>
                  <FileText className="w-4 h-4 text-[#5e5e5e]" />
                </button>

                <button
                  onClick={() => setActiveTab('mensajes')}
                  className="p-4 rounded-xl border border-[#e5e5e5] hover:border-black/30 hover:bg-[#f9f9f9] text-left transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-xs text-[#111111] block">
                      Ver Bandeja de Mensajes
                    </span>
                    <span className="text-[11px] text-[#5e5e5e]">
                      {unreadCount} consultas sin responder
                    </span>
                  </div>
                  <Mail className="w-4 h-4 text-[#5e5e5e]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PROYECTOS */}
        {activeTab === 'proyectos' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111]">
                  Gestión de Proyectos ({projects.length})
                </h1>
                <p className="text-xs text-[#5e5e5e] mt-1">
                  Creá, editá o eliminá proyectos que se renderizan automáticamente en el portfolio.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2.5 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>+ Agregar Proyecto</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="h-44 bg-neutral-900 relative">
                      <img
                        src={proj.heroImage}
                        alt={proj.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded text-white text-[10px] font-bold uppercase">
                        {proj.category}
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold text-base text-[#111111]">{proj.title}</h4>
                      <p className="text-xs text-[#5e5e5e] mt-1">{proj.area} • {proj.year}</p>
                      <p className="text-xs text-[#444748] mt-2 line-clamp-2">{proj.description}</p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-[#f3f3f3] flex items-center justify-between">
                    <button
                      onClick={() => onSelectProject(proj)}
                      className="text-xs font-bold text-[#111111] hover:underline cursor-pointer"
                    >
                      Previsualizar
                    </button>
                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: MENSAJES */}
        {activeTab === 'mensajes' && (
          <div className="space-y-6 max-w-5xl">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111]">
                Bandeja de Consultas de Clientes ({messages.length})
              </h1>
              <p className="text-xs text-[#5e5e5e] mt-1">
                Leé los mensajes enviados a través de los formularios del sitio web.
              </p>
            </div>

            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`bg-white rounded-2xl border p-6 shadow-xs transition-all ${
                    msg.status === 'Pendiente' ? 'border-amber-400 bg-amber-50/10' : 'border-[#e5e5e5]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <span className="text-sm font-bold text-[#111111]">{msg.name}</span>
                      <span className="text-xs text-[#5e5e5e] ml-2">({msg.email})</span>
                      {msg.projectType && (
                        <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#f3f3f3] text-[#111111]">
                          {msg.projectType} {msg.estimatedArea ? `• ${msg.estimatedArea}` : ''}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#5e5e5e]">{msg.date}</span>
                      <button
                        onClick={() => onToggleMessageStatus(msg.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider cursor-pointer ${
                          msg.status === 'Pendiente'
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                      >
                        {msg.status}
                      </button>
                      <button
                        onClick={() => onDeleteMessage(msg.id)}
                        className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                        title="Eliminar mensaje"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#444748] leading-relaxed bg-[#f9f9f9] p-4 rounded-xl border border-[#e5e5e5]">
                    {msg.message}
                  </p>

                  <div className="mt-3 flex items-center justify-end">
                    <a
                      href={`mailto:${msg.email}?subject=Romero Estudio - Consulta sobre tu proyecto`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111111] hover:underline"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Responder por Correo</span>
                    </a>
                  </div>
                </div>
              ))}

              {messages.length === 0 && (
                <div className="p-12 text-center bg-white rounded-2xl border border-[#e5e5e5]">
                  <Mail className="w-8 h-8 text-[#5e5e5e] mx-auto mb-2" />
                  <p className="text-xs text-[#5e5e5e]">No hay consultas registradas por el momento.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: GESTIÓN DE CONTENIDOS & AJUSTES */}
        {(activeTab === 'contenidos' || activeTab === 'ajustes') && (
          <div className="bg-white p-8 rounded-2xl border border-[#e5e5e5] max-w-4xl space-y-6">
            <h2 className="text-xl font-bold text-[#111111]">
              Parámetros Generales de Romero Estudio
            </h2>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#111111] mb-1">
                  Nombre del Estudio
                </label>
                <input
                  type="text"
                  disabled
                  value="Romero Estudio - Arquitectura Integral"
                  className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-neutral-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111111] mb-1">
                  Dirección y Teléfono Oficial
                </label>
                <input
                  type="text"
                  disabled
                  value="Buenos Aires, Argentina • +54 9 11 4800-9200"
                  className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-neutral-600 cursor-not-allowed"
                />
              </div>

              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
                <span className="font-bold block mb-1">Persistencia de datos:</span>
                Actualmente todos los datos están mockeados y reactivos en memoria para la validación visual y de interfaz. Más adelante se integrará la base de datos backend para sincronizar los cambios de forma permanente.
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: + NUEVO PROYECTO */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-[#e5e5e5] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#f3f3f3] mb-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5e5e5e]">
                  CMS Portfolio
                </span>
                <h3 className="text-xl font-bold text-[#111111]">
                  Crear Nuevo Proyecto
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-[#5e5e5e] hover:text-black rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#444748] mb-1">
                  Nombre del Proyecto *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Residencia Martínez"
                  className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-xs focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#444748] mb-1">
                    Categoría
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ProjectCategory)}
                    className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-xs focus:border-[#111111] focus:outline-none"
                  >
                    <option value="Residencial">Residencial</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Reforma">Reforma</option>
                    <option value="Corporativo">Corporativo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#444748] mb-1">
                    Año
                  </label>
                  <input
                    type="text"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-xs focus:border-[#111111] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#444748] mb-1">
                    Superficie (m²)
                  </label>
                  <input
                    type="text"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-xs focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#444748] mb-1">
                    Alcance
                  </label>
                  <input
                    type="text"
                    value={newScope}
                    onChange={(e) => setNewScope(e.target.value)}
                    placeholder="Obra Nueva, Reforma..."
                    className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-xs focus:border-[#111111] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#444748] mb-1">
                  Materiales Principales
                </label>
                <input
                  type="text"
                  value={newMaterials}
                  onChange={(e) => setNewMaterials(e.target.value)}
                  className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-xs focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#444748] mb-1">
                  URL de Imagen Principal
                </label>
                <input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-xs focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#444748] mb-1">
                  Descripción Breve
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Síntesis de la intervención arquitectónica..."
                  className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-xs focus:border-[#111111] focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-[#f3f3f3] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-[#e5e5e5] rounded-xl text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#111111] hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer active:scale-95"
                >
                  Guardar Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
