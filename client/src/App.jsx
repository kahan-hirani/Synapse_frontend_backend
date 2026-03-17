import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { api } from './api/api';
import { buildAppUrl, buildLandingUrl, isAppSubdomain } from './app/domain';
import { STARTER_NOTEBOOKS, createInitialChatMap } from './app/constants/starterData';
import AuthPage from './pages/AuthPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import MarketingLayout from './pages/MarketingLayout';
import NotebookPage from './pages/NotebookPage';
import ProfilePage from './pages/ProfilePage';
import WhyPage from './pages/WhyPage';

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

  const [notebooks, setNotebooks] = useState(STARTER_NOTEBOOKS);
  const [chatMap, setChatMap] = useState(() => createInitialChatMap(STARTER_NOTEBOOKS));
  const [selectedSourceMap, setSelectedSourceMap] = useState({});

  const [question, setQuestion] = useState('');
  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);

  const sourceInputRef = useRef(null);
  const didBootstrapProfile = useRef(false);

  const ensureNotebookExists = useCallback(() => {
    if (notebooks.length > 0) return notebooks[0].id;

    const id = `n-${Date.now()}`;
    const fallback = {
      id,
      icon: '📓',
      title: 'Untitled notebook',
      createdAt: new Date().toISOString(),
      sources: [],
      featured: false,
    };

    setNotebooks([fallback]);
    setChatMap({ [id]: [] });
    return id;
  }, [notebooks]);

  useEffect(() => {
    if (didBootstrapProfile.current) return;
    didBootstrapProfile.current = true;

    async function bootstrapProfile() {
      if (!token) return;

      try {
        const data = await api.profile(token);
        setUser(data.user);
        ensureNotebookExists();
        navigate('/app', { replace: true });
      } catch {
        localStorage.removeItem('nb_token');
        setToken('');
        setUser(null);
      }
    }

    bootstrapProfile();
  }, [token, ensureNotebookExists, navigate]);

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
        setUser(data.user);
      } else {
        const profileData = await api.profile(data.token);
        setUser(profileData.user);
      }

      setStatus(authMode === 'register' ? 'Account created.' : 'Signed in successfully.');
      setAuthForm({ username: '', email: '', password: '' });
      navigate('/app', { replace: true });
    } catch (error) {
      setStatus(error.message);
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
      navigate('/auth', { replace: true });
    }
  };

  const handleCreateNotebook = () => {
    const id = `n-${Date.now()}`;
    const notebook = {
      id,
      icon: '📓',
      title: `Untitled notebook ${notebooks.length + 1}`,
      createdAt: new Date().toISOString(),
      sources: [],
      featured: false,
    };

    setNotebooks((prev) => [notebook, ...prev]);
    setChatMap((prev) => ({ ...prev, [id]: [] }));
    navigate(`/app/notebook/${id}`);
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
      const response = await api.uploadPdf(file, token);
      const source = {
        id: `s-${Date.now()}`,
        name: file.name,
        type: 'PDF',
        addedAt: new Date().toISOString(),
        pdfId: response.pdfId,
      };

      setNotebooks((prev) =>
        prev.map((item) =>
          item.id === notebook.id ? { ...item, sources: [source, ...item.sources] } : item,
        ),
      );

      setSelectedSourceMap((prev) => ({ ...prev, [notebook.id]: source.id }));
      setStatus('Source uploaded and ready for chat.');
    } catch (error) {
      setStatus(error.message);
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
    } catch (error) {
      setChatMap((prev) => ({
        ...prev,
        [notebook.id]: [...(prev[notebook.id] || []), { role: 'assistant', text: `Error: ${error.message}` }],
      }));
    } finally {
      setAsking(false);
    }
  };

  const protectedElement = (element) => (user ? element : <Navigate to="/auth" replace />);

  return (
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

      <Route
        path="/app"
        element={
          protectedElement(
            <DashboardPage
              user={user}
              notebooks={notebooks}
              onCreateNotebook={handleCreateNotebook}
              onOpenNotebook={handleOpenNotebook}
              onLogout={handleLogout}
              onGoProfile={() => navigate('/app/profile')}
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
              onGoDashboard={() => navigate('/app')}
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
              onGoDashboard={() => navigate('/app')}
              onLogout={handleLogout}
            />,
          )
        }
      />

      <Route path="*" element={<Navigate to={user ? '/app' : '/auth'} replace />} />
    </Routes>
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
