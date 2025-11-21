/** ============================
 *  DevTools対策（完全防止は不可）
 *  - 右クリック（コンテキストメニュー）禁止
 *  - よく使われるショートカット抑制（F12, Ctrl/Cmd+Shift+I/J/C, Ctrl/Cmd+U）
 *  - 画像ドラッグ抑制（HTML/CSS側でも対応済）
 * ============================ */

// 右クリック禁止
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
}, { passive: false });

// キー操作抑制（注意：OSやブラウザで挙動差あり）
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  const ctrlOrCmd = e.ctrlKey || e.metaKey;

  // F12
  if (key === 'f12') {
    e.preventDefault();
  }

  // Ctrl/Cmd + Shift + (I|J|C)
  if (ctrlOrCmd && e.shiftKey && ['i','j','c'].includes(key)) {
    e.preventDefault();
  }

  // Ctrl/Cmd + U（ソース表示）
  if (ctrlOrCmd && key === 'u') {
    e.preventDefault();
  }
}, { passive: false });

// 画像ドラッグ抑制（念押し）
document.addEventListener('dragstart', (e) => {
  if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
    e.preventDefault();
  }
}, { passive: false });

/** ============================
 *  スクロール時のフェードイン
 * ============================ */
const onScrollFadeIn = () => {
  const els = document.querySelectorAll('section');
  const h = window.innerHeight;
  els.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < h - 100) el.classList.add('fade-in');
  });
};
document.addEventListener('scroll', onScrollFadeIn, { passive: true });
document.addEventListener('DOMContentLoaded', onScrollFadeIn);

/* ============================
 * 手紙ギミックの開閉制御
 * ============================ */
(function(){
  const wrap = document.querySelector('[data-letter]');
  if(!wrap) return;

  const envelope = wrap.querySelector('.envelope');
  const paper = wrap.querySelector('.paper');

  const setExpanded = (open) => {
    wrap.classList.toggle('open', open);
    envelope.setAttribute('aria-expanded', String(open));
  };

  // トグル開閉
  const toggle = () => setExpanded(!wrap.classList.contains('open'));

  // クリック / タップ
  envelope.addEventListener('click', toggle);

  // キーボード操作（Enter / Spaceで開閉）
  envelope.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (k === 'enter' || k === ' ') {
      e.preventDefault();
      toggle();
    }
    // ESCで閉じる
    if (k === 'escape') {
      setExpanded(false);
    }
  });

  // 封筒外をクリックしたら閉じる
  document.addEventListener('click', (e) => {
    if (!wrap.classList.contains('open')) return;
    if (!wrap.contains(e.target)) setExpanded(false);
  });

  // ビューポートサイズ変更時も、紙がはみ出さないよう軽く再配置（必要に応じて）
  window.addEventListener('resize', () => {
    if (!wrap.classList.contains('open')) return;
    // ここではスタイルに任せるため処理なし。調整が必要ならtranslateを計算して反映
  });
})();


/* =========================================
 * Xで共有（ツイート編集へ遷移）
 * ========================================= */
(function(){
  const btn = document.getElementById('shareX');
  if (!btn) return;

  // ▼ クラファンURL（CAMPFIRE）
  const CF_URL = 'https://camp-fire.jp/projects/896176/view';

  // ▼ ハッシュタグ（カンマ区切り）
  const HASHTAGS = [
    'WowMe',          // プロジェクト名
    '推し活',          // 文脈ハッシュタグ
    '動画メッセージ',   // 企画の性質
    'CAMPFIRE',       // プラットフォーム
    'クラウドファンディング'
  ].join(',');

  // ▼ 拡散コメント（本文）
  const COMMENT =
    '「推しがあなたの名前を呼ぶ」体験を、もっと身近に。' +
    '動画メッセージアプリ #WowMe を開発中！' +
    'CAMPFIREでクラファン挑戦中。ご支援＆拡散お願いします🙏';

  btn.addEventListener('click', () => {
    // x.com でも twitter.com でもOK。ここでは twitter.com を利用
    const intent = 'https://twitter.com/intent/tweet'
      + '?text=' + encodeURIComponent(COMMENT)
      + '&url=' + encodeURIComponent(CF_URL)
      + '&hashtags=' + encodeURIComponent(HASHTAGS);

    // 新規タブで開く
    window.open(intent, '_blank', 'noopener');
  });
})();


function calcRevenue() {
  const price = Number(document.getElementById("price").value);
  const count = Number(document.getElementById("count").value);

  if (!price || !count) {
    alert("単価と本数を入力してください！");
    return;
  }

  const total = price * count;
  const talent = Math.floor(total * 0.8);
  const wowme = total - talent;

  document.getElementById("total").innerText = total.toLocaleString();
  document.getElementById("talent").innerText = talent.toLocaleString();
  document.getElementById("wowme").innerText = wowme.toLocaleString();
}
