/* ==========================================================================
   CẤU HÌNH THÔNG TIN THIỆP CƯỚI (DỄ DÀNG THAY ĐỔI THÔNG TIN THẬT TẠI ĐÂY)
   ========================================================================== */
const WEDDING_CONFIG = {
  // 1. Tên Cô dâu & Chú rể
  groomName: "Võ Quốc Khánh",
  brideName: "Nguyễn Thị Trang",

  // 2. Thời gian tổ chức đám cưới (Mốc đầu tiên: Lễ Vu Quy tại Mộc Châu 10:00 sáng 07/11/2026)
  weddingDate: "2026-11-07T10:00:00",

  // 3. Thông tin tài khoản ngân hàng mừng cưới (01 tài khoản duy nhất)
  bankAccount: {
    bankName: "VietinBank - CN HOANG MAI - PGD LINH DAM",
    accountNumber: "102876452304",
    accountName: "NGUYEN THI TRANG",
    qrImage: "qr-bank.jpg"
  },

  // 4. Nhạc nền lãng mạn (Link MP3 trực tuyến chất lượng cao)
  // Bạn có thể thay bằng file mp3 của riêng mình hoặc để nguyên bản nhạc piano lãng mạn này
  musicUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=wedding-piano-112186.mp3",

  // 5. API danh sách lời chúc từ khách mời (Google Sheets Apps Script)
  wishesApiUrl: "https://script.google.com/macros/s/AKfycbwGxKHBTKtrr1kmOle3N--rPlbw3dbef3wt6uLP0ossGeKPVRDAXD6ddwc_z-7MUx4Z/exec"
};

/* ==========================================================================
   DANH SÁCH ẢNH TRONG ALBUM (LIGHTBOX GALLERY)
   Bạn có thể thay đổi link ảnh và chú thích tại đây
   ========================================================================== */
const GALLERY_IMAGES = [
  {
    url: "images/anh-cuoi-1.jpg",
    caption: ""
  },
  {
    url: "images/anh-cuoi-2.jpg",
    caption: ""
  },
  {
    url: "images/anh-cuoi-3.jpg",
    caption: ""
  },
  {
    url: "images/anh-cuoi-4.jpg",
    caption: ""
  },
  {
    url: "images/anh-cuoi-5.jpg",
    caption: ""
  },
  {
    url: "images/anh-cuoi-6.jpg",
    caption: ""
  },
  {
    url: "images/anh-cuoi-7.jpg",
    caption: ""
  },
  {
    url: "images/anh-cuoi-8.jpg",
    caption: ""
  }
];

/* ==========================================================================
   1. KHỞI TẠO THƯ VIỆN AOS (ANIMATE ON SCROLL)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 850,
      once: true,
      offset: 80,
      easing: "ease-out-cubic"
    });
  }

  // Khởi động bìa thiệp trước (khóa cuộn, chờ người dùng mở)
  initWeddingCover();

  // Khởi động các tính năng
  initCountdown();
  initPetalsCanvas();
  initAudioPlayer();
  initRSVPFeed();
  initMobileMenu();
});

/* ==========================================================================
   2. BỘ ĐẾM NGƯỢC THỜI GIAN THỰC (COUNTDOWN TIMER)
   ========================================================================== */
function initCountdown() {
  const targetTime = new Date(WEDDING_CONFIG.weddingDate).getTime();

  function update() {
    const now = new Date().getTime();
    const diff = targetTime - now;

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (diff <= 0) {
      if (daysEl) daysEl.innerText = "00";
      if (hoursEl) hoursEl.innerText = "00";
      if (minutesEl) minutesEl.innerText = "00";
      if (secondsEl) secondsEl.innerText = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = String(days).padStart(2, "0");
    if (hoursEl) hoursEl.innerText = String(hours).padStart(2, "0");
    if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, "0");
    if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   3. HIỆU ỨNG CÁNH HOA & LÁ RƠI NHẸ NHÀNG (FALLING PETALS CANVAS)
   ========================================================================== */
function initPetalsCanvas() {
  const canvas = document.getElementById("petals-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Mảng màu sắc của cánh hoa và lá (Màu be hồng nhạt, hồng phấn, xanh sage pastel)
  const petalColors = [
    "rgba(247, 219, 216, 0.75)", // Hồng hoa đào
    "rgba(255, 235, 230, 0.70)", // Cánh hoa kem sữa
    "rgba(235, 203, 196, 0.65)", // Hồng đất nhẹ
    "rgba(197, 168, 128, 0.50)", // Vàng champagne lấp lánh
    "rgba(143, 151, 121, 0.45)"  // Xanh sage lá cây
  ];

  const totalPetals = window.innerWidth < 768 ? 22 : 40; // Giảm số lượng trên mobile để mượt mà
  const petals = [];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 8 + 6;
      this.speedY = Math.random() * 1.2 + 0.6;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.rotation = Math.random() * 360;
      this.rotSpeed = Math.random() * 1.5 - 0.75;
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
      this.swingAngle = Math.random() * Math.PI * 2;
      this.swingSpeed = Math.random() * 0.02 + 0.01;
    }

    update() {
      this.swingAngle += this.swingSpeed;
      this.x += Math.sin(this.swingAngle) * 0.8 + this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotSpeed;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);

      ctx.beginPath();
      // Vẽ hình dạng cánh hoa uốn lượn tự nhiên
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(this.size, -this.size / 2, this.size, this.size, 0, this.size * 1.4);
      ctx.bezierCurveTo(-this.size, this.size, -this.size, -this.size / 2, 0, 0);

      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < totalPetals; i++) {
    petals.push(new Petal());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   4. TRÌNH PHÁT NHẠC NỀN LÃNG MẠN (AUDIO PLAYER)
   ========================================================================== */
function initAudioPlayer() {
  const bgMusic = document.getElementById("bg-music");
  const btn = document.getElementById("music-toggle-btn");
  const disc = document.getElementById("music-disc-spin");
  const icon = document.getElementById("music-icon");
  const text = document.getElementById("music-status-text");

  if (!bgMusic || !btn) return;

  let isPlaying = false;

  /* ── Cập nhật giao diện theo trạng thái phát / dừng ── */
  function updateUI(playing) {
    isPlaying = playing;

    if (playing) {
      // Đĩa xoay
      if (disc) disc.classList.remove("spin-paused");
      // Nút – thêm class is-playing để pulse + icon đổi màu
      btn.classList.add("is-playing");
      // Icon đổi thành compact disc
      if (icon) {
        icon.className = "fa-solid fa-compact-disc music-note-icon";
      }
      if (text) text.textContent = "Đang phát nhạc";
    } else {
      // Đĩa dừng
      if (disc) disc.classList.add("spin-paused");
      btn.classList.remove("is-playing");
      // Icon trở về nốt nhạc
      if (icon) {
        icon.className = "fa-solid fa-music music-note-icon";
      }
      if (text) text.textContent = "Bật nhạc lãng mạn";
    }
  }

  /* ── Nút click: toggle play / pause ── */
  function toggleMusic() {
    if (isPlaying) {
      bgMusic.pause();
      updateUI(false);
    } else {
      bgMusic.play()
        .then(() => updateUI(true))
        .catch(() => {
          console.log("Trình duyệt chặn autoplay – cần tương tác của người dùng.");
        });
    }
  }

  btn.addEventListener("click", toggleMusic);

  /* ── Autoplay Handling: phát nhạc ngay khi người dùng
        lần đầu click, scroll hoặc chạm vào trang ── */
  function startAutoplay() {
    if (!isPlaying) {
      bgMusic.play()
        .then(() => updateUI(true))
        .catch(() => { });
    }
    // Gỡ listener sau lần đầu tiên
    ["click", "scroll", "touchstart"].forEach(evt =>
      window.removeEventListener(evt, startAutoplay)
    );
  }

  ["click", "scroll", "touchstart"].forEach(evt =>
    window.addEventListener(evt, startAutoplay, { once: true, passive: true })
  );

  // Đặt đĩa ở trạng thái paused lúc đầu (chưa phát)
  if (disc) disc.classList.add("spin-paused");
}

/* ==========================================================================
   5. XỬ LÝ ALBUM ẢNH LIGHTBOX (POPUP PHÓNG TO ẢNH)
   ========================================================================== */
let currentImageIndex = 0;

function openLightbox(index) {
  const modal = document.getElementById("lightbox-modal");
  const img = document.getElementById("lightbox-img");
  const caption = document.getElementById("lightbox-caption");

  if (!modal || !img || !GALLERY_IMAGES[index]) return;

  currentImageIndex = index;
  img.src = GALLERY_IMAGES[index].url;
  if (caption) caption.innerText = GALLERY_IMAGES[index].caption;

  modal.classList.remove("hidden");
  setTimeout(() => {
    modal.classList.add("active");
  }, 10);
  document.body.style.overflow = "hidden"; // Ngăn cuộn trang
}

function closeLightbox() {
  const modal = document.getElementById("lightbox-modal");
  if (!modal) return;

  modal.classList.remove("active");
  setTimeout(() => {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }, 300);
}

function nextLightboxImage() {
  currentImageIndex = (currentImageIndex + 1) % GALLERY_IMAGES.length;
  updateLightboxContent();
}

function prevLightboxImage() {
  currentImageIndex = (currentImageIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
  updateLightboxContent();
}

function updateLightboxContent() {
  const img = document.getElementById("lightbox-img");
  const caption = document.getElementById("lightbox-caption");
  if (!img) return;

  img.style.opacity = "0.4";
  setTimeout(() => {
    img.src = GALLERY_IMAGES[currentImageIndex].url;
    if (caption) caption.innerText = GALLERY_IMAGES[currentImageIndex].caption;
    img.style.opacity = "1";
  }, 150);
}

// Bắt sự kiện phím mũi tên và ESC để điều khiển Lightbox
window.addEventListener("keydown", (e) => {
  const modal = document.getElementById("lightbox-modal");
  if (!modal || modal.classList.contains("hidden")) return;

  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") nextLightboxImage();
  if (e.key === "ArrowLeft") prevLightboxImage();
});

/* ==========================================================================
   6. HỘP MỪNG CƯỚI (QR CODE & BANKING MODAL)
   ========================================================================== */
function openGiftModal() {
  const modal = document.getElementById("gift-modal");
  if (!modal) return;

  modal.classList.remove("hidden");
  setTimeout(() => {
    modal.classList.add("active");
  }, 10);
  document.body.style.overflow = "hidden";
}

function closeGiftModal() {
  const modal = document.getElementById("gift-modal");
  if (!modal) return;

  modal.classList.remove("active");
  setTimeout(() => {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }, 300);
}

// Đóng modal khi bấm ra ngoài vùng nội dung
window.addEventListener("click", (e) => {
  const giftModal = document.getElementById("gift-modal");
  if (e.target === giftModal) {
    closeGiftModal();
  }
});

/* ==========================================================================
   6.5. HỘP LIÊN HỆ THIẾT KẾ THIỆP (CONTACT MODAL)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {
  const contactModal = document.getElementById('contact-modal');
  const openBtns = [
    document.getElementById('contact-nav-btn'),
    document.getElementById('contact-mobile-nav-btn'),
    document.getElementById('contact-footer-btn')
  ];
  const closeBtn = document.getElementById('close-contact-modal');

  openBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (contactModal) {
          contactModal.classList.remove('hidden');
          contactModal.classList.add('flex');
        }
      });
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      contactModal.classList.add('hidden');
      contactModal.classList.remove('flex');
    });
  }

  if (contactModal) {
    contactModal.addEventListener('click', function (e) {
      if (e.target === contactModal) {
        contactModal.classList.add('hidden');
        contactModal.classList.remove('flex');
      }
    });
  }
});

// Sao chép số tài khoản vào bộ nhớ tạm (Clipboard)
function copyToClipboard(text, btnElement) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showCopySuccess(btnElement);
    }).catch(() => {
      fallbackCopyText(text, btnElement);
    });
  } else {
    fallbackCopyText(text, btnElement);
  }
}

function fallbackCopyText(text, btnElement) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    showCopySuccess(btnElement);
  } catch (err) {
    showToast("Thông báo", "Không thể sao chép, bạn vui lòng copy thủ công nhé!");
  }
  document.body.removeChild(textarea);
}

function showCopySuccess(btnElement) {
  if (!btnElement) return;
  const originalHTML = btnElement.innerHTML;
  btnElement.innerHTML = `<i class="fa-solid fa-check text-green-600"></i> <span class="text-green-700">Đã sao chép!</span>`;
  showToast("Thành công", "Đã sao chép số tài khoản vào bộ nhớ tạm!");
  setTimeout(() => {
    btnElement.innerHTML = originalHTML;
  }, 2500);
}

/* ==========================================================================
   7. XÁC NHẬN THAM DỰ (FORM RSVP) & SỔ LƯU BÚT LỜI CHÚC (API GOOGLE SHEETS)
   ========================================================================== */
const STORAGE_KEY = "wedding_wishes_v3_mocchau_muine";

// Bộ nhớ cache tạm thời danh sách lời chúc
let currentWishesList = [];

// Hàm định dạng ngày giờ gửi lời chúc trang nhã
function formatWishTime(timeStr) {
  if (!timeStr) return "Vừa xong";

  const str = String(timeStr).trim();

  // Kiểm tra nếu là dạng DD/MM/YYYY hoặc DD/MM/YYYY HH:mm:ss
  const vnMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (vnMatch) {
    const [, d, m, y, h, min] = vnMatch;
    return h
      ? `${h.padStart(2, "0")}:${min.padStart(2, "0")} • ${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`
      : `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
  }

  // Thử parse Date chuẩn Javascript
  const parsedDate = new Date(str);
  if (!isNaN(parsedDate.getTime())) {
    const hours = String(parsedDate.getHours()).padStart(2, "0");
    const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const year = parsedDate.getFullYear();
    return `${hours}:${minutes} • ${day}/${month}/${year}`;
  }

  // Fallback loại bỏ hậu tố múi giờ dài dòng nếu có
  return str.replace(/\s*\(.*?\)\s*/g, "").replace(/GMT\+\d{4}/, "").trim();
}

// Khởi tạo sổ lưu bút & nạp dữ liệu từ API
function initRSVPFeed() {
  fetchWishesFromAPI();
}

// Gọi API Google Sheets nạp danh sách lời chúc
async function fetchWishesFromAPI() {
  const feed = document.getElementById("wishes-feed");
  const countEl = document.getElementById("wishes-count");

  // Hiển thị trạng thái đang tải nếu danh sách hiện đang trống
  if (currentWishesList.length === 0) {
    if (countEl) countEl.innerText = "Đang tải...";
    if (feed) {
      feed.innerHTML = `
        <div id="wishes-loading" class="text-center py-10 text-slateMuted flex flex-col items-center justify-center gap-2.5">
          <div class="w-10 h-10 rounded-full bg-warmBeige text-champagneDark flex items-center justify-center border border-champagne/30 animate-spin">
            <i class="fa-solid fa-circle-notch text-lg"></i>
          </div>
          <p class="text-xs uppercase tracking-wider text-champagneDark font-medium">Đang tải lời chúc từ khách mời...</p>
        </div>
      `;
    }
  }

  try {
    const apiUrl = (typeof WEDDING_CONFIG !== "undefined" && WEDDING_CONFIG.wishesApiUrl)
      ? WEDDING_CONFIG.wishesApiUrl
      : "https://script.google.com/macros/s/AKfycbwGxKHBTKtrr1kmOle3N--rPlbw3dbef3wt6uLP0ossGeKPVRDAXD6ddwc_z-7MUx4Z/exec";

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const list = Array.isArray(data) ? data : (data.value || []);

    // Đảo ngược mảng để lời chúc mới nhất (dòng cuối trên Google Sheet) xuất hiện ở trên cùng
    currentWishesList = [...list].reverse();

    // Lưu vào localStorage làm bộ nhớ đệm dự phòng
    try {
      localStorage.setItem("wedding_api_wishes_cache", JSON.stringify(currentWishesList));
    } catch (e) { }

    renderWishes(currentWishesList);
  } catch (error) {
    console.warn("Lỗi khi tải lời chúc từ API, chuyển sang dùng bộ nhớ đệm:", error);

    // Sử dụng bộ nhớ đệm nếu có
    const cached = JSON.parse(localStorage.getItem("wedding_api_wishes_cache") || "[]");
    if (cached && cached.length > 0) {
      currentWishesList = cached;
      renderWishes(currentWishesList);
    } else {
      if (countEl) countEl.innerText = "0 lời chúc";
      if (feed) {
        feed.innerHTML = `
          <div class="text-center py-8 px-4 bg-white/70 rounded-2xl border border-beigeLight text-slateMuted text-sm space-y-2">
            <p class="text-charcoal font-medium">Chưa thể kết nối đến máy chủ lời chúc.</p>
            <p class="text-xs text-slateMuted">Bạn vẫn có thể gửi lời chúc qua biểu mẫu bên trên nhé!</p>
            <button onclick="fetchWishesFromAPI()" class="mt-2 px-4 py-1.5 text-xs rounded-full bg-warmBeige text-champagneDark hover:bg-champagne hover:text-white transition-all font-medium inline-flex items-center gap-1.5 shadow-sm">
              <i class="fa-solid fa-rotate-right"></i> Thử tải lại
            </button>
          </div>
        `;
      }
    }
  }
}

// Tạo DOM Element cho từng thẻ lời chúc bám sát 100% template và style thiệp cưới
function createWishCardElement(item) {
  const initial = (item.name || "K").trim().charAt(0).toUpperCase();
  const name = item.name || "Khách mời ẩn danh";
  const formattedTime = formatWishTime(item.time);
  const message = item.message || item.wishes || "";
  const side = item.side || item.weddingParty || "Khách mời chúc phúc";

  const template = document.getElementById("wish-card-template");
  if (template && template.content && template.content.firstElementChild) {
    const clone = template.content.firstElementChild.cloneNode(true);
    const avatarEl = clone.querySelector(".wish-avatar");
    const nameEl = clone.querySelector(".wish-name");
    const timeEl = clone.querySelector(".wish-time-text");
    const tagEl = clone.querySelector(".wish-tag");
    const msgEl = clone.querySelector(".wish-message");

    if (avatarEl) avatarEl.textContent = initial;
    if (nameEl) nameEl.textContent = name;
    if (timeEl) timeEl.textContent = formattedTime;
    if (tagEl) {
      tagEl.innerHTML = `<i class="fa-solid fa-heart text-[8px] mr-1 text-roseGold"></i>${escapeHTML(side)}`;
    }
    if (msgEl) msgEl.textContent = message;
    return clone;
  }

  // Fallback cấu trúc thẻ đồng bộ
  const card = document.createElement("div");
  card.className = "bg-white p-4 sm:p-5 rounded-2xl border border-beigeLight shadow-sm flex items-start gap-4 hover:border-champagne/40 transition-colors";
  card.innerHTML = `
    <div class="wish-avatar w-10 h-10 rounded-full bg-warmBeige text-champagneDark font-bold flex items-center justify-center flex-shrink-0 border border-champagne/30 text-sm shadow-sm">
      ${escapeHTML(initial)}
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex flex-wrap items-center justify-between gap-1 mb-1">
        <h4 class="wish-name font-serif font-bold text-charcoal text-sm sm:text-base">${escapeHTML(name)}</h4>
        <span class="wish-time text-[11px] text-slateMuted flex items-center gap-1">
          <i class="fa-regular fa-clock text-[10px] text-champagne"></i>
          <span class="wish-time-text">${escapeHTML(formattedTime)}</span>
        </span>
      </div>
      <div class="wish-tag-wrap flex flex-wrap items-center gap-1 mb-2">
        <span class="wish-tag inline-block text-[10px] px-2 py-0.5 rounded-full bg-warmBeige text-champagneDark font-medium">
          <i class="fa-solid fa-heart text-[8px] mr-1 text-roseGold"></i>${escapeHTML(side)}
        </span>
      </div>
      <p class="wish-message text-sm text-slateMuted leading-relaxed whitespace-pre-line">${escapeHTML(message)}</p>
    </div>
  `;
  return card;
}

// Render toàn bộ danh sách thẻ lời chúc vào DOM
function renderWishes(list = currentWishesList) {
  const feed = document.getElementById("wishes-feed");
  const countEl = document.getElementById("wishes-count");
  if (!feed) return;

  if (countEl) {
    countEl.innerText = `${list.length} lời chúc`;
  }

  if (!list || list.length === 0) {
    feed.innerHTML = `
      <div class="text-center py-10 px-4 bg-white/60 rounded-2xl border border-beigeLight text-slateMuted italic text-sm">
        <i class="fa-regular fa-comment-dots text-2xl text-champagne/60 block mb-2"></i>
        Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc phúc đến cô dâu & chú rể nhé!
      </div>
    `;
    return;
  }

  feed.innerHTML = "";
  const fragment = document.createDocumentFragment();

  list.forEach(item => {
    const cardEl = createWishCardElement(item);
    fragment.appendChild(cardEl);
  });

  feed.appendChild(fragment);
}

function handleRSVPSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById("guest-name");
  const phoneInput = document.getElementById("guest-phone");
  const sideInput = document.getElementById("guest-side");
  const countInput = document.getElementById("guest-count");
  const wishesInput = document.getElementById("guest-wishes");
  const submitBtn = document.getElementById("submit-btn");

  const name = nameInput ? nameInput.value.trim() : "";
  const phone = phoneInput ? phoneInput.value.trim() : "";
  const side = sideInput ? sideInput.value : "";
  const count = countInput ? countInput.value : "";
  const wishes = wishesInput ? wishesInput.value.trim() : "";

  // Lấy các địa điểm được khách mời tích chọn
  const selectedEvents = Array.from(document.querySelectorAll('input[name="rsvp-event"]:checked')).map(cb => cb.value);

  if (!name || !wishes) {
    showToast("Chú ý", "Vui lòng nhập họ tên và lời chúc phúc của bạn nhé!");
    return;
  }

  // Đổi trạng thái nút gửi
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang gửi...';
  }

  const payload = {
    name: name,
    phone: phone,
    weddingParty: side + (selectedEvents.length > 0 ? (" - " + selectedEvents.join(', ')) : ""),
    guests: count,
    message: wishes
  };

  fetch("https://script.google.com/macros/s/AKfycbw9p62pw-cHWpVgb9fzFoUQoYpHpM_0s3tzAd0OrLCtwqp4F5vO6Hx3tAZCgSTycg/exec", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(() => {
      // Đưa lời chúc mới lên đầu danh sách để hiển thị ngay tức thì (Optimistic UI)
      const newWish = {
        name: name,
        side: side,
        count: count,
        events: selectedEvents.length > 0 ? selectedEvents : ["Chưa chọn địa điểm"],
        message: wishes,
        wishes: wishes,
        time: "Vừa xong"
      };

      currentWishesList.unshift(newWish);
      renderWishes(currentWishesList);

      // Bắn pháo hoa giấy chúc mừng (Confetti)
      if (typeof confetti === "function") {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#D4A373", "#C5A880", "#8F9779", "#F7F3EB"]
        });
      }

      showToast("Cảm ơn bạn!", "Cảm ơn bạn đã xác nhận tham dự và gửi lời chúc phúc!");
      document.getElementById("rsvp-form").reset();

      // Cuộn êm ái lên đầu danh sách lời chúc
      const feed = document.getElementById("wishes-feed");
      if (feed) {
        feed.scrollTo({ top: 0, behavior: "smooth" });
      }

      // Sau 3.5 giây, tự động gọi API nạp lại dữ liệu đồng bộ với Google Sheets
      setTimeout(() => {
        fetchWishesFromAPI();
      }, 3500);
    })
    .catch(error => {
      console.error("Lỗi khi gửi form:", error);
      showToast("Có lỗi xảy ra", "Vui lòng thử lại sau.");
    })
    .finally(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Gửi Xác Nhận & Lời Chúc';
      }
    });
}

function escapeHTML(str) {
  if (!str) return "";
  return str.replace(/[&<>'"]/g,
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

/* ==========================================================================
   8. THÔNG BÁO TOAST THÀNH CÔNG (TOAST NOTIFICATION)
   ========================================================================= */
let toastTimeout = null;

function showToast(title, message) {
  const toast = document.getElementById("toast");
  const toastTitle = document.getElementById("toast-title");
  const toastMsg = document.getElementById("toast-msg");

  if (!toast) return;

  if (toastTitle) toastTitle.innerText = title;
  if (toastMsg) toastMsg.innerText = message;

  toast.classList.add("show");

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

/* ==========================================================================
   9. TÍNH NĂNG "THÊM VÀO LỊCH" (GOOGLE CALENDAR & .ICS)
   ========================================================================= */
function addToCalendar(eventType) {
  let title = "Đám Cưới Võ Quốc Khánh & Nguyễn Thị Trang";
  let details = "";
  let location = "";
  let startDate = "";
  let endDate = "";

  if (eventType === "vuquy") {
    title = "[Lễ Vu Quy & Lễ Cưới] Võ Quốc Khánh & Nguyễn Thị Trang";
    details = "Lễ Cưới tại Nhà Thờ (19:30 05/11), Lễ Dạm Ngõ & Ăn Hỏi (06/11), Tiệc Cưới Mừng Nhà Gái (09:00 - 12:00 07/11/2026) tại Mộc Châu, Sơn La. Trân trọng kính mời quý khách!";
    location = "Bản Long Phú, Phường Mộc Châu, Tỉnh Sơn La";
    startDate = "20261107T020000Z"; // 09:00 GMT+7 = 02:00 UTC
    endDate = "20261107T050000Z";   // 12:00 GMT+7 = 05:00 UTC
  } else {
    title = "[Lễ Thành Hôn & Lễ Gia Tiên] Võ Quốc Khánh & Nguyễn Thị Trang";
    details = "Tiệc Cưới & Lễ Gia Tiên tại Nhà Hàng Hoàng Phát 2 (17:30 ngày 14/11/2026). Trân trọng kính mời quý khách!";
    location = "Nhà Hàng Hoàng Phát 2 - 281B Nguyễn Đình Chiểu, Phường Mũi Né, Tỉnh Lâm Đồng";
    startDate = "20261114T103000Z"; // 17:30 ngày 14/11 GMT+7 = 10:30 UTC
    endDate = "20261114T140000Z";   // 21:00 ngày 14/11 GMT+7 = 14:00 UTC
  }

  // Mở Google Calendar link trực tiếp
  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;

  window.open(googleCalUrl, "_blank");
  showToast("Đã mở lịch", "Đang chuyển tiếp đến ứng dụng Lịch của bạn...");
}

/* ==========================================================================
   10. MENU MOBILE (RESPONSIVE NAVBAR)
   ========================================================================= */
function initMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");
  const links = document.querySelectorAll(".mobile-nav-link");

  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });

  // Tự động đóng menu khi người dùng bấm vào một mục bất kỳ
  links.forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.add("hidden");
    });
  });
}

/* ==========================================================================
   11. MÀN HÌNH BÌA THIỆP CƯỚI (INVITATION COVER ENVELOPE)
   ========================================================================= */
function initWeddingCover() {
  const cover = document.getElementById("wedding-cover");
  if (!cover) return;

  // Khoá cuộn trang khi bìa thiệp đang hiển thị
  document.body.style.overflow = "hidden";

  /* ── Hàm mở thiệp ── */
  function openInvitation() {
    // 1. Bắt đầu animation biến mất (fade-out + slide-up)
    cover.classList.add("is-closing");

    // 2. Phát nhạc nền ngay lập tức (bỏ qua autoplay restriction
    //    vì đây là hành động trực tiếp của người dùng)
    const bgMusic = document.getElementById("bg-music");
    if (bgMusic) {
      bgMusic.play()
        .then(() => {
          // Cập nhật UI nút nhạc về trạng thái đang phát
          const btn = document.getElementById("music-toggle-btn");
          const disc = document.getElementById("music-disc-spin");
          const icon = document.getElementById("music-icon");
          const text = document.getElementById("music-status-text");

          if (btn) btn.classList.add("is-playing");
          if (disc) disc.classList.remove("spin-paused");
          if (icon) icon.className = "fa-solid fa-compact-disc music-note-icon";
          if (text) text.textContent = "Đang phát nhạc";
        })
        .catch(() => {
          // Trình duyệt vẫn từ chối – sẽ được xử lý bởi autoplay listener
          console.log("Autoplay bị từ chối – người dùng cần tương tác thêm.");
        });
    }

    // 3. Sau khi animation kết thúc (850ms) → ẩn hoàn toàn + cho phép cuộn
    setTimeout(() => {
      cover.style.display = "none";
      document.body.style.overflow = "";   // Mở khoá cuộn trang
    }, 900); // thêm 50ms đệm an toàn
  }

  /* ── Bắt sự kiện Click / Touch ── */
  cover.addEventListener("click", openInvitation, { once: true });
  cover.addEventListener("touchend", (e) => {
    e.preventDefault(); // Chặn ghost click trên mobile
    openInvitation();
  }, { once: true, passive: false });

  /* ── Phím tắt: Enter hoặc Space ── */
  cover.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openInvitation();
    }
  }, { once: true });
}
