import { useEffect, useRef, useState } from "react";
import { SecondaryButton } from "./ui";

/**
 * SpeakingCheckpoint
 * A real "speak before you submit" gate. It offers optional microphone
 * recording (MediaRecorder API) for students who want to capture their
 * speaking turn, and a required confirmation checkbox so the stage cannot
 * be completed by clicking through silently. If the microphone is not
 * available (permissions denied / unsupported browser), a text alternative
 * is always available.
 */
export function SpeakingCheckpoint({
  prompt,
  confirmLabel = "We said this out loud together before submitting.",
  onConfirmChange,
  confirmed,
}: {
  prompt: string;
  confirmLabel?: string;
  confirmed: boolean;
  onConfirmChange: (v: boolean) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startRecording = async () => {
    setMicError(null);
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      setMicError("Microphone recording isn't supported in this browser. Just speak aloud instead!");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
      setSeconds(0);
      timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      setMicError("Microphone access wasn't available. No problem — just speak aloud with your partner instead.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (timerRef.current) window.clearInterval(timerRef.current);
  };

  return (
    <div className="rounded-xl border border-dashed border-[#8a3b3b]/50 bg-[#fbf4e8] p-4">
      <p className="mb-3 text-sm font-semibold text-[#7a2e2e]">🎤 Speaking checkpoint</p>
      <p className="mb-3 text-sm text-[#5c5349]">{prompt}</p>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {!recording ? (
          <SecondaryButton onClick={startRecording}>● Record (optional)</SecondaryButton>
        ) : (
          <SecondaryButton onClick={stopRecording}>■ Stop ({seconds}s)</SecondaryButton>
        )}
        {audioUrl && <audio controls src={audioUrl} className="h-9" />}
      </div>
      {micError && <p className="mb-2 text-xs text-[#8a3b3b]">{micError}</p>}
      <label className="flex cursor-pointer items-start gap-2 text-sm text-[#2c2420]">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => onConfirmChange(e.target.checked)}
          className="mt-1 h-4 w-4 accent-[#7a2e2e]"
        />
        <span>{confirmLabel}</span>
      </label>
    </div>
  );
}
