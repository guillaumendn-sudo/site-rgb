document.addEventListener('DOMContentLoaded', () => {

    // --- Curseur Personnalisé ---
    const cursor = document.querySelector('.custom-cursor');
    const interactiveElements = document.querySelectorAll('a, button, .tilt-card');

    // On cache le curseur custom sur mobile pour éviter les bugs
    if (window.matchMedia("(hover: hover)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.borderColor = 'var(--accent-green)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.borderColor = 'rgba(255, 255, 255, 0.8)';
            });
        });
    }

    // --- Effet de Tilt 3D sur les cartes ---
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // --- Filtrage des Projets ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projetItems = document.querySelectorAll('.projet-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            projetItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'none';
                    setTimeout(() => {
                        item.style.animation = '';
                    }, 10);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // --- Animations au Défilement (Intersection Observer) ---
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // --- Gestion du Formulaire de Contact ---
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Afficher le message de chargement
            formMessage.style.display = 'block';
            formMessage.className = 'form-message loading';
            formMessage.textContent = 'Envoi en cours...';
            
            // Désactiver le formulaire
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Envoi en cours...';
            
            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formMessage.className = 'form-message success';
                    formMessage.textContent = '✅ Message envoyé avec succès! Je vous répondrai rapidement.';
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    formMessage.className = 'form-message error';
                    formMessage.textContent = data.error || '❌ Une erreur est survenue. Veuillez réessayer.';
                }
            } catch (error) {
                formMessage.className = 'form-message error';
                formMessage.textContent = '❌ Une erreur est survenue. Veuillez réessayer plus tard.';
            } finally {
                // Réactiver le formulaire
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                
                // Cacher le message après 5 secondes
                setTimeout(() => {
                    formMessage.style.display = 'none';
                    formMessage.className = 'form-message';
                    formMessage.textContent = '';
                }, 5000);
            }
        });
    }

});
