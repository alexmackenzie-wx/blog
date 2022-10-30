---
title: Nix Primer
publish_date: 2022-10-31
---

Containers without containers

![image](https://user-images.githubusercontent.com/44316926/198110379-c6cc19f7-2b7f-49f2-8463-ed9c0543947e.png)

*Should you wish to stay updated on future posts, [subscribe](https://whynowtech.substack.com/) to receive carrier pigeons at my substack.*

Stepping on a lego brick, not saving your old Pokémon game.. software running incorrectly on your machine.. all sources of *excruciating* pain.

Cue *“hasn’t {build tool / package manager} already solved this issue?”*

In short, somewhat. Docker, Buildpacks, etc., all do a decent job of building + packaging software that can be “run” elsewhere. For example, I use Dockerfiles in [Northflank](https://northflank.com/) to great effect (plug, et al) if I do say so myself.

However, a proclamation in software development — “works on my machine” is still necessary; implying that it’s possible, despite using these tools, that software may indeed, not work on your machine.

This is where Nix comes in. Well, came in 19 years ago. 10 years Docker’s senior!

Nix is *notoriously* difficult to grok, but in its most reductive form, it’s a *build tool + package manager*. More flattering descriptions have extolled the technology with credentials such as “the future of computing” or as “an outrageously underrated technology”.

Whatever your Nix headline of choice is, build tools & package managers bridge single-player development to multitenant production — history would have me believe that any paradigm shift in this realm is worth paying attention to. + If Tobi Lütke [compels](https://twitter.com/tobi/status/1576268144351399936?s=20&t=0wrMxHwR0XQjNb_onEUfqw) you to learn about a specific technology, jump on that *track*.

** *Niche tech reference, iykyk* **


