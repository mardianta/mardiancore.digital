document.addEventListener('DOMContentLoaded', () => {
  const blogPostListContainer = document.getElementById('blog-post-list');

  // Pastikan elemen kontainer ada di halaman sebelum melanjutkan
  if (!blogPostListContainer) {
    console.error('Container untuk daftar blog tidak ditemukan.');
    return;
  }

  const loadBlogPosts = async () => {
    try {
      // Mengambil data dari file posts.json
      // Path 'posts.json' relatif terhadap file HTML yang memuat skrip ini
      const response = await fetch('posts.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const posts = await response.json();

      // BARU: Urutkan post berdasarkan tanggal (dari terbaru ke terlama)
      // Ini mengasumsikan format tanggal bisa di-parse. "DD MMMM YYYY" sulit di-parse langsung.
      // Untuk keandalan, kita akan membalik array saja, dengan asumsi JSON diisi dari terlama ke terbaru.
      posts.reverse();

      // Kosongkan kontainer jika ada konten placeholder
      blogPostListContainer.innerHTML = '';

      // Loop melalui setiap post dan buat elemen HTML-nya
      posts.forEach(post => {
        const articleElement = document.createElement('article');
        articleElement.innerHTML = `
          <div class="mb-2">
              <span class="inline-block ${post.category.class} text-xs font-semibold px-2.5 py-1 rounded-full">${post.category.name}</span>
          </div>
          <h2 class="text-2xl md:text-3xl font-bold text-primary mb-2 leading-snug">
              <a href="${post.slug}.html" class="hover:text-secondary transition-colors">${post.title}</a>
          </h2>
          <p class="text-sm text-gray-500 mb-4">Dipublikasikan pada ${post.date}</p>
          <p class="text-gray-600 mb-4">${post.summary}</p>
          <a href="${post.slug}.html" class="font-semibold text-secondary hover:underline transition-colors">Baca Selengkapnya &rarr;</a>
        `;
        blogPostListContainer.appendChild(articleElement);
      });
    } catch (error) {
      console.error('Gagal memuat artikel blog:', error);
      blogPostListContainer.innerHTML = '<p class="text-center text-red-500">Gagal memuat artikel. Silakan coba lagi nanti.</p>';
    }
  };

  loadBlogPosts();
});