document.addEventListener('DOMContentLoaded', () => {
  const sidebarContainer = document.getElementById('recent-posts-sidebar');
  if (!sidebarContainer) return;

  // Fungsi untuk mendapatkan slug halaman saat ini dari URL
  const getCurrentSlug = () => {
    const path = window.location.pathname;
    const parts = path.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart.replace('.html', '');
  };

  const loadRecentPosts = async () => {
    try {
      const currentSlug = getCurrentSlug();
      // Menggunakan path absolut dari root domain agar konsisten
      const response = await fetch('/blog/posts.json'); 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let posts = await response.json();

      // Mengurai dan mengurutkan tanggal (terbaru lebih dulu)
      const monthMap = { 'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3, 'Mei': 4, 'Juni': 5, 'Juli': 6, 'Agustus': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11 };
      posts.forEach(post => {
        const parts = post.date.split(' ');
        post.parsedDate = new Date(parts[2], monthMap[parts[1]], parts[0]);
      });
      posts.sort((a, b) => b.parsedDate - a.parsedDate);

      // Saring artikel saat ini dan ambil 4 artikel terbaru lainnya
      const recentPosts = posts.filter(post => post.slug !== currentSlug).slice(0, 4);

      if (recentPosts.length === 0) {
        sidebarContainer.innerHTML = '<p class="text-gray-500">Tidak ada artikel terbaru lainnya.</p>';
        return;
      }

      const postsHTML = recentPosts.map(post => {
        const firstLetter = post.title.charAt(0).toUpperCase();
        
        // Cek jika post.image ada dan tidak kosong. Jika tidak, buat placeholder.
        const imageHtml = post.image
          ? `<img 
              src="${post.image}" 
              alt="Thumbnail untuk ${post.title}" 
              class="w-16 h-16 object-cover rounded-md flex-shrink-0" 
              loading="lazy">`
          : `<div class="w-16 h-16 rounded-md flex-shrink-0 flex items-center justify-center bg-gray-200 text-gray-500 text-2xl font-bold">
              ${firstLetter}
            </div>`;

        return `
          <a href="${post.slug}.html" class="flex items-start space-x-4 group">
            ${imageHtml}
            <div>
              <p class="font-semibold text-primary group-hover:text-secondary transition-colors leading-tight">${post.title}</p>
              <p class="text-sm text-gray-500 mt-1">${post.date}</p>
            </div>
          </a>`;
      }).join('');

      sidebarContainer.innerHTML = postsHTML;

    } catch (error) {
      console.error('Gagal memuat artikel terbaru untuk sidebar:', error);
      sidebarContainer.innerHTML = '<p class="text-red-500">Gagal memuat artikel.</p>';
    }
  };

  loadRecentPosts();
});