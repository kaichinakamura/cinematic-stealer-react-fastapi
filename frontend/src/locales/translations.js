export const translations = {
  ja: {
    // アップロード部分
    upload: {
      step: "画像をアップロード",
      target_label: "Target Image",
      target_sub: "変えたい画像",
      ref_label: "Reference Image",
      ref_sub: "憧れの色味",
      replace: "画像を入れ替え",
      drag_drop: "Drag & Drop or Click",
    },
    // コントロールパネル部分
    control: {
      step: "設定と生成", // ★変更: Select & Create -> 設定と生成
      algo_label: "ALGORITHM",
      create_btn: "Create Result",
      processing: "Processing...",
      // アルゴリズム説明文
      desc: {
        histogram: "色の分布を合わせます。最も自然な仕上がり。",
        reinhard: "統計的な色移動。極端な色変化に強い。",
        covariance: "色の相関を維持。鮮やかさを保ちたい場合に。",
        kmeans: "主要色を解析して置換。ポスターのような効果。",
      },
      // オプション
      preserve_lum: "Preserve Luminance",
      preserve_lum_sub: "明るさを維持 (色のみ適用)",
      lum_tooltip_on: "明るさは維持し、色味だけ適用。",
      lum_tooltip_off: "明るさもリファレンスに合わせます。",
      lum_tooltip_note: "※画像により結果が大きく変わるため、切り替えて試すのがおすすめです。",
    },
    // 結果・スナップショット部分
    result: {
      step: "生成結果", // ★変更: Result -> 生成結果
      snapshot_btn: "Snapshot",
      opacity: "Effect Opacity (Blend)",
      snapshots_title: "Snapshots",
      download_zip: "Download All as ZIP",
    },
    // ヘルプモーダル
    help: {
      title: "クイックガイド", // ★変更: Quick Guide -> クイックガイド
      step1_title: "Upload Images",
      step1_desc: "Target（変えたい画像）と Reference（真似したい色味）をそれぞれドラッグ&ドロップします。",
      step2_title: "Select & Create",
      step2_desc: "好みのAlgorithmを選び、Create Result を押します。Histogramが最も汎用的でおすすめです。",
      step3_title: "Snapshot & LUT",
      step3_desc: "結果が気に入ればSnapshotで保存。あとから画像や3D LUT (.cube) としてダウンロードできます。",
    }
  },
  en: {
    upload: {
      step: "Upload Images",
      target_label: "Target Image",
      target_sub: "Image to change",
      ref_label: "Reference Image",
      ref_sub: "Color reference",
      replace: "Replace Image",
      drag_drop: "Drag & Drop or Click",
    },
    control: {
      step: "Select & Create",
      algo_label: "ALGORITHM",
      create_btn: "Create Result",
      processing: "Processing...",
      desc: {
        histogram: "Matches color distribution. Most natural result.",
        reinhard: "Statistical color transfer. Robust to extreme changes.",
        covariance: "Maintains color covariance. Good for vividness.",
        kmeans: "Clustering-based replacement. Poster-like effect.",
      },
      preserve_lum: "Preserve Luminance",
      preserve_lum_sub: "Apply color only (Keep brightness)",
      lum_tooltip_on: "Maintains original brightness, applies color only.",
      lum_tooltip_off: "Matches brightness to reference as well.",
      lum_tooltip_note: "*Results vary greatly, so try switching it.",
    },
    result: {
      step: "Result",
      snapshot_btn: "Snapshot",
      opacity: "Effect Opacity (Blend)",
      snapshots_title: "Snapshots",
      download_zip: "Download All as ZIP",
    },
    help: {
      title: "Quick Guide",
      step1_title: "Upload Images",
      step1_desc: "Drag & drop the Target image and the Reference image (the color you want to steal).",
      step2_title: "Select & Create",
      step2_desc: "Select an Algorithm and press Create Result. Histogram is generally recommended.",
      step3_title: "Snapshot & LUT",
      step3_desc: "Save results as Snapshots. You can download images or 3D LUTs (.cube) later.",
    }
  }
};