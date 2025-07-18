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

        // Logika untuk gambar atau placeholder
        const firstLetter = post.title.charAt(0).toUpperCase();
        const imageHtml = post.image
          ? `<img 
              src="${post.image}" 
              alt="Thumbnail untuk ${post.title}" 
              class="w-32 h-32 object-cover rounded-lg flex-shrink-0" 
              loading="lazy">`
          : `<div class="w-32 h-32 rounded-lg flex-shrink-0 flex items-center justify-center bg-gray-200 text-gray-500 text-4xl font-bold">
              ${firstLetter}
            </div>`;

        articleElement.innerHTML = `
          <div class="flex flex-col sm:flex-row items-start sm:space-x-6">
            <a href="${post.slug}.html" class="block mb-4 sm:mb-0">
              ${imageHtml}
            </a>
            <div>
              <div class="mb-2">
                  <span class="inline-block ${post.category.class} text-xs font-semibold px-2.5 py-1 rounded-full">${post.category.name}</span>
              </div>
              <h2 class="text-2xl md:text-3xl font-bold text-primary mb-2 leading-snug">
                  <a href="${post.slug}.html" class="hover:text-secondary transition-colors">${post.title}</a>
              </h2>
              <p class="text-sm text-gray-500 mb-4">Dipublikasikan pada ${post.date}</p>
              <p class="text-gray-600 mb-4">${post.summary}</p>
              <a href="${post.slug}.html" class="font-semibold text-secondary hover:underline transition-colors">Baca Selengkapnya &rarr;</a>
            </div>
          </div>
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