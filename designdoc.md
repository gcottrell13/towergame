

<!-- TOC -->
* [Tower Game concept:](#tower-game-concept)
  * [Mechanics](#mechanics)
    * [account](#account)
    * [tower (run)](#tower-run)
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
* [Details of mechanics](#details-of-mechanics)
    * [floors](#floors-1)
    * [rooms](#rooms-1)
    * [research](#research-1)
* [Player QoL and utilities](#player-qol-and-utilities)
  * [Encyclopedia](#encyclopedia)
  * [Tower loading screen](#tower-loading-screen)
  * [Previous towers](#previous-towers)
  * [Production graph](#production-graph)
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
  - upgrade tower during night
  - buy bonuses during night
  - use "abilities" and produce resources during day

---

## Mechanics

---

### account
the overall player's progress

- has meta-currencies for purchasing upgrades. (the account wallet)
- has multiple concurrent towers at once

---

### tower (run)
a single tower that has its own:
- timer
- research tree
- resource count (wallet)
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

- the tower has an "unassigned worker pool"
- each room has an "assigned worker pool" that subtracts from the tower's pool
- carries a certain amount of resources at a certain speed, modified by worker upgrades

---

### research
progress is not shared between towers

- final research allows the player to win the game
- almost a tree structure, with some nodes having multiple pre-req nodes
- offers many upgrades and new kinds of rooms
- tower tier unlocks new research nodes

---

### resources
strings representing a name, usually accompanied by a count.

can be marked as "meta-currency", to allow for storage in the account wallet.

--- 

### enemies
destroy rooms

- drop resources
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
- manage tower layout

---

# Details of mechanics

### floors
expandable. heights <= 0 can expand independently of other floors, up to max tower width (upgradable).

heights > 0 can only expand to the width of the floor below (this restriction could be removed with upgrades).

can only add new floors above or underground according to the tower maximum in each category.

---

### rooms
have active and empty states.

have a storage of resources. player can insert/remove resources from/to the tower wallet.

unlocked when:
- tier reached
- researched

can be destroyed.

can be "upgraded" into other rooms.
- care to ensure sizes are consistent

for multi-floor rooms, configure: workers can spawn only on bottom floor, or on any floor occupied by the room.
(player configurable, or statically configured?)

---

### research
main categories of research:
1. general
   - max tower width
   - construction discounts
   - new floor kinds + new rooms
2. room synergy and bonuses
   - reduced required workers
   - bonus production
   - bonuses from proximity to certain rooms
   - new floor kinds + new rooms
   - new room upgrades for base rooms
3. tower height and bonuses
   - max height
   - new floor kinds + new rooms
4. underground
   - max depth
   - new floor kinds + new rooms
5. enemy farming
   - better weapons
   - bigger enemies that drop more resources
   - more enemies at once
   - new floor kinds + new rooms

later research node benefits scale more than the cost, 
so it's more cost-efficient to get later nodes instead of many earlier nodes.

when a tower has enough production to reach the final tier of upgrades, 
filling out the research tree will be necessary.

each research node is associated with a "color" or "category". 
the relative amounts of each category purchased are shown on the tower select screen.

---

# Player QoL and utilities

## Encyclopedia
information about everything that has been unlocked at one point

## Tower loading screen
list all current towers and their status

## Previous towers
store information about previous towers that have died

## Production graph
use IndexedDB via the Dexie library to store time-series data and calculate the production graph