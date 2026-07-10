document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    
    // Mobile Menu Logic
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            if (navLinks.classList.contains('active')) {
                mobileMenuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
                document.body.style.overflow = 'hidden'; 
            } else {
                mobileMenuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
                document.body.style.overflow = '';
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
                document.body.style.overflow = '';
            });
        });
    }
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Adjust for fixed navbar height
                const navHeight = navbar.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - navHeight;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form Logic
    const form = document.getElementById('qualify-form');
    const step1 = document.getElementById('form-step-1');
    const stepSuccess = document.getElementById('form-success');

    if (form && step1 && stepSuccess) {
        
        // Submit Form directly from Step 1
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate required fields
            const nameField = document.getElementById('name');
            const phoneField = document.getElementById('phone');
            const intentField = document.getElementById('intent');
            
            let isValid = true;
            
            [nameField, phoneField, intentField].forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = 'red';
                    isValid = false;
                } else {
                    field.style.borderColor = 'rgba(26, 46, 36, 0.2)';
                }
            });

            if (!isValid) return;
            
            const timelineField = document.getElementById('timeline');
            const sourceField = document.getElementById('source');
            
            // Changing state to "Enviando..."
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            // Send data to serverless function
            fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: nameField.value.trim(),
                    phone: phoneField.value.trim(),
                    intent: intentField.value,
                    timeline: timelineField ? timelineField.value : null,
                    source: sourceField ? sourceField.value : null
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success || data.message) {
                    submitBtn.style.backgroundColor = '#4a6b5a'; // Verde Claro (Éxito)
                    submitBtn.textContent = '¡Listo! ✓';
                    
                    setTimeout(() => {
                        step1.classList.remove('active');
                        stepSuccess.classList.add('active');
                    }, 1500);
                } else {
                    throw new Error(data.error || 'Error al enviar');
                }
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                submitBtn.textContent = 'Error, intenta de nuevo';
                submitBtn.style.backgroundColor = '#c0392b';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                }, 3000);
            });
        });
    }

    // Scroll Reveal with Stagger Logic
    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Determine if it's a parent container with children to stagger
                if (entry.target.classList.contains('stagger-parent')) {
                    const reveals = entry.target.querySelectorAll('.reveal');
                    reveals.forEach((el, index) => {
                        setTimeout(() => {
                            el.classList.add('active');
                        }, index * 150); // 150ms stagger
                    });
                } else if (entry.target.classList.contains('reveal')) {
                    // Single element reveal
                    entry.target.classList.add('active');
                }
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, revealOptions);

    document.querySelectorAll('.stagger-parent, .reveal:not(.stagger-parent .reveal)').forEach(element => {
        revealObserver.observe(element);
    });

});
