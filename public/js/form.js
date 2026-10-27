/**
 * Halaman Kalkulator: form interaktif dengan DOM & Event Handling.
 * Event yang dipakai: input (hasil langsung + validasi), submit, click.
 */
const form = document.getElementById("calcForm");
const resultEl = document.getElementById("result");
const historyList = document.getElementById("historyList");
const resetBtn = document.getElementById("resetBtn");
const clearBtn = document.getElementById("clearBtn");

const fields = ["nama", "harga", "jumlah", "diskon"];
const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

/** Aturan validasi tiap field. Mengembalikan pesan error, atau "" jika valid. */
const validators = {
  nama(value) {
    if (value === "") return "Nama barang wajib diisi.";
    if (value.length < 3 || value.length > 40) return "Nama harus 3-40 karakter.";
    if (!/[a-zA-Z]/.test(value)) return "Nama harus mengandung huruf.";
    return "";
  },
  harga(value) {
    if (value === "") return "Harga wajib diisi.";
    const n = Number(value);
    if (!Number.isInteger(n)) return "Harga harus berupa bilangan bulat.";
    if (n < 1000 || n > 100000000) return "Harga harus antara Rp1.000 dan Rp100.000.000.";
    return "";
  },
  jumlah(value) {
    if (value === "") return "Jumlah wajib diisi.";
    const n = Number(value);
    if (!Number.isInteger(n)) return "Jumlah harus berupa bilangan bulat.";
    if (n < 1 || n > 100) return "Jumlah harus antara 1 dan 100.";
    return "";
  },
  diskon(value) {
    if (value === "") return "Diskon wajib diisi (isi 0 jika tidak ada).";
    const n = Number(value);
    if (!Number.isInteger(n)) return "Diskon harus berupa bilangan bulat.";
    if (n < 0 || n > 90) return "Diskon harus antara 0 dan 90.";
    return "";
  },
};

/** Validasi satu field, tampilkan pesan error di bawah input. */
function validateField(id) {
  const input = document.getElementById(id);
  const message = validators[id](input.value.trim());
  document.getElementById(`${id}-error`).textContent = message;
  input.setAttribute("aria-invalid", message ? "true" : "false");
  return message === "";
}

function validateAll() {
  // map dulu supaya semua field divalidasi (tidak berhenti di yang pertama gagal)
  return fields.map(validateField).every(Boolean);
}

/** Membaca nilai form menjadi objek perhitungan. */
function calculate() {
  const nama = document.getElementById("nama").value.trim();
  const harga = Number(document.getElementById("harga").value);
  const jumlah = Number(document.getElementById("jumlah").value);
  const diskon = Number(document.getElementById("diskon").value);

  const subtotal = harga * jumlah;
  const potongan = (subtotal * diskon) / 100;
  return { nama, harga, jumlah, diskon, subtotal, potongan, total: subtotal - potongan };
}

function row(dl, label, value, className) {
  const dt = document.createElement("dt");
  dt.textContent = label;
  const dd = document.createElement("dd");
  dd.textContent = value;
  if (className) dd.className = className;
  dl.append(dt, dd);
}

/** Menampilkan hasil perhitungan pada panel hasil. */
function renderResult(data, saved) {
  const badge = document.createElement("span");
  badge.className = saved ? "badge" : "badge preview";
  badge.textContent = saved ? "Tersimpan ke riwayat" : "Pratinjau";

  const title = document.createElement("strong");
  title.textContent = data.nama;

  const dl = document.createElement("dl");
  row(dl, "Harga satuan", rupiah.format(data.harga));
  row(dl, "Jumlah", `${data.jumlah} pcs`);
  row(dl, "Subtotal", rupiah.format(data.subtotal));
  row(dl, `Diskon ${data.diskon}%`, `- ${rupiah.format(data.potongan)}`);
  row(dl, "Total bayar", rupiah.format(data.total), "total");

  const wrap = document.createElement("div");
  wrap.append(badge, document.createElement("br"), title, dl);

  resultEl.className = "result ok";
  resultEl.replaceChildren(wrap);
}

function renderEmptyResult(message) {
  resultEl.className = "result";
  resultEl.textContent = message;
}

/** Menambah satu item ke daftar riwayat. */
function addHistoryItem(data) {
  const empty = historyList.querySelector(".empty");
  if (empty) empty.remove();

  const li = document.createElement("li");
  const text = document.createElement("span");
  text.textContent = `${data.nama} x${data.jumlah} = ${rupiah.format(data.total)}`;

  const del = document.createElement("button");
  del.type = "button";
  del.textContent = "Hapus";
  del.dataset.action = "delete";

  li.append(text, del);
  historyList.prepend(li);
}

function renderEmptyHistory() {
  const li = document.createElement("li");
  li.className = "empty";
  li.textContent = "Belum ada perhitungan tersimpan.";
  historyList.replaceChildren(li);
}

/* ---------- Event listeners ---------- */

// input: validasi dan pratinjau hasil langsung saat mengetik
form.addEventListener("input", (event) => {
  if (!fields.includes(event.target.id)) return;
  validateField(event.target.id);
  const allFilled = fields.every((id) => document.getElementById(id).value.trim() !== "");
  if (allFilled && fields.every((id) => validators[id](document.getElementById(id).value.trim()) === "")) {
    renderResult(calculate(), false);
  } else {
    renderEmptyResult("Lengkapi semua kolom dengan benar untuk melihat hasil.");
  }
});

// submit: validasi penuh, lalu simpan ke riwayat
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateAll()) {
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    if (firstInvalid) firstInvalid.focus();
    renderEmptyResult("Perbaiki input yang bertanda merah terlebih dahulu.");
    return;
  }
  const data = calculate();
  renderResult(data, true);
  addHistoryItem(data);
});

// click: tombol reset
resetBtn.addEventListener("click", () => {
  form.reset();
  fields.forEach((id) => {
    document.getElementById(`${id}-error`).textContent = "";
    document.getElementById(id).removeAttribute("aria-invalid");
  });
  renderEmptyResult("Isi form di samping untuk melihat hasil perhitungan.");
  document.getElementById("nama").focus();
});

// click: tombol hapus semua riwayat
clearBtn.addEventListener("click", renderEmptyHistory);

// click: hapus satu item riwayat (event delegation)
historyList.addEventListener("click", (event) => {
  if (event.target.dataset.action !== "delete") return;
  event.target.closest("li").remove();
  if (historyList.children.length === 0) renderEmptyHistory();
});

renderEmptyHistory();
