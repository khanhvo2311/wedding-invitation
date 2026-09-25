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
  musicUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=wedding-piano-112186.mp3"
};

/* ==========================================================================
   DANH SÁCH ẢNH TRONG ALBUM (LIGHTBOX GALLERY)
   Bạn có thể thay đổi link ảnh và chú thích tại đây
   ========================================================================== */
const GALLERY_IMAGES = [
  {
    url: "images/gallery-1.jpg",
    caption: "Lời hẹn ước trăm năm - Hoàng hôn ngọt ngào"
  },
  {
    url: "images/gallery-2.jpg",
    caption: "Nụ cười rạng rỡ trong ngày vui trọng đại"
  },
  {
    url: "images/gallery-3.jpg",
    caption: "Khoảnh khắc dịu dàng bên nhau"
  },
  {
    url: "images/gallery-4.jpg",
    caption: "Cùng nhau ngắm nhìn tương lai phía trước"
  },
  {
    url: "images/gallery-5.jpg",
    caption: "Chiếc váy cưới trắng tinh khôi và nụ cười hạnh phúc"
  },
  {
    url: "images/gallery-6.jpg",
    caption: "Nắm tay em đi qua mọi cung đường yêu thương"
  },
  {
    url: "images/gallery-7.jpg",
    caption: "Góc phố quen - Nơi bắt đầu một câu chuyện đẹp"
  },
  {
    url: "images/gallery-8.jpg",
    caption: "Và chúng mình sẽ luôn mỉm cười như ngày hôm nay"
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
  const btn     = document.getElementById("music-toggle-btn");
  const disc    = document.getElementById("music-disc-spin");
  const icon    = document.getElementById("music-icon");
  const text    = document.getElementById("music-status-text");

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
        .catch(() => {});
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
  const contactModal = document.getElementById("contact-modal");
  if (e.target === giftModal) {
    closeGiftModal();
  }
  if (e.target === contactModal) {
    closeContactModal();
  }
});

/* ==========================================================================
   6.5. HỘP LIÊN HỆ THIẾT KẾ THIỆP (CONTACT MODAL)
   ========================================================================== */
function openContactModal() {
  const modal = document.getElementById("contact-modal");
  if (!modal) return;

  modal.classList.remove("hidden");
  setTimeout(() => {
    modal.classList.add("active");
  }, 10);
  document.body.style.overflow = "hidden";
}

function closeContactModal() {
  const modal = document.getElementById("contact-modal");
  if (!modal) return;

  modal.classList.remove("active");
  setTimeout(() => {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }, 300);
}

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
   7. XÁC NHẬN THAM DỰ (FORM RSVP) & SỔ LƯU BÚT LOCALSTORAGE
   ========================================================================== */
const STORAGE_KEY = "wedding_wishes_v3_mocchau_muine";

// Dữ liệu lời chúc mẫu ban đầu để sổ lưu bút luôn ấm áp
const DEFAULT_WISHES = [
  {
    name: "Phương Linh & Hoàng Nam",
    side: "Bạn chung cả hai",
    events: ["Tiệc Nhà Gái (Lễ Vu Quy - Mộc Châu, Sơn La)"],
    wishes: "Chúc hai bạn trăm năm hạnh phúc, răng long đầu bạc và luôn yêu thương nhau như ngày đầu nhé!",
    time: "2 giờ trước"
  },
  {
    name: "Bác Tuấn (Họ Nhà Gái)",
    side: "Nhà Gái (Thị Trang)",
    events: ["Tiệc Nhà Gái (Lễ Vu Quy - Mộc Châu, Sơn La)"],
    wishes: "Chúc mừng hạnh phúc hai cháu Khánh & Trang. Chúc gia đình nhỏ luôn rộn rã tiếng cười và ngập tràn niềm vui nơi cao nguyên Mộc Châu!",
    time: "Hôm qua"
  },
  {
    name: "Anh Đức (CLB Nhiếp Ảnh)",
    side: "Nhà Trai (Quốc Khánh)",
    events: ["Tiệc Nhà Trai (Lễ Cưới - Mũi Né, Lâm Đồng)"],
    wishes: "Hẹn gặp lại hai bạn tại Mũi Né nhé! Chúc chú rể bảnh bao của chúng ta luôn hạnh phúc viên mãn bên người bạn đời tuyệt vời!",
    time: "2 ngày trước"
  }
];

function initRSVPFeed() {
  let stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_WISHES));
  }
  renderWishes();
}

function renderWishes() {
  const feed = document.getElementById("wishes-feed");
  const countEl = document.getElementById("wishes-count");
  if (!feed) return;

  const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  if (countEl) {
    countEl.innerText = `${list.length} lời chúc`;
  }

  if (list.length === 0) {
    feed.innerHTML = `
      <div class="text-center py-8 text-slateMuted italic text-sm">
        Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc phúc đến cô dâu & chú rể nhé!
      </div>
    `;
    return;
  }

  feed.innerHTML = list.map((item) => {
    // Lấy ký tự đầu tiên của tên làm Avatar
    const initial = (item.name || "K").trim().charAt(0).toUpperCase();
    const eventBadges = Array.isArray(item.events) && item.events.length > 0 
      ? item.events.map(ev => `<span class="inline-block text-[10px] px-2 py-0.5 rounded-full bg-sageLight text-sageDark font-medium mr-1"><i class="fa-solid fa-location-dot text-[9px] mr-1"></i>${escapeHTML(ev)}</span>`).join("")
      : "";
    return `
      <div class="bg-white p-4 sm:p-5 rounded-2xl border border-beigeLight shadow-sm flex items-start gap-4 hover:border-champagne/40 transition-colors">
        <div class="w-10 h-10 rounded-full bg-warmBeige text-champagneDark font-bold flex items-center justify-center flex-shrink-0 border border-champagne/30 text-sm">
          ${initial}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap items-center justify-between gap-1 mb-1">
            <h4 class="font-serif font-bold text-charcoal text-sm">${escapeHTML(item.name)}</h4>
            <span class="text-[11px] text-slateMuted">${escapeHTML(item.time || "Vừa xong")}</span>
          </div>
          <div class="flex flex-wrap items-center gap-1 mb-2">
            <span class="inline-block text-[10px] px-2 py-0.5 rounded-full bg-warmBeige text-champagneDark font-medium">
              ${escapeHTML(item.side || "Khách mời")}
            </span>
            ${eventBadges}
          </div>
          <p class="text-sm text-slateMuted leading-relaxed">${escapeHTML(item.wishes)}</p>
        </div>
      </div>
    `;
  }).join("");
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
    // Vẫn lưu vào localstorage để hiển thị trên web
    const newWish = {
      name: name,
      side: side,
      count: count,
      events: selectedEvents.length > 0 ? selectedEvents : ["Chưa chọn địa điểm"],
      wishes: wishes,
      time: "Vừa xong"
    };

    const currentList = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    currentList.unshift(newWish);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentList));

    // Bắn pháo hoa giấy chúc mừng (Confetti)
    if (typeof confetti === "function") {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D4A373", "#C5A880", "#8F9779", "#F7F3EB"]
      });
    }

    showToast("Cảm ơn bạn!", "Cảm ơn bạn đã xác nhận tham dự!");
    document.getElementById("rsvp-form").reset();
    renderWishes();
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
    title = "[Lễ Vu Quy] Võ Quốc Khánh & Nguyễn Thị Trang";
    details = "Trân trọng kính mời quý khách đến dự Lễ Vu Quy của chúng mình tại Mộc Châu, Sơn La!";
    location = "Bản Long Phú, Phường Mộc Châu, Tỉnh Sơn La";
    startDate = "20261107T030000Z"; // 10:00 GMT+7 = 03:00 UTC
    endDate = "20261107T060000Z";   // 13:00 GMT+7 = 06:00 UTC
  } else {
    title = "[Lễ Cưới & Gia Tiên] Võ Quốc Khánh & Nguyễn Thị Trang";
    details = "Lễ cưới tại Nhà thờ Giáo xứ Mũi Né (17h30 ngày 13/11/2026) & Lễ Gia Tiên tại tư gia (08h30 ngày 14/11/2026). Trân trọng kính mời quý khách!";
    location = "70/9 đường Hồ Xuân Hương, Phường Mũi Né, Tỉnh Lâm Đồng";
    startDate = "20261113T103000Z"; // 17:30 ngày 13/11 GMT+7 = 10:30 UTC
    endDate = "20261114T050000Z";   // 12:00 ngày 14/11 GMT+7 = 05:00 UTC
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
          const btn  = document.getElementById("music-toggle-btn");
          const disc = document.getElementById("music-disc-spin");
          const icon = document.getElementById("music-icon");
          const text = document.getElementById("music-status-text");

          if (btn)  btn.classList.add("is-playing");
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
