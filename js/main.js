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
});

}

document.addEventListener('DOMContentLoaded', () => {
    
    const grilleProjets = document.querySelector('.grille-projets');
    const conteneurFiltres = document.querySelector('.conteneur-filtres');
    
    let tousLesProjets = []; 
    let filtresActifs = new Set(); 

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

    function genererFiltres(projets) {
        const toutesLesCompetences = new Set();
        projets.forEach(p => p.competences.forEach(c => toutesLesCompetences.add(c)));

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
                const skillClique = e.target.dataset.skill;
                const btnClique = e.target;

                if (skillClique === 'all') {
                    filtresActifs.clear();
                    document.querySelectorAll('.filtre-btn').forEach(btn => btn.classList.remove('active'));
                    btnClique.classList.add('active');
                } 
                else {
                    document.querySelector('.filtre-btn[data-skill="all"]').classList.remove('active');

                    if (filtresActifs.has(skillClique)) {
                        filtresActifs.delete(skillClique);
                        btnClique.classList.remove('active');
                    } else {
                        filtresActifs.add(skillClique);
                        btnClique.classList.add('active');
                    }

                    if (filtresActifs.size === 0) {
                        document.querySelector('.filtre-btn[data-skill="all"]').classList.add('active');
                    }
                }
                
                filtrerProjets();
            }
        });
    }

    function filtrerProjets() {
        let projetsFiltres;

        if (filtresActifs.size === 0) {
            projetsFiltres = tousLesProjets;
        } else {
            projetsFiltres = tousLesProjets.filter(projet => {
                return Array.from(filtresActifs).every(filtre => projet.competences.includes(filtre));
            });
        }
        
        genererCartesProjets(projetsFiltres);
    }

    function genererCartesProjets(projets) {
        grilleProjets.innerHTML = '';
        grilleProjets.classList.remove('has-active');

        if (projets.length === 0) {
            grilleProjets.innerHTML = "<p style='width:100%; text-align:center; color:#000; font-style:italic;'>I haven't published a project with this specific tech stack yet. But I'd love to build it for you. Feel free to send me an email !</p>";
            return;
        }

        projets.forEach(projet => {
            const carte = document.createElement('div');
            carte.className = 'carte-projet';
            carte.style.backgroundImage = `url('${projet.cheminImage}')`;

            const contenuPreview = `
                <div class="contenu-carte">
                    <div class="titre-projet" style="font-size:1.5rem; font-weight:bold;">${projet.titre}</div>
                    <div class="competences-projet" style="margin-top:10px; display:flex; gap:5px; flex-wrap:wrap;">
                        ${projet.competences.slice(0, 3).map(c => `<span class="tag-competence">${c}</span>`).join('')}
                        ${projet.competences.length > 3 ? '<span class="tag-competence">...</span>' : ''}
                    </div>
                </div>
            `;

            let slidesHTML = `
                <div class="carrousel-slide">
                    <div class="conteneur-carrousel-image">
                        <img src="${projet.cheminImage}" class="carrousel-image" alt="${projet.titre}">
                    </div>
                    <div class="carrousel-info">
                        <h4>${projet.titre}</h4>
                        <p class='p-carrousel-info'>${projet.description}</p>
                        <a href="${projet.lienProjet}" target="_blank" class="lien-projet">${projet.texteLien}</a>
                    </div>
                </div>
            `;

            let nbInfoSup = 0;
            if (projet.infosSupplementaires) {
                projet.infosSupplementaires.forEach(info => {
                    slidesHTML += `
                        <div class="carrousel-slide">
                            <div class="conteneur-carrousel-image">
                                <img src="${info.image}" class="carrousel-image" alt="Détail">
                            </div>
                            <div class="carrousel-info">
                                <h4>Détail</h4>
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
                `;              
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

            let currentSlide = 0;
            const track = carte.querySelector('.carrousel-track');
            const slides = carte.querySelectorAll('.carrousel-slide');
            const btnNext = carte.querySelector('.btn-next');
            const btnPrev = carte.querySelector('.btn-prev');
            const btnClose = carte.querySelector('.btn-close');

            const updateSlide = () => {
                track.style.transform = `translateX(-${currentSlide * 100}%)`;
            };
            
            if(btnNav != '') {
                btnNext.addEventListener('click', (e) => {
                    e.stopPropagation(); 
                    currentSlide = (currentSlide + 1) % slides.length; 
                    updateSlide();
                });
                btnPrev.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentSlide = (currentSlide - 1 + slides.length) % slides.length; 
                    updateSlide();
                });
            }
            
            btnClose.addEventListener('click', (e) => {
                e.stopPropagation();
                fermerCarte();
            });

            carte.addEventListener('click', () => {
                if (!carte.classList.contains('active')) {
                    document.querySelectorAll('.carte-projet.active').forEach(c => c.classList.remove('active'));
                    carte.classList.add('active');
                    grilleProjets.classList.add('has-active');
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

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.carte-projet') && !e.target.closest('.conteneur-filtres')) {
            fermerCarte();
        }
    });

    chargerProjets();
});
