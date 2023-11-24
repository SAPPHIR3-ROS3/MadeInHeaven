var OrbitPeriodMultiplier = [1/3, 2/3, 3/3 , 4/3, 6/3, 7/3, 8/3, 9/3, 10/3];
var SatelliteOrbits = 
{
    '.moon': 1/13, 
    '.phobos': 1/212, 
    '.deimos': 1/53, 
    '.io': 1/24, 
    '.europa': 1/12, 
    '.ganymede': 1/6, 
    '.callisto': 1/2, 
    '.titan': 1/67, 
    '.rhea': 1/24,
    '.titania': 1/350,
    '.oberon': 1/228,
    '.proteus': 1/538,
    '.nereide': 1/2,
    '.charon': 1/142
};
var EarthYear = 60;
var TimeSpeed = 0;
var RandomPosition = true;

function GenerateStarDots() {
    const Space = document.createElement('div');
    Space.classList.add('space');
    document.body.appendChild(Space);

    for (let i = 0; i < 400; i++) {
        let StarDot = document.createElement('div');
        StarDot.classList.add('star-dot');

        StarDot.style.left = Math.random() * 100 + '%';
        StarDot.style.top = Math.random() * 100 + '%';

        let size = Math.floor(Math.random() * 5) + 2;
        StarDot.style.width = size + 'px';
        StarDot.style.height = size + 'px';

        Space.appendChild(StarDot);
    }
}

function GenerateAsteroidsBelt() {
    const AsteroidsBelt = document.createElement('div');
    AsteroidsBelt.classList.add('asteroids-belt');

    let CenterY = window.innerHeight / 2;
    let CenterX = window.innerWidth / 2;
    const InnerRadius = 0.47 * CenterY;
    const OuterRadius = 0.51 * CenterY;
    const AsteroidMinRadius = 2;
    const AsteroidMaxRadius = 5
    const asteroids = 400;

    for (let i = 0; i < asteroids; i++)
    {
        let asteroid = document.createElement('div');
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
    let CenterY = window.innerHeight / 2;
    let CenterX = window.innerWidth / 2;
    let asteroids = document.querySelectorAll('.asteroids-belt-rock');

    for (let i = 0; i < asteroids.length; i++)
    {
        const asteroid = asteroids[i];
        let x = CenterX + Math.cos(asteroid.dataset.angle) * asteroid.dataset.radius;
        let y = CenterY + Math.sin(asteroid.dataset.angle) * asteroid.dataset.radius;

        asteroid.style.left = x + 'px';
        asteroid.style.top = y + 'px';
    }
}

function GenerateOrbits() {
    const Orbits = document.createElement('div');
    Orbits.classList.add('orbits');
    Planets = Array.from(document.querySelectorAll('.solar-object')).slice(1);
    let CenterY = window.innerHeight / 2;
    let CenterX = window.innerWidth / 2;
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
    let CenterY = window.innerHeight / 2;
    let CenterX = window.innerWidth / 2;
    let orbits = document.querySelectorAll('.orbit');
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

function FetchPlanetsAndSatellites() {
    let PlanetsWithSatellites = Array.from(document.querySelectorAll('.solar-object')).slice(1);

    for(let i = 0; i < PlanetsWithSatellites.length; i++)
    {
        PlanetsWithSatellites[i].dataset.orbit = OrbitPeriodMultiplier[i];
        PlanetsWithSatellites[i].dataset.angle = 0;
        let satellites = Array.from(PlanetsWithSatellites[i].children);

        for(let j = 0; j < satellites.length; j++)
        {
            satellites[j].dataset.angle = 0;
            satellites[j].dataset.radius = PlanetsWithSatellites[i].offsetHeight / 2;
            
            for(let k = 0; k < j; k++)
                satellites[j].dataset.radius += satellites[k].offsetHeight * 1;
            
            //satellites[j].dataset.radius -= satellites[j].offsetHeight / 2;
        }
    }
}

function DistanceBetween(ObjectA, ObjectB) {
    const x = ObjectA.offsetLeft - ObjectB.offsetLeft;
    const y = ObjectA.offsetTop - ObjectB.offsetTop;
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function OrbitAround(CenterOrbit, OrbitingObject, OrbitTime = 1, InitialAngle = 0, radius = 50){
    const FrameDelta = (1/60).toFixed(4);
    const AngularVelocity = ((2 * Math.PI) / OrbitTime) * TimeSpeed;
    let angle = InitialAngle * (Math.PI / 180);
    OrbitingObject.dataset.angle = InitialAngle * (Math.PI / 180);
    console.log(OrbitingObject.dataset.angle);
    let CenterX = CenterOrbit.offsetLeft;
    let CenterY = CenterOrbit.offsetTop;
    let x = CenterX + radius * Math.cos(angle);
    let y = CenterY + radius * Math.sin(angle);
    OrbitingObject.style.left = x + 'px';
    OrbitingObject.style.top = y + 'px';

    if(TimeSpeed != 0)
    {
        setInterval(() => 
        {
            CenterX = CenterOrbit.offsetLeft;
            CenterY = CenterOrbit.offsetTop;
            x = CenterX + radius * Math.cos(angle);
            y = CenterY + radius * Math.sin(angle);
            OrbitingObject.style.left = x + 'px';
            OrbitingObject.style.top = y + 'px';
            angle += AngularVelocity * FrameDelta;
            OrbitingObject.dataset.angle = angle;
        }, Math.floor(FrameDelta * 1000));
    }
}

function TimeFlow() {
    const Sun = document.querySelector('.sun');
    let planets = Array.from(document.querySelectorAll('.solar-object')).slice(1);

    for(let i = 0; i < planets.length; i++)
    {
        let OrbitTime = EarthYear * OrbitPeriodMultiplier[i];
        let InitialAngle = (RandomPosition) ? Math.random() * 360 : planets[i].dataset.angle;
        let DistanceRadius = DistanceBetween(Sun, planets[i]) * 0.998;
        let satellites = planets[i].children;

        OrbitAround(Sun, planets[i], OrbitTime, InitialAngle, DistanceRadius);

        for(let j = 0; j < satellites.length; j++)
        {
            let SatelliteClass = Array.from(satellites[j])[0];
            let SatelliteOrbitTime = OrbitTime * SatelliteOrbits[SatelliteClass];
            let SatelliteAngle = (RandomPosition) ?  Math.random() * 360 : 0;
            let SatelliteDistanceRadius = satellites[j].dataset.radius;

            OrbitAround(planets[i], satellites[j], SatelliteOrbitTime, SatelliteAngle, SatelliteDistanceRadius);
        }
    }
}   

document.addEventListener('DOMContentLoaded', 
function()
{
    FetchPlanetsAndSatellites();
    GenerateStarDots();
    GenerateOrbits();
    GenerateAsteroidsBelt();
    TimeFlow();
});

window.addEventListener('resize', 
function()
{
    RepositionOrbits();
    RepositionAsteroids();
});