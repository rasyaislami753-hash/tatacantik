document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ANIMASI EMOJI BERTERBANGAN (Bunga, Salting, Kaget, Love) ---
    const emojiContainer = document.getElementById('emoji-container');
    const emojis = ['🌸', '🌹', '🌷', '🌺', '😳', '🫣', '🤭', '😲', '😱', '❤️', '💖', '💕', '💘'];

    function createFloatingEmoji() {
        const emojiEl = document.createElement('div');
        emojiEl.classList.add('floating-emoji');
        emojiEl.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        // Posisi horizontal acak, ukuran, dan durasi animasi
        const startLeft = Math.random() * 100;
        const duration = 5 + Math.random() * 6; // 5 - 11 detik
        const size = 18 + Math.random() * 18; // 18px - 36px

        emojiEl.style.left = `${startLeft}vw`;
        emojiEl.style.fontSize = `${size}px`;
        emojiEl.style.animationDuration = `${duration}s`;

        emojiContainer.appendChild(emojiEl);

        // Hapus elemen setelah animasi selesai agar memori tetap ringan
        setTimeout(() => {
            emojiEl.remove();
        }, duration * 1000);
    }

    // Munculkan emoji secara berkala selama web dibuka
    setInterval(createFloatingEmoji, 450);
    for (let i = 0; i < 8; i++) {
        setTimeout(createFloatingEmoji, i * 200);
    }

    // --- FUNGSI PINDAH HALAMAN ---
    function goToPage(pageNumber) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        const targetPage = document.getElementById(`page-${pageNumber}`);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }

    // --- 2. LOGIKA PAGE 1: VALIDASI NAMA ---
    const nameInput = document.getElementById('name-input');
    const submitNameBtn = document.getElementById('submit-name');
    const errorMsg = document.getElementById('error-msg');

    function checkName() {
        const enteredName = nameInput.value.trim().toLowerCase();
        
        if (enteredName === 'naomi talitha') {
            errorMsg.textContent = '';
            goToPage(2);
        } else {
            errorMsg.textContent = 'coba masukan nama lengkap kamuu';
            nameInput.classList.remove('shake');
            void nameInput.offsetWidth; // Trigger reflow untuk ulang animasi shake
            nameInput.classList.add('shake');
        }
    }

    submitNameBtn.addEventListener('click', checkName);
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkName();
    });

    // --- 3. LOGIKA PAGE 2: AMPLOP & SURAT ---
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const envelope = document.getElementById('envelope');
    const letterPaper = document.getElementById('letter-paper');
    const nextToPage3Btn = document.getElementById('next-to-page3');

    envelopeWrapper.addEventListener('click', () => {
        envelope.classList.add('open');
        setTimeout(() => {
            envelopeWrapper.style.display = 'none';
            letterPaper.classList.remove('hidden');
        }, 550);
    });

    nextToPage3Btn.addEventListener('click', () => {
        goToPage(3);
    });

    // --- 4. LOGIKA PAGE 3: SIDIK JARI (HOLD 1 - 100%) ---
    const fingerprintBtn = document.getElementById('fingerprint-btn');
    const scannerRing = document.getElementById('scanner-ring');
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar');

    let progress = 0;
    let holdInterval = null;
    let isCompleted = false;

    function updateProgressUI() {
        progressText.textContent = `${progress}%`;
        progressBar.style.width = `${progress}%`;
    }

    function startHolding(e) {
        e.preventDefault();
        if (isCompleted) return;

        scannerRing.classList.add('scanning');
        clearInterval(holdInterval);

        holdInterval = setInterval(() => {
            if (progress < 100) {
                progress += 1;
                updateProgressUI();
            }
            if (progress >= 100) {
                isCompleted = true;
                clearInterval(holdInterval);
                scannerRing.classList.remove('scanning');
                setTimeout(() => {
                    goToPage(4);
                }, 350);
            }
        }, 35); // Kecepatan loading (~3.5 detik untuk penuh 100%)
    }

    function stopHolding() {
        if (isCompleted) return;
        scannerRing.classList.remove('scanning');
        clearInterval(holdInterval);

        // Jika dilepas sebelum 100%, perlahan turun kembali ke 0
        holdInterval = setInterval(() => {
            if (progress > 0) {
                progress -= 2;
                if (progress < 0) progress = 0;
                updateProgressUI();
            } else {
                clearInterval(holdInterval);
            }
        }, 25);
    }

    // Event untuk Mouse (Desktop) & Touch (HP)
    fingerprintBtn.addEventListener('mousedown', startHolding);
    window.addEventListener('mouseup', stopHolding);

    fingerprintBtn.addEventListener('touchstart', startHolding, { passive: false });
    window.addEventListener('touchend', stopHolding);
    window.addEventListener('touchcancel', stopHolding);
});