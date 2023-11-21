function GenerateStarDots() {
    var Space = document.createElement('div');
    Space.classList.add('space');
    document.body.appendChild(Space);

    for (var i = 0; i < 400; i++) {
        var StarDot = document.createElement('div');
        StarDot.classList.add('star-dot');

        StarDot.style.left = Math.random() * 100 + '%';
        StarDot.style.top = Math.random() * 100 + '%';

        var size = Math.floor(Math.random() * 5) + 2;
        StarDot.style.width = size + 'px';
        StarDot.style.height = size + 'px';

        Space.appendChild(StarDot);
    }
}

function GenerateAsteroidsBelt() {
    const AsteroidsBelt = document.createElement('div');
    AsteroidsBelt.classList.add('asteroids-belt');

    var CenterY = window.innerHeight / 2;
    var CenterX = window.innerWidth / 2;
    const InnerRadius = 0.48 * CenterY;
    const OuterRadius = 0.56 * CenterY;
    const AsteroidMinRadius = 2;
    const AsteroidMaxRadius = 5
    const asteroids = 1800;

    for (let i = 0; i < asteroids; i++)
    {
        var asteroid = document.createElement('div');
        asteroid.classList.add('asteroids-belt-rock');

        asteroid.dataset.angle = (i / asteroids) * 2 * Math.PI;
        asteroid.dataset.radius = InnerRadius + (OuterRadius - InnerRadius) * Math.random();
        const x = Math.cos(asteroid.dataset.angle) * asteroid.dataset.radius;
        const y = Math.sin(asteroid.dataset.angle) * asteroid.dataset.radius;

        const size = Math.random() * AsteroidMaxRadius + AsteroidMinRadius;
        asteroid.style.width = size + 'px';
        asteroid.style.height = size + 'px';
        asteroid.style.left = CenterX + x - size + 'px';
        asteroid.style.top = CenterY + y - size + 'px';

        AsteroidsBelt.appendChild(asteroid);
    }

    document.body.appendChild(AsteroidsBelt);
}

function RepositionAsteroids() {
    var space = document.querySelector('.space').getBoundingClientRect();
    var asteroids = document.querySelectorAll('.asteroid-belt-rock');

    for (let i = 0; i < asteroids.length; i++) {
        const asteroid = asteroids[i];
        var x = (space.width / 2) + Math.cos(asteroid.dataset.angle) * asteroid.dataset.radius;
        var y = (space.height / 2) + Math.sin(asteroid.dataset.angle) * asteroid.dataset.radius;

        asteroid.style.left = x + 'px';
        asteroid.style.top = y + 'px';
    }
}

document.addEventListener('DOMContentLoaded', 
function()
{
    GenerateStarDots();
    GenerateAsteroidsBelt();
    //GenerateOrbits();
});

//window.addEventListener('resize', function(){RepositionAsteroids();});