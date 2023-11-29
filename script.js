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

function ToggleBWFilter(seconds, SecondsDelay = 0) {
    function BWPercentage(gray) {document.body.style.filter = `grayscale(${gray}%)`;}
  
    if(TimeSpeed == 0)
    {
        for(let gray = 0; gray < 101; gray++)
            setTimeout(() => {BWPercentage(gray);}, SecondsDelay * 1000 + gray * (seconds - SecondsDelay) * 10);
    }
    else
    {
        for(let gray = 0; gray < 101; gray++)
            setTimeout(() => {BWPercentage(100 - gray);}, SecondsDelay * 1000 + gray * (seconds - SecondsDelay) * 10)
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
        ToggleBWFilter(4, 2);
        ManageRing(5, 2);
    }
    else
    {
        TimeSpeed = PreviousTimeSpeed;
        PreviousTimeSpeed = 0;
        let TheWorld = new Audio('media/audio/Star Platinum The World End.mp3')
        TheWorld.play();
        ToggleBWFilter(2);
        ManageRing(2);
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
    let OrbitRadius = document.querySelectorAll('.orbit')[4]
    OrbitRadius = Number((OrbitRadius.dataset.radius / MinAxys).toFixed(3));
    const InnerRadius = (OrbitRadius - 0.03) * MinAxys;
    const OuterRadius = (OrbitRadius + 0.005) * MinAxys;
    const AsteroidMinRadius = 2;
    const AsteroidMaxRadius = 5
    const asteroids = 300;

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
} 

function FetchPlanetsAndSatellites() {
    const Sun = document.querySelector('.center');
    const orbits = Array.from(document.querySelectorAll('.orbit'));
    let planets = Array.from(document.querySelectorAll('.solar-object')).slice(1);
    console.log(Sun.offsetLeft);
    console.log(' ')

    for(let i = 0; i < orbits.length; i++)
    {   
        let index = (i < 5) ? i : i - 1;
        let x = Sun.offsetLeft + Number(orbits[i].dataset.radius) - planets[index].offsetWidth / 2;
        let y = Sun.offsetTop - planets[index].offsetHeight / 2;
        planets[index].style.left = `${x}px`;
        planets[index].style.top = `${y}px`;
        console.log(i, planets[index].style.left, planets[index].style.top, planets[index].offsetWidth);
        let satellites = Array.from(planets[index].children);
        
        for(let j = 0; j < satellites.length; j++)
        {
            x = planets[index].offsetLeft + planets[index].offsetWidth / 2 - satellites[j].offsetWidth / 2;
            y = planets[index].offsetTop + planets[index].offsetHeight + 5;

            for(let k = 0; k < j; k++)
                y += satellites[k].offsetHeight + 3;

            satellites[j].style.left = `${x}px`;
            satellites[j].style.top = `${y}px`;
            console.log(i, j, satellites[j].style.left, satellites[j].style.top, satellites[j].offsetWidth);

        }
    }
}


function DistanceBetween(ObjectA, ObjectB) {
    const x = ObjectA.offsetLeft - ObjectB.offsetLeft;
    const y = ObjectA.offsetTop - ObjectB.offsetTop;
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function OrbitAround(center, OrbitingObject, radius, angle = 0, OrbitTime = 1) {
    let radian = angle * Math.PI / 180;
    const AngleIncrement = (2 * Math.PI) / (60 * OrbitTime);
  
    function updatePosition() {
        if (TimeSpeed !== 0)
        {
            radian += AngleIncrement * TimeSpeed;
    
            const centerX = center.offsetLeft + center.offsetWidth / 2;
            const centerY = center.offsetTop + center.offsetHeight / 2;
    
            const x = centerX + radius * Math.cos(radian);
            const y = centerY + radius * Math.sin(radian);
    
            OrbitingObject.style.left = x - OrbitingObject.offsetWidth / 2 + 'px';
            OrbitingObject.style.top = y - OrbitingObject.offsetHeight / 2 + 'px';
            OrbitingObject.dataset.angle = ((radian * 180 / Math.PI) % 360).toFixed(0);
        }
    }

    function frame() {
        updatePosition();
        requestAnimationFrame(frame);
    }
  
    frame();
}


function TimeFlow() {
    
} 
  

document.addEventListener('DOMContentLoaded', 
function()
{
    GenerateStarDots();
    GenerateOrbits();
    GenerateAsteroidsBelt();
    FetchPlanetsAndSatellites();
});

window.addEventListener('resize', 
function()
{

});