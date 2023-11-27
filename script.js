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
var PreviousTimeSpeed = 0;
var TimeSpeed = 1;
var RandomPosition = false;

function ToggleBWFilter(seconds, SecondsDelay) {
    function BWPercentage(gray) {document.body.style.filter = `grayscale(${gray}%)`;}
  
    if(TimeSpeed == 0)
    {
        for(let gray = 0; gray < 101; gray++)
            setTimeout(() => {BWPercentage(gray);}, SecondsDelay * 1000 + gray * (seconds - SecondsDelay) * 10);
    }
    else
    {
        for(let gray = 0; gray < 101; gray++)
            setTimeout(() => {BWPercentage(100 - gray);}, SecondsDelay * 1000 + gray * (seconds - SecondsDelay) * 10);
    }
}

function ManageRing(seconds, SecondsDelay) {
    const Earth = document.querySelector('.earth');
    const ring = document.createElement('div');
    ring.classList.add('ring');
    Earth.appendChild(ring);
    
    function change(diameter) {
        diameter *= window.innerWidth / 50;
        ring.style.left = Earth.style.left;
        ring.style.top = Earth.style.top
        ring.style.width = diameter + 'px';
        ring.style.height = diameter + 'px';
    }
  
    if(TimeSpeed == 0)
    {
      for(let diameter = 0; diameter < 101; diameter++)
        setTimeout(() => {change(diameter);}, SecondsDelay * 1000 + diameter * (seconds - SecondsDelay) * 10);
  
      setTimeout(() => {ring.remove();}, seconds * 1000);
    }
    else
    {
      for(let diameter = 0; diameter < 101; diameter++)
        setTimeout(() => {change(100 - diameter);}, diameter * seconds * 10);
  
      setTimeout(() => {ring.remove();}, seconds * 1000);
    }
}
  
function ZaWarudo() {
    if(TimeSpeed != 0)
    { 
        PreviousTimeSpeed = TimeSpeed;
        TimeSpeed = 0;
        let TheWorld = new Audio('media/audio/Star Platinum The World Start.mp3')
        TheWorld.play();
        ToggleBWFilter(5, 2);
        ManageRing(5, 2);
        //TimeFlow();
    }
    else
    {
        TimeSpeed = PreviousTimeSpeed;
        PreviousTimeSpeed = 0;
        let TheWorld = new Audio('media/audio/Star Platinum The World End.mp3')
        TheWorld.play();
        ToggleBWFilter(2);
        ManageRing(2);
        //TimeFlow();
    }
  }

function GenerateStarDots() {
    const Space = document.createElement('div');
    Space.classList.add('space');
    document.body.appendChild(Space);

    for (let i = 0; i < 300; i++) {
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
    let MinAxys = (CenterY <= CenterX) ? CenterY : CenterX;
    const InnerRadius = 0.47 * MinAxys;
    const OuterRadius = 0.51 * MinAxys;
    const AsteroidMinRadius = 2;
    const AsteroidMaxRadius = 5
    const asteroids = 600;

    for (let i = 0; i < asteroids; i++)
    {
        let asteroid = document.createElement('div');
        asteroid.classList.add('asteroids-belt-rock');

        asteroid.dataset.angle = (i / asteroids) * 2 * Math.PI;
        asteroid.dataset.radius = InnerRadius + (OuterRadius - InnerRadius) * Math.random();
        asteroid.dataset.RadiusPercentage = asteroid.dataset.radius / MinAxys;
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
    let MinAxys = (CenterY <= CenterX) ? CenterY : CenterX;
    let asteroids = document.querySelectorAll('.asteroids-belt-rock');

    for (let i = 0; i < asteroids.length; i++)
    {
        let asteroid = asteroids[i];
        asteroid.dataset.radius = MinAxys * asteroid.dataset.RadiusPercentage;
        let x = CenterX + Math.cos(asteroid.dataset.angle) * asteroid.dataset.radius - asteroid.offsetWidth;
        let y = CenterY + Math.sin(asteroid.dataset.angle) * asteroid.dataset.radius - asteroid.offsetHeight;

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
        orbit.dataset.radius = radius;
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
        Planets[i].dataset.radius = radius * 0.998;
        Planets[i].style.top = CenterY - radius + 'px';
    }
}

function RepositionOrbits() {
    let CenterY = window.innerHeight / 2;
    let CenterX = window.innerWidth / 2;
    let orbits = document.querySelectorAll('.orbit');
    let MinRadius = document.querySelector('.sun').offsetHeight;
    let MinAxys = (CenterY <= CenterX) ? CenterY : CenterX;
    let MaxRadius = MinAxys + 0.05 * MinAxys;

    for (let i = 0; i < orbits.length; i++)
    {
        const percentage = i / orbits.length;
        const radius = MinRadius + percentage * (MaxRadius - MinRadius);
        let orbit = orbits[i];

        orbit.style.width = radius * 2 + 'px';
        orbit.style.height = radius * 2 + 'px';
        orbit.style.left = CenterX - radius + 'px';
        orbit.style.top = CenterY - radius + 'px';
    }
} 

function FetchPlanetsAndSatellites() {
    let PlanetsWithSatellites = Array.from(document.querySelectorAll('.solar-object')).slice(1);

    for(let i = 0; i < PlanetsWithSatellites.length; i++)
    {
        PlanetsWithSatellites[i].dataset.orbit = OrbitPeriodMultiplier[i];
        let satellites = Array.from(PlanetsWithSatellites[i].children);
        console.log(satellites);

        for(let j = 0; j < satellites.length; j++)
        {
            let radius = PlanetsWithSatellites[i].offsetHeight / 2;
            
            for(let k = 0; k < j; k++)
                radius += satellites[k].offsetHeight * 1.1;

            satellites[j].dataset.radius = radius;
        }
    }
}

function RepositionPlanetsAndSatellites() {
    const Sun = document.querySelector('.sun');
    const CenterX = Sun.offsetLeft;
    const CenterY = Sun.offsetTop;
    const orbits = Array.from(document.querySelectorAll('.orbit'));
    let planets = Array.from(document.querySelectorAll('.solar-object')).slice(1);

    if(TimeSpeed == 0)
    {
        for(let i = 0; i < orbits.length - 1; i++)
        {
            const index = (i < 4) ? i : i + 1;
            planets[i].dataset.radius = orbits[index].radius * 0.998;

            const x = CenterX + planets[i].dataset.radius * Math.cos(planets[i].dataset.angle);
            const y = CenterY + planets[i].dataset.radius * Math.sin(planets[i].dataset.angle);
            planets[i].style.left = x + 'px';
            planets[i].style.top = y + 'px';
        }
    }
}

function DistanceBetween(ObjectA, ObjectB) {
    const x = ObjectA.offsetLeft - ObjectB.offsetLeft;
    const y = ObjectA.offsetTop - ObjectB.offsetTop;
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function OrbitAround(CenterOrbit, OrbitingObject, OrbitTime = 1, InitialAngle = 0, radius = 50){
    let Time = null;
    const FrameDelta = (1/60).toFixed(4);
    const AngularVelocity = ((2 * Math.PI) / OrbitTime) * TimeSpeed;
    let angle = InitialAngle * (Math.PI / 180);
    OrbitingObject.dataset.angle = InitialAngle * (Math.PI / 180);
    let CenterX = CenterOrbit.offsetLeft;
    let CenterY = CenterOrbit.offsetTop;
    let x = CenterX + radius * Math.cos(angle);
    let y = CenterY + radius * Math.sin(angle);
    OrbitingObject.style.left = x + 'px';
    OrbitingObject.style.top = y + 'px';

    if(TimeSpeed != 0)
    {
        Time = setInterval(() => 
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
    else
    {
        clearInterval(Time);
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

        // for(let j = 0; j < satellites.length; j++)
        // {
        //     let SatelliteClass = Array.from(satellites[j])[0];
        //     let SatelliteOrbitTime = OrbitTime * SatelliteOrbits[SatelliteClass];
        //     let SatelliteAngle = (RandomPosition) ?  Math.random() * 360 : 0;
        //     let SatelliteDistanceRadius = satellites[j].dataset.radius;

        //     OrbitAround(planets[i], satellites[j], SatelliteOrbitTime, SatelliteAngle, SatelliteDistanceRadius);
        // }
    }
}   

document.addEventListener('DOMContentLoaded', 
function()
{
    FetchPlanetsAndSatellites();
    GenerateStarDots();
    GenerateOrbits();
    GenerateAsteroidsBelt();
    //TimeFlow();
});

window.addEventListener('resize', 
function()
{
    RepositionOrbits();
    RepositionAsteroids();
    RepositionPlanetsAndSatellites();
});