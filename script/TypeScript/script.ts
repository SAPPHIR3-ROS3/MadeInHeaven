let OrbitPeriodMultiplier : number[] = [1/3, 2/3, 3/3 , 4/3, 6/3, 7/3, 8/3, 9/3, 10/3];
let SatelliteOrbits : {[key: string] : number} =
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

let EarthYear : number = 60;
let PreviousTimeSpeed : number = 0;
let TimeSpeed : number = 1;
let RandomPosition : boolean = false;