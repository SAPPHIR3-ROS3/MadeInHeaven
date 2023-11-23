function GenerateStarDots() {
    const Space = document.createElement('div');
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
    const InnerRadius = 0.47 * CenterY;
    const OuterRadius = 0.51 * CenterY;
    const AsteroidMinRadius = 2;
    const AsteroidMaxRadius = 5
    const asteroids = 400;

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
    var CenterY = window.innerHeight / 2;
    var CenterX = window.innerWidth / 2;
    var asteroids = document.querySelectorAll('.asteroids-belt-rock');

    for (let i = 0; i < asteroids.length; i++)
    {
        const asteroid = asteroids[i];
        var x = CenterX + Math.cos(asteroid.dataset.angle) * asteroid.dataset.radius;
        var y = CenterY + Math.sin(asteroid.dataset.angle) * asteroid.dataset.radius;

        asteroid.style.left = x + 'px';
        asteroid.style.top = y + 'px';
    }
}

function GenerateOrbits() {
    const Orbits = document.createElement('div');
    Orbits.classList.add('orbits');
    Planets = Array.from(document.querySelectorAll('.solar-object')).slice(1);
    var CenterY = window.innerHeight / 2;
    var CenterX = window.innerWidth / 2;
    const MinRadius = document.querySelector('.sun').offsetHeight;
    const MaxRadius = CenterY + 0.05 * CenterY;
    const NumOrbits = 10;

    for(let i = 0; i < NumOrbits; i++)
    {
        const orbit = document.createElement('div');
        orbit.classList.add('orbit');

        const percentage = i / NumOrbits;
        const radius = MinRadius + percentage * (MaxRadius - MinRadius);

        orbit.style.width = radius * 2 + 'px';
        orbit.style.height = radius * 2 + 'px';
        orbit.style.left = CenterX - radius + 'px';
        orbit.style.top = CenterY - radius + 'px';

        if(i == 4)
            orbit.style.visibility = 'hidden';

        Orbits.appendChild(orbit);
    }

    document.body.appendChild(Orbits);

    for(let i = 0; i < NumOrbits - 1; i++)
    {
        const index = (i < 4) ? i : i + 1;
        const percentage = index / NumOrbits;
        const radius = MinRadius + percentage * (MaxRadius - MinRadius);
        Planets[i].style.top = CenterY - radius + 'px';
    }
}

function RepositionOrbits() {
    var CenterY = window.innerHeight / 2;
    var CenterX = window.innerWidth / 2;
    var orbits = document.querySelectorAll('.orbit');
    const MinRadius = document.querySelector('.sun').offsetHeight;
    const MaxRadius = CenterY + 0.05 * CenterY;

    for (let i = 0; i < orbits.length; i++)
    {
        const percentage = i / orbits.length;
        const radius = MinRadius + percentage * (MaxRadius - MinRadius);
        const orbit = orbits[i];

        orbit.style.left = CenterX - radius + 'px';
        orbit.style.top = CenterY - radius + 'px';
    }
}

function OrbitAround(CenterOrbit, OrbitingObject, OrbitTime = 1, InitialAngle = 0, radius = 50){
    const FrameDelta = (1/60).toFixed(4);
    const AngularVelocity = (2 * Math.PI) / OrbitTime;
    let angle = InitialAngle * (Math.PI / 180);

    setInterval(() => 
    {
        const CenterX = CenterOrbit.offsetLeft + CenterOrbit.offsetWidth / 2;
        const CenterY = CenterOrbit.offsetTop + CenterOrbit.offsetHeight / 2;
        const x = CenterX + radius * Math.cos(angle);
        const y = CenterY + radius * Math.sin(angle);
        OrbitingObject.style.left = x - OrbitingObject.clientWidth / 2 + 'px';
        OrbitingObject.style.top = y - OrbitingObject.clientHeight / 2 + 'px';
        angle += AngularVelocity * FrameDelta;
    }, Math.floor(FrameDelta * 1000));
}

document.addEventListener('DOMContentLoaded', 
function()
{
    GenerateStarDots();
    GenerateOrbits();
    GenerateAsteroidsBelt();
});

window.addEventListener('resize', 
function()
{
    RepositionOrbits();
    RepositionAsteroids();
});