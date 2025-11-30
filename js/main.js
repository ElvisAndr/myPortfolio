window.addEventListener('scroll', function() {
    const header = document.querySelector('#header-fixe');
    const scrollPosition = window.scrollY;

    if (scrollPosition > 100) {
        header.classList.add('visible');
    } else {
        header.classList.remove('visible');
    } 
});

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

document.addEventListener('DOMContentLoaded', () => {
    
    const grilleProjets = document.querySelector('.grille-projets');
    const conteneurFiltres = document.querySelector('.conteneur-filtres');
    
    let tousLesSkills = [];
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
        btnTous.textContent = 'All';
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
        const p = document.createElement('p');
        p.style.width = '100%';
        p.style.textAlign = 'center';
        p.style.color = '#000';
        p.style.fontStyle = 'italic';
        p.textContent = "I haven't published a project with this specific tech stack yet. But I'd love to build it for you. Feel free to send me an email !";
        grilleProjets.appendChild(p);
        return;
    }

    projets.forEach(projet => {
        const carte = document.createElement('div');
        carte.className = 'carte-projet';
        carte.style.backgroundImage = `url('${projet.cheminImage}')`;

        const contenuPreview = document.createElement('div');
        contenuPreview.className = 'contenu-carte';

        const divTitre = document.createElement('div');
        divTitre.className = 'titre-projet';
        divTitre.style.fontSize = '1.5rem';
        divTitre.style.fontWeight = 'bold';
        divTitre.textContent = projet.titre;

        const divDate = document.createElement('div');
        divDate.className = 'date-projet';
        
        const pDate = document.createElement('p');
        const imgStatus = document.createElement('img');
        imgStatus.className = 'icone-status';
        imgStatus.alt = 'Status';
        
        if (projet.status === 'Done') {
            imgStatus.src = 'assets/logo/done.svg';
        } else {
            imgStatus.src = 'assets/logo/ongoing.svg';
        }

        pDate.appendChild(imgStatus);
        pDate.appendChild(document.createTextNode(' ' + projet.date)); 
        divDate.appendChild(pDate);

        const divCompetences = document.createElement('div');
        divCompetences.className = 'competences-projet';
        divCompetences.style.marginTop = '10px';
        divCompetences.style.display = 'flex';
        divCompetences.style.gap = '5px';
        divCompetences.style.flexWrap = 'wrap';

        projet.competences.slice(0, 3).forEach(c => {
            const span = document.createElement('span');
            span.className = 'tag-competence';
            span.textContent = c;
            divCompetences.appendChild(span);
        });

        if (projet.competences.length > 3) {
            const spanDots = document.createElement('span');
            spanDots.className = 'tag-competence';
            spanDots.textContent = '...';
            divCompetences.appendChild(spanDots);
        }

        contenuPreview.appendChild(divTitre);
        contenuPreview.appendChild(divDate);
        contenuPreview.appendChild(divCompetences);
        carte.appendChild(contenuPreview);

        const carrouselContainer = document.createElement('div');
        carrouselContainer.className = 'carrousel-container';

        const btnClose = document.createElement('button');
        btnClose.className = 'btn-close';
        btnClose.textContent = '✕';
        carrouselContainer.appendChild(btnClose);

        const carrouselTrack = document.createElement('div');
        carrouselTrack.className = 'carrousel-track';

        const slidePrincipal = document.createElement('div');
        slidePrincipal.className = 'carrousel-slide';

        const conteneurImgPrinc = document.createElement('div');
        conteneurImgPrinc.className = 'conteneur-carrousel-image';
        const imgPrinc = document.createElement('img');
        imgPrinc.src = projet.cheminImage;
        imgPrinc.className = 'carrousel-image';
        imgPrinc.alt = projet.titre;
        conteneurImgPrinc.appendChild(imgPrinc);

        const infoPrinc = document.createElement('div');
        infoPrinc.className = 'carrousel-info';
        
        const h4Princ = document.createElement('h4');
        h4Princ.textContent = projet.titre;
        
        const pDescPrinc = document.createElement('p');
        pDescPrinc.className = 'p-carrousel-info';
        pDescPrinc.textContent = projet.description;

        const aLien = document.createElement('a');
        aLien.href = projet.lienProjet;
        aLien.target = '_blank';
        aLien.className = 'lien-projet';
        aLien.textContent = projet.texteLien;

        infoPrinc.appendChild(h4Princ);
        infoPrinc.appendChild(pDescPrinc);
        infoPrinc.appendChild(aLien);

        slidePrincipal.appendChild(conteneurImgPrinc);
        slidePrincipal.appendChild(infoPrinc);
        carrouselTrack.appendChild(slidePrincipal);

        let nbInfoSup = 0;
        if (projet.infosSupplementaires) {
            projet.infosSupplementaires.forEach(info => {
                const slideSup = document.createElement('div');
                slideSup.className = 'carrousel-slide';

                const conteneurImgSup = document.createElement('div');
                conteneurImgSup.className = 'conteneur-carrousel-image';
                const imgSup = document.createElement('img');
                imgSup.src = info.image;
                imgSup.className = 'carrousel-image';
                imgSup.alt = 'Détail';
                conteneurImgSup.appendChild(imgSup);

                const infoSupDiv = document.createElement('div');
                infoSupDiv.className = 'carrousel-info';
                const pInfoSup = document.createElement('p');
                pInfoSup.textContent = info.description;
                infoSupDiv.appendChild(pInfoSup);

                slideSup.appendChild(conteneurImgSup);
                slideSup.appendChild(infoSupDiv);
                carrouselTrack.appendChild(slideSup);
                nbInfoSup++;
            });
        }

        carrouselContainer.appendChild(carrouselTrack);

        let btnPrev = null;
        let btnNext = null;

        if (nbInfoSup >= 1) {
            btnPrev = document.createElement('button');
            btnPrev.className = 'btn-nav btn-prev';
            btnPrev.textContent = '❮';
            
            btnNext = document.createElement('button');
            btnNext.className = 'btn-nav btn-next';
            btnNext.textContent = '❯';

            carrouselContainer.appendChild(btnPrev);
            carrouselContainer.appendChild(btnNext);
        }

        carte.appendChild(carrouselContainer);

        let currentSlide = 0;
        const slides = carrouselTrack.children; 

        const updateSlide = () => {
            carrouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        };

        if (btnNext) {
            btnNext.addEventListener('click', (e) => {
                e.stopPropagation();
                currentSlide = (currentSlide + 1) % slides.length;
                updateSlide();
            });
        }

        if (btnPrev) {
            btnPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                updateSlide();
            });
        }

        btnClose.addEventListener('click', (e) => {
            e.stopPropagation();
            if (typeof fermerCarte === 'function') fermerCarte(); 
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


    function generateSkills(skillsData) {
        const container = document.querySelector('.colonne-competences-techniques');
        const mainTitle = document.createElement('h3');
        mainTitle.textContent = 'Technical Skills';

        container.innerHTML = '';
        container.appendChild(mainTitle);
        const createSection = (categoryTitle, filterType) => {
            const filteredSkills = skillsData.filter(item => item.type === filterType);
            
            if (filteredSkills.length === 0) return;

            const subTitle = document.createElement('h4');
            subTitle.textContent = categoryTitle;
            subTitle.classList.add('skill-subtitle');
            container.appendChild(subTitle);
            const ul = document.createElement('ul');
            ul.className = 'skill-list';

            filteredSkills.forEach(item => {
                const li = document.createElement('li');
                const iconContainer = document.createElement('span');
                const spanText = document.createElement('span');

                iconContainer.className = 'skill-icon';
                iconContainer.innerHTML = item.svg; 
                spanText.textContent = item.skill;

                li.appendChild(iconContainer);
                li.appendChild(spanText);
                ul.appendChild(li);
            });
            container.appendChild(ul);
        };
        
        createSection("Programming Languages", "Programming Language");
        createSection("Software & Tools", "Software");
    }

    async function chargerSkills() {
        try {
            const reponse = await fetch('js/skills.json');
            const tousLesSkills = await reponse.json();
            generateSkills(tousLesSkills);
        } catch (erreur) {
            console.error('Erreur lors du chargement des skills:', erreur);
        }
    }

    chargerSkills();

    chargerProjets();
});
