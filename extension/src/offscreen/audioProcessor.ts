/// <reference types="@types/audioworklet" />

const pcmBuffer: Int16Array[] = [];
let bufferedSamples = 0;

function float32ToInt16(input: Float32Array): Int16Array {
  const output = new Int16Array(input.length);

  for (let i = 0; i < input.length; i++) {
    const sample = Math.max(-1, Math.min(1, input[i]));
    output[i] = sample < 0 ? sample * 32768 : sample * 32767;
  }

  return output;
}

class AudioProcessor extends AudioWorkletProcessor {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  process(
    inputs: Float32Array[][],
    _outputs: Float32Array[][],
    _parameters: Record<string, Float32Array>,
  ) {
    const input = inputs[0];
    const channel = input?.[0];

    if (!channel) return true;

    const pcm = float32ToInt16(channel);

    pcmBuffer.push(pcm);
    bufferedSamples += pcm.length;

    if (bufferedSamples >= 1280) {
      const chunk = new Int16Array(bufferedSamples);

      let offset = 0;

      for (const buffer of pcmBuffer) {
        chunk.set(buffer, offset);
        offset += buffer.length;
      }

      this.port.postMessage(chunk);

      pcmBuffer.length = 0;
      bufferedSamples = 0;
    }

    return true;
  }
}

registerProcessor("audio-processor", AudioProcessor);
