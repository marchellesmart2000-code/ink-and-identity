import { Button } from "./Button";
import { Modal } from "./Modal";

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <p className="text-sm leading-relaxed text-ivory/70">{body}</p>
      <div className="mt-6 flex gap-3">
        <Button onClick={onConfirm}>{confirmLabel}</Button>
        <Button variant="line" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
