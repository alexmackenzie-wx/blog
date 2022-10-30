---
title: Nix Primer
publish_date: 2022-10-31
---

Containers without containers

![image](https://user-images.githubusercontent.com/44316926/198110379-c6cc19f7-2b7f-49f2-8463-ed9c0543947e.png)

*Should you wish to stay updated on future posts, [subscribe](https://whynowtech.substack.com/) to receive carrier pigeons via my substack.*

Stepping on a lego brick, not saving your old Pokémon game.. software running incorrectly on your machine.. all sources of *excruciating* pain.

Cue *“hasn’t {build tool / package manager} already solved this issue?”*

In short, somewhat. Docker, Buildpacks, etc., all do a decent job of building + packaging software that can be “run” elsewhere. For example, I use Dockerfiles in [Northflank](https://northflank.com/) to great effect (plug, et al) if I do say so myself.

However, a proclamation in software development — “works on my machine” is still necessary; implying that it’s possible, despite using these tools, that software may indeed, not work on your machine.

This is where Nix comes in. Well, came in 19 years ago. 10 years Docker’s senior!

Nix is *notoriously* difficult to grok, but in its most reductive form, it’s a *build tool + package manager*. More flattering descriptions have extolled the technology with credentials such as “the future of computing” or as “an outrageously underrated technology”.

Whatever your Nix headline of choice is, build tools & package managers bridge single-player development to multitenant production — history would have me believe that any paradigm shift in this realm is worth paying attention to. + If Tobi Lütke [compels](https://twitter.com/tobi/status/1576268144351399936?s=20&t=0wrMxHwR0XQjNb_onEUfqw) you to learn about a specific technology, jump on that *track*.

** *Niche tech reference, iykyk* **

---

Nix enables developers to *build*: **reproducible**, **declarative**, and **reliable** software.

To the uninitiated, the above definition will likely be rather abstruse. That’s ok, I spent many-a-year building software without fully appreciating what was going on under the proverbial hood.

Alright, let’s drop our egos and go back to basics. If you’re intimately (weird!) familiar with how software is built +/ packaged and want to skip to the section on Nix, that’s cool.

** *Turns upright framed picture of [Chris Lattner](https://nondot.org/~sabre/)* **

** *I’m going all in on niche tech references today, sorry* **

Let’s begin with “building” software.

Applications are often comprised of many files. For example, this blog (thanks Deno) is comprised of a TypeScript file, a JSON file for some config, a “posts” folder that contains more “WIP” markdown files than I’d care to admit, etc.

These files, dear readers, are what’s known as “source code”.

![image](https://user-images.githubusercontent.com/44316926/198899682-8a0c5088-f093-4505-bdc4-91811599a052.png)

Within this source code (the main.ts file specifically), I’m also “dependent” on a bunch of other folks’ code (often called “packages”) that I’ve installed. This collection of third-party code is known as a piece of software’s *dependencies*.

![image](https://user-images.githubusercontent.com/44316926/198899700-b4ae593c-e908-497b-b053-2ddc494775c2.png)

*You: “Why stand on the shoulders of another developer?”*

*Alex: “Why re-invent the wheel?”*

*Ok ok. Pourquoi est-ce relevant?*

~Firstly, build tools take that there source code and convert + bundle it into a format that can be *executed* by a “target environment” (ie ultimately by a CPU). [Remember](https://whynowtech.substack.com/p/deno#:~:text=To%20grossly%20oversimplify%2C%20execute%20%3D%20make%20a%20program%20do%20what%20it%E2%80%99s%20supposed%20to%20do.), “execute” = make software do what it’s intended to do.

This conversion process is known as “compilation” — source code is *compiled* into machine code (also called “binary code”). You may also hear people refer to this compiled code as an “executable”.

>**Technical Detail:** Compiling source code actually creates *multiple* machine code files called “object files” which are then “linked” by a.. “linker”.. >which ultimately creates a *single* executable file.
>
>So — source code + compilation = object files, object files + linking = single executable. More [here](https://www.cprogramming.com/compilingandlinking.html) if you wish to delve into the weeds of it all.

** *Build tools fin* **

---
