document.addEventListener('DOMContentLoaded', () => {
  const postNavigationContainer = document.getElementById('post-navigation');
  if (!postNavigationContainer) {
    // Jika tidak ada kontainer navigasi, hentikan eksekusi.
    // Ini memastikan skrip tidak error di halaman yang tidak memiliki navigasi post.
    return;
  }

  // Fungsi untuk mendapatkan slug halaman saat ini dari URL
  const getCurrentSlug = () => {
    const path = window.location.pathname;
    const parts = path.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart.replace('.html', ''); // Hapus ekstensi .html
  };

  const loadPostNavigation = async () => {
    try {
      const currentSlug = getCurrentSlug();
      
      // Mengambil data dari posts.json. Path ini relatif dari halaman detail blog.
      const response = await fetch('posts.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let posts = await response.json();

      // PENTING: Mengurai dan Mengurutkan Post Berdasarkan Tanggal
      // Format "DD MMMM YYYY" perlu diubah agar JavaScript bisa mengurutkannya.
      const monthMap = { 'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3, 'Mei': 4, 'Juni': 5, 'Juli': 6, 'Agustus': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11 };
      posts.forEach(post => {
        const parts = post.date.split(' '); // ["17", "Juli", "2025"]
        post.parsedDate = new Date(parts[2], monthMap[parts[1]], parts[0]);
      });

      // Urutkan array posts dari yang terlama ke terbaru
      posts.sort((a, b) => a.parsedDate - b.parsedDate);

      // Cari index dari artikel saat ini
      const currentIndex = posts.findIndex(post => post.slug === currentSlug);

      if (currentIndex === -1) {
        console.error('Artikel saat ini tidak ditemukan di posts.json');
        return;
      }

      // Tentukan artikel sebelumnya dan selanjutnya
      const prevPost = posts[currentIndex - 1]; // Akan menjadi 'undefined' jika tidak ada
      const nextPost = posts[currentIndex + 1]; // Akan menjadi 'undefined' jika tidak ada

      let navHTML = '';

      if (prevPost) {
        navHTML += `
          <a href="${prevPost.slug}.html" class="text-left">
            <span class="text-sm text-gray-500">&larr; Artikel Sebelumnya</span>
            <p class="mt-1 font-semibold text-primary hover:text-secondary">${prevPost.title}</p>
          </a>
        `;
      }

      if (nextPost) {
        navHTML += `
          <a href="${nextPost.slug}.html" class="text-right">
            <span class="text-sm text-gray-500">Artikel Selanjutnya &rarr;</span>
            <p class="mt-1 font-semibold text-primary hover:text-secondary">${nextPost.title}</p>
          </a>
        `;
      }

      postNavigationContainer.innerHTML = navHTML;

    } catch (error) {
      console.error('Gagal memuat navigasi post:', error);
      postNavigationContainer.innerHTML = '<p class="text-center text-red-500">Gagal memuat navigasi.</p>';
    }
  };

  loadPostNavigation();
});