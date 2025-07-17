document.addEventListener('DOMContentLoaded', () => {
  const latestPostsContainer = document.getElementById('latest-posts-container');

  // Hanya jalankan jika kontainer ada di halaman
  if (!latestPostsContainer) {
    return;
  }

  const loadLatestPosts = async () => {
    try {
      // Path ke file JSON relatif terhadap index.html
      const response = await fetch('blog/posts.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let posts = await response.json();

      // Urutkan post dari yang terbaru ke terlama.
      // Dengan asumsi data di JSON diurutkan dari terlama ke terbaru, kita tinggal membaliknya.
      posts.reverse();

      // Ambil hanya 3 artikel pertama
      const latestThreePosts = posts.slice(0, 3);

      // Kosongkan kontainer
      latestPostsContainer.innerHTML = '';

      // Loop melalui 3 artikel dan buat card HTML-nya
      latestThreePosts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'bg-white rounded-lg shadow-md overflow-hidden flex flex-col';
        postCard.innerHTML = `
          <div class="p-6 flex-grow">
            <span class="inline-block ${post.category.class} text-xs font-semibold px-2.5 py-1 rounded-full mb-2">${post.category.name}</span>
            <h3 class="text-xl font-bold text-primary mb-2 leading-snug">
              <a href="blog/${post.slug}.html" class="hover:text-secondary transition-colors">${post.title}</a>
            </h3>
            <p class="text-sm text-gray-500 mb-4">${post.date}</p>
            <p class="text-gray-600 text-sm flex-grow">${post.summary}</p>
          </div>
          <div class="p-6 bg-gray-50">
            <a href="blog/${post.slug}.html" class="font-semibold text-secondary hover:underline transition-colors text-sm">Baca Selengkapnya &rarr;</a>
          </div>
        `;
        latestPostsContainer.appendChild(postCard);
      });
    } catch (error) {
      console.error('Gagal memuat artikel terbaru:', error);
      latestPostsContainer.innerHTML = '<p class="text-center text-red-500 col-span-3">Gagal memuat artikel.</p>';
    }
  };

  loadLatestPosts();
});