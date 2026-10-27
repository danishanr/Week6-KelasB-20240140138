/**
 * Uji coba fetch 10 produk dari DummyJSON, hasilnya dicetak ke console.
 * Jalankan dengan: node latihan/fetch.js
 */
async function testFetchAPI() {
  const url = "https://dummyjson.com/products?limit=10";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request gagal dengan status ${response.status}`);
    }
    const data = await response.json();
    console.log("Fetch berhasil, jumlah produk:", data.products.length);
    data.products.forEach((p) => console.log(`- ${p.title}: $${p.price}`));
  } catch (error) {
    console.error("Fetch error:", error.message);
  }
}

testFetchAPI();
