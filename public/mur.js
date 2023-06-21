document.addEventListener('DOMContentLoaded', () => {
    // Récupération du bouton
    const layoutButton = document.querySelector('.button_layout');
  
    // Fonction pour changer le layout des photos
    function changeLayout() {
        const images = document.querySelectorAll('.img_cell');
        images.forEach(image => {
        let computedStyle = window.getComputedStyle(image);
        let currentLayout = computedStyle.getPropertyValue('display');
        if (currentLayout === 'inline') {
            image.style.display= 'block';
        } else {
            image.style.display = 'inline';
        }
});
}
    // Ajout des événements qui déclenchent les fonctions 
    layoutButton.addEventListener('click', changeLayout);
  
    console.log('mur.js a été exécuté');
  });