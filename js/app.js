(() => {
  const PHONE = '256750791591';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* Premium logo loader */
  const loader = $('#siteLoader');
  const closeLoader = () => {
    if (!loader || loader.classList.contains('is-hidden')) return;
    loader.classList.add('is-hidden');
    document.body.classList.remove('is-loading');
    setTimeout(() => loader.remove(), 900);
  };
  window.addEventListener('load', () => setTimeout(closeLoader, 2550));
  setTimeout(closeLoader, 4100);

  /* Header */
  const header = $('#siteHeader');
  const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 34);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  /* Mobile menu */
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

  /* Hero slideshow */
  const heroSlides = $$('.hero-slide');
  const heroRail = $$('.hero__rail span');
  let heroIndex = 0;
  const showHeroSlide = (index) => {
    if (!heroSlides.length) return;
    heroSlides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    heroRail.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
  };
  if (heroSlides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setInterval(() => {
      heroIndex = (heroIndex + 1) % heroSlides.length;
      showHeroSlide(heroIndex);
    }, 4800);
  }

  /* Scroll reveals with a gentle stagger */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const siblings = entry.target.parentElement ? $$('.reveal', entry.target.parentElement) : [];
        const index = Math.max(0, siblings.indexOf(entry.target));
        entry.target.style.transitionDelay = `${Math.min(index * 55, 220)}ms`;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .1, rootMargin: '0px 0px -32px' });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  /* Gallery grab-to-scroll */
  const gallery = $('#galleryTrack');
  if (gallery) {
    let down = false, startX = 0, scrollLeft = 0;
    gallery.addEventListener('pointerdown', e => {
      down = true;
      startX = e.clientX;
      scrollLeft = gallery.scrollLeft;
      gallery.setPointerCapture?.(e.pointerId);
    });
    gallery.addEventListener('pointermove', e => {
      if (!down) return;
      gallery.scrollLeft = scrollLeft - (e.clientX - startX) * 1.2;
    });
    const stop = () => { down = false; };
    gallery.addEventListener('pointerup', stop);
    gallery.addEventListener('pointercancel', stop);
    gallery.addEventListener('pointerleave', stop);
  }

  /* Dates */
  const toISO = date => date.toISOString().split('T')[0];
  const today = new Date();
  ['quickCheckIn','quickCheckOut','checkIn','checkOut'].map(id => $('#' + id)).filter(Boolean).forEach(input => input.min = toISO(today));
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

  /* Booking drawer */
  const bookingModal = $('#bookingModal');
  const openBooking = (room = '') => {
    if (!bookingModal) return;
    bookingModal.classList.add('is-open');
    bookingModal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    if (room && $('#roomPreference')) $('#roomPreference').value = room;
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
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeBooking(); setMenu(false); }
  });

  const openWhatsApp = message => {
    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener');
  };

  $('#quickBook')?.addEventListener('click', () => {
    const checkIn = $('#quickCheckIn')?.value || '';
    const checkOut = $('#quickCheckOut')?.value || '';
    const guests = $('#quickGuests')?.value || '2';
    if (!checkIn || !checkOut) {
      openBooking();
      if (checkIn && $('#checkIn')) $('#checkIn').value = checkIn;
      if (checkOut && $('#checkOut')) $('#checkOut').value = checkOut;
      if ($('#guests')) $('#guests').value = guests;
      return;
    }
    openWhatsApp(`Hello Dorah Haven Motel. I would like to check availability from ${checkIn} to ${checkOut} for ${guests} guest(s). Please share the available room options and rates.`);
  });

  $('#bookingForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const checkIn = $('#checkIn')?.value || '';
    const checkOut = $('#checkOut')?.value || '';
    const guests = $('#guests')?.value || '2';
    const room = $('#roomPreference')?.value || 'Any available room';
    const name = $('#guestName')?.value.trim() || '';
    const note = $('#guestNote')?.value.trim() || '';
    let message = `Hello Dorah Haven Motel. I would like to check availability from ${checkIn} to ${checkOut} for ${guests} guest(s). Room preference: ${room}.`;
    if (name) message += ` My name is ${name}.`;
    if (note) message += ` Note: ${note}`;
    message += ' Please share availability and rates. Thank you.';
    openWhatsApp(message);
  });

  /* Soft pointer parallax on desktop */
  const hero = $('.hero');
  const floating = $('.hero__floating-card');
  if (hero && floating && matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    hero.addEventListener('pointermove', e => {
      const x = (e.clientX / innerWidth - .5) * 12;
      const y = (e.clientY / innerHeight - .5) * 12;
      floating.style.transform = `translate3d(${x}px,${y}px,0)`;
    });
    hero.addEventListener('pointerleave', () => floating.style.transform = '');
  }
})();
