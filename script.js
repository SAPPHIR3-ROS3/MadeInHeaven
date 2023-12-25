// global variables

const TheWorldStart = new Audio('./media/audio/Star Platinum The World Start.mp3');
const TheWorldEnd = new Audio('./media/audio/Star Platinum The World End.mp3');
const Crucified = new Audio('./media/audio/Crucified Army of Lovers Short.mp3');
const MadeInHeavenAudio = new Audio('./media/audio/MadeInHeaven.mp3');
const UniverseResetAudio = new Audio('./media/audio/UniverseReset.mp3');
const SolarObjectsImages = 
{
    'sun': './media/images/sun.png',
    'mercury': './media/images/mercury.png',
    'venus': './media/images/venus.png',
    'earth': './media/images/earth.png',
    'mars': './media/images/mars.png',
    'jupiter': './media/images/jupiter.png',
    'saturn': './media/images/saturn.png',
    'uranus': './media/images/uranus.png',
    'neptune': './media/images/neptune.png',
    'pluto': './media/images/pluto.png',
}
const SatellitesImages =
{
    'moon': './media/images/moon.png',
    'phobos': './media/images/phobos.png',
    'deimos': './media/images/deimos.png',
    'io': './media/images/io.png',
    'europa': './media/images/europa.png',
    'ganymede': './media/images/ganymede.png',
    'callisto': './media/images/callisto.png',
    'titan': './media/images/titan.png',
    'rhea': './media/images/rhea.png',
    'titania': './media/images/titania.png',
    'oberon': './media/images/oberon.png',
    'proteus': './media/images/proteus.png',
    'nereide': './media/images/nereide.png',
    'charon': './media/images/charon.png'
}

let OrbitPeriodMultiplier = [1/3, 2/3, 3/3 , 4/3, 6/3, 7/3, 8/3, 9/3, 10/3];
let SatelliteOrbits = 
{
    'moon': 1/13, 
    'phobos': 1/21, 
    'deimos': 1/5, 
    'io': 1/24, 
    'europa': 1/12, 
    'ganymede': 1/6, 
    'callisto': 1/4, 
    'titan': 1/67, 
    'rhea': 1/24,
    'titania': 1/35,
    'oberon': 1/22,
    'proteus': 1/53,
    'nereide': 1/8,
    'charon': 1/142
};
let EarthYear = 60;
let PreviousTimeSpeed = 0;
let TimeSpeed = 1;
let trails = 1000;
let RandomPosition = true;
let MadeInHeavenIsRunning = false;
let UniverseIsResetting = false;
let ZaWarudoIsRunning = false;
let Spiraling = false;
let canvas;
let ctx;
let StarDots;
let orbits;
let AsteroidsBelt;
let Sun;
let Reset;
let Ring;

let mouse = {x: undefined, y: undefined, clicked: false};

// classes 

class StarDot {
    constructor(x, y, radius, color, canvas) {
        this.x = x;
        this.y = y;
        this.XPercentage = x / canvas.width;
        this.YPercentage = y / canvas.height;
        this.radius = radius;
        this.color = color;
        this.Channels = color.match(/\d+/g).map(Number);
        this.DistanceRadius = ((this.y - canvas.height / 2)**2 + (this.x - canvas.width / 2)**2)**(1/2);
        this.angle = Math.atan2(this.y - canvas.height / 2, this.x - canvas.width / 2);
        this.trail = [];
        this.TrailLength = trails;
        this.spirals = 11;
    }

    setPosition(canvas, angle, radius) {
        this.angle = angle;
        this.DistanceRadius = radius;

        if(this.trail.length < this.spirals)
            this.trail.unshift({x : this.x, y : this.y});
        else
        {
            this.trail.pop();
            this.trail.unshift({x : this.x, y : this.y});
        }

        this.x = canvas.width / 2 + this.DistanceRadius * Math.cos(this.angle);
        this.y = canvas.height / 2 + this.DistanceRadius * Math.sin(this.angle);
        this.XPercentage = this.x / canvas.width;
        this.YPercentage = this.y / canvas.height;
    }

    redraw(canvas) {
        this.x = this.XPercentage * canvas.width;
        this.y = this.YPercentage * canvas.height;
        let ctx = canvas.getContext('2d');

        this.draw(ctx);
    }

    draw(ctx, trail = false) {
        if(trail)
        {
            for(let i = 0; i < this.trail.length; i++)
            {
                let glow = 0.85 - (i)/ (this.trail.length);
                if(glow > 0)
                {
                    ctx.beginPath();
                    ctx.arc(this.trail[i].x, this.trail[i].y, this.radius, 0, 2 * Math.PI);
                    ctx.fillStyle = `rgba(${this.Channels[0]}, ${this.Channels[1]}, ${this.Channels[2]}, ${glow})`;
                    ctx.fill();
                }
            }
        }
        for(let i = this.radius; i < this.radius * 3; i++)
        {
            let glow = 0.85 - (i)/ (this.radius * 3);
            if(glow > 0)
            {
                ctx.beginPath();
                ctx.arc(this.x, this.y, i, 0, 2 * Math.PI);
                ctx.fillStyle = `rgba(${this.Channels[0]}, ${this.Channels[1]}, ${this.Channels[2]}, ${glow})`;
                ctx.fill();
            }
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(canvas, ctx, angle, radius, trail = false) {
        this.setPosition(canvas, angle, radius);
        this.draw(ctx , trail);
    }
}

class Orbit {
    constructor(radius, CenterX, CenterY) {
        this.CenterX = CenterX;
        this.CenterY = CenterY;
        this.radius = radius;
        this.RadiusPercentage = radius / CenterY;
        this.thickness = 2.5;
        this.color = 'rgba(255, 255, 255, 0.3)';
    }

    redraw(canvas){
        this.CenterX = canvas.width / 2;
        this.CenterY = canvas.height / 2;
        this.draw(ctx);
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.CenterX, this.CenterY, this.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.thickness;
        ctx.stroke();
    }

    update(canvas, ctx, radius) {
        this.CenterX = canvas.width / 2;
        this.CenterY = canvas.height / 2;
        this.radius = radius;
        this.draw(ctx);
    }
}

class Asteroid {
    constructor(angle, DistanceRadius, OrbitTime, canvas) {
        this.radius = Math.random() * 2.5 + 1;
        this.angle = angle;
        this.AngleRadians = angle * (Math.PI / 180);
        this.DistanceRadius = DistanceRadius;
        this.OrbitTime = OrbitTime;
        this.AngleDelta = 360 / (this.OrbitTime * 60);
        this.center = {x : canvas.width/2, y : canvas.height/2, radius : 0};
        let MinAxys = (canvas.height <= canvas.width) ? canvas.height : canvas.width;
        this.RadiusPercentage = DistanceRadius / MinAxys;
        this.x = canvas.width / 2 + this.DistanceRadius * Math.cos(this.AngleRadians);
        this.y = canvas.height / 2 + this.DistanceRadius * Math.sin(this.AngleRadians);
        this.color = 'rgb(180, 102, 0)';
        this.trail = [];
        this.TrailLength = trails;
        this.spirals = 5;
    }

    setPosition(canvas, angle, radius) {
        this.angle = angle;
        this.AngleRadians = this.angle * (Math.PI / 180);
        this.DistanceRadius = radius;

        if(this.trail.length < this.spirals)
            this.trail.unshift({x : this.x, y : this.y});
        else
        {
            this.trail.pop();
            this.trail.unshift({x : this.x, y : this.y});
        }

        this.x = canvas.width / 2 + this.DistanceRadius * Math.cos(this.AngleRadians);
        this.y = canvas.height / 2 + this.DistanceRadius * Math.sin(this.AngleRadians);
    }

    setPositionRadians(radian, radius) {
        this.AngleRadians = radian;
        this.angle = (this.AngleRadians * (180 / Math.PI)) % 360;
        this.DistanceRadius = radius;
        this.x = this.center.x + this.DistanceRadius * Math.cos(this.AngleRadians);
        this.y = this.center.y + this.DistanceRadius * Math.sin(this.AngleRadians);
    }

    setCenter(x, y, radius) {
        this.center = {x : x, y : y, radius : radius};
    }

    draw(ctx, trail = false) {
        if(trail)
        {
            for(let i = 0; i < this.trail.length; i++)
            {
                let glow = 0.85 - (i)/ (this.trail.length);
                if(glow > 0)
                {
                    ctx.beginPath();
                    ctx.arc(this.trail[i].x, this.trail[i].y, this.radius, 0, 2 * Math.PI);
                    ctx.fillStyle = `rgba(180, 102, 0, ${glow})`;
                    ctx.fill();
                }
            }
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(canvas, ctx, angle, radius , trail = false) {
        this.setPosition(canvas, angle, radius);
        this.draw(ctx , trail);
    }

    updateRadians(canvas, ctx, radian, radius){
        this.setPositionRadians(radian, radius);
        this.draw(ctx);
    }
}

class SolarObject {
    constructor(name, radius, orbitRadius, orbitPeriod, spirals, image, canvas, isSun = false, isSaturn = false) {
        ctx = canvas.getContext('2d');
        this.name = name;
        this.isSun = isSun;
        this.isSaturn = isSaturn;
        this.radius = radius;
        this.OrbitRadius = orbitRadius;
        this.OrbitPeriod = orbitPeriod;
        this.center = {x: canvas.width / 2, y: canvas.height / 2, radius: 0};
        this.OrbitAngle = 0;
        this.AngleRadians = this.OrbitAngle * (Math.PI / 180);
        this.AngleDelta = 360 / (this.OrbitPeriod * 60);
        this.x = this.center.x + this.OrbitRadius * Math.cos(this.OrbitAngle);
        this.y = this.center.y + this.OrbitRadius * Math.sin(this.OrbitAngle);
        this.RadiusPercentage = this.OrbitRadius / canvas.height;
        this.spirals = spirals;
        this.image = new Image();
        this.image.src = image;
        this.image.onload = () => {
            ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        };
        this.trail = [];
        this.TrailLength = trails;
        this.Satellites = Array.from([]);
    }

    setCenter(x, y, radius) {
        this.center = {x : x, y : y, radius : radius};
    }

    setAngle(angle) {
        this.OrbitAngle = angle;
        this.AngleRadians = this.OrbitAngle * (Math.PI / 180);
        this.x = this.center.x + this.OrbitRadius * Math.cos(this.AngleRadians);
        this.y = this.center.y / 2 + this.OrbitRadius * Math.sin(this.AngleRadians);
    }

    setRadian(radian) {
        this.AngleRadians = radian;
        this.OrbitAngle = this.AngleRadians * (180 / Math.PI);
        this.x = this.center.x + this.OrbitRadius * Math.cos(this.AngleRadians);
        this.y = this.center.y + this.OrbitRadius * Math.sin(this.AngleRadians);
    }

    setRadius(radius) {
        this.OrbitRadius = radius;
        this.x = this.center.x + this.OrbitRadius * Math.cos(this.AngleRadians);
        this.y = this.center.y + this.OrbitRadius * Math.sin(this.AngleRadians);
    }

    setPeriod(period) {
        this.OrbitPeriod = period;
        this.AngleDelta = 360 / this.OrbitPeriod;
    }

    setPosition(angle, radius) {
        this.OrbitAngle = angle;
        this.AngleRadians = this.OrbitAngle * (Math.PI / 180);
        this.OrbitRadius = radius;

        if(this.trail.length < this.spirals)
            this.trail.unshift({x : this.x, y : this.y});
        else
        {
            this.trail.pop();
            this.trail.unshift({x : this.x, y : this.y});
        }

        this.x = this.center.x + this.OrbitRadius * Math.cos(this.AngleRadians);
        this.y = this.center.y + this.OrbitRadius * Math.sin(this.AngleRadians);

        if(!UniverseIsResetting)
        {
            for(let i = 0; i < this.Satellites.length; i++)
                this.Satellites[i].setCenter(this.x, this.y, this.radius);
        }
    }

    setPositionRadians(radian, radius) {
        this.AngleRadians = radian;
        this.OrbitAngle = (this.AngleRadians * (180 / Math.PI)) % 360;
        this.OrbitRadius = radius;
        this.x = this.center.x + this.OrbitRadius * Math.cos(this.AngleRadians);
        this.y = this.center.y + this.OrbitRadius * Math.sin(this.AngleRadians);

        if(!Spiraling)
        {
            for(let i = 0; i < this.Satellites.length; i++)
                this.Satellites[i].setCenter(this.x, this.y, this.radius);
        }
    }

    setSatellites(Satellites) {
        this.Satellites = Array.from(Satellites);
    }

    draw(ctx, trail = false) {
        if(this.isSun)
        {
            for(let i = this.radius; i < this.radius * 2; i++)
            {
                let glow = 0.85 - (i)/ (this.radius * 2);
                if(glow > 0)
                {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, i, 0, 2 * Math.PI);
                    ctx.fillStyle = `rgba(230, 96, 0, ${glow})`;
                    ctx.fill();
                }
            }
        }

        if(trail)
        {
            for(let i = 0; i < this.trail.length; i++)
            {
                let glow = 0.85 - (i)/ (this.trail.length);
                if(glow > 0)
                {
                    ctx.globalAlpha = glow;
                    ctx.drawImage(this.image, this.trail[i].x - this.radius, this.trail[i].y - this.radius, this.radius * 2, this.radius * 2);
                    ctx.globalAlpha = 1.0;
                }
            }
        }

        if(this.isSaturn)
        {
            // TODO : draw saturn rings parallax
        }

        ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);

        if(this.isSaturn)
        {
            // TODO : draw saturn rings
        }
    }

    update(ctx, angle, radius, trail = false) {
        this.setPosition(angle, radius);
        this.draw(ctx, trail);
    }
}

class Satellite {
    constructor(name, radius, RelativeOrbitRadius, RelativerbitPeriod, center, spirals, image, canvas) {
        this.name = name;
        this.radius = radius;
        this.RelativeOrbitRadius = RelativeOrbitRadius;
        this.RelativeOrbitPeriod = RelativerbitPeriod;
        this.center = {x : center.x, y : center.y, radius : center.radius};
        this.OrbitAngle = 0;
        this.AngleRadians = this.OrbitAngle * (Math.PI / 180);
        this.AngleDelta = 360 / (this.RelativeOrbitPeriod * 60);
        this.x = this.center.x + this.RelativeOrbitRadius * Math.cos(this.OrbitAngle);
        this.y = this.center.y + this.RelativeOrbitRadius * Math.sin(this.OrbitAngle);
        this.RadiusPercentage = this.OrbitRadius / canvas.height;
        this.spirals = spirals;
        this.image = new Image();
        this.image.src = image;
        this.image.onload = () => {
            ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        };
    }

    setCenter(x, y, radius) {
        this.center = {x : x, y : y, radius : radius};
    }

    setRadius(radius) {
        this.RelativeOrbitRadius = radius;
        this.x = this.center.x + this.RelativeOrbitRadius * Math.cos(this.AngleRadians);
        this.y = this.center.y + this.RelativeOrbitRadius * Math.sin(this.AngleRadians);
    }

    setAngle(angle) {
        this.OrbitAngle = angle;
        this.AngleRadians = this.OrbitAngle * (Math.PI / 180);
        this.x = this.center.x + this.OrbitRadius * Math.cos(this.AngleRadians);
        this.y = this.center.y + this.OrbitRadius * Math.sin(this.AngleRadians);
    }

    setPeriod(period) {
        this.RelativeOrbitPeriod = period;
        this.AngleDelta = 360 / this.RelativeOrbitPeriod;
    }

    setPosition(angle, radius) {
        this.OrbitAngle = angle % 360;
        this.AngleRadians = this.OrbitAngle * (Math.PI / 180);
        this.OrbitRadius = radius;
        this.x = this.center.x + this.OrbitRadius * Math.cos(this.AngleRadians);
        this.y = this.center.y + this.OrbitRadius * Math.sin(this.AngleRadians);
    }

    setPositionRadians(radian, radius) {
        this.AngleRadians = radian;
        this.OrbitAngle = (this.AngleRadians * (180 / Math.PI)) % 360;
        this.OrbitRadius = radius;
        this.x = this.center.x + this.OrbitRadius * Math.cos(this.AngleRadians);
        this.y = this.center.y + this.OrbitRadius * Math.sin(this.AngleRadians);
    }

    recalculateNewCenterPosition(canvas) {
        let dx = this.x - canvas.width / 2;
        let dy = this.y - canvas.height / 2;
        let DistanceRadius = Math.sqrt(dx * dx + dy * dy);
        let angle = (Math.atan2(dy, dx) * (180 / Math.PI)) < 0 ? (Math.atan2(dy, dx) * (180 / Math.PI)) + 360 : (Math.atan2(dy, dx) * (180 / Math.PI));
        this.setCenter({ x: canvas.width / 2, y: canvas.height / 2 });
        this.setPosition(canvas, angle, DistanceRadius);
    }

    orbit(){
        function updatePosition() {
            let LocalCanvas = document.getElementById('canvas');
            let LocalCtx = LocalCanvas.getContext('2d');
            let angle = this.OrbitAngle; 
            let delta = this.AngleDelta * TimeSpeed;
            let radius = this.OrbitRadius;
            this.update(LocalCtx, (angle + delta) % 360 , radius);
        }

        function animate(){
            if(TimeSpeed !== 0 || !MadeInHeavenIsRunning)
            {
                updatePosition();
                requestAnimationFrame(animate);
            }
        }

        animate();
    }

    spiral(loops, duration) {
        let StartTime = performance.now();
        let InitialRadian = this.AngleRadians;
        let InitialRadius = this.OrbitRadius;
        
        function updatePosition() {
            let currentTime = performance.now();
            let elapsed = (currentTime - StartTime) / 1000;
            let radian = InitialRadian * (1 - Math.min(1, elapsed / duration)) * 2 * Math.PI * loops;
            let radius = InitialRadius * (1 - Math.min(1, elapsed / duration));

            this.setPositionRadians(radian, radius);
        }

        function animate(){
            if((performance.now() - StartTime) / 1000 < duration)
            {
                updatePosition();
                requestAnimationFrame(animate);
            }
            else
            {
                this.setPosition(0,0);
            }
        }

        animate();
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }

    update(ctx, angle, radius) {
        this.setPosition(angle, radius);
        this.draw(ctx);
    }
}

class ZaWarudoRing{
    constructor(earth) {
        this.center = {x : earth.x, y : earth.y};
        this.radius = 0;
        this.MinRadiusPercentage = 0.85;
        this.MinRadius = this.radius * this.MinRadiusPercentage;
        this.RestPercentege = 1 - this.MinRadiusPercentage;
    };

    draw(ctx) {
        let offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = ctx.canvas.width;
        offscreenCanvas.height = ctx.canvas.height;
        let offscreenCtx = offscreenCanvas.getContext('2d');
    
        offscreenCtx.drawImage(ctx.canvas, 0, 0);
        offscreenCtx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI, false);
        offscreenCtx.stroke();
        offscreenCtx.fill();

        let imageData = ctx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);

        for(let i = 0; i < imageData.data.length; i += 4) {
            let x = (i / 4) % offscreenCanvas.width;
            let y = Math.floor((i / 4) / offscreenCanvas.width);
            let dx = this.center.x - x;
            let dy = this.center.y - y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if(distance < this.radius) {
                imageData.data[i] = 255 - imageData.data[i];     
                imageData.data[i + 1] = 255 - imageData.data[i + 1];
                imageData.data[i + 2] = 255 - imageData.data[i + 2];
                imageData.data[i + 3] = imageData.data[i + 3];
            }
        }

        offscreenCtx.putImageData(imageData, 0, 0);
        ctx.drawImage(offscreenCanvas, 0, 0);
    }

    update(ctx, earth, radius) {
        this.center = {x : earth.x, y : earth.y};
        this.radius = radius;
        this.MinRadius = this.radius * this.MinRadiusPercentage;
        this.draw(ctx);
    }
}

class BlackHole{
    constructor(canvas){
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.radius = 45;
        this.PhotonSphereRadius = 0.7 * this.radius;
        this.OuterRadius = 1.35 * this.radius;
        this.vibration = 3;
    }

    setCenter(x, y) {
        this.x = x;
        this.y = y;
    }

    setRadius(radius) {
        this.radius = radius;
        this.PhotonSphereRadius = 0.7 * this.radius;
        this.OuterRadius = 1.35 * this.radius;
    }

    draw(ctx) {
        let x = this.x + (Math.random() - 0.5) * this.vibration;
        let y = this.y + (Math.random() - 0.5) * this.vibration;

        for(let i = this.radius; i < this.OuterRadius; i++)
        {
            let glow = 0.95 - (i)/ (this.OuterRadius);
            if(glow > 0)
            {
                ctx.beginPath();
                ctx.arc(x, y, i, 0, 2 * Math.PI);
                ctx.fillStyle = `rgba(255, 255, 255, ${glow})`;
                ctx.fill();
            }
        }

        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(x, y, this.PhotonSphereRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.closePath();
    }
}

// general functions

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    StarDots = GenerateStarDots(canvas);
    orbits = GenerateOrbits(canvas);
    AsteroidsBelt = GenerateAsteroidsBelt(canvas, orbits[4].radius);
    Reset = new BlackHole(canvas);
    Sun = new SolarObject('sun', 25, 0, 0, 0, SolarObjectsImages['sun'], canvas, true);
    Planets = GeneratePlanetsAndSatellites(canvas, orbits);
    TimeSpeed = 1;
    OrbitScene(canvas, ctx, StarDots, orbits, AsteroidsBelt, Sun, Planets);
}

function ToggleBWFilter(canvas, seconds, SecondsDelay = 0, increment = true) {
    let GrayDelta = (increment) ? 1 : -1;
    let InitialGray = (increment) ? 0 : 100;
    let duration = (seconds - SecondsDelay) * 10;

    function BWPercentage(gray) {
        canvas.style.filter = `grayscale(${gray}%)`;
        canvas.dataset.filter = gray / 100;
    }

    for(let gray = 0; gray < 101; gray++) 
        setTimeout(BWPercentage.bind(null, InitialGray + GrayDelta * gray), SecondsDelay * 1000 + gray * duration);
}

function Clock(seconds) {
    let opacity = 0;
    let FadeTime = seconds / 12;
    let exponent = 4.1;
    let StartTime = performance.now();
    let Timestamp = new Date();
    let HoursDeg = ((Timestamp.getHours() % 12) / 12) * 360;
    let MinutesDeg = (Timestamp.getMinutes() / 60) * 360;
    let Watch = document.createElement('div');
    Watch.classList.add('watch');
    let WatchFace = document.createElement('div');
    let HoursHand = document.createElement('div');
    let MinutesHand = document.createElement('div');
    const AngleIncrement = (2 * Math.PI) / (60 * EarthYear);
    const increment = AngleIncrement * TimeSpeed * (Math.log(TimeSpeed))**exponent;
    WatchFace.classList.add('watchface');
    HoursHand.classList.add('hours-hand');
    MinutesHand.classList.add('minutes-hand');
    Watch.appendChild(WatchFace);
    Watch.appendChild(MinutesHand);
    Watch.appendChild(HoursHand);
    document.body.appendChild(Watch);
    HoursHand.style.transform = `rotate(${HoursDeg}deg)`;
    MinutesHand.style.transform = `rotate(${MinutesDeg}deg)`;

    function ClockOpacity(opacity){
        WatchFace.style.opacity = opacity;
        HoursHand.style.opacity = opacity;
        MinutesHand.style.opacity = opacity;
    };

    function fadeIn() {
        if (opacity < 51) {
            ClockOpacity(opacity/100);
            opacity++;
            requestAnimationFrame(fadeIn);
        }
    }

    function fadeOut() {
        if (opacity > -1) {
            ClockOpacity(opacity/100);
            opacity--;
            requestAnimationFrame(fadeOut);
        } 
        else {
            Watch.remove();
        }
    }

    function updateClockPosition() {
        if (TimeSpeed !== 0) {
            HoursDeg += increment / 12;
            MinutesDeg += increment;
            HoursHand.style.transform = `translate(-50%, -50%) rotate(${HoursDeg}deg)`;
            MinutesHand.style.transform = `translate(-50%, -50%) rotate(${MinutesDeg}deg)`;
        }
    }

    function ClockFrame() {
        if((performance.now() - StartTime) / 1000 < seconds - FadeTime/10)
        {
            updateClockPosition();
            requestAnimationFrame(ClockFrame);
        }
        else
            fadeOut();
    }

    fadeIn();
    ClockFrame();
}

function DaylightCycle(seconds) {
    let exponent = 2;
    let StartTime = performance.now();
    let btw = document.createElement('div');
    let wtb = document.createElement('div');
    btw.classList.add('night-to-day');
    wtb.classList.add('day-to-night');
    document.body.appendChild(btw);
    document.body.appendChild(wtb);

    function ScrollDaylight() {
        let btwLeft = btw.offsetLeft / window.innerWidth * 100 + 1 * Math.log(TimeSpeed) * exponent;
        let wtbLeft = wtb.offsetLeft / window.innerWidth * 100 + 1 * Math.log(TimeSpeed) * exponent;

        if (btwLeft > 100)
            btwLeft -= 200;

        if (wtbLeft > 100)
            wtbLeft -= 200;

        btw.style.left = `${btwLeft}%`;
        wtb.style.left = `${wtbLeft}%`;
    }

    function DayNight() {
        if((performance.now() - StartTime) / 1000 < seconds)
        {
            ScrollDaylight();
            requestAnimationFrame(DayNight);
        }
        else
        {
            document.body.removeChild(btw);
            document.body.removeChild(wtb);
        }
    }

    DayNight();
}

function HoverEffect(ctx, object) {
    ctx.beginPath();
    ctx.arc(object.x, object.y, object.radius + 2, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function GenerateStarDots(canvas) {
    let ctx = canvas.getContext('2d');
    let StarDots = [];
    let stars = 500;
    let colors = ['rgb(1, 30, 72)', 'rgb(75, 56, 111)', 'rgb(16, 80, 105)', 'rgb(107, 107, 3)'];

    for(let i = 0; i < stars; i++)
    {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let radius = Math.random() * 2 + 1.5;
        let color = colors[Math.floor(Math.random() * colors.length)];
        StarDots.push(new StarDot(x, y, radius, color, canvas));
    }

    for(let i = 0; i < StarDots.length; i++)
        StarDots[i].draw(ctx);

    return StarDots;
}

function GenerateOrbits(canvas) {
    let ctx = canvas.getContext('2d');
    let Orbits = [];
    let CenterX = canvas.width / 2;
    let CenterY = canvas.height / 2;
    const MinRadius = 0.125 * CenterY;
    const MaxRadius = CenterY + 0.065 * CenterY;
    const NumOrbits = 10;

    for(let i = 0; i < NumOrbits; i++)
    {
        let percentage = i / NumOrbits;
        let radius = MinRadius + percentage * (MaxRadius - MinRadius);
        Orbits.push(new Orbit(radius, CenterX, CenterY));
    }

    for(let i = 0; i < Orbits.length; i++)
        if(i !== 4)
            Orbits[i].draw(ctx, canvas.width / 2, canvas.height / 2, Orbits[i].radius);

    return Orbits;
}

function GenerateAsteroidsBelt(canvas, OrbitRadius){
    let ctx = canvas.getContext('2d');
    let AsteroidsBelt = [];
    let asteroids = 500;
    let CenterX = Number(canvas.width) / 2;
    let CenterY = Number(canvas.height) / 2;
    let MinAxys = (CenterY <= CenterX) ? CenterY : CenterX;
    const InnerRadius = OrbitRadius - 0.035 * MinAxys;
    const OuterRadius = OrbitRadius - 0.02 * MinAxys;
    let AsteroidsAngle = 0;
    let AngleDelta = 360 / asteroids;
    let Variation = 4;
    for(let i = 0; i < asteroids; i++)
    {
        let radius = Math.random() * (OuterRadius - InnerRadius) + InnerRadius;
        let OrbitTime = 5/3 * EarthYear + ((Math.random() * Variation) - (Variation/2));
        AsteroidsBelt.push(new Asteroid(AsteroidsAngle, radius, OrbitTime, canvas));
        AsteroidsAngle += AngleDelta;
    }

    for(let i = 0; i < AsteroidsBelt.length; i++)
        AsteroidsBelt[i].draw(ctx);

    return AsteroidsBelt;
}

function GeneratePlanetsAndSatellites(canvas, orbits) {
    let CenterMultiplier = 1.5;

    let Mercury = new SolarObject('mercury', 4, orbits[0].radius, OrbitPeriodMultiplier[0] * EarthYear, 0.5, SolarObjectsImages['mercury'], canvas);
    Mercury.setPosition(Math.random() * 359, Mercury.OrbitRadius);
    
    let Venus = new SolarObject('venus', 8, orbits[1].radius, OrbitPeriodMultiplier[1] * EarthYear, 1.5, SolarObjectsImages['venus'], canvas);
    Venus.setPosition(Math.random() * 359, Venus.OrbitRadius);
    
    let Earth = new SolarObject('earth', 8.5, orbits[2].radius, OrbitPeriodMultiplier[2] * EarthYear, 2.5, SolarObjectsImages['earth'], canvas);
    Earth.setPosition(Math.random() * 359, Earth.OrbitRadius);
    let Moon = new Satellite('moon', 3, Earth.radius * CenterMultiplier + 3, SatelliteOrbits['moon'] * Earth.OrbitPeriod, Earth, 2.5, SatellitesImages['moon'], canvas);
    Moon.setPosition(Math.random() * 359, Moon.center.radius * CenterMultiplier + Moon.radius);
    Earth.setSatellites([Moon]);
    
    let Mars = new SolarObject('mars', 7,orbits[3].radius, OrbitPeriodMultiplier[3] * EarthYear, 3.5, SolarObjectsImages['mars'], canvas);
    Mars.setPosition(Math.random() * 359, Mars.OrbitRadius);
    let Phobos = new Satellite('phobos', 2.5, Mars.radius * CenterMultiplier + 2.5, SatelliteOrbits['phobos'] * Mars.OrbitPeriod, Mars, 3.5, SatellitesImages['phobos'], canvas);
    let Deimos = new Satellite('deimos', 2, Mars.radius * CenterMultiplier + Phobos.radius * 2 + 2 + 1, SatelliteOrbits['deimos'] * Mars.OrbitPeriod, 3.5, Mars, SatellitesImages['deimos'], canvas);
    Phobos.setPosition(Math.random() * 359, Phobos.center.radius * CenterMultiplier + Phobos.radius);
    Deimos.setPosition(Math.random() * 359, Deimos.center.radius * CenterMultiplier + Phobos.radius * 2 + Deimos.radius + 1);
    Mars.setSatellites([Phobos, Deimos]);
    
    let Jupiter = new SolarObject('jupiter', 18, orbits[5].radius, OrbitPeriodMultiplier[4] * EarthYear, 5.5, SolarObjectsImages['jupiter'], canvas);
    Jupiter.setPosition(Math.random() * 359, Jupiter.OrbitRadius);
    let Io = new Satellite('io', 2, Jupiter.radius * (CenterMultiplier - 0.15) + 2, SatelliteOrbits['io'] * Jupiter.OrbitPeriod, Jupiter, 5.5, SatellitesImages['io'], canvas);
    let Europa = new Satellite('europa', 2, Jupiter.radius * (CenterMultiplier - 0.15) + Io.radius * 2 + 2 + 1, SatelliteOrbits['europa'] * Jupiter.OrbitPeriod, Jupiter, 5.5, SatellitesImages['europa'], canvas);
    let Ganymede = new Satellite('ganymede', 3, Jupiter.radius * (CenterMultiplier - 0.15) + Io.radius * 2 + Europa.radius * 2 + 3 + 2, SatelliteOrbits['ganymede'] * Jupiter.OrbitPeriod, Jupiter, 5.5, SatellitesImages['ganymede'], canvas);
    let Callisto = new Satellite('callisto', 2.5, Jupiter.radius * (CenterMultiplier - 0.15) + Io.radius * 2 + Europa.radius * 2 + Ganymede.radius * 2 + 2.5 + 3, SatelliteOrbits['callisto'] * Jupiter.OrbitPeriod, Jupiter, 5.5, SatellitesImages['callisto'], canvas);
    Io.setPosition(Math.random() * 359, Io.center.radius * (CenterMultiplier - 0.15) + Io.radius);
    Europa.setPosition(Math.random() * 359, Europa.center.radius * (CenterMultiplier - 0.15) + Io.radius * 2 + Europa.radius + 1);
    Ganymede.setPosition(Math.random() * 359, Ganymede.center.radius * (CenterMultiplier - 0.15) + Io.radius * 2 + Europa.radius * 2 + Ganymede.radius + 2);
    Callisto.setPosition(Math.random() * 359, Callisto.center.radius * (CenterMultiplier - 0.15) + Io.radius * 2 + Europa.radius * 2 + Ganymede.radius * 2 + Callisto.radius + 3);
    Jupiter.setSatellites([Io, Europa, Ganymede, Callisto]);
    
    let Saturn = new SolarObject('saturn', 16, orbits[6].radius, OrbitPeriodMultiplier[5] * EarthYear, 6.5, SolarObjectsImages['saturn'], canvas, false, true);
    Saturn.setPosition(Math.random() * 359, Saturn.OrbitRadius);
    let Titan = new Satellite('titan', 3.5, Saturn.radius * CenterMultiplier + 3.5, SatelliteOrbits['titan'] * Saturn.OrbitPeriod, Saturn, 6.5, SatellitesImages['titan'], canvas);
    let Rhea = new Satellite('rhea', 2, Saturn.radius * CenterMultiplier + Titan.radius * 2 + 2 + 1, SatelliteOrbits['rhea'] * Saturn.OrbitPeriod, Saturn, 6.5, SatellitesImages['rhea'], canvas);
    Titan.setPosition(Math.random() * 359, Titan.center.radius * CenterMultiplier + Titan.radius);
    Rhea.setPosition(Math.random() * 359, Rhea.center.radius * CenterMultiplier + Titan.radius * 2.2 + Rhea.radius);
    Saturn.setSatellites([Titan, Rhea]);
    
    let Uranus = new SolarObject('uranus', 13, orbits[7].radius, OrbitPeriodMultiplier[6] * EarthYear, 7.5, SolarObjectsImages['uranus'], canvas);
    Uranus.setPosition(Math.random() * 359, Uranus.OrbitRadius);
    let Titania = new Satellite('titania', 2.5, Uranus.radius * CenterMultiplier + 2.5, SatelliteOrbits['titania'] * Uranus.OrbitPeriod, Uranus, 7.5, SatellitesImages['titania'], canvas);
    let Oberon = new Satellite('oberon', 2.5, Uranus.radius * CenterMultiplier + Titania.radius * 2 + 2.5 + 1, SatelliteOrbits['oberon'] * Uranus.OrbitPeriod, Uranus, 7.5, SatellitesImages['oberon'], canvas);
    Titania.setPosition(Math.random() * 359, Titania.center.radius * CenterMultiplier + Titania.radius);
    Oberon.setPosition(Math.random() * 359, Oberon.center.radius * CenterMultiplier + Titania.radius * 2 + Oberon.radius + 1);
    Uranus.setSatellites([Titania, Oberon]);
    
    let Neptune = new SolarObject('neptune', 12.5, orbits[8].radius, OrbitPeriodMultiplier[7] * EarthYear, 8.5, SolarObjectsImages['neptune'], canvas);
    Neptune.setPosition(Math.random() * 359, Neptune.OrbitRadius);
    let Nereide = new Satellite('nereide', 2, Neptune.radius * CenterMultiplier + 2, SatelliteOrbits['nereide'] * Neptune.OrbitPeriod, Neptune, 8.5, SatellitesImages['nereide'], canvas);
    let Proteus = new Satellite('proteus', 2, Neptune.radius * CenterMultiplier + Nereide.radius * 2 + 2 + 1, SatelliteOrbits['proteus'] * Neptune.OrbitPeriod, Neptune, 8.5, SatellitesImages['proteus'], canvas);
    Nereide.setPosition(Math.random() * 359, Nereide.center.radius * CenterMultiplier + Nereide.radius);
    Proteus.setPosition(Math.random() * 359, Proteus.center.radius * CenterMultiplier + Nereide.radius * 2 + Proteus.radius + 1);
    Neptune.setSatellites([Nereide, Proteus]);

    let Pluto = new SolarObject('pluto', 4, orbits[9].radius, OrbitPeriodMultiplier[8] * EarthYear, 9.5, SolarObjectsImages['pluto'], canvas);
    Pluto.setPosition(Math.random() * 359, Pluto.OrbitRadius);
    let Charon = new Satellite('charon', 2, Pluto.radius * CenterMultiplier + 2, SatelliteOrbits['charon'] * Pluto.OrbitPeriod, Pluto, 9.5, SatellitesImages['charon'], canvas);
    Charon.setPosition(Math.random() * 359, Charon.center.radius * CenterMultiplier + Charon.radius);
    Pluto.setSatellites([Charon]);

    Planets = [Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto];

    return Planets;
}

function OrbitScene(canvas, ctx, StarDots, orbits, AsteroidsBelt, Sun, Planets) {
    function update() {
        if(TimeSpeed != 0 && !UniverseIsResetting)
        {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for(let i = 0; i < StarDots.length; i++)
                StarDots[i].draw(ctx);

            for(let i = 0; i < orbits.length; i++)
                if(i !== 4)
                    orbits[i].draw(ctx);

            for(let i = 0; i < AsteroidsBelt.length; i++)
            {
                AsteroidsBelt[i].setCenter(canvas.width/2, canvas.height/2, 0);
                let angle = AsteroidsBelt[i].angle; 
                let delta = AsteroidsBelt[i].AngleDelta * TimeSpeed;
                let radius = AsteroidsBelt[i].DistanceRadius;
                AsteroidsBelt[i].update(canvas, ctx, (angle + delta) % 360 , radius);
            }

            Sun.draw(ctx);

            for(let i = 0; i < Planets.length; i++)
            {
                Planets[i].setCenter(canvas.width/2, canvas.height/2, 0);
                let angle = Planets[i].OrbitAngle; 
                let delta = Planets[i].AngleDelta * TimeSpeed;
                let radius = Planets[i].OrbitRadius;
                Planets[i].update(ctx, (angle + delta) % 360, radius);

                for(let j = 0; j < Planets[i].Satellites.length; j++)
                {
                    let angle = Planets[i].Satellites[j].OrbitAngle; 
                    let delta = Planets[i].Satellites[j].AngleDelta * TimeSpeed;
                    let radius = Planets[i].Satellites[j].RelativeOrbitRadius;
                    Planets[i].Satellites[j].update(ctx, (angle + delta) % 360, radius);
                }
            }

            if(!MadeInHeavenIsRunning)
            {
                if(Math.abs(mouse.x - Sun.x) < Sun.radius && Math.abs(mouse.y - Sun.y) < Sun.radius)
                {    
                    HoverEffect(ctx, Sun);

                    if(mouse.clicked)
                    {
                        MadeInHeavenStart();
                        mouse.clicked = false;
                    }
                }

                let EarthIndex = 2

                if(Math.abs(mouse.x - Planets[EarthIndex].x) < Planets[EarthIndex].radius && Math.abs(mouse.y - Planets[EarthIndex].y) < Planets[EarthIndex].radius)
                {    
                    HoverEffect(ctx, Planets[EarthIndex]);

                    if(mouse.clicked && !ZaWarudoIsRunning)
                        ZaWarudoStart(canvas, ctx, StarDots, orbits, AsteroidsBelt, Sun, Planets);
                    
                }
            }

        }
        else if (TimeSpeed == 0 && MadeInHeavenIsRunning)
        {
            SpiralScene(canvas, ctx, StarDots, AsteroidsBelt, Planets);
            TimeSpeed = 1;
        }
    }

    function animate() {
        update();
        requestAnimationFrame(animate);
    }

    animate();
}

function SpiralScene(canvas, ctx, StarDots, AsteroidsBelt, Planets) {
    let StartTime = performance.now();
    let duration = 29;
    let BlackHoleRadius = Reset.PhotonSphereRadius;
    let Axys = (canvas.width**2 + canvas.height**2)**(1/2);
    let StarDotsInitialAngles = StarDots.map((StarDot) => StarDot.angle);
    let StarDotsInitialRadius = StarDots.map((StarDot) => StarDot.DistanceRadius);
    let StarDotsSpiralsDuration = StarDots.map(() => duration - Math.random() * 4);
    let AsteroidsInitialAngles = AsteroidsBelt.map((Asteroid) => Asteroid.angle);
    let AsteroidsInitialRadius = AsteroidsBelt.map((Asteroid) => Asteroid.DistanceRadius);

    let PlanetsInitialAngles = [];

    for(let i = 0; i < Planets.length; i++)
        PlanetsInitialAngles.push(Planets[i].OrbitAngle);

    let PlanetsInitialRadius = [];

    for(let i = 0; i < Planets.length; i++)
        PlanetsInitialRadius.push(Planets[i].OrbitRadius);

    let Satellites = {};

    for(let i = 0; i < Planets.length; i++)
        for(let j = 0; j < Planets[i].Satellites.length; j++)
            Satellites[Planets[i].Satellites[j].name] = Planets[i].Satellites[j];

    for(let satellite in Satellites)
        Satellites[satellite].recalculateNewCenterPosition(canvas);
    
    let SatellitesInitialAngles = {};
    let SatellitesInitialRadius = {};
    
    for(let satellite in Satellites)
    {
        SatellitesInitialAngles[satellite] = Satellites[satellite].OrbitAngle;
        SatellitesInitialRadius[satellite] = Satellites[satellite].RelativeOrbitRadius;
    }

    // console.log(SatellitesInitialAngles, SatellitesInitialRadius);

    function update() {
        if(UniverseIsResetting)
        {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let CurrentTime = performance.now();
            let elapsed = (CurrentTime - StartTime) / 1000;

            if(elapsed > duration && elapsed - duration < 1)
                Reset.setRadius(Reset.radius * (1 - (elapsed - duration)));

            if(elapsed < duration + 1)
                Reset.draw(ctx);
            else if(elapsed > duration + 1 && elapsed < duration + 2)
            {
                ctx.beginPath();
                ctx.arc(canvas.width / 2, canvas.height / 2, Axys * (elapsed - duration - 1), 0, 2 * Math.PI);
                ctx.fillStyle = 'white';
                ctx.fill();
                ctx.closePath();
            }
            else
                UniverseIsResetting = false;

            for(let i = 0; i < StarDots.length; i++)
            {
                let PercentagePassed = elapsed / StarDotsSpiralsDuration[i];
                let angle = StarDotsInitialAngles[i] + Math.min(1, PercentagePassed) * 2 * Math.PI * StarDots[i].spirals;
                let radius = StarDotsInitialRadius[i] * (1 - Math.min(1, PercentagePassed));

                if(StarDots[i].DistanceRadius > BlackHoleRadius)
                    StarDots[i].update(canvas, ctx, angle, radius, true);
            }

            let PercentagePassed = elapsed / duration;

            for(let i = 0; i < AsteroidsBelt.length; i++)
            {
                let angle = AsteroidsInitialAngles[i] + (Math.min(1, PercentagePassed) * 2 * Math.PI * AsteroidsBelt[i].spirals) * (180 / Math.PI);
                let radius = AsteroidsInitialRadius[i] * (1 - Math.min(1, PercentagePassed));

                if(AsteroidsBelt[i].DistanceRadius > BlackHoleRadius)
                    AsteroidsBelt[i].update(canvas, ctx, angle, radius, true);
            }


            for(let i = 0; i < Planets.length; i++)
            {
                let angle = PlanetsInitialAngles[i] + (Math.min(1, PercentagePassed) * 2 * Math.PI * Planets[i].spirals) * (180 / Math.PI);
                let radius = PlanetsInitialRadius[i] * (1 - Math.min(1, PercentagePassed));

                if(Planets[i].OrbitRadius > BlackHoleRadius)
                    Planets[i].update(ctx, angle, radius, true);
            }

            for(let satellite in Satellites)
            {
                let angle = SatellitesInitialAngles[satellite] + (Math.min(1, PercentagePassed) * 2 * Math.PI * Satellites[satellite].spirals) * (180 / Math.PI);
                let radius = SatellitesInitialRadius[satellite] * (1 - Math.min(1, PercentagePassed));

                if(Satellites[satellite].RelativeOrbitRadius > BlackHoleRadius)
                    Satellites[satellite].update(ctx, angle, radius);
            }
        }
    }

    function animate() {
        if(UniverseIsResetting)
        { 
            update();
            requestAnimationFrame(animate);
        }
        else
            location.reload(true);
    }

    UniverseIsResetting = true;
    
    animate();
}

function ZaWarudoStart(canvas, ctx, StarDots, orbits, AsteroidsBelt, Sun, Planets) {
    let StartDuration = 4;
    let delay = 2;
    let StartTime;
    let ended = false;
    let Ring = new ZaWarudoRing(Planets[2]);
    let radius = 0;
    let Axys = (canvas.width**2 + canvas.height**2)**(1/2);
    let MaxRadius = Axys * (1/Ring.MinRadiusPercentage);

    function update(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let currentTime = performance.now();
        let elapsed = (currentTime - StartTime) / 1000;
        
        for(let i = 0; i < StarDots.length; i++)
            StarDots[i].draw(ctx);

        for(let i = 0; i < orbits.length; i++)
            if(i !== 4)
                orbits[i].draw(ctx);
        
        for(let i = 0; i < AsteroidsBelt.length; i++)
            AsteroidsBelt[i].draw(ctx);

        Sun.draw(ctx);

        for(let i = 0; i < Planets.length; i++)
        {
            Planets[i].draw(ctx);

            for(let j = 0; j < Planets[i].Satellites.length; j++)
                Planets[i].Satellites[j].draw(ctx);
        }

        ZaWarudoIsRunning = (elapsed < StartDuration) ? true : false;

        if(ZaWarudoIsRunning && radius < MaxRadius)
        {
            radius = MaxRadius * (elapsed / StartDuration);
            Ring.update(ctx, Planets[2], radius);
        }

        if(!ZaWarudoIsRunning)
        {
            let EarthIndex = 2

            if(Math.abs(mouse.x - Planets[EarthIndex].x) < Planets[EarthIndex].radius && Math.abs(mouse.y - Planets[EarthIndex].y) < Planets[EarthIndex].radius)
            {    
                HoverEffect(ctx, Planets[EarthIndex]);

                if(mouse.clicked && !ZaWarudoIsRunning)
                {
                    ZaWarudoEnd(canvas, ctx, StarDots, orbits, AsteroidsBelt, Sun, Planets);
                    mouse.clicked = false;
                }
            }
        }
    }

    function animate() {
        if(!ended)
        {
            update();
            requestAnimationFrame(animate);
        }
    }

    mouse.clicked = false;
    ZaWarudoIsRunning = true;
    setTimeout(() => {ZaWarudoIsRunning = false}, StartDuration * 1000);
    setTimeout(() => {PreviousTimeSpeed = TimeSpeed; TimeSpeed = 0;}, delay * 1000);
    TheWorldStart.play();
    ToggleBWFilter(canvas, StartDuration, delay, true);
    setTimeout(() => {
        StartTime = performance.now();
        animate();
    }, delay * 1000);
}

function ZaWarudoEnd(canvas, ctx, StarDots, orbits, AsteroidsBelt, Sun, Planets) {
    let EndDuration = 2;
    let EndTime;
    let ended = false;
    let Ring = new ZaWarudoRing(Planets[2]);
    let Axys = (canvas.width**2 + canvas.height**2)**(1/2);
    let MaxRadius = Axys * (1/Ring.MinRadiusPercentage);
    let radius = MaxRadius;

    function update(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let currentTime = performance.now();
        let elapsed = (currentTime - EndTime) / 1000;
        
        for(let i = 0; i < StarDots.length; i++)
            StarDots[i].draw(ctx);

        for(let i = 0; i < orbits.length; i++)
            if(i !== 4)
                orbits[i].draw(ctx);
        
        for(let i = 0; i < AsteroidsBelt.length; i++)
            AsteroidsBelt[i].draw(ctx);

        Sun.draw(ctx);

        for(let i = 0; i < Planets.length; i++)
        {
            Planets[i].draw(ctx);

            for(let j = 0; j < Planets[i].Satellites.length; j++)
                Planets[i].Satellites[j].draw(ctx);
        }

        ZaWarudoIsRunning = (elapsed < EndDuration) ? true : false;

        if(ZaWarudoIsRunning && radius > 0)
        {
            radius = MaxRadius * (1 - (elapsed / EndDuration));
            Ring.update(ctx, Planets[2], radius);
        }

        if(!ZaWarudoIsRunning)
        {
            ended = true;
            mouse.clicked = false;
        }
    }

    function animate() {
        if(!ended)
        {
            update();
            requestAnimationFrame(animate);
        }
    }

    mouse.clicked = false;
    ZaWarudoIsRunning = true;
    setTimeout(() => {ZaWarudoIsRunning = false}, EndDuration * 1000);
    setTimeout(() => {TimeSpeed = PreviousTimeSpeed; PreviousTimeSpeed = 0;}, EndDuration * 1000);
    TheWorldEnd.play();
    ToggleBWFilter(canvas, EndDuration, 0, false);
    setTimeout(() => {
        EndTime = performance.now();
        animate();
    }, 0);
}

function MadeInHeavenStart() {
    if(!MadeInHeavenIsRunning)
    {
        MadeInHeavenIsRunning = true;
        let SpeedPhase1 = 2901;
        let SpeedPhase2 = 6501;
        let SpeedPhase3 = 10001;

        let DPhase0 = 17;
        let DPhase1 = 5;
        let DPhase2 = 14;
        let DPhase3 = 33.5;
        let DPhase4 = 31;

        let MadeInHeavenText = document.createElement('div');
        MadeInHeavenText.id = 'MadeInHeaven';
        MadeInHeavenText.innerHTML = 'Made in<br>Heaven';
        let StartTime = performance.now();
        let CurrentTime;
        
        Crucified.play();

        setTimeout(() =>
        {
            for(let i = 0; i < SpeedPhase1; i++)
                setTimeout(() => {
                    TimeSpeed = 1+i/100;
                }, i/SpeedPhase1 * SpeedPhase1);
            
            CurrentTime = performance.now();
        }, DPhase0 * 1000);
        setTimeout(() =>
        {
            MadeInHeavenAudio.play();
            document.body.appendChild(MadeInHeavenText);
        }, (DPhase0 - 1) * 1000);
        setTimeout(() =>
        {
            Clock(DPhase2);

            for(let i = SpeedPhase1 + 99; i < SpeedPhase2; i++)
                setTimeout(() => {
                    TimeSpeed = i/100;
                }, (i - SpeedPhase1 - 99)/(SpeedPhase2 - SpeedPhase1) * DPhase2 * 1000);

            document.body.removeChild(MadeInHeavenText);
            CurrentTime = performance.now();
        }, (DPhase0 + DPhase1) * 1000);
        setTimeout(() =>
        {
            DaylightCycle(DPhase3);

            for(let i = SpeedPhase2 - 1; i < SpeedPhase3; i++)
                if(i % 200 == 0)
                    setTimeout(() => {
                        TimeSpeed = i/100;
                    }, (i - SpeedPhase2 + 1)/(SpeedPhase3 - SpeedPhase2) * DPhase3 * 1000);

            CurrentTime = performance.now();
        }, (DPhase0+DPhase1+DPhase2) * 1000);
        setTimeout(() =>
        {
            TimeSpeed = 0;
            UniverseResetAudio.play();
            CurrentTime = performance.now();
        }, (DPhase0+DPhase1+DPhase2+DPhase3) * 1000);
        setTimeout(() => 
        {
            MadeInHeavenIsRunning = false;
            CurrentTime = performance.now();
        }, (DPhase0+DPhase1+DPhase2+DPhase3 + DPhase4) * 1000);
    }
}

// events

document.addEventListener('DOMContentLoaded', 
function() {
    init();
});

window.addEventListener('mousemove',
function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('click',
function(){
    mouse.clicked = true;
    this.setTimeout(() => mouse.clicked = false, 10);
});

window.addEventListener('resize',
function() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let i = 0; i < StarDots.length; i++)
        StarDots[i].redraw(canvas);

    for (let i = 0; i < orbits.length; i++)
        orbits[i].redraw(canvas);

    Sun.setCenter(canvas.width / 2, canvas.height / 2, 0);
    Sun.update(ctx, 0, 0);
    // Reset.setCenter(canvas.width / 2, canvas.height / 2, 0);
    // Reset.draw(ctx);
});