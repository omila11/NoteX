import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiPlus, FiLogOut, FiSave, FiX, FiSearch, FiMic, FiFile, FiBold, FiUpload } from 'react-icons/fi';

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [formData, setFormData] = useState({ title: '', content: '', attachments: [] });
    const [user, setUser] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [showTextMenu, setShowTextMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [viewingNote, setViewingNote] = useState(null);
    const navigate = useNavigate();
    const contentRef = useRef(null);
    const recognitionRef = useRef(null);

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
        initializeSpeechRecognition();
    }, [navigate]);

    // Initialize speech recognition
    const initializeSpeechRecognition = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript;
                
                setFormData(prev => ({
                    ...prev,
                    content: prev.content + (prev.content ? ' ' : '') + transcript
                }));
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsRecording(false);
                toast.error('Voice input error: ' + event.error);
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };
        }
    };

    
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredNotes(notes);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = notes.filter(note => 
                note.title.toLowerCase().includes(query) || 
                note.content.toLowerCase().includes(query)
            );
            setFilteredNotes(filtered);
        }
    }, [searchQuery, notes]);

    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/notes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
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
                toast.error('Failed to fetch notes');
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

    const openModal = (note = null) => {
        if (note) {
            setEditingNote(note);
            setFormData({ 
                title: note.title, 
                content: htmlToPlainText(note.content), // Convert HTML to plain text for editing
                attachments: note.attachments || [] 
            });
        } else {
            setEditingNote(null);
            setFormData({ title: '', content: '', attachments: [] });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingNote(null);
        setFormData({ title: '', content: '', attachments: [] });
        if (isRecording && recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    
    const toggleVoiceRecording = () => {
        if (!recognitionRef.current) {
            toast.error('Speech recognition not supported in this browser');
            return;
        }

        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
        } else {
            recognitionRef.current.start();
            setIsRecording(true);
            toast.info('Voice recording started...');
        }
    };

    
    const handleTextSelect = (e) => {
        const textarea = e.target;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        if (start !== end) {
            const rect = textarea.getBoundingClientRect();
            setMenuPosition({ 
                x: e.clientX, 
                y: rect.top - 50 
            });
            setShowTextMenu(true);
        } else {
            setShowTextMenu(false);
        }
    };

    
    const applyBold = () => {
        const textarea = contentRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = formData.content.substring(start, end);
        
        if (selectedText) {
            const boldText = `**${selectedText}**`;
            const newContent = formData.content.substring(0, start) + boldText + formData.content.substring(end);
            setFormData({ ...formData, content: newContent });
            setShowTextMenu(false);
            
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + 2, end + 2);
            }, 0);
        }
    };

    const applyHighlight = () => {
        const textarea = contentRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = formData.content.substring(start, end);
        
        if (selectedText) {
            const highlightedText = `==${selectedText}==`;
            const newContent = formData.content.substring(0, start) + highlightedText + formData.content.substring(end);
            setFormData({ ...formData, content: newContent });
            setShowTextMenu(false);
            
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + 2, end + 2);
            }, 0);
        }
    };

    
    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const fileNames = files.map(f => f.name).join(', ');
        
        setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, ...files.map(f => f.name)]
        }));
        
        toast.success(`Files attached: ${fileNames}`);
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
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            // Convert markers to HTML before saving
            const dataToSave = {
                ...formData,
                content: plainTextToHtml(formData.content)
            };

            if (editingNote) {
                
                const response = await axios.put(
                    `http://localhost:5000/api/notes/${editingNote._id}`,
                    dataToSave,
                    config
                );

                if (response.data.success) {
                    toast.success('Note updated successfully');
                    fetchNotes();
                    closeModal();
                }
            } else {
                // Create new note
                const response = await axios.post(
                    'http://localhost:5000/api/notes',
                    dataToSave,
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
        if (!window.confirm('Are you sure you want to delete this note?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:5000/api/notes/${noteId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                toast.success('Note deleted successfully');
                fetchNotes();
            }
        } catch (error) {
            console.error('Error deleting note:', error);
            toast.error('Failed to delete note');
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const renderFormattedContent = (content) => {
        return { __html: content };
    };

    // Convert HTML formatted content to plain text for editing
    const htmlToPlainText = (html) => {
        return html
            .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
            .replace(/<mark>(.*?)<\/mark>/g, '==$1==');
    };

    // Convert plain text with markers back to HTML
    const plainTextToHtml = (text) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/==(.*?)==/g, '<mark>$1</mark>');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">📝 NoteX</h1>
                    
                    {/* Search Bar */}
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search notes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-gray-700">Welcome, <strong>{user?.name}</strong></span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                        >
                            <FiLogOut /> Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        My Notes <span className="text-gray-500 text-lg">({notes.length})</span>
                    </h2>
                    
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition shadow-lg"
                    >
                        <FiPlus /> New Note
                    </button>
                </div>

                {/* Notes Grid */}
                {filteredNotes.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-xl mb-4">No notes yet. Create your first note!</p>
                        <button
                            onClick={() => openModal()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
                        >
                            Create Note
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNotes.map((note) => (
                            <div
                                key={note._id}
                                onClick={() => setViewingNote(note)}
                                className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 border-l-4 border-blue-500 relative pb-12 cursor-pointer"
                            >
                                <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
                                    {note.title}
                                </h3>
                                <div 
                                    className="text-gray-600 mb-4 line-clamp-3 whitespace-pre-wrap"
                                    dangerouslySetInnerHTML={renderFormattedContent(note.content)}
                                />
                                <div className="text-xs text-gray-400 mb-2">
                                    {formatDate(note.updatedAt)}
                                </div>
                                {note.attachments && note.attachments.length > 0 && (
                                    <div className="text-xs text-blue-600 mb-2 flex items-center gap-1">
                                        <FiFile size={12} />
                                        {note.attachments.length} attachment(s)
                                    </div>
                                )}
                                <div className="absolute bottom-3 right-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => openModal(note)}
                                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition shadow-sm"
                                        title="Edit note"
                                    >
                                        <FiEdit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(note._id)}
                                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition shadow-sm"
                                        title="Delete note"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold text-gray-800">
                                    {editingNote ? 'Edit Note' : 'Create New Note'}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    <FiX />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Enter note title"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-gray-700 font-medium">Content</label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={applyBold}
                                                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition"
                                                title="Bold (select text first)"
                                            >
                                                <FiBold size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={applyHighlight}
                                                className="p-2 bg-yellow-200 hover:bg-yellow-300 rounded-md transition"
                                                title="Highlight (select text first)"
                                            >
                                                <span className="font-bold text-sm">H</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={toggleVoiceRecording}
                                                className={`p-2 rounded-md transition ${
                                                    isRecording 
                                                        ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                                                        : 'bg-gray-200 hover:bg-gray-300'
                                                }`}
                                                title={isRecording ? "Stop voice input" : "Start voice input"}
                                            >
                                                <FiMic size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <textarea
                                        ref={contentRef}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        onSelect={handleTextSelect}
                                        onBlur={() => setTimeout(() => setShowTextMenu(false), 200)}
                                        placeholder="Write your note here... Use **text** for bold, ==text== for highlight"
                                        rows="10"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
                                        required
                                    />
                                </div>

                                {/* File Upload */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 font-medium mb-2">Attachments</label>
                                    <div className="flex items-center gap-3">
                                        <label className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer transition">
                                            <FiUpload size={18} />
                                            <span>Upload Files</span>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*,.pdf,.doc,.docx,.txt"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    {formData.attachments && formData.attachments.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {formData.attachments.map((file, index) => (
                                                <span key={index} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                    <FiFile size={12} />
                                                    {file}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition font-semibold"
                                    >
                                        <FiSave /> Save
                                    </button>
                                    {editingNote && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                closeModal();
                                                handleDelete(editingNote._id);
                                            }}
                                            className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition font-semibold"
                                        >
                                            <FiTrash2 /> Delete
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex items-center justify-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-3 rounded-lg transition font-semibold"
                                    >
                                        <FiX /> Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Text Selection Popup Menu */}
            {showTextMenu && (
                <div 
                    className="fixed bg-white shadow-lg rounded-lg border border-gray-300 p-2 flex gap-2 z-50"
                    style={{ 
                        left: `${menuPosition.x}px`, 
                        top: `${menuPosition.y}px`,
                        transform: 'translateX(-50%)'
                    }}
                >
                    <button
                        onClick={applyBold}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition"
                        title="Bold"
                    >
                        <FiBold size={18} />
                    </button>
                    <button
                        onClick={applyHighlight}
                        className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded transition"
                        title="Highlight"
                    >
                        <span className="font-bold">H</span>
                    </button>
                </div>
            )}

            
            {viewingNote && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={() => setViewingNote(null)}>
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{viewingNote.title}</h2>
                                    <p className="text-sm text-gray-500">{formatDate(viewingNote.updatedAt)}</p>
                                </div>
                                <button
                                    onClick={() => setViewingNote(null)}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    <FiX />
                                </button>
                            </div>
                            
                            <div className="prose max-w-none">
                                <div 
                                    className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed"
                                    dangerouslySetInnerHTML={renderFormattedContent(viewingNote.content)}
                                />
                            </div>

                            {viewingNote.attachments && viewingNote.attachments.length > 0 && (
                                <div className="mt-6 border-t pt-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Attachments</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {viewingNote.attachments.map((file, index) => (
                                            <div key={index} className="flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-lg border border-blue-200">
                                                <FiFile size={16} />
                                                <span className="text-sm font-medium">{file}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => {
                                        setViewingNote(null);
                                        openModal(viewingNote);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition"
                                >
                                    <FiEdit2 /> Edit Note
                                </button>
                                <button
                                    onClick={() => {
                                        setViewingNote(null);
                                        handleDelete(viewingNote._id);
                                    }}
                                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition"
                                >
                                    <FiTrash2 /> Delete
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
