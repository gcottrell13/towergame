

<!-- TOC -->
* [Tower Game concept:](#tower-game-concept)
  * [Mechanics](#mechanics)
    * [account](#account)
    * [building/tower (run)](#buildingtower-run)
    * [floors](#floors)
    * [rooms](#rooms)
    * [transportation](#transportation)
      * [stairs](#stairs)
      * [elevators](#elevators)
    * [workers](#workers)
    * [research](#research)
    * [resources](#resources)
    * [enemies](#enemies)
    * [weapons](#weapons)
  * [Day Time](#day-time)
  * [Night Time](#night-time)
* [Details](#details)
<!-- TOC -->


# Tower Game concept:
- sims tower
- more resources than just money
- different kinds of "workers" that live in the tower
- research tree
- game ends after a certain amount of time unless you win before that
- repeatedly restart game with upgrades and bonuses until you can win before the time limit
  - research tree is too complicated to fill out in one run for a while
  - you can unlock the ability to maintain multiple concurrent runs
  - export meta-currency for account-wide upgrades, some can affect in-progress runs

- literally tower defense, but it's just one tower
- can pause a run, and switch to another run
- day/night cycle
  - upgrade building during night
  - buy bonuses during night
  - use "abilities" and produce resources during day

---

## Mechanics

---

### account
the overall player's progress

- has meta-currencies for purchasing upgrades
- has multiple concurrent buildings at once

---

### building/tower (run)
a single building that has its own:
- timer
- research tree
- resource count
- a tier/rating that goes up according to (some of?) these criteria (wip):
  - quantity of workers
  - time spent in run
  - income threshold
  - upgrade level of a certain "core" room

has multiple floors, both above ground and underground

---

### floors
each floor is of a certain type, or "zoning" in land development terms

- only certain kinds of rooms can be placed in certain types of floors
- rezoning requires resources, and will destroy incompatible rooms

---

### rooms
places where production happens

- can take in resources and produce resources
- can provide workers to other rooms
- can be upgraded
- requires a certain number of workers in order to function with 100% efficiency
- some provide daytime abilities to affect production in some way
- some rooms have variable width and/or height

---

### transportation
move workers between floors

#### stairs
have high capacity, but are slow and short

#### elevators
have a smaller capacity, but are tall and fast. capacity upgradable with more cars

---

### workers
move resources between rooms

- the building has an "unassigned worker pool"
- each room has an "assigned worker pool" that subtracts from the building's pool
- carries a certain amount of resources at a certain speed, modified by worker upgrades

---

### research
progress is not shared between buildings

- final research allows the player to win the game
- almost a tree structure, with some nodes having multiple pre-req nodes
- offers many upgrades and new kinds of rooms
- building tier unlocks new research nodes

---

### resources
strings representing a name, usually accompanied by a count

--- 

### enemies
destroy rooms

- what do they target?
- get stronger as time progresses

---

### weapons
special kinds of rooms that shoot enemies

- can provide daytime abilities for managing enemies

---

## Day Time

- room production
- enemy encounters
- timed events

---

## Night Time

- random merchant
- manage building layout

---

# Details