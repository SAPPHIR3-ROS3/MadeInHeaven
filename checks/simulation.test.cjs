const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function simulation() {
    let now = 0;
    let frames = [];
    let timers = [];
    const events = {};
    const context = new Proxy({ getImageData: () => ({ data: new Uint8ClampedArray(0) }) }, { get: (target, key) => target[key] || (() => {}) });
    const canvas = { width: 800, height: 600, style: {}, dataset: {}, getContext: () => context, getBoundingClientRect: () => ({ left: 0, top: 0, width: canvas.width, height: canvas.height }) };
    context.canvas = canvas;
    const element = () => ({ style: {}, classList: { add() {} }, appendChild() {}, remove() {}, offsetLeft: 0 });
    const sandbox = {
        console, Math, Date, Uint8ClampedArray,
        Audio: class { play() { return Promise.resolve(); } }, Image: class {},
        performance: { now: () => now },
        requestAnimationFrame: callback => frames.push(callback),
        location: { reload: () => { sandbox.reloaded = true; } },
        document: { getElementById: () => canvas, createElement: tag => tag === 'canvas' ? { width: 0, height: 0, getContext: () => context } : element(), body: { appendChild() {}, removeChild() {} }, addEventListener: (name, callback) => { events[name] = callback; } },
        innerWidth: 800, innerHeight: 600,
        addEventListener: (name, callback) => { events[name] = callback; },
        setTimeout: (callback, delay) => timers.push({ callback, at: now + delay })
    };
    sandbox.window = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync('script.js', 'utf8'), sandbox);
    const run = code => vm.runInContext(code, sandbox);
    events.DOMContentLoaded();
    function step(milliseconds = 17) {
        now += milliseconds;
        const due = timers.filter(timer => timer.at <= now);
        timers = timers.filter(timer => timer.at > now);
        due.forEach(timer => timer.callback());
        const pending = frames;
        frames = [];
        pending.forEach(callback => callback(now));
    }
    function click(object) {
        const position = run(object);
        events.click({ target: canvas, clientX: position.x, clientY: position.y });
    }
    return { run, step, click, canvas, sandbox, events, frameCount: () => frames.length };
}

test('Terra: cicli ripetuti, clic rapidi e ripristino del tempo', () => {
    const sim = simulation();
    for (let cycle = 0; cycle < 4; cycle++) {
        sim.click('Planets[2]');
        assert.equal(sim.run('TimeStopState'), 'starting');
        sim.click('Planets[2]');
        sim.click('Sun');
        assert.equal(sim.run('MadeInHeavenIsRunning'), false);
        sim.step(2000);
        assert.equal(sim.run('TimeSpeed'), 0);
        sim.step(4000);
        assert.equal(sim.run('TimeStopState'), 'stopped');
        const angle = sim.run('Planets[2].OrbitAngle');
        sim.step(1000);
        assert.equal(sim.run('Planets[2].OrbitAngle'), angle);
        sim.click('Planets[2]');
        assert.equal(sim.run('TimeStopState'), 'ending');
        sim.click('Planets[2]');
        sim.step(2000);
        assert.equal(sim.run('TimeStopState'), 'idle');
        assert.equal(sim.run('TimeSpeed'), 1);
        assert.equal(sim.canvas.dataset.filter, 0);
        assert.equal(sim.frameCount(), 1);
    }
});

test('Ridimensionamento durante il fermatempo: orbite e satelliti coerenti', () => {
    const sim = simulation();
    sim.click('Planets[2]');
    sim.step(6000);
    const radius = sim.run('Planets[2].OrbitRadius');
    sim.sandbox.innerWidth = 400;
    sim.sandbox.innerHeight = 300;
    sim.events.resize();
    sim.step();
    assert.equal(sim.run('Planets[2].OrbitRadius'), radius / 2);
    assert.equal(sim.run('orbits[2].radius'), radius / 2);
    assert.equal(sim.run('Planets.every(p => p.Satellites.every(s => Number.isFinite(s.x) && Number.isFinite(s.y)))'), true);
    sim.click('Planets[2]');
    sim.step(2000);
    assert.equal(sim.run('TimeStopState'), 'idle');
});

test('Reset: satelliti finiti, centro corretto e conclusione della sequenza', () => {
    const sim = simulation();
    sim.click('Sun');
    sim.click('Sun');
    assert.equal(sim.run('MadeInHeavenIsRunning'), true);
    sim.step(17000);
    sim.step(5000);
    sim.step(14000);
    sim.step(33500);
    assert.equal(sim.run('UniverseIsResetting'), true);
    assert.equal(sim.run('Planets.every(p => p.Satellites.every(s => Number.isFinite(s.x) && Number.isFinite(s.y) && s.center.x === canvas.width / 2 && s.center.y === canvas.height / 2))'), true);
    sim.step(29000);
    sim.step(500);
    assert.equal(sim.run('Reset.radius'), 22.5);
    sim.step(1600);
    sim.step();
    assert.equal(sim.sandbox.reloaded, true);
});

test('Cache statica: riuso tra frame e invalidazione al resize', () => {
    const sim = simulation();
    sim.run('globalThis.cachedLayer = StaticScene; globalThis.starDraws = 0; StarDots.forEach(star => { star.draw = () => starDraws++; });');
    sim.step(); sim.step();
    assert.equal(sim.run('starDraws'), 0);
    assert.equal(sim.run('StaticScene === cachedLayer'), true);
    sim.sandbox.innerWidth = 400; sim.sandbox.innerHeight = 300;
    sim.events.resize(); sim.step();
    assert.equal(sim.run('starDraws'), 500);
    sim.step();
    assert.equal(sim.run('starDraws'), 500);
    assert.equal(sim.run('AsteroidsBelt.every(a => a.trail.length === 0) && Planets.every(p => p.trail.length === 0)'), true);
});

test('Fermatempo: nessun readback dei pixel', () => {
    const sim = simulation();
    sim.run("ctx.getImageData = () => { throw new Error('Readback inatteso'); };");
    sim.click('Planets[2]'); sim.step(3000); sim.step(3000);
    assert.equal(sim.run('TimeStopState'), 'stopped');
});
