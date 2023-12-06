document.addEventListener('DOMContentLoaded', () => {
    // Récupération du bouton
    const layoutButton = document.getElementById('button_layout');
    const imagesContainer = document.querySelector('.imgs_container'); // Remplacez avec votre sélecteur approprié

    // Fonction pour changer le layout des photos
    function changeLayout() {
        // Ajoute ou supprime la classe 'single-column' selon l'état actuel
        imagesContainer.classList.toggle('single-column');
    }

    // Ajout des événements qui déclenchent les fonctions 
    layoutButton.addEventListener('click', changeLayout);

    console.log('mur.js a été exécuté');
});