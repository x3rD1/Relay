export async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];

  if (!(activeTab && activeTab.id)) return;

  return activeTab;
}
