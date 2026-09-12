import React, { useState } from 'react';
import { Project, ContactMessage, ServiceItem, ProjectCategory, ProjectStatus, SiteSettings, SiteStats, ScreenView } from '../types';
import { api } from '../api';
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
  Save,
  Server,
  RefreshCw,
  Check,
  Sparkles,
  ArrowLeft,
  Palette,
  Layers,
  Lock,
  Shield,
} from 'lucide-react';

interface AdminDashboardViewProps {
  projects: Project[];
  messages: ContactMessage[];
  services: ServiceItem[];
  settings: SiteSettings;
  stats?: SiteStats;
  onAddProject: (project: Project) => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
  onDeleteProject: (projectId: string) => void;
  onSelectProject: (project: Project) => void;
  onToggleMessageStatus: (messageId: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onUpdateSettings: (settings: Partial<SiteSettings>) => void;
  onUpdateService: (id: string, updates: Partial<ServiceItem>) => void;
  onRefreshData?: () => void;
  onNavigateView?: (view: ScreenView) => void;
  onLogout?: () => void;
  adminUser?: { name?: string; role?: string; email?: string } | null;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  projects,
  messages,
  services,
  settings,
  stats,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onSelectProject,
  onToggleMessageStatus,
  onDeleteMessage,
  onUpdateSettings,
  onUpdateService,
  onRefreshData,
  onNavigateView,
  onLogout,
  adminUser,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'proyectos' | 'contenidos' | 'mensajes' | 'ajustes'>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Security & password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // New project form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ProjectCategory>('Residencial');
  const [newDescription, setNewDescription] = useState('');
  const [newYear, setNewYear] = useState('2024');
  const [newArea, setNewArea] = useState('320 m²');
  const [newScope, setNewScope] = useState('Obra Nueva');
  const [newMaterials, setNewMaterials] = useState('Hormigón Visto, Vidrio Doble, Acero');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({ ...settings });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Messages filter
  const [messageFilter, setMessageFilter] = useState<'todos' | 'Pendiente' | 'Respondido'>('todos');

  // Selected service for content editing
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');
  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];
  const [serviceShortDesc, setServiceShortDesc] = useState('');
  const [serviceTimeline, setServiceTimeline] = useState('');

  // Keep form in sync when settings prop updates
  React.useEffect(() => {
    setSettingsForm({ ...settings });
  }, [settings]);

  React.useEffect(() => {
    if (currentService) {
      setServiceShortDesc(currentService.shortDesc);
      setServiceTimeline(currentService.timeline);
    }
  }, [selectedServiceId, services]);

  const unreadCount = messages.filter((m) => m.status === 'Pendiente').length;
  const filteredMessages = messages.filter((m) =>
    messageFilter === 'todos' ? true : m.status === messageFilter
  );

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
    setNewTitle('');
    setNewDescription('');
  };

  const handleSaveEditProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    onUpdateProject(editingProject.id, editingProject);
    setEditingProject(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentService) return;
    onUpdateService(currentService.id, {
      shortDesc: serviceShortDesc,
      timeline: serviceTimeline,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (!currentPassword || !newPassword) {
      setPasswordStatus({ success: false, message: 'Completa la contraseña actual y la nueva contraseña.' });
      return;
    }

    if (newPassword.length < 4) {
      setPasswordStatus({ success: false, message: 'La nueva contraseña debe tener al menos 4 caracteres.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ success: false, message: 'La confirmación de la nueva contraseña no coincide.' });
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await api.changePassword(currentPassword, newPassword);
      if (res.success) {
        setPasswordStatus({ success: true, message: '✓ Contraseña actualizada correctamente en el servidor.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordStatus({ success: false, message: res.error || 'No se pudo actualizar la contraseña.' });
      }
    } catch {
      setPasswordStatus({ success: false, message: 'Error de comunicación con el servidor.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col md:flex-row pt-16 md:pt-20">
      {/* 1. SIDEBAR */}
      <aside className="w-full md:w-64 bg-white border-r border-[#e5e5e5] p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* Panel Header */}
          <div className="pb-3.5 border-b border-[#f3f3f3] flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              Panel de Gestión
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5e5e5e]">
                API
              </span>
            </div>
          </div>

          {/* Return to Public Site */}
          <button
            onClick={() => onNavigateView?.('inicio')}
            className="w-full mt-4 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-[#111111] rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer border border-[#e5e5e5] group"
            title="Volver a la vista pública de la web"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Volver a la Web</span>
            </div>
            <ExternalLink className="w-3 h-3 text-neutral-400" />
          </button>

          {/* Nav List */}
          <nav className="mt-4 space-y-1 text-xs font-semibold">
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
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === 'proyectos' ? 'bg-white/20 text-white' : 'bg-[#f3f3f3] text-[#5e5e5e]'
                }`}
              >
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

            {/* Internal Design System & Components Links */}
            <div className="pt-4 mt-4 border-t border-[#f3f3f3] space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5e5e5e] block px-3 mb-2">
                Recursos de Marca
              </span>
              <button
                onClick={() => onNavigateView?.('marca')}
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[#5e5e5e] hover:bg-[#f9f9f9] hover:text-[#111111] transition-colors cursor-pointer text-xs font-semibold"
              >
                <Palette className="w-4 h-4" />
                <span>Manual de Marca</span>
              </button>
              <button
                onClick={() => onNavigateView?.('ui-kit')}
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[#5e5e5e] hover:bg-[#f9f9f9] hover:text-[#111111] transition-colors cursor-pointer text-xs font-semibold"
              >
                <Layers className="w-4 h-4" />
                <span>UI Kit de Componentes</span>
              </button>
            </div>
          </nav>
        </div>

        {/* User profile and server badge footer */}
        <div className="pt-6 border-t border-[#f3f3f3] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-bold">
                {adminUser?.name ? adminUser.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'AR'}
              </div>
              <div className="overflow-hidden">
                <span className="block text-xs font-bold text-[#111111] truncate max-w-[110px]">
                  {adminUser?.name || 'Arq. Romero'}
                </span>
                <span className="block text-[10px] text-[#5e5e5e] truncate max-w-[110px]">
                  {adminUser?.role || 'Director Técnico'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {onRefreshData && (
                <button
                  title="Sincronizar Datos"
                  onClick={onRefreshData}
                  className="p-1.5 text-[#5e5e5e] hover:text-black transition-colors rounded-lg hover:bg-neutral-100 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
              {onLogout && (
                <button
                  title="Cerrar Sesión"
                  onClick={onLogout}
                  className="p-1.5 text-red-600 hover:text-red-700 transition-colors rounded-lg hover:bg-red-50 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200 text-[10px] text-neutral-500 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <Server className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">Node.js API • Port 3000</span>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="text-[10px] font-bold text-red-600 hover:underline cursor-pointer"
              >
                Salir
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {/* TAB: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 max-w-6xl">
            {/* Top Bar Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111]">
                  Panel de Gestión
                </h1>
                <p className="text-xs text-[#5e5e5e] mt-1">
                  Resumen operativo con persistencia en backend de Express y control en vivo.
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

            {/* 3 Metric Cards */}
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
                  {stats?.activeProjects ?? projects.filter((p) => p.status === 'En curso').length}
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{projects.length} obras registradas en total</span>
                </p>
              </div>

              {/* Card 2 */}
              <div
                onClick={() => setActiveTab('mensajes')}
                className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-xs cursor-pointer hover:border-black/30 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5e5e5e]">
                    Mensajes y Consultas
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
                  {stats?.visits ?? '2.4k'}
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Contador sincronizado con el backend</span>
                </p>
              </div>
            </div>

            {/* Obras y Proyectos Recientes */}
            <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#111111]">
                    Obras y Proyectos Recientes
                  </h3>
                  <p className="text-xs text-[#5e5e5e]">
                    Listado sincronizado mediante el endpoint REST <code className="bg-neutral-100 px-1 py-0.5 rounded">/api/projects</code>.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('proyectos')}
                  className="text-xs font-bold uppercase tracking-wider text-[#111111] hover:underline cursor-pointer"
                >
                  Ver Todos ({projects.length})
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
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingProject(proj)}
                              className="p-1.5 text-[#5e5e5e] hover:text-black hover:bg-[#f3f3f3] rounded-lg transition-colors cursor-pointer"
                              title="Editar Proyecto"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
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

            {/* Acciones Rápidas */}
            <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6 shadow-xs">
              <h3 className="text-lg font-bold text-[#111111] mb-4">
                Acciones Rápidas de Administración
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('contenidos')}
                  className="p-4 rounded-xl border border-[#e5e5e5] hover:border-black/30 hover:bg-[#f9f9f9] text-left transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-xs text-[#111111] block">
                      Editar Contenidos
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
                      Bandeja de Mensajes
                    </span>
                    <span className="text-[11px] text-[#5e5e5e]">
                      {unreadCount} consultas pendientes
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
                  Creá, editá o eliminá proyectos. Los cambios se persisten inmediatamente en la base de datos de Express.
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
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded text-white text-[10px] font-bold">
                        {proj.status}
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold text-base text-[#111111]">{proj.title}</h4>
                      <p className="text-xs text-[#5e5e5e] mt-1">{proj.area} • {proj.year} • {proj.scope}</p>
                      <p className="text-xs text-[#444748] mt-2 line-clamp-2">{proj.description}</p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-[#f3f3f3] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onSelectProject(proj)}
                        className="text-xs font-bold text-[#111111] hover:underline cursor-pointer"
                      >
                        Ver Ficha
                      </button>
                      <button
                        onClick={() => setEditingProject(proj)}
                        className="text-xs font-bold text-neutral-600 hover:text-black cursor-pointer flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Editar</span>
                      </button>
                    </div>
                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar Proyecto"
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111]">
                  Bandeja de Consultas de Clientes ({messages.length})
                </h1>
                <p className="text-xs text-[#5e5e5e] mt-1">
                  Gestioná los mensajes recibidos a través de los formularios y actualizá su estado de respuesta.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#e5e5e5]">
                {(['todos', 'Pendiente', 'Respondido'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setMessageFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize ${
                      messageFilter === filter
                        ? 'bg-[#111111] text-white'
                        : 'text-[#5e5e5e] hover:text-black'
                    }`}
                  >
                    {filter === 'todos' ? 'Todos' : filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredMessages.map((msg) => (
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
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider cursor-pointer transition-all ${
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

              {filteredMessages.length === 0 && (
                <div className="p-12 text-center bg-white rounded-2xl border border-[#e5e5e5]">
                  <Mail className="w-8 h-8 text-[#5e5e5e] mx-auto mb-2" />
                  <p className="text-xs text-[#5e5e5e]">No hay consultas con el filtro seleccionado.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: GESTIÓN DE CONTENIDOS */}
        {activeTab === 'contenidos' && (
          <div className="space-y-8 max-w-4xl">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111]">
                Gestión de Contenidos
              </h1>
              <p className="text-xs text-[#5e5e5e] mt-1">
                Editá los textos del Hero, eslogan y las descripciones de los servicios. Los cambios se guardan en el backend.
              </p>
            </div>

            {/* 1. Hero text editor */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#f3f3f3]">
                <h3 className="font-bold text-sm text-[#111111]">
                  Encabezado Principal (Hero de Inicio)
                </h3>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5e5e5e]">
                  Sección 01
                </span>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#111111] mb-1">
                    Título Principal del Hero
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                    className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-xs text-[#111111] focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#111111] mb-1">
                    Descripción / Bajada del Hero
                  </label>
                  <textarea
                    rows={3}
                    value={settingsForm.heroSubtitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                    className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-xs text-[#111111] focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  {settingsSaved ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" /> ¡Guardado con éxito en el backend!
                    </span>
                  ) : <span></span>}

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#111111] hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer flex items-center gap-2 active:scale-95"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Guardar Textos del Hero</span>
                  </button>
                </div>
              </form>
            </div>

            {/* 2. Services content editor */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e5e5e5] shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#f3f3f3]">
                <h3 className="font-bold text-sm text-[#111111]">
                  Modificar Servicios & Plazos
                </h3>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5e5e5e]">
                  Sección 02
                </span>
              </div>

              <div className="flex gap-2 pb-2 overflow-x-auto">
                {services.map((svc) => (
                  <button
                    key={svc.id}
                    onClick={() => setSelectedServiceId(svc.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedServiceId === svc.id
                        ? 'bg-[#111111] text-white'
                        : 'bg-[#f3f3f3] text-neutral-600 hover:text-black'
                    }`}
                  >
                    {svc.title}
                  </button>
                ))}
              </div>

              {currentService && (
                <form onSubmit={handleSaveService} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#111111] mb-1">
                      Descripción Resumida
                    </label>
                    <textarea
                      rows={2}
                      value={serviceShortDesc}
                      onChange={(e) => setServiceShortDesc(e.target.value)}
                      className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-xs text-[#111111] focus:border-[#111111] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#111111] mb-1">
                      Plazo Estimado
                    </label>
                    <input
                      type="text"
                      value={serviceTimeline}
                      onChange={(e) => setServiceTimeline(e.target.value)}
                      className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-xs text-[#111111] focus:border-[#111111] focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#111111] hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer flex items-center gap-2 active:scale-95"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Actualizar Servicio</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* TAB: AJUSTES DEL SITIO */}
        {activeTab === 'ajustes' && (
          <div className="bg-white p-8 rounded-2xl border border-[#e5e5e5] max-w-4xl space-y-6 shadow-xs">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111]">
                Ajustes Generales del Estudio
              </h1>
              <p className="text-xs text-[#5e5e5e] mt-1">
                Configuración institucional, vías de contacto y números telefónicos oficiales.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#111111] mb-1">
                    Nombre Oficial del Estudio
                  </label>
                  <input
                    type="text"
                    value={settingsForm.studioName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, studioName: e.target.value })}
                    className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-neutral-800 focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#111111] mb-1">
                    Eslogan Institucional
                  </label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-neutral-800 focus:border-[#111111] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#111111] mb-1">
                    Correo Electrónico de Contacto
                  </label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-neutral-800 focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#111111] mb-1">
                    Teléfono Oficial
                  </label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-neutral-800 focus:border-[#111111] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#111111] mb-1">
                    Dirección / Ubicación Física
                  </label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-neutral-800 focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#111111] mb-1">
                    Número WhatsApp (con código de país)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-neutral-800 focus:border-[#111111] focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
                <span className="font-bold block mb-1">Persistencia Activa:</span>
                Los cambios se guardan inmediatamente en el backend Node.js / Express mediante <code className="bg-emerald-100/80 px-1 py-0.5 rounded font-mono text-[11px]">PUT /api/settings</code>.
              </div>

              <div className="flex items-center justify-between pt-2">
                {settingsSaved ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" /> ¡Ajustes actualizados en el servidor!
                  </span>
                ) : <span></span>}

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#111111] hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Parámetros</span>
                </button>
              </div>
            </form>

            {/* SECCIÓN SEGURIDAD Y ACCESO */}
            <div className="pt-8 border-t border-[#f0f0f0] mt-8">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#111111]">
                    Seguridad y Clave de Administrador
                  </h2>
                  <p className="text-[11px] text-[#5e5e5e]">
                    Modifica la contraseña requerida para ingresar al panel de control.
                  </p>
                </div>
              </div>

              {passwordStatus && (
                <div
                  className={`mt-4 p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                    passwordStatus.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  <span>{passwordStatus.message}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="mt-4 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-[#111111] mb-1">
                      Contraseña Actual
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-neutral-800 focus:border-[#111111] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#111111] mb-1">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 4 caracteres"
                      className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-neutral-800 focus:border-[#111111] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#111111] mb-1">
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repetir nueva contraseña"
                      className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-neutral-800 focus:border-[#111111] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="px-6 py-2.5 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer flex items-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{isChangingPassword ? 'Guardando...' : 'Actualizar Contraseña'}</span>
                  </button>
                </div>
              </form>
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
                className="p-2 text-[#5e5e5e] hover:text-black rounded-full cursor-pointer"
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
                  className="px-4 py-2 border border-[#e5e5e5] rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#111111] hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer active:scale-95"
                >
                  Guardar Proyecto en Backend
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR PROYECTO */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-[#e5e5e5] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#f3f3f3] mb-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5e5e5e]">
                  Editar Proyecto
                </span>
                <h3 className="text-xl font-bold text-[#111111]">
                  {editingProject.title}
                </h3>
              </div>
              <button
                onClick={() => setEditingProject(null)}
                className="p-2 text-[#5e5e5e] hover:text-black rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#444748] mb-1">
                  Título del Proyecto
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-xs focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#444748] mb-1">
                    Categoría
                  </label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as ProjectCategory })}
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
                    Estado de Obra
                  </label>
                  <select
                    value={editingProject.status}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as ProjectStatus })}
                    className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-xs focus:border-[#111111] focus:outline-none"
                  >
                    <option value="En curso">En curso</option>
                    <option value="Completado">Completado</option>
                    <option value="En planificación">En planificación</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#444748] mb-1">
                    Superficie
                  </label>
                  <input
                    type="text"
                    value={editingProject.area}
                    onChange={(e) => setEditingProject({ ...editingProject, area: e.target.value })}
                    className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-xs focus:border-[#111111] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#444748] mb-1">
                    Año
                  </label>
                  <input
                    type="text"
                    value={editingProject.year}
                    onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                    className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-xs focus:border-[#111111] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#444748] mb-1">
                  Materiales
                </label>
                <input
                  type="text"
                  value={editingProject.materials}
                  onChange={(e) => setEditingProject({ ...editingProject, materials: e.target.value })}
                  className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-xs focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#444748] mb-1">
                  URL de Imagen
                </label>
                <input
                  type="text"
                  value={editingProject.heroImage}
                  onChange={(e) => setEditingProject({ ...editingProject, heroImage: e.target.value })}
                  className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-xs focus:border-[#111111] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#444748] mb-1">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full p-2.5 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl text-xs focus:border-[#111111] focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-[#f3f3f3] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 border border-[#e5e5e5] rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#111111] hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
