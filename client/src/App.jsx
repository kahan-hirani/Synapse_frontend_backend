import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { api } from './api/api';
import { buildAppUrl, buildLandingUrl, isAppSubdomain } from './app/domain';
import AuthPage from './pages/AuthPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import MarketingLayout from './pages/MarketingLayout';
import NotebookPage from './pages/NotebookPage';
import ProfilePage from './pages/ProfilePage';
import SourcesPage from './pages/SourcesPage';
import WhyPage from './pages/WhyPage';
import CreateNotebookModal from './components/app/CreateNotebookModal';
import RenameNotebookModal from './components/app/RenameNotebookModal';
import ToastViewport from './components/app/ToastViewport';

function App() {
  return (
    <BrowserRouter>
      <DomainRouter />
    </BrowserRouter>
  );
}

function DomainRouter() {
  const appHost = isAppSubdomain();

  if (!appHost) {
    return (
      <Routes>
        <Route path="/" element={<MarketingLayout onTryNotebook={() => (window.location.href = buildAppUrl('/auth'))} />}>
          <Route index element={<LandingPage onTryNotebook={() => (window.location.href = buildAppUrl('/auth'))} />} />
          <Route path="why" element={<WhyPage />} />
          <Route path="contact" element={<ContactPage onTryNotebook={() => (window.location.href = buildAppUrl('/auth'))} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    );
  }

  return <ProductRoutes />;
}

function ProductRoutes() {
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' });
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('nb_token') || '');
  const [status, setStatus] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('nb_theme') || 'dark');

  const [notebooks, setNotebooks] = useState([]);
  const [chatMap, setChatMap] = useState({});
  const [selectedSourceMap, setSelectedSourceMap] = useState({});
  const [activityLog, setActivityLog] = useState([]);

  const [question, setQuestion] = useState('');
  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [createNotebookOpen, setCreateNotebookOpen] = useState(false);
  const [renameNotebookTarget, setRenameNotebookTarget] = useState(null);
  const [toasts, setToasts] = useState([]);
  const applyUser = useCallback((nextUser) => {
    setUser(nextUser);
    const preferredTheme = nextUser?.preferences?.theme;
    if (preferredTheme === 'dark' || preferredTheme === 'light') {
      setTheme(preferredTheme);
    }
  }, []);


  const sourceInputRef = useRef(null);
  const didBootstrapProfile = useRef(false);

  useEffect(() => {
    localStorage.setItem('nb_theme', theme);
  }, [theme]);

  const notify = useCallback((message, kind = 'success') => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, kind }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3200);
  }, []);

  const pushActivity = useCallback((action, notebookTitle) => {
    setActivityLog((prev) => [
      {
        id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        action,
        notebookTitle,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);

  const normalizeNotebook = useCallback((notebook) => ({
    ...notebook,
    id: String(notebook.id || notebook._id),
    createdAt: notebook.createdAt || new Date().toISOString(),
    lastEditedAt: notebook.lastEditedAt || notebook.updatedAt || notebook.createdAt || new Date().toISOString(),
    sources: (notebook.sources || []).map((source) => ({
      ...source,
      id: String(source.id || source._id),
      pdfId: source.pdfId ? String(source.pdfId) : '',
    })),
  }), []);

  const loadNotebooks = useCallback(
    async (authToken) => {
      if (!authToken) return;
      try {
        const response = await api.listNotebooks(authToken);
        const normalized = (response.notebooks || []).map(normalizeNotebook);
        setNotebooks(normalized);
      } catch (error) {
        notify(error.message, 'error');
      }
    },
    [normalizeNotebook, notify],
  );

  useEffect(() => {
    setChatMap((prev) => {
      const next = {};
      notebooks.forEach((item) => {
        next[item.id] = prev[item.id] || [];
      });
      return next;
    });
  }, [notebooks]);

  useEffect(() => {
    if (didBootstrapProfile.current) return;
    didBootstrapProfile.current = true;

    async function bootstrapProfile() {
      if (!token) return;

      try {
        const data = await api.profile(token);
        applyUser(data.user);
        await loadNotebooks(token);
        navigate('/app', { replace: true });
      } catch {
        localStorage.removeItem('nb_token');
        setToken('');
        setUser(null);
      }
    }

    bootstrapProfile();
  }, [token, applyUser, loadNotebooks, navigate]);

  const handleAuthFieldChange = (event) => {
    const { name, value } = event.target;
    setAuthForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setStatus('');

    try {
      const payload =
        authMode === 'register'
          ? { username: authForm.username, email: authForm.email, password: authForm.password }
          : { email: authForm.email, password: authForm.password };

      const data = authMode === 'register' ? await api.register(payload) : await api.login(payload);

      setToken(data.token);
      localStorage.setItem('nb_token', data.token);

      if (data.user) {
        applyUser(data.user);
      } else {
        const profileData = await api.profile(data.token);
        applyUser(profileData.user);
      }

      await loadNotebooks(data.token);

      setStatus(authMode === 'register' ? 'Account created.' : 'Signed in successfully.');
      notify(authMode === 'register' ? 'Account created successfully.' : 'Signed in successfully.');
      setAuthForm({ username: '', email: '', password: '' });
      navigate('/app', { replace: true });
    } catch (error) {
      setStatus(error.message);
      notify(error.message, 'error');
    }
  };

  const handleUpdateProfile = async (payload) => {
    if (!token) return false;
    try {
      const data = await api.updateProfile(payload, token);
      applyUser(data.user);
      notify('Profile updated successfully.');
      return true;
    } catch (error) {
      notify(error.message, 'error');
      return false;
    }
  };

  const handleChangePassword = async (payload) => {
    if (!token) return false;
    try {
      await api.updatePassword(payload, token);
      notify('Password updated successfully.');
      return true;
    } catch (error) {
      notify(error.message, 'error');
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      if (token) await api.logout(token);
    } catch {
      // Ignore logout API errors and clear local state.
    } finally {
      localStorage.removeItem('nb_token');
      setToken('');
      setUser(null);
      setStatus('Logged out.');
      notify('Logged out successfully.');
      navigate('/auth', { replace: true });
    }
  };

  const handleCreateNotebook = async (title) => {
    const notebookTitle = title.trim();
    if (!notebookTitle || !token) return;

    try {
      const response = await api.createNotebook({ title: notebookTitle }, token);
      const notebook = normalizeNotebook(response.notebook);
      setNotebooks((prev) => [notebook, ...prev]);
      pushActivity('Created notebook', notebook.title);
      notify(`Notebook "${notebook.title}" created.`);
      setCreateNotebookOpen(false);
      navigate(`/app/notebook/${notebook.id}`);
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  const handleRenameNotebook = async (id, nextTitle) => {
    if (!token) return;
    try {
      const response = await api.updateNotebook(id, { title: nextTitle }, token);
      const updated = normalizeNotebook(response.notebook);
      setNotebooks((prev) => prev.map((item) => (item.id === id ? updated : item)));
      pushActivity('Renamed notebook', updated.title);
      notify(`Renamed notebook to "${updated.title}".`);
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  const handleDeleteNotebook = async (id) => {
    if (!token) return;
    const notebook = notebooks.find((item) => item.id === id);
    if (!notebook) return;

    try {
      await api.deleteNotebook(id, token);
      setNotebooks((prev) => prev.filter((item) => item.id !== id));
      setChatMap((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setSelectedSourceMap((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      pushActivity('Deleted notebook', notebook.title);
      notify(`Deleted notebook "${notebook.title}".`, 'warning');
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  const handleDuplicateNotebook = async (id) => {
    if (!token) return;
    const sourceNotebook = notebooks.find((item) => item.id === id);
    if (!sourceNotebook) return;
    const desiredCopyTitle = `${sourceNotebook.title} copy`;

    try {
      const response = await api.duplicateNotebook(id, token);
      const createdDuplicate = normalizeNotebook(response.notebook);
      let duplicate = createdDuplicate;

      if (createdDuplicate.title !== desiredCopyTitle) {
        try {
          const renameResponse = await api.updateNotebook(createdDuplicate.id, { title: desiredCopyTitle }, token);
          duplicate = normalizeNotebook(renameResponse.notebook);
        } catch {
          duplicate = { ...createdDuplicate, title: desiredCopyTitle };
        }
      }

      setNotebooks((prev) => [duplicate, ...prev]);
      setChatMap((prev) => ({ ...prev, [duplicate.id]: [...(prev[id] || [])] }));
      pushActivity('Duplicated notebook', duplicate.title);
      notify(`Duplicated notebook as "${duplicate.title}".`);
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  const handleToggleShared = async (id) => {
    if (!token) return;

    const current = notebooks.find((item) => item.id === id);
    if (!current) return;

    try {
      const response = await api.updateNotebook(id, { isShared: !current.isShared }, token);
      const updated = normalizeNotebook(response.notebook);
      setNotebooks((prev) => prev.map((item) => (item.id === id ? updated : item)));
      pushActivity(updated.isShared ? 'Shared notebook' : 'Unshared notebook', updated.title);
      notify(updated.isShared ? `Shared "${updated.title}".` : `Unshared "${updated.title}".`);
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  const handleToggleFavorite = async (id) => {
    if (!token) return;

    const current = notebooks.find((item) => item.id === id);
    if (!current) return;

    try {
      const response = await api.updateNotebook(id, { isFavorite: !current.isFavorite }, token);
      const updated = normalizeNotebook(response.notebook);
      setNotebooks((prev) => prev.map((item) => (item.id === id ? updated : item)));
      pushActivity(updated.isFavorite ? 'Added to favorites' : 'Removed from favorites', updated.title);
      notify(updated.isFavorite ? `Added "${updated.title}" to favorites.` : `Removed "${updated.title}" from favorites.`);
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  const handleOpenNotebook = (id) => {
    navigate(`/app/notebook/${id}`);
  };

  const handleSelectSource = (notebookId, sourceId) => {
    setSelectedSourceMap((prev) => ({ ...prev, [notebookId]: sourceId }));
  };

  const handleUpload = async (event, notebook) => {
    const file = event.target.files?.[0];
    if (!file || !token || !notebook) return;

    setUploading(true);
    setStatus('');

    try {
      const response = await api.uploadPdf(file, token, notebook.id);

      if (response.notebook) {
        const updatedNotebook = normalizeNotebook(response.notebook);
        setNotebooks((prev) => prev.map((item) => (item.id === notebook.id ? updatedNotebook : item)));
      }

      if (response.source?.id) {
        setSelectedSourceMap((prev) => ({ ...prev, [notebook.id]: String(response.source.id) }));
      }

      setStatus('Source uploaded and ready for chat.');
      pushActivity('Uploaded source', notebook.title);
      notify(`Uploaded source to "${notebook.title}".`);
    } catch (error) {
      setStatus(error.message);
      notify(error.message, 'error');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleAsk = async (event, notebook, selectedSource) => {
    event.preventDefault();
    if (!question.trim() || !selectedSource?.pdfId || !token || asking || !notebook) return;

    const questionText = question.trim();
    setQuestion('');
    setAsking(true);

    setChatMap((prev) => ({
      ...prev,
      [notebook.id]: [...(prev[notebook.id] || []), { role: 'user', text: questionText }],
    }));

    try {
      const response = await api.askPdf({ pdfId: selectedSource.pdfId, question: questionText }, token);
      const citationText = (response.citations || []).map((citation) => `p.${citation.page}`).join(', ');

      setNotebooks((prev) =>
        prev.map((item) => (item.id === notebook.id ? { ...item, lastEditedAt: new Date().toISOString() } : item)),
      );

      setChatMap((prev) => ({
        ...prev,
        [notebook.id]: [
          ...(prev[notebook.id] || []),
          {
            role: 'assistant',
            text: response.answer,
            meta: citationText ? `Citations: ${citationText}` : 'Citations unavailable',
          },
        ],
      }));
      pushActivity('Asked AI question', notebook.title);
      notify('Answer generated successfully.');
    } catch (error) {
      setChatMap((prev) => ({
        ...prev,
        [notebook.id]: [...(prev[notebook.id] || []), { role: 'assistant', text: `Error: ${error.message}` }],
      }));
      notify(error.message, 'error');
    } finally {
      setAsking(false);
    }
  };

  const protectedElement = (element) => (user ? element : <Navigate to="/auth" replace />);

  return (
    <>
      <Routes>
      <Route
        path="/auth"
        element={
          user ? (
            <Navigate to="/app" replace />
          ) : (
            <AuthPage
              authMode={authMode}
              authForm={authForm}
              status={status}
              onFieldChange={handleAuthFieldChange}
              onChangeMode={setAuthMode}
              onSubmit={handleAuthSubmit}
              onBackToLanding={() => (window.location.href = buildLandingUrl('/'))}
            />
          )
        }
      />

      <Route path="/app" element={protectedElement(<Navigate to="/app/home" replace />)} />

      <Route
        path="/app/home"
        element={
          protectedElement(
            <HomePage
              user={user}
              notebooks={notebooks}
              theme={theme}
              onGoLibrary={() => navigate('/app/library')}
              onGoSources={() => navigate('/app/sources')}
              onGoProfile={() => navigate('/app/profile')}
              onCreateNotebook={() => setCreateNotebookOpen(true)}
              onOpenNotebook={handleOpenNotebook}
              onLogout={handleLogout}
            />,
          )
        }
      />

      <Route
        path="/app/library"
        element={
          protectedElement(
            <DashboardPage
              user={user}
              notebooks={notebooks}
              theme={theme}
              activityLog={activityLog}
              onCreateNotebook={() => setCreateNotebookOpen(true)}
              onRequestRenameNotebook={setRenameNotebookTarget}
              onOpenNotebook={handleOpenNotebook}
              onDeleteNotebook={handleDeleteNotebook}
              onDuplicateNotebook={handleDuplicateNotebook}
              onToggleFavorite={handleToggleFavorite}
              onToggleShared={handleToggleShared}
              onLogout={handleLogout}
              onGoProfile={() => navigate('/app/profile')}
              onGoHome={() => navigate('/app/home')}
              onGoLibrary={() => navigate('/app/library')}
              onGoSources={() => navigate('/app/sources')}
            />,
          )
        }
      />

      <Route
        path="/app/sources"
        element={
          protectedElement(
            <SourcesPage
              user={user}
              notebooks={notebooks}
              theme={theme}
              onGoHome={() => navigate('/app/home')}
              onGoLibrary={() => navigate('/app/library')}
              onGoProfile={() => navigate('/app/profile')}
              onCreateNotebook={() => setCreateNotebookOpen(true)}
              onOpenNotebook={handleOpenNotebook}
              onLogout={handleLogout}
            />,
          )
        }
      />

      <Route
        path="/app/notebook/:notebookId"
        element={
          protectedElement(
            <NotebookRoute
              notebooks={notebooks}
              chatMap={chatMap}
              selectedSourceMap={selectedSourceMap}
              question={question}
              asking={asking}
              uploading={uploading}
              status={status}
              sourceInputRef={sourceInputRef}
              onOpenNotebook={handleOpenNotebook}
              onGoDashboard={() => navigate('/app/library')}
              onUpload={handleUpload}
              onSelectSource={handleSelectSource}
              onAsk={handleAsk}
              onQuestionChange={setQuestion}
            />,
          )
        }
      />

      <Route
        path="/app/profile"
        element={
          protectedElement(
            <ProfilePage
              user={user}
              notebooks={notebooks}
              chatMap={chatMap}
              theme={theme}
              onUpdateProfile={handleUpdateProfile}
              onChangePassword={handleChangePassword}
              onGoHome={() => navigate('/app/home')}
              onGoLibrary={() => navigate('/app/library')}
              onGoSources={() => navigate('/app/sources')}
              onCreateNotebook={() => setCreateNotebookOpen(true)}
              onOpenNotebook={handleOpenNotebook}
              onLogout={handleLogout}
            />,
          )
        }
      />

      <Route path="*" element={<Navigate to={user ? '/app' : '/auth'} replace />} />
      </Routes>

      <CreateNotebookModal
        isOpen={createNotebookOpen}
        isDark={theme === 'dark'}
        onClose={() => setCreateNotebookOpen(false)}
        onCreate={handleCreateNotebook}
      />
      <ToastViewport toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((item) => item.id !== id))} />
      <RenameNotebookModal
        isOpen={Boolean(renameNotebookTarget)}
        isDark={theme === 'dark'}
        notebookTitle={renameNotebookTarget?.title || ''}
        onClose={() => setRenameNotebookTarget(null)}
        onRename={(nextTitle) => {
          if (!renameNotebookTarget) return;
          handleRenameNotebook(renameNotebookTarget.id, nextTitle);
          setRenameNotebookTarget(null);
        }}
      />
    </>
  );
}

function NotebookRoute({
  notebooks,
  chatMap,
  selectedSourceMap,
  question,
  asking,
  uploading,
  status,
  sourceInputRef,
  onOpenNotebook,
  onGoDashboard,
  onUpload,
  onSelectSource,
  onAsk,
  onQuestionChange,
}) {
  const { notebookId } = useParams();
  const notebook = useMemo(() => notebooks.find((item) => item.id === notebookId) || notebooks[0], [notebooks, notebookId]);

  if (!notebook) {
    return <Navigate to="/app/library" replace />;
  }

  const selectedSource = useMemo(() => {
    if (!notebook?.sources?.length) return null;
    const selectedId = selectedSourceMap[notebook.id];
    return notebook.sources.find((source) => source.id === selectedId) || notebook.sources[0];
  }, [notebook, selectedSourceMap]);

  return (
    <NotebookPage
      notebook={notebook}
      notebooks={notebooks}
      sourceInputRef={sourceInputRef}
      selectedSourceId={selectedSource?.id || ''}
      messages={chatMap[notebook?.id] || []}
      question={question}
      asking={asking}
      uploading={uploading}
      status={status}
      onSelectSource={(sourceId) => onSelectSource(notebook.id, sourceId)}
      onQuestionChange={onQuestionChange}
      onAsk={(event) => onAsk(event, notebook, selectedSource)}
      onUpload={(event) => onUpload(event, notebook)}
      onRequestUpload={() => sourceInputRef.current?.click()}
      onGoDashboard={onGoDashboard}
      onOpenNotebook={onOpenNotebook}
    />
  );
}

export default App;
