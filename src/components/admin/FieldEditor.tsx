"use client";

import { useState, type ReactNode } from "react";
import { emptyValue, type Field } from "@/lib/schema";

type Obj = Record<string, unknown>;

const inputCls =
  "w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-fg placeholder:text-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

function Label({ field, htmlFor, children }: { field: { label: string; help?: string }; htmlFor?: string; children?: ReactNode }) {
  return (
    <div className="mb-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-fg">
        {field.label}
      </label>
      {field.help && <p className="mt-0.5 text-xs text-subtle">{field.help}</p>}
      {children}
    </div>
  );
}

function IconBtn({ label, onClick, disabled, children, danger }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode; danger?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex size-8 items-center justify-center rounded-md border border-line text-sm transition disabled:opacity-30 ${
        danger ? "text-danger hover:bg-danger/10" : "text-muted hover:bg-surface hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}

function move<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr];
  const [x] = next.splice(from, 1);
  next.splice(to, 0, x);
  return next;
}

// ---------- list of strings ----------
function ChipsEditor({ id, value, onChange, placeholder }: { id: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const parts = draft.split(",").map((s) => s.trim()).filter(Boolean);
    const fresh = parts.filter((p) => !value.some((v) => v.toLowerCase() === p.toLowerCase()));
    if (fresh.length) onChange([...value, ...fresh]);
    setDraft("");
  };
  return (
    <div className="rounded-lg border border-line bg-bg p-2 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
      <ul className="flex flex-wrap gap-1.5">
        {value.map((v, i) => (
          <li key={`${v}-${i}`} className="inline-flex items-center gap-1 rounded-md border border-line bg-surface py-0.5 pl-2 pr-1 text-sm">
            {v}
            <button type="button" aria-label={`Remove ${v}`} onClick={() => onChange(value.filter((_, j) => j !== i))} className="rounded px-1 text-subtle hover:bg-danger/10 hover:text-danger">
              ×
            </button>
          </li>
        ))}
        <li className="min-w-40 flex-1">
          <input
            id={id}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                add();
              } else if (e.key === "Backspace" && !draft && value.length) {
                onChange(value.slice(0, -1));
              }
            }}
            onBlur={add}
            placeholder={placeholder ?? "Type and press Enter"}
            className="w-full bg-transparent px-1 py-1 text-sm focus:outline-none"
          />
        </li>
      </ul>
    </div>
  );
}

function LinesEditor({ id, value, onChange }: { id: string; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="space-y-2">
      {value.map((v, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="mt-2 w-5 shrink-0 text-right text-xs text-subtle">{i + 1}.</span>
          <textarea
            id={i === 0 ? id : undefined}
            value={v}
            rows={Math.min(6, Math.max(2, Math.ceil(v.length / 90)))}
            onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))}
            className={`${inputCls} resize-y`}
          />
          <div className="flex shrink-0 flex-col gap-1">
            <IconBtn label="Move up" disabled={i === 0} onClick={() => onChange(move(value, i, i - 1))}>↑</IconBtn>
            <IconBtn label="Move down" disabled={i === value.length - 1} onClick={() => onChange(move(value, i, i + 1))}>↓</IconBtn>
            <IconBtn label="Remove" danger onClick={() => onChange(value.filter((_, j) => j !== i))}>×</IconBtn>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, ""])} className="rounded-lg border border-dashed border-line px-3 py-1.5 text-sm font-medium text-accent hover:bg-surface">
        + Add line
      </button>
    </div>
  );
}

// ---------- repeatable cards ----------
export function ObjectListEditor({
  fields,
  itemTitle,
  addLabel,
  value,
  onChange,
  idPrefix,
  defaultOpen = false,
}: {
  fields: Field[];
  itemTitle: string;
  addLabel?: string;
  value: Obj[];
  onChange: (v: Obj[]) => void;
  idPrefix: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState<Set<number>>(() => new Set(defaultOpen ? value.map((_, i) => i) : []));
  const toggle = (i: number) => setOpen((s) => {
    const n = new Set(s);
    if (n.has(i)) n.delete(i);
    else n.add(i);
    return n;
  });
  const remap = (from: number, to: number) =>
    setOpen((s) => {
      const n = new Set<number>();
      s.forEach((i) => n.add(i === from ? to : i === to ? from : i));
      return n;
    });

  return (
    <div className="space-y-3">
      {value.map((item, i) => {
        const title = String(item[itemTitle] ?? "").trim() || "Untitled";
        const isOpen = open.has(i);
        return (
          <div key={i} className="overflow-hidden rounded-xl border border-line bg-bg">
            <div className="flex items-center gap-2 px-3 py-2">
              <button type="button" onClick={() => toggle(i)} aria-expanded={isOpen} className="flex min-w-0 flex-1 items-center gap-2 py-1 text-left">
                <span className={`inline-block text-subtle transition ${isOpen ? "rotate-90" : ""}`}>▸</span>
                <span className="truncate font-medium">{title}</span>
              </button>
              <IconBtn label="Move up" disabled={i === 0} onClick={() => { onChange(move(value, i, i - 1)); remap(i, i - 1); }}>↑</IconBtn>
              <IconBtn label="Move down" disabled={i === value.length - 1} onClick={() => { onChange(move(value, i, i + 1)); remap(i, i + 1); }}>↓</IconBtn>
              <IconBtn
                label="Delete"
                danger
                onClick={() => {
                  if (confirm(`Delete “${title}”? You can undo this from History after saving.`)) {
                    onChange(value.filter((_, j) => j !== i));
                    setOpen(new Set());
                  }
                }}
              >
                🗑
              </IconBtn>
            </div>
            {isOpen && (
              <div className="border-t border-line bg-surface/50 p-4">
                <FieldsEditor fields={fields} value={item} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} idPrefix={`${idPrefix}-${i}`} />
              </div>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => {
          onChange([...value, emptyValue(fields)]);
          setOpen((s) => new Set(s).add(value.length));
        }}
        className="w-full rounded-xl border border-dashed border-line px-4 py-3 text-sm font-semibold text-accent hover:bg-surface"
      >
        + {addLabel ?? "Add item"}
      </button>
    </div>
  );
}

// ---------- one field ----------
function FieldEditor({ field, value, onChange, id }: { field: Field; value: unknown; onChange: (v: unknown) => void; id: string }) {
  switch (field.type) {
    case "text":
    case "url":
    case "email":
      return (
        <div>
          <Label field={field} htmlFor={id} />
          <input
            id={id}
            type={field.type === "text" ? "text" : field.type}
            value={String(value ?? "")}
            placeholder={field.placeholder}
            required={field.required}
            onChange={(e) => onChange(e.target.value)}
            className={inputCls}
          />
        </div>
      );
    case "textarea":
      return (
        <div>
          <Label field={field} htmlFor={id} />
          <textarea id={id} value={String(value ?? "")} placeholder={field.placeholder} rows={3} onChange={(e) => onChange(e.target.value)} className={`${inputCls} resize-y`} />
        </div>
      );
    case "boolean":
      return (
        <label className="flex cursor-pointer items-start gap-3">
          <span className="relative mt-0.5 inline-flex">
            <input type="checkbox" className="peer sr-only" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
            <span className="h-5 w-9 rounded-full bg-surface-2 ring-1 ring-line transition peer-checked:bg-ok peer-focus-visible:ring-2 peer-focus-visible:ring-accent" />
            <span className="absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
          </span>
          <span>
            <span className="text-sm font-medium">{field.label}</span>
            {field.help && <span className="block text-xs text-subtle">{field.help}</span>}
          </span>
        </label>
      );
    case "list": {
      const list = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div>
          <Label field={field} htmlFor={id} />
          {field.chips ? <ChipsEditor id={id} value={list} onChange={onChange} placeholder={field.placeholder} /> : <LinesEditor id={id} value={list} onChange={onChange} />}
        </div>
      );
    }
    case "object":
      return (
        <fieldset className="rounded-xl border border-line p-4">
          <legend className="px-1 text-sm font-medium">{field.label}</legend>
          <FieldsEditor fields={field.fields} value={(value as Obj) ?? {}} onChange={onChange} idPrefix={id} />
        </fieldset>
      );
    case "objectList":
      return (
        <div>
          <Label field={field} />
          <ObjectListEditor
            fields={field.fields}
            itemTitle={field.itemTitle}
            addLabel={field.addLabel}
            value={Array.isArray(value) ? (value as Obj[]) : []}
            onChange={onChange}
            idPrefix={id}
          />
        </div>
      );
  }
}

export function FieldsEditor({ fields, value, onChange, idPrefix }: { fields: Field[]; value: Obj; onChange: (v: Obj) => void; idPrefix: string }) {
  return (
    <div className="grid gap-5">
      {fields.map((f) => (
        <FieldEditor key={f.key} field={f} id={`${idPrefix}-${f.key}`} value={value[f.key]} onChange={(v) => onChange({ ...value, [f.key]: v })} />
      ))}
    </div>
  );
}
