import { MicVAD } from "@ricky0123/vad-web";

export async function startVAD(
  stream: MediaStream,
  onSpeechStart: () => void,
  onVADMisfire: () => void,
  onSpeechEnd: () => void,
) {
  const vad = await MicVAD.new({
    model: "v6",
    getStream: async () => stream,
    startOnLoad: false,

    baseAssetPath: chrome.runtime.getURL("vad/"),
    onnxWASMBasePath: chrome.runtime.getURL("vad/"),

    onSpeechStart,

    onVADMisfire,

    onSpeechEnd,
  });

  vad.start();
}
