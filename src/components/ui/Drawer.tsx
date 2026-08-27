import { AnimatePresence, motion } from "framer-motion";
import { IconButton } from "./IconButton";

export function Drawer({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-ink/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-50 w-[min(100%,28rem)] overflow-y-auto border-l border-gold/25 bg-charcoal text-ivory paper-grain pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
            aria-label={title}
          >
            <div className="flex items-center justify-between px-6 py-5">
              <p className="eyebrow">{title}</p>
              <IconButton label="Close navigation" onClick={onClose} className="text-ivory">
                ×
              </IconButton>
            </div>
            <div className="px-6 pb-10">{children}</div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
