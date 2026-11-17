import { HelpCircle, SendHorizontal, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";

import { NOT_FOUND_ANSWER } from "../api/types";
import { selectThread, useChatStore, type ChatTurn } from "../stores/chatStore";
import { SourceList } from "./SourceList";
import { Alert } from "./ui/Alert";
import { Button } from "./ui/Button";
import { Spinner } from "./ui/Spinner";

const EXAMPLES = ["এই নথির মূল বিষয় কী?", "লেখক কে?", "সংক্ষেপে সারাংশ দাও"];

function Turn({ turn }: { turn: ChatTurn }) {
  const notFound =
    turn.result && (!turn.result.found || turn.result.answer.trim() === NOT_FOUND_ANSWER);
  return (
    <div className="flex flex-col gap-3 animate-fade-in">
      <div className="self-end max-w-[85%] rounded-xl rounded-br-sm bg-surface-card px-4 py-2.5 font-bangla leading-relaxed whitespace-pre-wrap text-ink">
        {turn.question}
      </div>
      <div className="max-w-full rounded-xl border border-hairline bg-surface-raised p-4 shadow-card sm:p-5">
        {turn.pending ? (
          <Spinner className="text-muted" label="Searching your documents…" />
        ) : turn.error ? (
          <Alert>{turn.error}</Alert>
        ) : notFound ? (
          <div className="flex items-start gap-3 text-muted">
            <HelpCircle className="mt-1 size-5 shrink-0" />
            <div>
              <p className="font-display text-2xl text-ink">{NOT_FOUND_ANSWER}</p>
              <p className="mt-1 text-sm">
                The uploaded documents don't contain an answer to this question.
              </p>
            </div>
          </div>
        ) : turn.result ? (
          <>
            <div className="flex items-start gap-3">
              <Sparkles className="mt-1 size-4 shrink-0 text-primary" />
              <p className="font-bangla leading-relaxed whitespace-pre-wrap text-ink">
                {turn.result.answer}
              </p>
            </div>
            <SourceList sources={turn.result.sources} />
          </>
        ) : null}
      </div>
    </div>
  );
}

export function AskPanel({
  projectId,
  hasDocuments,
}: {
  projectId: string;
  hasDocuments: boolean;
}) {
  const thread = useChatStore(selectThread(projectId));
  const ask = useChatStore((s) => s.ask);
  const clear = useChatStore((s) => s.clear);
  const limit = useChatStore((s) => s.limit);
  const setLimit = useChatStore((s) => s.setLimit);
  const [query, setQuery] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const pending = thread.some((t) => t.pending);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [thread.length, pending]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    if (!q || pending || q.length > 1000) return;
    setQuery("");
    void ask(projectId, q);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {!hasDocuments && (
        <Alert kind="info">
          This project has no documents yet. Upload one in the Documents tab so there is something
          to search.
        </Alert>
      )}

      {thread.length === 0 ? (
        <div className="rounded-lg bg-surface-card/60 px-6 py-10 text-center">
          <h3 className="text-title">Ask in Bangla or English</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Answers come only from this project's documents. If they don't cover it, you'll get{" "}
            <span className="font-bangla">“{NOT_FOUND_ANSWER}”</span>.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setQuery(ex)}
                className="cursor-pointer rounded-full border border-hairline-strong bg-surface-raised px-3.5 py-1.5 font-bangla text-sm text-body hover:border-primary hover:text-ink"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {thread.map((t) => (
            <Turn key={t.id} turn={t} />
          ))}
          <div ref={endRef} />
        </div>
      )}

      <form
        onSubmit={submit}
        className="sticky bottom-3 rounded-xl border border-hairline-strong bg-surface-raised p-2 shadow-pop focus-within:border-primary"
      >
        <label htmlFor="ask-input" className="sr-only">
          Your question
        </label>
        <textarea
          id="ask-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          maxLength={1000}
          placeholder="প্রশ্ন লিখুন… (Enter to send, Shift+Enter for a new line)"
          className="w-full resize-none bg-transparent px-2.5 py-2 font-bangla leading-relaxed text-ink outline-none placeholder:text-subtle"
        />
        <div className="flex flex-wrap items-center gap-2 px-1">
          <label className="inline-flex items-center gap-2 text-xs text-muted">
            Sources
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="h-8 cursor-pointer rounded-md border border-hairline bg-canvas px-2 text-sm text-ink"
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          {thread.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              icon={<Trash2 className="size-3.5" />}
              onClick={() => clear(projectId)}
              disabled={pending}
            >
              Clear
            </Button>
          )}
          <span className="ml-auto text-xs text-subtle">
            {query.length > 900 && `${query.length}/1000`}
          </span>
          <Button
            type="submit"
            size="sm"
            disabled={!query.trim() || pending}
            loading={pending}
            icon={<SendHorizontal className="size-4" />}
          >
            Ask
          </Button>
        </div>
      </form>
    </div>
  );
}
