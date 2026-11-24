type CardAdminControlsProps = {
  title: string;
  hidden?: boolean | undefined;
  onEdit: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
};

export function CardAdminControls({
  title,
  hidden,
  onEdit,
  onDelete,
  onToggleVisibility,
}: CardAdminControlsProps) {
  return (
    <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
      <button
        type="button"
        aria-label={`Edit ${title}`}
        onClick={onEdit}
        className="rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-secondary"
      >
        Edit
      </button>
      <button
        type="button"
        aria-label={`Delete ${title}`}
        onClick={onDelete}
        className="rounded-lg border px-3 py-2 text-sm font-semibold text-destructive hover:bg-secondary"
      >
        Delete
      </button>
      <button
        type="button"
        aria-label={`${hidden ? "Show" : "Hide"} ${title} ${hidden ? "to" : "from"} public`}
        aria-pressed={Boolean(hidden)}
        onClick={onToggleVisibility}
        className="rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-secondary"
      >
        {hidden ? "Show to public" : "Hide from public"}
      </button>
    </div>
  );
}
