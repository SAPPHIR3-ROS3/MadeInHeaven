let OrbitPeriodMultiplier = [1/3, 2/3, 3/3 , 4/3, 6/3, 7/3, 8/3, 9/3, 10/3];
let SatelliteOrbits = 
{
    'moon': 1/13, 
    'phobos': 1/21, 
    'deimos': 1/5, 
    'io': 1/24, 
    'europa': 1/12, 
    'ganymede': 1/6, 
    'callisto': 1/2, 
    'titan': 1/67, 
    'rhea': 1/24,
    'titania': 1/35,
    'oberon': 1/22,
    'proteus': 1/53,
    'nereide': 1/2,
    'charon': 1/142
};
let EarthYear = 60;
let PreviousTimeSpeed = 0;
let TimeSpeed = 1;
let RandomPosition = true;
let ZaWarudoIsRunning = false;

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

function DaylightCycle() {
    let btw = document.querySelector('.night-to-day');
    let wtb = document.querySelector('.day-to-night');

    function ScrollDaylight() {
        // Get current position as a percentage
        let btwLeft = btw.offsetLeft / window.innerWidth * 100 + 1 * Math.log10(TimeSpeed);
        let wtbLeft = wtb.offsetLeft / window.innerWidth * 100 + 1 * Math.log10(TimeSpeed);

        console.log(btwLeft, wtbLeft);

        // If a div is completely out of view, reset it to the left of the other div
        if (btwLeft > 100)
            btwLeft -= 200;

        if (wtbLeft > 100)
            wtbLeft -= 200;

        btw.style.left = `${btwLeft}%`;
        wtb.style.left = `${wtbLeft}%`;
    }

    function DayNight() {
        ScrollDaylight();
        requestAnimationFrame(DayNight);
    }

    DayNight();
}
  
function ZaWarudo() {
    if(!ZaWarudoIsRunning)
    {
        ZaWarudoIsRunning = true;
        setTimeout(() => 
        {
            ZaWarudoIsRunning = false;
        }, 5 * 1000);
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
            ToggleBWFilter(3);
            ManageRing(2);
        }
    }
}

function Clock() {
    let Timestamp = new Date();
    let HoursDeg = ((Timestamp.getHours() % 12) / 12) * 360;
    let MinutesDeg = (Timestamp.getMinutes() / 60) * 360;
    let HoursHand = document.querySelector('.hours-hand');
    let MinutesHand = document.querySelector('.minutes-hand');
    const AngleIncrement = (2 * Math.PI) / (60 * EarthYear);

    HoursHand.style.transform = `rotate(${HoursDeg}deg)`;
    MinutesHand.style.transform = `rotate(${MinutesDeg}deg)`;

    function updateClockPosition() {
        if (TimeSpeed !== 0) {
            HoursDeg = HoursDeg + (AngleIncrement * TimeSpeed * 1 / 12);
            MinutesDeg = MinutesDeg + (AngleIncrement * TimeSpeed);
            HoursHand.style.transform = `rotate(${HoursDeg}deg)`;
            MinutesHand.style.transform = `rotate(${MinutesDeg}deg)`;
        }
    }

    function ClockFrame() {
        updateClockPosition();
        requestAnimationFrame(ClockFrame);
    }

    ClockFrame();
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
        asteroid.dataset.RadiusPercentage = Number(asteroid.dataset.radius) / MinAxys;
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

function DistanceBetween(ObjectA, ObjectB) {
    const x = ObjectA.offsetLeft - ObjectB.offsetLeft;
    const y = ObjectA.offsetTop - ObjectB.offsetTop;
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function FetchPlanetsAndSatellites() {
    let orbits = Array.from(document.querySelectorAll('.orbit'));
    let Sun = document.querySelector('.center');
    let planets = Array.from(document.querySelectorAll('.solar-object')).slice(1);
    
    for(let i = 0; i < orbits.length; i++)
    {
        let index = (i < 5) ? i : i - 1;
        planets[index].dataset.radius = orbits[i].dataset.radius;
        planets[index].dataset.angle = (RandomPosition) ? Math.random() * 359 : 0;
        let orbit = EarthYear * OrbitPeriodMultiplier[index];
        let satellites = Array.from(planets[index].children);
        OrbitAround(Sun, planets[index], Number(planets[index].dataset.radius), Number(planets[index].dataset.angle), orbit);
        
        for(let j = 0; j < satellites.length; j++)
        {
            let radius = 0;
            for(let k = 0; k < j; k++)
                radius += satellites[k].offsetHeight;
            
            radius += planets[index].offsetHeight;
            satellites[j].dataset.radius = radius;
            satellites[j].dataset.angle = (RandomPosition) ? Math.random() * 359 : 0;
            let SatelliteOrbit = EarthYear * OrbitPeriodMultiplier[index] * SatelliteOrbits[satellites[j].classList[0]];
            OrbitAround(planets[index], satellites[j], Number(satellites[j].dataset.radius), Number(satellites[j].dataset.angle), SatelliteOrbit);
        }
    }
}

function AsteroidsBeltSpin()
{
    let Sun = document.querySelector('.center');
    let asteroids = Array.from(document.querySelectorAll('.asteroids-belt-rock'));
    let OrbitTime = 5/3 * EarthYear;
    //console.log(OrbitTime);

    for(let i = 0; i < asteroids.length; i++)
    {
        //console.log(Sun, asteroids[i], Number(asteroids[i].dataset.radius), Number(asteroids[i].dataset.angle), OrbitTime);
        //OrbitAround(Sun, asteroids[i], Number(asteroids[i].dataset.radius), Number(asteroids[i].dataset.angle), OrbitTime);
    }
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

function SpiralAround(object, loops, duration, initialAngle) {
    let startTime = null;
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;
    let objectCenterX = object.offsetLeft + object.offsetWidth / 2;
    let objectCenterY = object.offsetTop + object.offsetHeight / 2;
    let initialRadius = Math.sqrt(Math.pow(centerX - objectCenterX, 2) + Math.pow(centerY - objectCenterY, 2));
    initialAngle = initialAngle * Math.PI / 180; // convert to radians

    function spiralMovement() {
        let currentTime = performance.now();
        if (!startTime) startTime = currentTime;
        let elapsed = (currentTime - startTime) / 1000; // convert to seconds
        let angle = initialAngle + Math.min(1, (elapsed / duration)) * 2 * Math.PI * loops;
        let radius = initialRadius * (1 - Math.min(1, elapsed / duration));
        let x = centerX + radius * Math.cos(angle) - object.offsetWidth / 2;
        let y = centerY + radius * Math.sin(angle) - object.offsetHeight / 2;
        object.style.left = x + 'px';
        object.style.top = y + 'px';
    }

    function animationControl() {
        if ((performance.now() - startTime) / 1000 < duration) { // convert to seconds
            spiralMovement();
            requestAnimationFrame(animationControl);
        } else {
            object.style.left = (centerX - object.offsetWidth / 2) + 'px';
            object.style.top = (centerY - object.offsetHeight / 2) + 'px';
        }
    }

    animationControl();
}

function RepositionOrbits()
{
    let orbits = Array.from(document.querySelectorAll('.orbit'));
    let CenterY = window.innerHeight / 2;
    let CenterX = window.innerWidth / 2;
    const MinRadius = document.querySelector('.sun').offsetHeight;
    const MaxRadius = CenterY + 0.05 * CenterY;
    
    for(let i = 0; i < orbits.length; i++)
    {
        const percentage = i / orbits.length;
        const radius = MinRadius + percentage * (MaxRadius - MinRadius);
        orbits[i].dataset.radius = radius;
        orbits[i].style.width = radius * 2 + 'px';
        orbits[i].style.height = radius * 2 + 'px';
        orbits[i].style.left = CenterX - radius + 'px';
        orbits[i].style.top = CenterY - radius + 'px';
    }
}

function RepositionAsteroids()
{
    let asteroids = Array.from(document.querySelectorAll('.asteroids-belt-rock'));
    let CenterY = window.innerHeight / 2;
    let CenterX = window.innerWidth / 2;
    let MinAxys = (CenterY <= CenterX) ? CenterY : CenterX;
    let OrbitRadius = document.querySelectorAll('.orbit')[4]
    OrbitRadius = Number((OrbitRadius.dataset.radius / MinAxys).toFixed(3));

    for(let i = 0; i < asteroids.length; i++)
    {
        asteroids[i].dataset.radius = asteroids[i].dataset.RadiusPercentage * MinAxys;
        const x = Math.cos(asteroids[i].dataset.angle) * asteroids[i].dataset.radius;
        const y = Math.sin(asteroids[i].dataset.angle) * asteroids[i].dataset.radius;
        const size = asteroids[i].offsetHeight; 
        asteroids[i].style.left = CenterX + x - size + 'px';
        asteroids[i].style.top = CenterY + y - size + 'px';
    }
}

document.addEventListener('DOMContentLoaded', 
function()
{
    GenerateStarDots();
    GenerateOrbits();
    GenerateAsteroidsBelt();
    FetchPlanetsAndSatellites();
    // AsteroidsBeltSpin();
});

window.addEventListener('resize', 
function()
{
    RepositionOrbits();
    RepositionAsteroids();
});