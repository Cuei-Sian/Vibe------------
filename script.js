// script.js
document.addEventListener("DOMContentLoaded", () => {
  const modelEl = document.getElementById("model");
  const sizeBlock = document.getElementById("sizeBlock");
  const calcBtn = document.getElementById("calcBtn");

  // 切換體型選單顯示
  modelEl.addEventListener("change", () => {
    sizeBlock.classList.toggle("hidden", modelEl.value !== "size");
  });

  calcBtn.addEventListener("click", calcDogAge);
});

function calcDogAge() {
  const birthInput = document.getElementById("birth").value;
  const model = document.getElementById("model").value;
  const size = document.getElementById("size")?.value || "medium";
  const resultEl = document.getElementById("result");

  if (!birthInput) {
    resultEl.innerHTML = "請先輸入出生日期。";
    return;
  }

  const birthDate = new Date(birthInput);
  const today = new Date();

  // 計算實際完整年齡（整年）
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
    // 1 -> 15, 2 -> 24, 之後每年 +5
    if (ageYears === 0) {
      // 幼犬未滿1歲：用月數估算（簡單比例）
      const months = Math.max(
        0,
        (today.getFullYear() - birthDate.getFullYear()) * 12 +
          (today.getMonth() - birthDate.getMonth())
      );
      const approxHuman = Math.round((months / 12) * 15);
      humanEquivalent = approxHuman;
      detail = `（幼犬估算，按月換算）`;
    } else if (ageYears === 1) {
      humanEquivalent = 15;
    } else if (ageYears === 2) {
      humanEquivalent = 24;
    } else {
      humanEquivalent = 24 + (ageYears - 2) * 5;
    }
    detail = detail || "（簡易換算）";
  } else if (model === "dna") {
    // 使用 Wang et al. 2020: human ≈ 16 * ln(dogYears) + 31
    // 若狗年齡為 0（未滿1歲），用 1 作為下限再給提示
    const dogYearsForCalc = ageYears >= 1 ? ageYears : 1;
    humanEquivalent = Math.round(16 * Math.log(dogYearsForCalc) + 31);
    if (ageYears === 0) detail = "（狗小於1歲，公式使用年齡下限1計算）";
    else detail = "（DNA 甲基化模型）";
  } else if (model === "size") {
    // 臨床常用簡化倍數（近似）：小型4、中型5、大型6
    const multiplier = size === "small" ? 4 : size === "medium" ? 5 : 6;
    humanEquivalent = ageYears * multiplier;
    detail = `（體型換算：${size}，乘數 ${multiplier}）`;
  }

  // 顯示結果
  resultEl.innerHTML = `
    狗狗實際年齡：<span style="color:#d9534f">${ageYears}</span> 歲 <br>
    換算成人類年齡：<span style="color:#0275d8">${humanEquivalent}</span> 歲 ${detail}
  `;
}
