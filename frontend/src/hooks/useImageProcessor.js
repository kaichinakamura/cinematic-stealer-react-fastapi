import { useState, useCallback } from 'react';
import JSZip from 'jszip'; 

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  console.error("Error: VITE_API_URL is not set in environment variables.");
}

export const useImageProcessor = () => {
  const [targetFile, setTargetFile] = useState(null);
  const [targetPreview, setTargetPreview] = useState(null);
  const [refFile, setRefFile] = useState(null);
  const [refPreview, setRefPreview] = useState(null);
  const [method, setMethod] = useState("histogram");
  const [preserveLum, setPreserveLum] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [processedPreview, setProcessedPreview] = useState(null);
  const [snapshots, setSnapshots] = useState([]);
  const [isZipping, setIsZipping] = useState(false);

  // ★共通処理: ファイルを受け取ってStateを更新する関数
  const processFile = useCallback((file, type) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      if (type === 'target') {
        setTargetFile(file);
        setTargetPreview(url);
      } else {
        setRefFile(file);
        setRefPreview(url);
      }
      setProcessedPreview(null);
    }
  }, []);

  // ★修正: ドラッグ＆ドロップ用
  const handleDrop = useCallback((e, type) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0]; // 安全にアクセス
    if (file) {
      processFile(file, type);
    }
  }, [processFile]);

  // ★追加: クリック選択用（ファイル選択ダイアログから）
  const handleFileSelect = useCallback((e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file, type);
    }
    // 同じファイルを再選択できるようにvalueをリセット
    e.target.value = ''; 
  }, [processFile]);

  const handleSwap = () => {
    setTargetFile(refFile);
    setTargetPreview(refPreview);
    setRefFile(targetFile);
    setRefPreview(targetPreview);
    setProcessedPreview(null);
  };

  const runProcess = async () => {
    if (!targetFile || !refFile) return alert("画像を2枚選択してください");
    setIsLoading(true);
    const formData = new FormData();
    formData.append("target", targetFile);
    formData.append("reference", refFile);
    formData.append("method", method);
    formData.append("preserve_luminance", preserveLum);

    try {
      const res = await fetch(`${API_BASE_URL}/api/process`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Processing failed");
      const blob = await res.blob();
      setProcessedPreview(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      alert("エラーが発生しました。Backendを確認してください。");
    } finally {
      setIsLoading(false);
    }
  };

  const takeSnapshot = (currentOpacity) => {
    if (!processedPreview || !targetPreview) return;
    const newSnap = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleTimeString(),
      processed: processedPreview,
      target: targetPreview,
      refFile: refFile, 
      method: method, 
      preserveLum: preserveLum, 
      intensity: currentOpacity
    };
    setSnapshots([newSnap, ...snapshots]);
  };

  const downloadLut = async (snap) => {
    const formData = new FormData();
    formData.append("reference", snap.refFile);
    formData.append("method", snap.method);
    formData.append("preserve_luminance", snap.preserveLum);
    formData.append("intensity", snap.intensity);

    try {
      const res = await fetch(`${API_BASE_URL}/api/generate_lut`, {
        method: "POST",
        body: formData,
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cinematic_${snap.method}.cube`;
      a.click();
    } catch (err) {
      alert("LUT生成エラー");
    }
  };

  const downloadAllAsZip = async () => {
    if (snapshots.length === 0) return;
    setIsZipping(true);
    const zip = new JSZip();
    const folder = zip.folder("cinematic_snapshots");

    try {
      await Promise.all(snapshots.map(async (snap, index) => {
        const prefix = `snap_${index + 1}_${snap.method}`;
        const imgBlob = await fetch(snap.processed).then(r => r.blob());
        folder.file(`${prefix}.png`, imgBlob);
        const info = `Method: ${snap.method}\nIntensity: ${snap.intensity}\nPreserve Luminance: ${snap.preserveLum}\nDate: ${snap.date}`;
        folder.file(`${prefix}_info.txt`, info);

        const formData = new FormData();
        formData.append("reference", snap.refFile);
        formData.append("method", snap.method);
        formData.append("preserve_luminance", snap.preserveLum);
        formData.append("intensity", snap.intensity);
        
        const lutRes = await fetch(`${API_BASE_URL}/api/generate_lut`, {
          method: "POST", body: formData
        });
        if (lutRes.ok) {
          const lutBlob = await lutRes.blob();
          folder.file(`${prefix}.cube`, lutBlob);
        }
      }));

      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = "cinematic_snapshots.zip";
      a.click();

    } catch (e) {
      console.error(e);
      alert("ZIP作成中にエラーが発生しました");
    } finally {
      setIsZipping(false);
    }
  };

  return {
    targetFile, targetPreview,
    refFile, refPreview,
    method, setMethod,
    preserveLum, setPreserveLum,
    isLoading,
    processedPreview,
    snapshots, setSnapshots,
    isZipping,
    handleDrop,      // D&D用
    handleFileSelect,// クリック選択用 (★追加)
    handleSwap,
    runProcess,
    takeSnapshot,
    downloadLut,
    downloadAllAsZip
  };
};