  const menuBtn = document.getElementById('menuToggle');
  const menuClose = document.getElementById('menuClose');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  function openMenu(){
    navMenu.classList.add('open'); navOverlay.classList.add('open');
    menuBtn.setAttribute('aria-expanded', true);
  }
  function closeMenu(){
    navMenu.classList.remove('open'); navOverlay.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', false);
  }
  menuBtn.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  navOverlay.addEventListener('click', closeMenu);
  navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  (function(){
    var placeEls = document.querySelectorAll('.js-local-place');
    var sunEls = document.querySelectorAll('.js-local-sun');
    try{var cp=sessionStorage.getItem('setsPlace'),cs=sessionStorage.getItem('setsSun');if(cp)placeEls.forEach(function(e){e.textContent=cp;});if(cs)sunEls.forEach(function(e){e.textContent=cs;});}catch(e){}
    if(!placeEls.length || !navigator.geolocation){
      var bar1 = document.getElementById('localBar');
      var bar2 = document.getElementById('navLocalMobile');
      if(bar1) bar1.style.display = 'none';
      if(bar2) bar2.style.display = 'none';
      return;
    }
    navigator.geolocation.getCurrentPosition(function(pos){
      var lat = pos.coords.latitude, lon = pos.coords.longitude;

      fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + lat + '&longitude=' + lon + '&localityLanguage=fr')
        .then(function(r){ return r.json(); })
        .then(function(data){
          var parts = [data.locality, data.city && data.city !== data.locality ? data.city : null].filter(Boolean);
          var text = parts.length ? parts.join(', ') : (data.principalSubdivision || 'Localisation indisponible');
          placeEls.forEach(function(el){ el.textContent = text; }); try{sessionStorage.setItem('setsPlace',text);}catch(e){}
        })
        .catch(function(){ placeEls.forEach(function(el){ el.textContent = 'Localisation indisponible'; }); });

      fetch('https://api.sunrise-sunset.org/json?lat=' + lat + '&lng=' + lon + '&formatted=0')
        .then(function(r){ return r.json(); })
        .then(function(data){
          var text = '—';
          if(data && data.status === 'OK'){
            var fmt = {hour:'2-digit', minute:'2-digit'};
            var sunrise = new Date(data.results.sunrise).toLocaleTimeString('fr-FR', fmt);
            var sunset = new Date(data.results.sunset).toLocaleTimeString('fr-FR', fmt);
            text = 'Lever ' + sunrise + ' · Coucher ' + sunset;
          }
          sunEls.forEach(function(el){ el.textContent = text; }); try{sessionStorage.setItem('setsSun',text);}catch(e){}
        })
        .catch(function(){ sunEls.forEach(function(el){ el.textContent = '—'; }); });
    }, function(){
      var bar1 = document.getElementById('localBar');
      var bar2 = document.getElementById('navLocalMobile');
      if(bar1) bar1.style.display = 'none';
      if(bar2) bar2.style.display = 'none';
    }, { timeout: 8000 });
  })();
  (function(){
    function flashTarget(){
      var id = window.location.hash.replace('#','');
      if(!id) return;
      var el = document.getElementById(id);
      if(!el || !el.classList.contains('domain-card')) return;
      document.querySelectorAll('.domain-card.highlight').forEach(function(c){
        c.classList.remove('highlight');
      });
      requestAnimationFrame(function(){
        el.classList.add('highlight');
        setTimeout(function(){ el.classList.remove('highlight'); }, 1800);
      });
    }
    window.addEventListener('hashchange', flashTarget);
    window.addEventListener('load', flashTarget);
  })();
  (function(){
    var items = document.querySelectorAll('.nav-item');
    items.forEach(function(item){
      var dropdown = item.querySelector('.nav-dropdown');
      if(!dropdown) return;
      function reposition(){
        dropdown.style.transform = 'translateX(-50%)';
        var rect = dropdown.getBoundingClientRect();
        var margin = 12;
        var overflowLeft = margin - rect.left;
        var overflowRight = rect.right - (window.innerWidth - margin);
        if(overflowLeft > 0){
          dropdown.style.transform = 'translateX(calc(-50% + ' + overflowLeft + 'px))';
        } else if(overflowRight > 0){
          dropdown.style.transform = 'translateX(calc(-50% - ' + overflowRight + 'px))';
        }
      }
      item.addEventListener('mouseenter', reposition);
      item.addEventListener('focusin', reposition);
      item.addEventListener('mouseleave', function(){ item.classList.remove('force-hide'); });
      dropdown.querySelectorAll('a').forEach(function(link){
        link.addEventListener('click', function(){
          item.classList.add('force-hide');
        });
      });
    });
  })();
  (function(){
    var btn = document.getElementById('backToTop');
    if(!btn) return;
    window.addEventListener('scroll', function(){
      btn.classList.toggle('visible', window.scrollY > 500);
    });
    btn.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();
