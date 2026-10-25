---
title: Boids
description: "A Boids simulation in Unity where up to 1000 Craigles flock, grow, split and die."
date: 2026-08-19
animation: boids
buttons:
    - label: Repository
      href: https://github.com/SamiSha99/grendel-craigles
---

![Craigles being born and multiplying until they hit 1000 entities inside the cube.](/assets/videos/boids.mp4)

I made this as an assignment for [Grendel Games](https://grendelgames.com/) when I applied for a job there, I passed the assignment, but I couldn't get the job due to European laws. :(

The assignment called them Craigles, from researching it turned out the algorithm is called [Boids](https://en.wikipedia.org/wiki/Boids), a flocking algorithm made by Craig Reynolds where each entity only looks at the ones near it, but all together they move like a flock of birds or a school of fish. Craigle is probably flavoring for the creator Craig Reynolds.

Up to 1000 Craigles live inside a 100x100x100 cube, where they are born, grow, split into two and die from overcrowding.

Made with Unity and C#.

---

## Flocking

Every Craigle has a perception radius, any other Craigle inside it is part of its swarm. Every frame, three rules are applied using that swarm:

- **Cohesion** -> Move toward the center of the swarm, the farther it is from the center, the weaker the pull.
- **Separation** -> Push away from Craigles that are too close, the bigger the Craigle gets, the more space it needs.
- **Alignment** -> Turn to face the same direction as the swarm, this only changes where it's heading and not its speed.

When a Craigle hits a wall of the cube, it bounces back inside.

---

## Life Cycle

Craigles are born from one corner of the cube and get yeeted toward the center at a random angle and speed, after that they keep growing bigger every second.

Once a Craigle is old enough, it has a chance to split into two smaller children, each going in a slightly different direction with a slightly different color from their parent, so families of Craigles end up with similar colors. But if a Craigle has too many neighbors around it, it has a chance to literally just "die" from the overcrowding.

According to documentations, Unity can only draw 1023 instances in one call, therefore the population is hard capped to 1000, any extra Craigle is removed at random.

---

## Performance

Checking every Craigle against every other Craigle is O(n^2), with 1000 Craigles that's around a million checks every frame.

> million checks? every frame? wtf?

To fix this, I split the cube into a [spatial grid](<https://en.wikipedia.org/wiki/Grid_(spatial_index)>) where each cell is as big as the perception radius. With the default perception of 10 that's 1000 cells (10x10x10), and each Craigle only checks the 27 cells around it (3x3x3), since anything farther can't be in its swarm anyway.

The perception affects performance a lot, the higher it is, the fewer cells there are, but each cell has more Craigles to check. At a perception of 100 the whole cube is a single cell and it's back to O(n^2), which drops to around 30 FPS or less, there's a config made just to show this.

Overall, using the default of 10 for perception has increased performance substantially.

Rendering is done with [Graphics.DrawMeshInstanced](https://docs.unity3d.com/6000.5/Documentation/ScriptReference/Graphics.DrawMeshInstanced.html), all Craigles are drawn in one call as simple triangles facing where it's moving, with a quick shader so each one can have its own color. It wasn't clean implementation but at least it makes the colors visible considering the time constraint (writing the code was more important than some pretty shaders).

---

## Configs

Every setting is in a Swarm Config, from spawning, to the swarm rules, to mitosis and crowding, so it's easy to try different behaviors without touching the code.

![The Swarm Config with the default settings.](/assets/images/boids/swarm_config.png){style="max-width:320px"}

The project comes with a few of them, shown below:

- **Swarm Default** -> The default settings.
- **Swarm Double Perception** -> Double the perception and personal space, so swarms are bigger and more spread out.
- **Swarm Rainbow with Crowd Tolerance** -> Children change color a lot more from their parent and nobody dies from crowding.
- **Swarm Unstable Mitosis** -> Craigles grow slower and wait longer to split, but their children shoot off in very different directions.
- **Swarm Deathless Cubes** -> Uses cubes instead of triangles and is a lot more tolerant of crowding.
- **Swarm Default 1 Cell O(n^2)** -> The whole cube is one cell, to show the performance hit. P.S.: WILL LAG.

I also added an orbital camera so you can move the camera around by dragging with your mouse on the screen, and a counter on the screen for the amount of Craigles and FPS so you can see the result.

## Final Thoughts

I learned a lot about such an algorithm, really proud with the results so to celebrate this milestone I recreated it again in JavaScript which you should be seeing in the background in action (its not 1 to 1 for your info I made it more accurate to the site's vibe).

You can see the code for yourself: [boid.js](https://github.com/SamiSha99/SamiSha99.github.io/blob/master/src/scripts/game/entities/boid.js).

I would like to thank in particular for [Grendel Games](https://grendelgames.com/) for giving me this opportunity and perhaps one day we may work together or perhaps say hi!
