(() => {
  const PHONE = '256750791591';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const loader = $('#siteLoader');
  const closeLoader = () => {
    if (!loader || loader.classList.contains('is-hidden')) return;
    loader.classList.add('is-hidden');
    document.body.classList.remove('is-loading');
    setTimeout(() => loader.remove(), 800);
  };
  window.addEventListener('load', () => setTimeout(closeLoader, 2700));
  setTimeout(closeLoader, 4300);

  const header = $('#siteHeader');
  const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 36);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  const menu = $('#mobileMenu');
  const menuToggle = $('#menuToggle');
  const menuClose = $('#menuClose');
  const setMenu = (open) => {
    if (!menu) return;
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menuToggle?.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuToggle?.addEventListener('click', () => setMenu(true));
  menuClose?.addEventListener('click', () => setMenu(false));
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -40px' });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  const toISO = (date) => date.toISOString().split('T')[0];
  const today = new Date();
  const dateInputs = ['quickCheckIn', 'quickCheckOut', 'checkIn', 'checkOut'].map(id => $('#' + id)).filter(Boolean);
  dateInputs.forEach(input => input.min = toISO(today));

  const syncCheckoutMin = (checkInId, checkOutId) => {
    const checkIn = $('#' + checkInId), checkOut = $('#' + checkOutId);
    if (!checkIn || !checkOut) return;
    checkIn.addEventListener('change', () => {
      if (!checkIn.value) return;
      const next = new Date(checkIn.value + 'T12:00:00');
      next.setDate(next.getDate() + 1);
      checkOut.min = toISO(next);
      if (!checkOut.value || checkOut.value <= checkIn.value) checkOut.value = toISO(next);
    });
  };
  syncCheckoutMin('quickCheckIn','quickCheckOut');
  syncCheckoutMin('checkIn','checkOut');

  const bookingModal = $('#bookingModal');
  const openBooking = (room = '') => {
    if (!bookingModal) return;
    bookingModal.classList.add('is-open');
    bookingModal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    if (room) $('#roomPreference').value = room;
    setTimeout(() => $('#checkIn')?.focus(), 450);
  };
  const closeBooking = () => {
    bookingModal?.classList.remove('is-open');
    bookingModal?.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  };
  $$('.js-open-booking').forEach(btn => btn.addEventListener('click', () => openBooking()));
  $$('.js-close-booking').forEach(btn => btn.addEventListener('click', closeBooking));
  $$('.js-room-enquire').forEach(btn => btn.addEventListener('click', () => openBooking(btn.dataset.room || '')));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeBooking(); setMenu(false); } });

  const openWhatsApp = (message) => {
    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener');
  };

  $('#quickBook')?.addEventListener('click', () => {
    const checkIn = $('#quickCheckIn').value;
    const checkOut = $('#quickCheckOut').value;
    const guests = $('#quickGuests').value;
    if (!checkIn || !checkOut) {
      openBooking();
      if (checkIn) $('#checkIn').value = checkIn;
      if (checkOut) $('#checkOut').value = checkOut;
      $('#guests').value = guests;
      return;
    }
    openWhatsApp(`Hello Dorah Haven Motel. I would like to check availability from ${checkIn} to ${checkOut} for ${guests} guest(s). Please share the available room options and rates.`);
  });

  $('#bookingForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const checkIn = $('#checkIn').value;
    const checkOut = $('#checkOut').value;
    const guests = $('#guests').value;
    const room = $('#roomPreference').value;
    const name = $('#guestName').value.trim();
    const note = $('#guestNote').value.trim();
    let message = `Hello Dorah Haven Motel. I would like to check availability from ${checkIn} to ${checkOut} for ${guests} guest(s). Room preference: ${room}.`;
    if (name) message += ` My name is ${name}.`;
    if (note) message += ` Note: ${note}`;
    message += ' Please share availability and rates. Thank you.';
    openWhatsApp(message);
  });
})();
