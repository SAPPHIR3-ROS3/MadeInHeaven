function GenerateStarDots() {
    var Space = document.createElement('div');
    Space.classList.add('space');

    for (var i = 0; i < 300; i++) {
        var StarDot = document.createElement('div');
        StarDot.classList.add('star-dot');

        StarDot.style.left = Math.random() * 100 + '%';
        StarDot.style.top = Math.random() * 100 + '%';

        var size = Math.floor(Math.random() * 5) + 2;
        StarDot.style.width = size + 'px';
        StarDot.style.height = size + 'px';

        Space.appendChild(StarDot);
    }

    document.body.appendChild(Space);
}

document.addEventListener('DOMContentLoaded', function(){GenerateStarDots();});
