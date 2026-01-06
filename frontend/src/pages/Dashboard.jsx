import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    FiEdit2, FiTrash2, FiPlus, FiLogOut, FiSave, FiX, FiSearch, 
    FiFile, FiStar, FiTrash, FiGrid, FiSettings, FiChevronDown, 
    FiMenu, FiHeart, FiBookOpen, FiBriefcase, FiZap, FiUser,
    FiShoppingCart
} from 'react-icons/fi';

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [formData, setFormData] = useState({ title: '', content: '', tags: [] });
    const [user, setUser] = useState(null);
    const [viewingNote, setViewingNote] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentView, setCurrentView] = useState('notes'); // 'notes', 'favorites', 'trash'
    const [showSettings, setShowSettings] = useState(false);
    const [sortBy, setSortBy] = useState('dateModified'); // 'dateModified', 'dateCreated', 'title'
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [settings, setSettings] = useState({
        theme: localStorage.getItem('theme') || 'dark',
        fontSize: localStorage.getItem('fontSize') || 'medium',
        defaultView: localStorage.getItem('defaultView') || 'notes',
        compactMode: localStorage.getItem('compactMode') === 'true'
    });
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.classList.toggle('light-theme', settings.theme === 'light');
    }, [settings.theme]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!token) {
            navigate('/login');
            return;
        }

        if (userData) {
            setUser(JSON.parse(userData));
        }

        fetchNotes();
    }, [navigate]);

    useEffect(() => {
        fetchNotes();
    }, [currentView]);

    useEffect(() => {
        const filtered = notes.filter(note => {
            const matchesSearch = searchQuery.trim() === '' || 
                note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                note.content.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesFilter = activeFilter === 'All' || 
                (note.tags && note.tags.includes(activeFilter));
            
            // Filter by view
            if (currentView === 'favorites') {
                return matchesSearch && matchesFilter && note.isFavorite;
            } else if (currentView === 'trash') {
                return matchesSearch && matchesFilter;
            }
            
            return matchesSearch && matchesFilter;
        });

        // Sort the filtered notes
        const sorted = [...filtered].sort((a, b) => {
            if (sortBy === 'dateModified') {
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            } else if (sortBy === 'dateCreated') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortBy === 'title') {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });

        setFilteredNotes(sorted);
    }, [searchQuery, notes, activeFilter, currentView, sortBy]);

    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem('token');
            const endpoint = currentView === 'trash' 
                ? 'http://localhost:5000/api/notes/trash/all'
                : 'http://localhost:5000/api/notes';
            
            const response = await axios.get(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                setNotes(response.data.notes);
                setFilteredNotes(response.data.notes);
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                handleLogout();
            } else {
                // Set empty notes instead of showing error for now
                setNotes([]);
                setFilteredNotes([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const updateSettings = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        localStorage.setItem(key, value);
        if (key === 'defaultView') {
            setCurrentView(value);
        }
        toast.success('Settings updated');
    };

    const openModal = (note = null) => {
        if (note) {
            setEditingNote(note);
            setFormData({ 
                title: note.title, 
                content: note.content,
                tags: note.tags || []
            });
        } else {
            setEditingNote(null);
            setFormData({ title: '', content: '', tags: [] });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingNote(null);
        setFormData({ title: '', content: '', tags: [] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title.trim() || !formData.content.trim()) {
            toast.error('Title and content are required');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { 'Authorization': `Bearer ${token}` }
            };

            if (editingNote) {
                const response = await axios.put(
                    `http://localhost:5000/api/notes/${editingNote._id}`,
                    formData,
                    config
                );

                if (response.data.success) {
                    toast.success('Note updated successfully');
                    fetchNotes();
                    closeModal();
                }
            } else {
                const response = await axios.post(
                    'http://localhost:5000/api/notes',
                    formData,
                    config
                );

                if (response.data.success) {
                    toast.success('Note created successfully');
                    fetchNotes();
                    closeModal();
                }
            }
        } catch (error) {
            console.error('Error saving note:', error);
            toast.error('Failed to save note');
        }
    };

    const handleDelete = async (noteId) => {
        if (!window.confirm('Are you sure you want to move this note to trash?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:5000/api/notes/${noteId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success('Note moved to trash');
                fetchNotes();
            }
        } catch (error) {
            console.error('Error deleting note:', error);
            toast.error('Failed to delete note');
        }
    };

    const toggleFavorite = async (noteId, event) => {
        event.stopPropagation();
        
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(`http://localhost:5000/api/notes/${noteId}/favorite`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success(response.data.message);
                fetchNotes();
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast.error('Failed to update favorite');
        }
    };

    const restoreNote = async (noteId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(`http://localhost:5000/api/notes/${noteId}/restore`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success('Note restored successfully');
                fetchNotes();
            }
        } catch (error) {
            console.error('Error restoring note:', error);
            toast.error('Failed to restore note');
        }
    };

    const permanentDelete = async (noteId) => {
        if (!window.confirm('Permanently delete this note? This action cannot be undone!')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:5000/api/notes/${noteId}/permanent`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success('Note permanently deleted');
                fetchNotes();
            }
        } catch (error) {
            console.error('Error permanently deleting note:', error);
            toast.error('Failed to delete note');
        }
    };

    const formatDate = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffTime = Math.abs(now - date);
        const diffMinutes = Math.ceil(diffTime / (1000 * 60));
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffWeeks = Math.ceil(diffDays / 7);
        const diffMonths = Math.ceil(diffDays / 30);

        if (diffMinutes < 60) return `${diffMinutes} mins ago`;
        if (diffHours < 24) return `${diffHours === 1 ? '1 hour' : diffHours + ' hours'} ago`;
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffWeeks === 1) return '1 week ago';
        if (diffWeeks < 4) return `${diffWeeks} weeks ago`;
        if (diffMonths === 1) return '1 month ago';
        return `${diffMonths} months ago`;
    };

    const getNoteIcon = (tags) => {
        if (!tags || tags.length === 0) return { icon: FiFile, color: 'bg-purple-500/20', iconColor: 'text-purple-500' };
        if (tags.includes('Work')) return { icon: FiBriefcase, color: 'bg-purple-500/20', iconColor: 'text-purple-500' };
        if (tags.includes('Personal')) return { icon: FiUser, color: 'bg-blue-500/20', iconColor: 'text-blue-500' };
        if (tags.includes('Reading')) return { icon: FiBookOpen, color: 'bg-green-500/20', iconColor: 'text-green-500' };
        if (tags.includes('Ideas')) return { icon: FiZap, color: 'bg-orange-500/20', iconColor: 'text-orange-500' };
        if (tags.includes('Family')) return { icon: FiHeart, color: 'bg-pink-500/20', iconColor: 'text-pink-500' };
        if (tags.includes('Shopping')) return { icon: FiShoppingCart, color: 'bg-blue-500/20', iconColor: 'text-blue-500' };
        return { icon: FiFile, color: 'bg-gray-500/20', iconColor: 'text-gray-500' };
    };

    const getTagColor = (tag) => {
        const colors = {
            'Work': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            'Personal': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            'Reading': 'bg-green-500/20 text-green-400 border-green-500/30',
            'Ideas': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
            'Family': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
            'Shopping': 'bg-blue-500/20 text-blue-400 border-blue-500/30'
        };
        return colors[tag] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-900">
                <div className="text-xl text-white">Loading notes...</div>
            </div>
        );
    }

    console.log('Dashboard rendering with notes:', notes.length);

    const getThemeClasses = () => {
        const isLight = settings.theme === 'light';
        return {
            bg: isLight ? 'bg-gray-50' : 'bg-slate-900',
            text: isLight ? 'text-gray-900' : 'text-white',
            sidebar: isLight ? 'bg-white border-gray-200' : 'bg-slate-900 border-slate-700',
            cardBg: isLight ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-700',
            cardHover: isLight ? 'hover:border-gray-300' : 'hover:border-slate-600',
            inputBg: isLight ? 'bg-gray-100 border-gray-300' : 'bg-slate-800 border-slate-700',
            modalBg: isLight ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-700',
            textSecondary: isLight ? 'text-gray-600' : 'text-slate-400',
            textTertiary: isLight ? 'text-gray-500' : 'text-slate-500',
            hoverBg: isLight ? 'hover:bg-gray-100' : 'hover:bg-slate-800',
            buttonBg: isLight ? 'bg-gray-100 hover:bg-gray-200' : 'bg-slate-700 hover:bg-slate-600',
            border: isLight ? 'border-gray-200' : 'border-slate-700'
        };
    };

    const getFontSizeClasses = () => {
        const sizes = {
            small: { title: 'text-base', content: 'text-sm', heading: 'text-2xl' },
            medium: { title: 'text-lg', content: 'text-sm', heading: 'text-3xl' },
            large: { title: 'text-xl', content: 'text-base', heading: 'text-4xl' }
        };
        return sizes[settings.fontSize];
    };

    const getCompactClasses = () => {
        return settings.compactMode ? { padding: 'p-3', gap: 'gap-3' } : { padding: 'p-5', gap: 'gap-4' };
    };

    const theme = getThemeClasses();
    const fontSize = getFontSizeClasses();
    const compact = getCompactClasses();

    return (
        <div className={`flex min-h-screen ${theme.bg} ${theme.text}`}>
            <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} ${theme.sidebar} border-r transition-all duration-300 overflow-hidden flex flex-col`}>
                <div className="p-6 flex-1">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="text-blue-500 text-2xl">📝</div>
                        <span className="text-xl font-bold">NoteX</span>
                    </div>
                    <div className="mb-8">
                        <h3 className={`text-xs font-semibold ${theme.textTertiary} uppercase mb-3`}>MENU</h3>
                        <nav className="space-y-1">
                            <button onClick={() => { setCurrentView('notes'); setActiveFilter('All'); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${currentView === 'notes' ? 'bg-blue-600/20 text-blue-400' : `${theme.textSecondary} ${theme.hoverBg}`}`}>
                                <FiFile size={18} />
                                <span>All Notes</span>
                            </button>
                            <button onClick={() => { setCurrentView('favorites'); setActiveFilter('All'); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${currentView === 'favorites' ? 'bg-blue-600/20 text-blue-400' : `${theme.textSecondary} ${theme.hoverBg}`}`}>
                                <FiStar size={18} />
                                <span>Favorites</span>
                            </button>
                            <button onClick={() => { setCurrentView('trash'); setActiveFilter('All'); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${currentView === 'trash' ? 'bg-blue-600/20 text-blue-400' : `${theme.textSecondary} ${theme.hoverBg}`}`}>
                                <FiTrash size={18} />
                                <span>Trash</span>
                            </button>
                        </nav>
                    </div>
                    <div className="mb-8">
                        <h3 className={`text-xs font-semibold ${theme.textTertiary} uppercase mb-3`}>TAGS</h3>
                        <nav className="space-y-1">
                            <button onClick={() => setActiveFilter('Personal')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${activeFilter === 'Personal' ? 'bg-blue-600/20 text-blue-400' : `${theme.textSecondary} ${theme.hoverBg}`}`}>
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                <span>Personal</span>
                            </button>
                            <button onClick={() => setActiveFilter('Work')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${activeFilter === 'Work' ? 'bg-purple-600/20 text-purple-400' : `${theme.textSecondary} ${theme.hoverBg}`}`}>
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                <span>Work</span>
                            </button>
                            <button onClick={() => setActiveFilter('Reading')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${activeFilter === 'Reading' ? 'bg-green-600/20 text-green-400' : `${theme.textSecondary} ${theme.hoverBg}`}`}>
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span>Reading</span>
                            </button>
                        </nav>
                    </div>
                </div>
                <div className={`border-t ${theme.border}`}>
                    <button onClick={() => setShowSettings(true)} className={`w-full flex items-center gap-3 px-6 py-4 ${theme.textSecondary} ${theme.hoverBg} transition`}>
                        <FiSettings size={18} />
                        <span>Settings</span>
                    </button>
                    <div className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold text-lg">
                            {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1">
                            <div className="font-semibold text-sm">{user?.name || 'Alex Morgan'}</div>
                        </div>
                    </div>
                </div>
            </aside>
            <main className="flex-1 flex flex-col">
                <header className={`border-b ${theme.border} ${theme.bg}`}>
                    <div className="px-6 py-4 flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`${theme.textSecondary} hover:${theme.text} transition md:hidden`}>
                            <FiMenu size={24} />
                        </button>
                        <div className="flex-1 max-w-xl">
                            <div className="relative">
                                <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textSecondary}`} size={18} />
                                <input type="text" placeholder="Search titles or content..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full pl-10 pr-4 py-2 ${theme.inputBg} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.text} placeholder-gray-500`} />
                            </div>
                        </div>
                        {currentView !== 'trash' && (
                            <button onClick={() => openModal()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium">
                                <FiPlus size={18} />
                                Create New Note
                            </button>
                        )}
                        <button onClick={handleLogout} className={`p-2 ${theme.textSecondary} hover:text-red-400 transition`} title="Logout">
                            <FiLogOut size={20} />
                        </button>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <h1 className={`${fontSize.heading} font-bold`}>All Notes <span className={theme.textTertiary}>({filteredNotes.length})</span></h1>
                            <div className={`flex items-center gap-2 text-sm ${theme.textSecondary} relative`}>
                                <span>Sort by:</span>
                                <button 
                                    onClick={() => setShowSortMenu(!showSortMenu)}
                                    className={`flex items-center gap-1 hover:${theme.text} transition`}
                                >
                                    {sortBy === 'dateModified' ? 'Date Modified' : sortBy === 'dateCreated' ? 'Date Created' : 'Title'}
                                    <FiChevronDown size={16} />
                                </button>
                                {showSortMenu && (
                                    <div className={`absolute top-full right-0 mt-2 ${theme.modalBg} border ${theme.border} rounded-lg shadow-xl z-10 py-2 min-w-[160px]`}>
                                        <button
                                            onClick={() => { setSortBy('dateModified'); setShowSortMenu(false); }}
                                            className={`w-full text-left px-4 py-2 ${theme.hoverBg} transition ${sortBy === 'dateModified' ? theme.text : theme.textSecondary}`}
                                        >
                                            Date Modified
                                        </button>
                                        <button
                                            onClick={() => { setSortBy('dateCreated'); setShowSortMenu(false); }}
                                            className={`w-full text-left px-4 py-2 ${theme.hoverBg} transition ${sortBy === 'dateCreated' ? theme.text : theme.textSecondary}`}
                                        >
                                            Date Created
                                        </button>
                                        <button
                                            onClick={() => { setSortBy('title'); setShowSortMenu(false); }}
                                            className={`w-full text-left px-4 py-2 ${theme.hoverBg} transition ${sortBy === 'title' ? theme.text : theme.textSecondary}`}
                                        >
                                            Title (A-Z)
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className={theme.textSecondary}>View and manage your personal thoughts.</p>
                    </div>
                    <div className="flex gap-3 mb-6">
                        <button onClick={() => setActiveFilter('All')} className={`px-4 py-2 rounded-lg font-medium transition ${activeFilter === 'All' ? `${theme.buttonBg} ${theme.text}` : `${theme.textSecondary} ${theme.hoverBg}`}`}>All</button>
                        <button onClick={() => setActiveFilter('Work')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${activeFilter === 'Work' ? `${theme.buttonBg} ${theme.text}` : `${theme.textSecondary} ${theme.hoverBg}`}`}>
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            Work
                        </button>
                        <button onClick={() => setActiveFilter('Personal')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${activeFilter === 'Personal' ? `${theme.buttonBg} ${theme.text}` : `${theme.textSecondary} ${theme.hoverBg}`}`}>
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Personal
                        </button>
                        <button onClick={() => setActiveFilter('Reading')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${activeFilter === 'Reading' ? `${theme.buttonBg} ${theme.text}` : `${theme.textSecondary} ${theme.hoverBg}`}`}>
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Reading
                        </button>
                    </div>
                    {filteredNotes.length === 0 ? (
                        <div className="text-center py-20">
                            <div className={`w-20 h-20 ${theme.cardBg} border rounded-full flex items-center justify-center mx-auto mb-4`}>
                                {currentView === 'trash' ? (
                                    <FiTrash size={32} className={theme.textSecondary} />
                                ) : (
                                    <FiFile size={32} className={theme.textSecondary} />
                                )}
                            </div>
                            <p className={`${theme.textSecondary} ${fontSize.title} mb-4`}>
                                {currentView === 'trash' ? 'Trash is empty' : currentView === 'favorites' ? 'No favorite notes yet' : 'No notes yet. Create your first note!'}
                            </p>
                            {currentView === 'notes' && (
                                <button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition">Create Note</button>
                            )}
                        </div>
                    ) : (
                        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${compact.gap}`}>
                            {filteredNotes.map((note) => {
                                const { icon: Icon, color, iconColor } = getNoteIcon(note.tags);
                                return (
                                    <div key={note._id} className={`${theme.cardBg} rounded-lg ${compact.padding} border ${theme.cardHover} transition group relative`}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
                                                <Icon className={iconColor} size={20} />
                                            </div>
                                            {currentView !== 'trash' && (
                                                <button
                                                    onClick={(e) => toggleFavorite(note._id, e)}
                                                    className={`p-2 rounded-lg transition ${note.isFavorite ? 'text-yellow-500' : 'text-slate-400 hover:text-yellow-500'}`}
                                                >
                                                    <FiStar size={18} fill={note.isFavorite ? 'currentColor' : 'none'} />
                                                </button>
                                            )}
                                        </div>
                                        <div onClick={() => setViewingNote(note)} className="cursor-pointer">
                                            <h3 className={`${fontSize.title} font-semibold mb-2 line-clamp-2 group-hover:text-blue-400 transition`}>{note.title}</h3>
                                            <p className={`${theme.textSecondary} ${fontSize.content} mb-4 line-clamp-3`}>{note.content.replace(/<[^>]*>/g, '').substring(0, 150)}...</p>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className={theme.textTertiary}>{formatDate(note.updatedAt)}</span>
                                                {note.tags && note.tags.length > 0 && (
                                                    <span className={`px-2 py-1 rounded border ${getTagColor(note.tags[0])}`}>{note.tags[0]}</span>
                                                )}
                                            </div>
                                        </div>
                                        {currentView === 'trash' && (
                                            <div className="flex gap-2 mt-4">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); restoreNote(note._id); }}
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition"
                                                >
                                                    Restore
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); permanentDelete(note._id); }}
                                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition"
                                                >
                                                    Delete Forever
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
                    <div className={`${theme.modalBg} rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border`}>
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className={`text-2xl font-bold ${theme.text}`}>{editingNote ? 'Edit Note' : 'Create New Note'}</h3>
                                <button onClick={closeModal} className={`${theme.textSecondary} hover:${theme.text} text-2xl`}><FiX /></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className={`block ${theme.text} font-medium mb-2`}>Title</label>
                                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter note title" className={`w-full px-4 py-2 ${theme.inputBg} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.text} placeholder-gray-500`} required />
                                </div>
                                <div className="mb-4">
                                    <label className={`block ${theme.text} font-medium mb-2`}>Content</label>
                                    <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Write your note here..." rows="10" className={`w-full px-4 py-2 ${theme.inputBg} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${theme.text} placeholder-gray-500`} required />
                                </div>
                                <div className="mb-6">
                                    <label className={`block ${theme.text} font-medium mb-2`}>Tags</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Work', 'Personal', 'Reading', 'Ideas', 'Family', 'Shopping'].map(tag => (
                                            <button key={tag} type="button" onClick={() => { if (formData.tags.includes(tag)) { setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) }); } else { setFormData({ ...formData, tags: [...formData.tags, tag] }); } }} className={`px-3 py-1 rounded-lg text-sm transition border ${formData.tags.includes(tag) ? getTagColor(tag) : `${theme.buttonBg} ${theme.textSecondary} ${theme.border}`}`}>{tag}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium"><FiSave size={18} /> Save</button>
                                    <button type="button" onClick={closeModal} className={`w-10 h-10 flex items-center justify-center ${theme.buttonBg} text-white rounded-lg transition`} title="Cancel"><FiX size={18} /></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {viewingNote && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={() => setViewingNote(null)}>
                    <div className={`${theme.modalBg} rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border`} onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h2 className={`text-3xl font-bold ${theme.text} mb-2`}>{viewingNote.title}</h2>
                                    <p className={`text-sm ${theme.textSecondary}`}>{formatDate(viewingNote.updatedAt)}</p>
                                </div>
                                <button onClick={() => setViewingNote(null)} className={`${theme.textSecondary} hover:${theme.text} text-2xl`}><FiX /></button>
                            </div>
                            <div className="prose max-w-none">
                                <div className={`${theme.text} whitespace-pre-wrap ${fontSize.title} leading-relaxed`}>{viewingNote.content}</div>
                            </div>
                            {viewingNote.tags && viewingNote.tags.length > 0 && (
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {viewingNote.tags.map((tag, index) => (
                                        <span key={index} className={`px-3 py-1 rounded-lg text-sm border ${getTagColor(tag)}`}>{tag}</span>
                                    ))}
                                </div>
                            )}
                            <div className="mt-6 flex gap-3">
                                <button onClick={() => { setViewingNote(null); openModal(viewingNote); }} className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition" title="Edit Note"><FiEdit2 size={18} /></button>
                                <button onClick={() => { setViewingNote(null); handleDelete(viewingNote._id); }} className="w-10 h-10 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition" title="Delete"><FiTrash2 size={18} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showSettings && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
                    <div className={`${theme.modalBg} rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border`}>
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className={`text-2xl font-bold ${theme.text}`}>Settings</h3>
                                <button onClick={() => setShowSettings(false)} className={`${theme.textSecondary} hover:${theme.text} text-2xl`}><FiX /></button>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className={`block ${theme.text} font-medium mb-3`}>Theme</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => updateSettings('theme', 'dark')}
                                            className={`p-4 rounded-lg border-2 transition ${
                                                settings.theme === 'dark'
                                                    ? 'border-blue-500 bg-blue-500/20'
                                                    : `border-slate-600 ${theme.buttonBg}`
                                            }`}
                                        >
                                            <div className={`${theme.text} font-medium mb-1`}>🌙 Dark Mode</div>
                                            <div className={`${theme.textSecondary} text-sm`}>Easy on the eyes</div>
                                        </button>
                                        <button
                                            onClick={() => updateSettings('theme', 'light')}
                                            className={`p-4 rounded-lg border-2 transition ${
                                                settings.theme === 'light'
                                                    ? 'border-blue-500 bg-blue-500/20'
                                                    : `border-slate-600 ${theme.buttonBg}`
                                            }`}
                                        >
                                            <div className={`${theme.text} font-medium mb-1`}>☀️ Light Mode</div>
                                            <div className={`${theme.textSecondary} text-sm`}>Bright and clear</div>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className={`block ${theme.text} font-medium mb-3`}>Font Size</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['small', 'medium', 'large'].map(size => (
                                            <button
                                                key={size}
                                                onClick={() => updateSettings('fontSize', size)}
                                                className={`p-3 rounded-lg border-2 transition capitalize ${
                                                    settings.fontSize === size
                                                        ? `border-blue-500 bg-blue-500/20 ${theme.text}`
                                                        : `border-slate-600 ${theme.buttonBg} ${theme.textSecondary}`
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className={`block ${theme.text} font-medium mb-3`}>Default View</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <button
                                            onClick={() => updateSettings('defaultView', 'notes')}
                                            className={`p-3 rounded-lg border-2 transition ${
                                                settings.defaultView === 'notes'
                                                    ? `border-blue-500 bg-blue-500/20 ${theme.text}`
                                                    : `border-slate-600 ${theme.buttonBg} ${theme.textSecondary}`
                                            }`}
                                        >
                                            <FiFile className="mx-auto mb-1" size={20} />
                                            All Notes
                                        </button>
                                        <button
                                            onClick={() => updateSettings('defaultView', 'favorites')}
                                            className={`p-3 rounded-lg border-2 transition ${
                                                settings.defaultView === 'favorites'
                                                    ? `border-blue-500 bg-blue-500/20 ${theme.text}`
                                                    : `border-slate-600 ${theme.buttonBg} ${theme.textSecondary}`
                                            }`}
                                        >
                                            <FiStar className="mx-auto mb-1" size={20} />
                                            Favorites
                                        </button>
                                        <button
                                            onClick={() => updateSettings('defaultView', 'trash')}
                                            className={`p-3 rounded-lg border-2 transition ${
                                                settings.defaultView === 'trash'
                                                    ? `border-blue-500 bg-blue-500/20 ${theme.text}`
                                                    : `border-slate-600 ${theme.buttonBg} ${theme.textSecondary}`
                                            }`}
                                        >
                                            <FiTrash className="mx-auto mb-1" size={20} />
                                            Trash
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <div className={`flex items-center justify-between p-4 ${theme.buttonBg} rounded-lg`}>
                                        <div>
                                            <div className={`${theme.text} font-medium mb-1`}>Compact Mode</div>
                                            <div className={`${theme.textSecondary} text-sm`}>Show more notes on screen</div>
                                        </div>
                                        <button
                                            onClick={() => updateSettings('compactMode', !settings.compactMode)}
                                            className={`relative w-14 h-7 rounded-full transition ${
                                                settings.compactMode ? 'bg-blue-600' : 'bg-slate-600'
                                            }`}
                                        >
                                            <div
                                                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                                                    settings.compactMode ? 'transform translate-x-7' : ''
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition font-medium"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
