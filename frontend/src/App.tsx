import { useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { useClassifyConversation, useGetHealth } from '@workspace/api-client-react';
import type { ClassificationResult } from '@workspace/api-client-react';
import {
  Activity, ArrowUpRight, AudioLines, Check, ChevronRight, CircleAlert, Clock3,
  FileText, History, LoaderCircle, RotateCcw, Send, ShieldCheck, Sparkles,
  Trash2, Wifi, X,
} from 'lucide-react';

const queryClient = new QueryClient();
const MAX_LENGTH = 10000;

type SessionRecord = {
  id: string;
  message: string;
  result: ClassificationResult;
  createdAt: Date;
};

const categoryDescriptions: Record<string, string> = {
  'Add New Line': 'A request to add a line or device to an existing account.',
  'Cancel Service': 'A request to cancel or discontinue a service.',
  'Change Plans': 'A request to switch, upgrade, or modify a plan.',
  'Data Usage': 'A question or concern about data consumption.',
  Deactivate: 'A request to deactivate a line, device, or account.',
  'High Bill': 'A concern about an unexpectedly high charge or bill.',
  Others: 'The message does not clearly fit another category.',
  'Poor Connectivity': 'A service quality concern involving signal or connection.',
  'Port Out': 'A request to transfer a number to another carrier.',
  'Roaming Plans': 'A question about international or domestic roaming options.',
};

function formatTime(date: Date) {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(date);
}

function AppDashboard() {
  const [message, setMessage] = useState('');
  const [validation, setValidation] = useState('');
  const [requestError, setRequestError] = useState('');
  const [history, setHistory] = useState<SessionRecord[]>([]);
  const [activeRecord, setActiveRecord] = useState<SessionRecord | null>(null);
  const classify = useClassifyConversation();
  const health = useGetHealth();
  const isPending = classify.isPending;
  const charCount = message.length;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) {
      setValidation('Add a conversation before classifying.');
      return;
    }
    if (trimmed.length > MAX_LENGTH) {
      setValidation(`Conversation must be ${MAX_LENGTH.toLocaleString()} characters or fewer.`);
      return;
    }
    setValidation('');
    setRequestError('');
    setActiveRecord(null);
    try {
      const result = await classify.mutateAsync({ data: { message: trimmed } });
      const record: SessionRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        message: trimmed,
        result,
        createdAt: new Date(),
      };
      setHistory((previous) => [record, ...previous]);
      setActiveRecord(record);
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'The classification request could not be completed.';
      setRequestError(messageText || 'The classification request could not be completed.');
    }
  };

  const clear = () => {
    setMessage('');
    setValidation('');
    setRequestError('');
    setActiveRecord(null);
  };

  const selectRecord = (record: SessionRecord) => {
    setActiveRecord(record);
    setMessage(record.message);
    setValidation('');
    setRequestError('');
  };

  const clearHistory = () => {
    setHistory([]);
    setActiveRecord(null);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Main navigation">
        <div className="flex items-center gap-3 px-2 mb-11">
          <div className="brand-mark"><AudioLines size={19} strokeWidth={2.2} /></div>
          <div className="brand-copy">
            <div className="text-[13px] font-bold tracking-tight">Signal Desk</div>
            <div className="text-[10px] text-slate-400 mt-0.5">SUPPORT OPERATIONS</div>
          </div>
        </div>
        <div className="nav-label px-3 mb-2 text-[9px] font-mono tracking-[.15em] text-slate-500">WORKSPACE</div>
        <nav className="flex flex-col gap-1" aria-label="Workspace">
          <div className="sidebar-link active" aria-current="page" data-testid="nav-classifier">
            <Activity size={16} /><span>Message classifier</span>
          </div>
          <button type="button" className="sidebar-link w-full text-left cursor-pointer hover:bg-slate-800/70" aria-label="Session history" onClick={() => document.getElementById('session-history')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} data-testid="nav-history">
            <History size={16} /><span>Session history</span>
          </button>
        </nav>
        <div className="mt-auto side-footer">
          <div className="rounded-xl border border-slate-700/80 bg-slate-800/55 p-3.5">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-200">
              <ShieldCheck size={14} className="text-emerald-300" /> Analyst workspace
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-slate-400">
              Classifications are session-only and are not saved to an account.
            </p>
          </div>
          <div className="mt-5 px-2 text-[9px] font-mono text-slate-500">BUILD 0.1 · INTERNAL TOOL</div>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="mobile-brand items-center gap-2.5">
            <div className="brand-mark !w-8 !h-8"><AudioLines size={16} /></div>
            <span className="heading-font text-sm font-extrabold">Signal Desk</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <span>Operations</span><ChevronRight size={13} /><span className="font-semibold text-slate-700">Message classifier</span>
          </div>
          <div className="ml-auto flex items-center gap-2.5" data-testid="status-api-health">
            {health.isLoading ? (
              <>
                <span className="skeleton h-2 w-2 rounded-full" />
                <span className="text-[11px] text-slate-500">Checking service</span>
              </>
            ) : health.isError ? (
              <>
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-[11px] text-slate-500">Service status unavailable</span>
                <button className="secondary-action !px-2 !py-1 text-[10px]" onClick={() => health.refetch()} data-testid="button-retry-health">
                  Retry
                </button>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                <span className="text-[11px] text-slate-600">Service {health.data?.status || 'available'}</span>
              </>
            )}
          </div>
        </header>

        <main className="content-wrap">
          <section className="mb-8 reveal">
            <div className="eyebrow mb-3">SUPPORT OPERATIONS <span className="mx-1.5 text-amber-600">/</span> MESSAGE TRIAGE</div>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <h1 className="heading-font text-[29px] sm:text-[34px] tracking-[-.045em] font-extrabold leading-tight text-slate-800">
                  Conversation classifier
                </h1>
                <p className="mt-2 text-sm text-slate-500 max-w-[570px] leading-relaxed">
                  Turn a customer message into a clear support category, with confidence and review status at a glance.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start lg:self-auto rounded-full border border-amber-800/10 bg-amber-100/60 px-3 py-2 text-[10px] font-semibold text-amber-900">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                Demo classifier · not trained AI
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,.9fr)] gap-5 items-start">
            <section className="panel p-5 sm:p-6 reveal" aria-labelledby="compose-title">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-lg bg-emerald-900/[.07] text-emerald-800"><FileText size={17} /></div>
                  <div>
                    <h2 id="compose-title" className="heading-font text-[16px] font-bold text-slate-800">Conversation input</h2>
                    <p className="mt-1 text-[11px] text-slate-500">Paste a customer message to begin triage.</p>
                  </div>
                </div>
                <span className="eyebrow pt-1">01 / INPUT</span>
              </div>
              <form onSubmit={submit} noValidate>
                <div className={`rounded-lg border bg-[#fbfaf6] px-4 pt-3 pb-2 transition-colors ${validation ? 'border-red-300' : 'border-[#e6e1d7] focus-within:border-emerald-800/45'}`}>
                  <label htmlFor="conversation-message" className="eyebrow block mb-2">CUSTOMER MESSAGE</label>
                  <textarea
                    id="conversation-message"
                    className="message-area"
                    value={message}
                    onChange={(event) => {
                      setMessage(event.target.value);
                      if (validation) setValidation('');
                    }}
                    placeholder="For example: I've been charged for international roaming even though I didn't use my phone abroad..."
                    maxLength={MAX_LENGTH + 1}
                    aria-invalid={Boolean(validation)}
                    aria-describedby={validation ? 'input-validation' : 'message-counter'}
                    data-testid="input-conversation"
                  />
                  <div className="flex justify-between items-center border-t border-[#e9e5dc] py-2.5">
                    <span className="text-[10px] text-slate-400">Customer wording is sent as entered.</span>
                    <span id="message-counter" className={`font-mono text-[10px] ${charCount > MAX_LENGTH ? 'text-red-700' : 'text-slate-400'}`} data-testid="text-character-count">
                      {charCount.toLocaleString()} / {MAX_LENGTH.toLocaleString()}
                    </span>
                  </div>
                </div>
                {validation && <p id="input-validation" className="mt-2 flex items-center gap-1.5 text-xs text-red-700" role="alert" data-testid="error-validation"><CircleAlert size={14} />{validation}</p>}
                {requestError && (
                  <div className="error-banner mt-3 flex items-start gap-2 rounded-lg p-3 text-xs" role="alert" data-testid="error-classification">
                    <CircleAlert size={15} className="mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="font-bold">Classification did not complete</div>
                      <div className="mt-1 leading-relaxed">{requestError}</div>
                    </div>
                    <button type="button" aria-label="Dismiss error" className="p-1" onClick={() => setRequestError('')} data-testid="button-dismiss-error"><X size={14} /></button>
                  </div>
                )}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <ShieldCheck size={13} className="text-emerald-800" />
                    <span>Review the result before acting on it.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" className="secondary-action" onClick={clear} disabled={!message && !activeRecord && !requestError} data-testid="button-clear-input">
                      <RotateCcw size={13} /> Clear
                    </button>
                    <button type="submit" className="primary-action" disabled={isPending} data-testid="button-classify">
                      {isPending ? <><LoaderCircle size={15} className="animate-spin" /> Classifying</> : <><Send size={14} /> Classify message</>}
                    </button>
                  </div>
                </div>
              </form>
              <div className="mt-5 flex items-center gap-2.5 border-t border-[#ece8df] pt-4">
                <Sparkles size={14} className="text-amber-600" />
                <p className="text-[10px] leading-relaxed text-slate-500">
                  Demo mode returns a deterministic example classification. It is not a trained machine-learning model.
                </p>
              </div>
            </section>

            <section className="panel min-h-[360px] p-5 sm:p-6 reveal reveal-delay" aria-labelledby="result-title">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-lg bg-amber-100/70 text-amber-800"><Activity size={17} /></div>
                  <div>
                    <h2 id="result-title" className="heading-font text-[16px] font-bold text-slate-800">Classification result</h2>
                    <p className="mt-1 text-[11px] text-slate-500">Category, confidence, and review guidance.</p>
                  </div>
                </div>
                <span className="eyebrow pt-1">02 / RESULT</span>
              </div>
              {isPending ? (
                <div className="space-y-5 pt-2" aria-label="Classification in progress" data-testid="loading-classification">
                  <div className="skeleton h-3 w-28 rounded" />
                  <div className="skeleton h-9 w-3/4 rounded" />
                  <div className="skeleton h-2 w-full rounded" />
                  <div className="skeleton h-20 w-full rounded-lg" />
                  <div className="text-[11px] text-slate-500">Reviewing the conversation…</div>
                </div>
              ) : activeRecord ? (
                <ResultView record={activeRecord} onNew={clear} />
              ) : (
                <div className="flex min-h-[254px] flex-col items-center justify-center rounded-xl border border-dashed border-[#dcd7cb] bg-[#fbfaf6] px-6 text-center" data-testid="empty-classification">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-[#e8eee8] text-emerald-800"><Wifi size={19} /></div>
                  <h3 className="heading-font mt-4 text-sm font-bold text-slate-700">Ready when you are</h3>
                  <p className="mt-2 max-w-[260px] text-xs leading-relaxed text-slate-500">
                    Submit a conversation to see the predicted category and whether a human review is recommended.
                  </p>
                  <div className="mt-5 flex items-center gap-2 text-[9px] font-mono uppercase tracking-wider text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> Classifier endpoint ready
                  </div>
                </div>
              )}
            </section>
          </div>

          <section id="session-history" className="panel mt-5 overflow-hidden reveal reveal-delay scroll-mt-6" aria-labelledby="history-title">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6 border-b border-[#ece8df]">
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#f0eee8] text-slate-600"><Clock3 size={15} /></div>
                <div>
                  <h2 id="history-title" className="heading-font text-sm font-bold text-slate-800">Recent classifications</h2>
                  <p className="mt-0.5 text-[10px] text-slate-500">This browser session only · {history.length} {history.length === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
              {history.length > 0 && (
                <button type="button" className="secondary-action !border-transparent !px-2 text-[10px]" onClick={clearHistory} data-testid="button-clear-history">
                  <Trash2 size={12} /> Clear history
                </button>
              )}
            </div>
            {history.length ? (
              <div className="divide-y divide-[#eeeae2]">
                {history.map((record) => (
                  <button
                    type="button"
                    className={`history-row flex w-full items-center gap-4 px-5 py-3.5 text-left sm:px-6 ${activeRecord?.id === record.id ? 'bg-[#f4f3ec]' : ''}`}
                    key={record.id}
                    onClick={() => selectRecord(record)}
                    data-testid={`row-classification-${record.id}`}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#edf1ec] font-mono text-[10px] font-medium text-emerald-900">
                      {record.result.category.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-xs font-bold text-slate-700" data-testid={`text-category-${record.id}`}>{record.result.category}</span>
                        <span className="hidden sm:inline text-[9px] font-mono text-slate-400">{Math.round(record.result.confidence * 100)}%</span>
                      </span>
                      <span className="mt-1 block truncate text-[10px] text-slate-500">{record.message}</span>
                    </span>
                    <span className="hidden sm:flex shrink-0 flex-col items-end gap-1.5">
                      <span className={`pill ${record.result.reviewStatus === 'Review required' ? 'pill-review' : 'pill-clear'}`}>
                        {record.result.reviewStatus === 'Review required' ? 'REVIEW' : 'CLEARED'}
                      </span>
                      <span className="font-mono text-[9px] text-slate-400">{formatTime(record.createdAt)}</span>
                    </span>
                    <ArrowUpRight size={14} className="shrink-0 text-slate-400" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-4 px-6 py-6" data-testid="empty-history">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f2f0e9] text-slate-500"><History size={17} /></div>
                <div>
                  <p className="text-xs font-semibold text-slate-700">Nothing classified yet</p>
                  <p className="mt-1 text-[10px] text-slate-500">Your results will appear here until this page session ends.</p>
                </div>
              </div>
            )}
          </section>

          <footer className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-1 text-[9px] font-mono uppercase tracking-wider text-slate-400">
            <span>Telecom message classifier <span className="mx-1.5">·</span> Support tooling</span>
            <span>Session data is cleared when you leave</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

function ResultView({ record, onNew }: { record: SessionRecord; onNew: () => void }) {
  const { result } = record;
  const confidence = Math.min(100, Math.max(0, Math.round(result.confidence * 100)));
  const reviewNeeded = result.reviewStatus === 'Review required';
  return (
    <div className="reveal" data-testid="classification-result">
      <div className="flex items-center justify-between">
        <span className="eyebrow">PREDICTED CATEGORY</span>
        <span className={`pill ${result.classifierMode === 'MOCK' ? 'pill-mock' : 'pill-clear'}`} data-testid="status-classifier-mode">
          {result.classifierMode === 'MOCK' ? 'MOCK · DEMO' : 'PYTHON API'}
        </span>
      </div>
      <div className="mt-3">
        <h3 className="heading-font text-[27px] leading-tight tracking-[-.035em] font-extrabold text-slate-800" data-testid="text-result-category">{result.category}</h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">{categoryDescriptions[result.category] || 'Review the conversation in context before taking action.'}</p>
      </div>
      <div className="mt-6 rounded-xl bg-[#f6f5ef] p-4">
        <div className="mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-700"><Activity size={14} className="text-emerald-800" /> Confidence</div>
          <span className="font-mono text-sm font-medium text-slate-800" data-testid="text-result-confidence">{confidence}%</span>
        </div>
        <div className="meter-track"><div className="meter-fill" style={{ width: `${confidence}%` }} /></div>
        <p className="mt-2.5 text-[10px] leading-relaxed text-slate-500">
          {result.classifierMode === 'MOCK'
            ? 'Demo confidence is illustrative only; it is not calibrated or produced by a trained model.'
            : 'Confidence is a model signal, not a guarantee. Use your judgment before resolving the case.'}
        </p>
      </div>
      <div className={`mt-4 rounded-xl border p-4 ${reviewNeeded ? 'border-amber-800/15 bg-amber-50/70' : 'border-emerald-900/10 bg-emerald-50/55'}`} data-testid="status-review">
        <div className="flex items-center gap-2">
          {reviewNeeded ? <CircleAlert size={16} className="text-amber-800" /> : <Check size={16} className="text-emerald-800" />}
          <span className="text-xs font-bold text-slate-800">{result.reviewStatus}</span>
          <span className={`pill ml-auto ${reviewNeeded ? 'pill-review' : 'pill-clear'}`}>{reviewNeeded ? 'HUMAN CHECK' : 'LOW RISK'}</span>
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-slate-600">
          {reviewNeeded
            ? 'Review this conversation before taking action. Confirm the intent and account context.'
            : 'No additional review was flagged. Confirm the recommendation against the customer context.'}
        </p>
      </div>
      <div className="mt-4 border-l-2 border-amber-500/60 pl-3 py-0.5" data-testid="text-model-notice">
        <div className="eyebrow !text-[9px] mb-1">CLASSIFIER NOTICE</div>
        <p className="text-[10px] leading-relaxed text-slate-500">{result.modelNotice}</p>
        {result.classifierMode === 'MOCK' && (
          <p className="mt-1.5 text-[10px] font-semibold text-slate-600">This is a deterministic demo result, not trained AI.</p>
        )}
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-[#ece8df] pt-4">
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400"><Clock3 size={12} /> {formatTime(record.createdAt)}</div>
        <button type="button" className="secondary-action !py-2" onClick={onNew} data-testid="button-new-classification"><RotateCcw size={12} /> New message</button>
      </div>
    </div>
  );
}

function Home() {
  return <AppDashboard />;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
