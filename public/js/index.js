/**
 * Halaman Katalog: mengambil produk dari DummyJSON (Fetch API),
 * lalu menampilkannya lewat manipulasi DOM. Mendukung cari, filter, dan urut.
 */
const API_URL = "https://dummyjson.com/products?limit=100";

const statusEl = document.getElementById("status");
const gridEl = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const sortSelect = document.getElementById("sortSelect");

let allProducts = [];

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/** Helper membuat elemen dengan class dan teks (textContent aman dari XSS). */
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function showLoading() {
  statusEl.className = "loading";
  statusEl.textContent = "Memuat produk...";
  gridEl.replaceChildren();
}

function showError(message) {
  statusEl.className = "error";
  statusEl.textContent = `Gagal memuat data: ${message}`;
  const retry = el("button", "", "Coba Lagi");
  retry.addEventListener("click", loadProducts);
  statusEl.appendChild(retry);
}

function showInfo(message) {
  statusEl.className = "";
  statusEl.textContent = message;
}

/** Mengambil data dari API. */
async function loadProducts() {
  showLoading();
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`server membalas dengan status ${response.status}`);
    }
    const data = await response.json();
    allProducts = data.products;
    fillCategories(allProducts);
    applyFilters();
  } catch (error) {
    showError(error.message);
  }
}

function fillCategories(products) {
  const categories = [...new Set(products.map((p) => p.category))].sort();
  categorySelect.length = 1; // sisakan opsi "Semua Kategori"
  categories.forEach((cat) => {
    const option = el("option", "", cat);
    option.value = cat;
    categorySelect.appendChild(option);
  });
}

function createCard(product) {
  const card = el("article", "card");

  const img = el("img");
  img.src = product.thumbnail;
  img.alt = product.title;
  img.loading = "lazy";

  const body = el("div", "body");
  body.append(
    el("span", "category", product.category),
    el("h3", "", product.title),
    el("div", "meta", `Rating ${product.rating} · Stok ${product.stock}`),
    el("div", "price", usd.format(product.price))
  );

  card.append(img, body);
  return card;
}

/** Menyaring, mengurutkan, lalu merender produk sesuai input pengguna. */
function applyFilters() {
  const keyword = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;
  const sort = sortSelect.value;

  let result = allProducts.filter((p) => {
    const matchName = p.title.toLowerCase().includes(keyword);
    const matchCategory = category === "" || p.category === category;
    return matchName && matchCategory;
  });

  if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
  if (sort === "name-asc") result.sort((a, b) => a.title.localeCompare(b.title));

  gridEl.replaceChildren(...result.map(createCard));

  if (result.length === 0) {
    showInfo("Tidak ada produk yang cocok.");
  } else {
    showInfo(`Menampilkan ${result.length} dari ${allProducts.length} produk`);
  }
}

searchInput.addEventListener("input", applyFilters);
categorySelect.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);

loadProducts();
