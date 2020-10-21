import * as React from "react";
import { Modal, ModalBody } from "carbon-components-react";

const prompts: Array<() => void> = [];
const installKey = "app:install";

export function savePrompt(e: any) {
  prompts.push(() => e.prompt());
}

export const Install: React.FC = () => {
  const [open, setOpen] = React.useState(() => {
    const hasBeenTried = localStorage.getItem(installKey);
    return hasBeenTried !== "yes" && prompts.length === 1;
  });

  const close = React.useCallback(() => setOpen(false), []);
  const install = React.useCallback(() => {
    prompts.forEach((prompt) => prompt());
    setOpen(false);
  }, []);

  React.useEffect(() => {
    localStorage.setItem(installKey, "yes");
  }, []);

  return (
    <Modal
      primaryButtonText="Install"
      secondaryButtonText="Cancel"
      title="Install App?"
      open={open}
      onSecondarySubmit={close}
      onRequestClose={close}
      onRequestSubmit={install}
    >
      <ModalBody>
        Install the app on your device for the best experience.
      </ModalBody>
    </Modal>
  );
};
