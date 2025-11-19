window.addEventListener('scroll', function() {
    const header = document.querySelector('#header-fixe');
    const scrollPosition = window.scrollY;

    if (scrollPosition > 100) {
        header.classList.add('visible');
    } else {
        header.classList.remove('visible');
    } 
});

{


window.addEventListener('DOMContentLoaded', (event) => {
    
    tsParticles.load({
        id: "tsparticles",
        options: {
            preset: "links",
            
            background: {
                color: {
                    value: "transparent" 
                }
            },
            interactivity: {
                events: {
                    onHover: {
                        enable: false
                    },
                    onClick: {
                        enable: false
                    }
                }
            },
            particles: {
                color: {
                    value: "#333333"
                },
                links: {
                    color: "#555555",
                    distance: 150,
                    enable: true,
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                        default: "bounce"
                    },
                    random: false,
                    speed: 1,
                    straight: false
                },
                number: {
                    density: {
                        enable: true
                    },
                    value: 50
                },
                opacity: {
                    value: 0.3
                },
                shape: {
                    type: "circle"
                },
                size: {
                    value: { min: 1, max: 3 }
                }
            },
            detectRetina: true
        }
    });

    // particlesJS.load('particles-js', 'js/particles.json', function() {
    //     console.log('callback - particles.js config loaded');
    // });
});

}

document.addEventListener('DOMContentLoaded', () => {
    
    const grilleProjets = document.querySelector('.grille-projets');
    const conteneurFiltres = document.querySelector('.conteneur-filtres');
    let tousLesProjets = [];

    // --- 1. CHARGEMENT ---
    async function chargerProjets() {
        try {
            const reponse = await fetch('js/portfolio.json');
            tousLesProjets = await reponse.json();
            genererFiltres(tousLesProjets);
            genererCartesProjets(tousLesProjets);
        } catch (erreur) {
            console.error('Erreur:', erreur);
        }
    }

    // --- 2. FILTRES ---
    function genererFiltres(projets) {
        const toutesLesCompetences = new Set();
        projets.forEach(p => p.competences.forEach(c => toutesLesCompetences.add(c)));

        // Bouton "Tous" par défaut
        const btnTous = document.createElement('button');
        btnTous.className = 'filtre-btn active';
        btnTous.dataset.skill = 'all';
        btnTous.textContent = 'Tous';
        conteneurFiltres.appendChild(btnTous);

        toutesLesCompetences.forEach(skill => {
            const btn = document.createElement('button');
            btn.className = 'filtre-btn';
            btn.dataset.skill = skill;
            btn.textContent = skill;
            conteneurFiltres.appendChild(btn);
        });

        conteneurFiltres.addEventListener('click', (e) => {
            if (e.target.classList.contains('filtre-btn')) {
                conteneurFiltres.querySelector('.active')?.classList.remove('active');
                e.target.classList.add('active');
                filtrerProjets(e.target.dataset.skill);
            }
        });
    }

    function filtrerProjets(skill) {
        const projetsFiltres = (skill === 'all') 
            ? tousLesProjets 
            : tousLesProjets.filter(p => p.competences.includes(skill));
        genererCartesProjets(projetsFiltres);
    }

    // --- 3. GÉNÉRATION DES CARTES & CARROUSEL ---
    function genererCartesProjets(projets) {
        grilleProjets.innerHTML = '';
        grilleProjets.classList.remove('has-active');

        projets.forEach(projet => {
            const carte = document.createElement('div');
            carte.className = 'carte-projet';
            // Image de fond (visible quand inactive)
            carte.style.backgroundImage = `url('${projet.cheminImage}')`;

            // 1. Contenu "Preview" (visible quand inactif)
            const contenuPreview = `
                <div class="contenu-carte">
                    <div class="titre-projet" style="font-size:1.5rem; font-weight:bold;">${projet.titre}</div>
                    <div class="competences-projet" style="margin-top:10px; display:flex; gap:5px; flex-wrap:wrap;">
                        ${projet.competences.slice(0, 3).map(c => `<span class="tag-competence">${c}</span>`).join('')}
                        ${projet.competences.length > 3 ? '<span class="tag-competence">...</span>' : ''}
                    </div>
                </div>
            `;

            // 2. Génération des slides du carrousel
            // On commence par l'image principale du projet
            let slidesHTML = `
                <div class="carrousel-slide">
                    <img src="${projet.cheminImage}" class="carrousel-image" alt="${projet.titre}">
                    <div class="carrousel-info">
                        <h4>${projet.titre}</h4>
                        <p>${projet.description}</p>
                        <a href="${projet.lienProjet}" target="_blank">${projet.texteLien}</a>
                    </div>
                </div>
            `;

            let nbInfoSup = 0;
            // On ajoute les infos supplémentaires comme slides
            if (projet.infosSupplementaires) {
                nbInfoSup = 0;
                projet.infosSupplementaires.forEach(info => {
                    slidesHTML += `
                        <div class="carrousel-slide">
                            <img src="${info.image}" class="carrousel-image" alt="Détail">
                            <div class="carrousel-info">
                                <p>${info.description}</p>
                            </div>
                        </div>
                    `;
                    nbInfoSup++;
                });
                
            }
            let btnNav = '';
            if(nbInfoSup >= 1) {
                btnNav = `
                    <button class="btn-nav btn-prev">❮</button>
                    <button class="btn-nav btn-next">❯</button>
                `               
            }
            carte.innerHTML = `
                ${contenuPreview}
                
                <div class="carrousel-container">
                    <button class="btn-close">✕</button>
                    
                    <div class="carrousel-track">
                        ${slidesHTML}
                    </div>
                    ${btnNav}
                    
                </div>
            `;

            // --- LOGIQUE DU CARROUSEL (INTERNE À LA CARTE) ---
            let currentSlide = 0;
            const track = carte.querySelector('.carrousel-track');
            const slides = carte.querySelectorAll('.carrousel-slide');
            const btnNext = carte.querySelector('.btn-next');
            const btnPrev = carte.querySelector('.btn-prev');
            const btnClose = carte.querySelector('.btn-close');

            // Fonction pour bouger le slide
            const updateSlide = () => {
                track.style.transform = `translateX(-${currentSlide * 100}%)`;
            };
            
            if(btnNav != '') {
                btnNext.addEventListener('click', (e) => {
                    e.stopPropagation(); // Empêche de fermer la carte
                    currentSlide = (currentSlide + 1) % slides.length; // Boucle au début
                    updateSlide();
                });
                btnPrev.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentSlide = (currentSlide - 1 + slides.length) % slides.length; // Boucle à la fin
                    updateSlide();
                });
            }


            // --- LOGIQUE D'OUVERTURE / FERMETURE ---
            
            // Clic sur la croix pour fermer
            btnClose.addEventListener('click', (e) => {
                e.stopPropagation();
                fermerCarte();
            });

            // Clic sur la carte pour ouvrir
            carte.addEventListener('click', () => {
                if (!carte.classList.contains('active')) {
                    // 1. Fermer les autres
                    document.querySelectorAll('.carte-projet.active').forEach(c => c.classList.remove('active'));
                    
                    // 2. Activer celle-ci
                    carte.classList.add('active');
                    grilleProjets.classList.add('has-active');
                    
                    // 3. Reset carrousel au début
                    currentSlide = 0;
                    updateSlide();
                }
            });

            grilleProjets.appendChild(carte);
        });
    }

    function fermerCarte() {
        document.querySelectorAll('.carte-projet.active').forEach(c => c.classList.remove('active'));
        grilleProjets.classList.remove('has-active');
    }

    // Fermer si clic en dehors
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.carte-projet') && !e.target.closest('.conteneur-filtres')) {
            fermerCarte();
        }
    });

    chargerProjets();
});

