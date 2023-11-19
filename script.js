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

function GenerateOrbits() {
    
}

function GenerateAsteroidsBelt() {
    var AsteroidsBelt = document.createElement('div');
    AsteroidsBelt.classList.add('asteroids-belt');
    document.body.appendChild(AsteroidsBelt);
  
    var space = document.querySelector('.space').getBoundingClientRect();
    var DistanceToTop = space.height / 2;
    var InnerRadius = 0.39 * DistanceToTop;
    var OuterRadius = 0.42 * DistanceToTop;
    
    var asteroids = 500;
  
    for (var i = 0; i < asteroids; i++) {
      var asteroid = document.createElement('div');
      asteroid.classList.add('asteroid-belt-rock');
  
      asteroid.dataset.angle = (i / asteroids) * 2 * Math.PI;
      asteroid.dataset.radius = InnerRadius + Math.random() * (OuterRadius - InnerRadius);
      var x = (space.width / 2) + Math.cos(asteroid.dataset.angle) * asteroid.dataset.radius;
      var y = (space.height / 2) + Math.sin(asteroid.dataset.angle) * asteroid.dataset.radius;

      var size = Math.random() * 5 + 1;
      asteroid.style.width = size + 'px';
      asteroid.style.height = size + 'px';
  
      asteroid.style.left = x + 'px';
      asteroid.style.top = y + 'px';
  
      AsteroidsBelt.appendChild(asteroid);
    }
}

function RepositionAsteroids() {
    var space = document.querySelector('.space').getBoundingClientRect();
    var asteroids = document.querySelectorAll('.asteroid-belt-rock');
    
    for(let i = 0; i < asteroids.length; i++)
    {
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
});

setInterval(function(){RepositionAsteroids();}, 1000/250);