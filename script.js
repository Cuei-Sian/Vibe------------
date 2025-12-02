document.addEventListener("DOMContentLoaded", () => {
  const modelEl = document.getElementById("model");
  const sizeBlock = document.getElementById("sizeBlock");
  const calcBtn = document.getElementById("calcBtn");
  const resultEl = document.getElementById("result");
  const birthEl = document.getElementById("birth");

  // ▼ 讀取之前的結果 --------------------------
  const lastResult = localStorage.getItem("dogAgeResult");
  if (lastResult) {
    resultEl.innerHTML = lastResult;
    resultEl.classList.add("show");
  }

  const lastBirth = localStorage.getItem("dogBirth");
  if (lastBirth) birthEl.value = lastBirth;

  const lastModel = localStorage.getItem("dogModel");
  if (lastModel) modelEl.value = lastModel;

  const lastSize = localStorage.getItem("dogSize");
  if (lastSize) {
    document.getElementById("size").value = lastSize;
    if (lastModel === "size") sizeBlock.classList.remove("hidden");
  }

  // ▼ 切換體型選單顯示 --------------------------
  modelEl.addEventListener("change", () => {
    sizeBlock.classList.toggle("hidden", modelEl.value !== "size");
  });

  calcBtn.addEventListener("click", calcDogAge);
});

// ▼ 計算函式 ------------------------------------
function calcDogAge() {
  const birthInput = document.getElementById("birth").value;
  const model = document.getElementById("model").value;
  const size = document.getElementById("size")?.value || "medium";
  const resultEl = document.getElementById("result");

  if (!birthInput) {
    resultEl.innerHTML = "請先輸入出生日期。";
    resultEl.classList.add("show");
    return;
  }

  const birthDate = new Date(birthInput);
  const today = new Date();

  let ageYears = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    ageYears--;
  }
  if (ageYears < 0) ageYears = 0;

  let humanEquivalent = 0;
  let detail = "";

  if (model === "simple") {
    if (ageYears === 0) {
      const months = Math.max(
        0,
        (today.getFullYear() - birthDate.getFullYear()) * 12 +
          (today.getMonth() - birthDate.getMonth())
      );
      humanEquivalent = Math.round((months / 12) * 15);
      detail = "（幼犬估算）";
    } else if (ageYears === 1) humanEquivalent = 15;
    else if (ageYears === 2) humanEquivalent = 24;
    else humanEquivalent = 24 + (ageYears - 2) * 5;
    detail = detail || "（簡易換算）";
  } else if (model === "dna") {
    const dogYearsForCalc = ageYears >= 1 ? ageYears : 1;
    humanEquivalent = Math.round(16 * Math.log(dogYearsForCalc) + 31);
    detail = ageYears === 0 ? "（狗小於1歲，以1歲估算）" : "（DNA 甲基化模型）";
  } else if (model === "size") {
    const multiplier = size === "small" ? 4 : size === "medium" ? 5 : 6;
    humanEquivalent = ageYears * multiplier;
    detail = `（體型換算：${size}，×${multiplier}）`;
  }

  const html = `
    🐾 狗狗實際年齡：<span style="color:#d35400">${ageYears}</span> 歲<br>
    🧡 換算成人類年齡：<span style="color:#c0392b">${humanEquivalent}</span> 歲 ${detail}
  `;

  resultEl.innerHTML = html;
  resultEl.classList.add("show");

  // ▼ 儲存到 localStorage -------------------------
  localStorage.setItem("dogAgeResult", html);
  localStorage.setItem("dogBirth", birthInput);
  localStorage.setItem("dogModel", model);
  localStorage.setItem("dogSize", size);
}
