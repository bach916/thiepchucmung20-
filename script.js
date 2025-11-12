const wishTemplates = [
    "Chúc thầy/cô luôn mạnh khỏe, hạnh phúc và thành công trên con đường trồng người.",
    "Kính chúc thầy/cô ngày 20/11 thật nhiều niềm vui và ý nghĩa. Cảm ơn thầy/cô vì tất cả!",
    "Cảm ơn thầy/cô đã truyền cảm hứng, thắp sáng ước mơ cho chúng em.",
    "Nhân ngày Nhà giáo Việt Nam, xin gửi đến thầy/cô lời tri ân sâu sắc nhất.",
    "Chúc thầy/cô luôn giữ mãi ngọn lửa đam mê và nhiệt huyết với nghề.",
    "Chúc mừng ngày 20/11! Kính chúc thầy/cô sức khỏe dồi dào, vạn sự như ý.",
    "Cảm ơn thầy/cô - người lái đò thầm lặng đã đưa bao thế hệ cập bến tri thức."
  ];
  const wishInput = document.getElementById('wish-input');
  const wishTemplate = document.getElementById('wish-template');
  const teacherImg = document.getElementById('teacher-img');
  const imgUpload = document.getElementById('img-upload');
  const btnUploadImg = document.getElementById('btn-upload-img');
  const signatureCanvas = document.getElementById('signature-canvas');
  const btnClearSign = document.getElementById('btn-clear-sign');
  const btnMusic = document.getElementById('btn-music');
  const bgMusic = document.getElementById('bg-music');
  const btnShare = document.getElementById('btn-share');
  const btnPrint = document.getElementById('btn-print');
  const btnReset = document.getElementById('btn-reset');
  const toast = document.getElementById('toast');
  const confettiCanvas = document.getElementById('confetti-canvas'); 
  wishTemplates.forEach((w, i) => {
    const opt = document.createElement('option');
    opt.value = w;
    opt.textContent = w;
    wishTemplate.appendChild(opt);
  });
  wishTemplate.addEventListener('change', () => {
    if (wishTemplate.value) wishInput.value = wishTemplate.value;
  });
  btnUploadImg.addEventListener('click', () => imgUpload.click());
  imgUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      teacherImg.src = ev.target.result;
      showToast('Đã cập nhật ảnh thầy/cô!');
    };
    reader.readAsDataURL(file);
  });
  const signCtx = signatureCanvas.getContext('2d');
  let drawing = false, lastX = 0, lastY = 0;
  function startDraw(e) {
    drawing = true;
    [lastX, lastY] = getXY(e);
  }
  function draw(e) {
    if (!drawing) return;
    const [x, y] = getXY(e);
    signCtx.lineWidth = 2;
    signCtx.lineCap = 'round';
    signCtx.strokeStyle = '#d2691e';
    signCtx.beginPath();
    signCtx.moveTo(lastX, lastY);
    signCtx.lineTo(x, y);
    signCtx.stroke();
    [lastX, lastY] = [x, y];
  }
  function stopDraw() { drawing = false; }
  function getXY(e) {
    const rect = signatureCanvas.getBoundingClientRect();
    if (e.touches) {
      return [
        e.touches[0].clientX - rect.left,
        e.touches[0].clientY - rect.top
      ];
    } else {
      return [
        e.offsetX !== undefined ? e.offsetX : e.layerX,
        e.offsetY !== undefined ? e.offsetY : e.layerY
      ];
    }
  }
  signatureCanvas.addEventListener('mousedown', startDraw);
  signatureCanvas.addEventListener('mousemove', draw);
  signatureCanvas.addEventListener('mouseup', stopDraw);
  signatureCanvas.addEventListener('mouseleave', stopDraw);
  signatureCanvas.addEventListener('touchstart', startDraw);
  signatureCanvas.addEventListener('touchmove', draw);
  signatureCanvas.addEventListener('touchend', stopDraw); 
  btnClearSign.addEventListener('click', () => {
    signCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
  }); 
  let musicPlaying = false;
  btnMusic.addEventListener('click', () => {
    if (!musicPlaying) {
      bgMusic.play();
      btnMusic.textContent = 'Tắt nhạc nền';
      btnMusic.classList.add('active');
      musicPlaying = true;
    } else {
      bgMusic.pause();
      btnMusic.textContent = 'Bật nhạc nền';
      btnMusic.classList.remove('active');
      musicPlaying = false;
    }
  });
  bgMusic.addEventListener('ended', () => { musicPlaying = false; });
  
  function loadCard() {
    const data = localStorage.getItem('card20_11');
    if (!data) return;
    try {
      const { wish, img, sign } = JSON.parse(data);
      if (wish) wishInput.value = wish;
      if (img) teacherImg.src = img;
      if (sign) {
        const imgSign = new Image();
        imgSign.onload = () => signCtx.drawImage(imgSign, 0, 0);
        imgSign.src = sign;
      }
    } catch {}
  }
  function resetCard() {
    wishInput.value = '';
    teacherImg.src = "Ảnh/hình 1.jpg";
    wishTemplate.selectedIndex = 0;
    signCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
    bgMusic.pause();
    bgMusic.currentTime = 0;
    btnMusic.textContent = 'Bật nhạc nền';
    btnMusic.classList.remove('active');
    localStorage.removeItem('card20_11');
    showToast('Đã làm mới thiệp!');
  }
  btnShare.addEventListener('click', async () => {
    const shareData = {
      title: 'Thiệp 20/11 Tri Ân Thầy Cô',
      text: wishInput.value || 'Chúc mừng ngày Nhà giáo Việt Nam 20/11!',
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('Đã mở menu chia sẻ!');
      } catch (err) {
        showToast('Chia sẻ bị hủy hoặc không thành công.');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Đã sao chép link thiệp!');
    }
  });
  btnPrint.addEventListener('click', () => {
    window.print();
  });
  function randomColor() {
    const colors = ['#ffd700', '#ffb347', '#ff6961', '#32cd32', '#1e90ff', '#d2691e', '#ff69b4'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  function launchConfetti() {
    const ctx = confettiCanvas.getContext('2d');
    const W = confettiCanvas.width = window.innerWidth;
    const H = confettiCanvas.height = window.innerHeight;
    const confettis = [];
    for (let i = 0; i < 60; i++) {
      confettis.push({
        x: Math.random() * W,
        y: Math.random() * -H,
        r: Math.random() * 8 + 4,
        d: Math.random() * 80 + 40,
        color: randomColor(),
        tilt: Math.random() * 10 - 5,
        tiltAngle: 0,
        tiltAngleInc: Math.random() * 0.07 + 0.05
      });
    }
    let angle = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      angle += 0.01;
      for (let i = 0; i < confettis.length; i++) {
        let c = confettis[i];
        c.y += (Math.cos(angle + c.d) + 1 + c.r / 2) * 0.8;
        c.x += Math.sin(angle);
        c.tiltAngle += c.tiltAngleInc;
        c.tilt = Math.sin(c.tiltAngle) * 15;
        ctx.beginPath();
        ctx.lineWidth = c.r;
        ctx.strokeStyle = c.color;
        ctx.moveTo(c.x + c.tilt + c.r / 3, c.y);
        ctx.lineTo(c.x + c.tilt, c.y + c.r * 2);
        ctx.stroke();
      }
    }
    let frame = 0;
function animate() {
  draw();
  frame++;
  if (frame < 300) requestAnimationFrame(animate); 
  else ctx.clearRect(0, 0, W, H);
}
    animate();
  }
  btnSave.addEventListener('click', () => {
    saveCard();
    launchConfetti();
  });
  btnShare.addEventListener('click', launchConfetti);
  function showToast(msg) {
    toast.textContent = msg;
    toast.style.opacity = 1;
    setTimeout(() => { toast.style.opacity = 0; }, 2200);
  }
  btnReset.addEventListener('click', resetCard); 
  window.addEventListener('DOMContentLoaded', loadCard);
  window.addEventListener('resize', () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  });