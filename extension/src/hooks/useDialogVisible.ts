import { useEffect, useState } from "react";

export function useDialogVisible() {
  const [dialogVisible, setDialogVisible] = useState<boolean | null>(null);

  useEffect(() => {
    const isDialogVisible = async () => {
      const res = (await chrome.storage.local.get("dialogVisible")) as {
        dialogVisible: boolean;
      };

      const visible = res.dialogVisible ?? true;
      setDialogVisible(visible);
      return;
    };

    isDialogVisible();
  }, []);

  const toggleDialog = () => {
    const nextVisible = !dialogVisible;
    setDialogVisible(nextVisible);
    chrome.storage.local.set({ dialogVisible: nextVisible });
  };

  return { dialogVisible, toggleDialog };
}
