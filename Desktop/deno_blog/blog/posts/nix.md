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

~Firstly, build tools take that there source code and convert + bundle it into a format that can be *executed* by a “target environment” (ie ultimately by a CPU). [Remember](https://whynowtech.substack.com/p/deno), “execute” = make software do what it’s intended to do.

This conversion process is known as “compilation” — source code is *compiled* into machine code (also called “binary code”). You may also hear people refer to this compiled code as an “executable”.
<br></br>

>**Technical Detail:** Compiling source code actually creates *multiple* machine code files called “object files” which are then “linked” by a.. “linker”.. >which ultimately creates a *single* executable file.
>
>So — source code + compilation = object files, object files + linking = single executable. More [here](https://www.cprogramming.com/compilingandlinking.html) if you wish to delve into the weeds of it all.

** *Build tools fin* **

---

Cool, we now know what’s required to build software on *my* computer. Astute readers, if I sent you this executable, would it “do what it’s supposed to do” on *your* computer?

Unlikely. Why? Well, I suspect you don’t have the “blog”, “ga”, and “redirects” packages installed. Remember, our software is *dependent* on them.

Even if you do, did you install the same version of those packages as I did? I doubt we’re even running the same macOS version currently, never mind some comparatively esoteric package.

Thankfully, a second utility resides within our arsenal — software “packaging” tools. The most famous (infamous?) of which is Docker.

Packaging tools.. package.. (ie bundle together) your source code alongside the specific (e.g., ga v1.2.3) dependencies it’s reliant on. Convenient.

These tools often go a step further and supply additional information that a 3rd party (e.g., a cloud provider) may need in order to correctly *build* your software.

** *The line can get a little blurry between build / packaging tools* **

I think this packaging is best illustrated via Docker’s “Dockerfile”. Below is one I use within [Northflank](https://northflank.com/). (to deploy a pretty neat twitter scraper 😎)

![image](https://user-images.githubusercontent.com/44316926/198900123-87f21627-2bb9-4e40-a546-0cfda9ec0845.png)

The above Dockerfile is a list of consecutive instructions (each called a “build step”) that when followed, compose an “image” of your application.

Think of images as snapshots in time of the “environment” (ie source code, file system, dependencies, etc) required to successfully build your software. These images can then be shared with others, and thus, your environment can be **reproduced** by third-parties.

Or as Peter Fenton rather poetically puts it — images give us a way to “program the global computer”.

** *Packaging -- fin* **

---

Look, Docker undoubtedly deserves the adulation it’s received. This said, it has some acute flaws that can only be solved by a fundamentally different approach to building and packaging software. Enter the old timer, Nix.

Let’s study one such flaw before we delve into Nix itself. As shown above, Dockerfiles contain a set of instructions that build an image. One of these build steps (e.g., RUN pip install..) involves downloading dependencies from an external source called “pip”.

>**Fun Fact:** Pip is a recursive acronym. It stands for “Pip installs python”. Because acronyms in tech weren’t obtuse enough already!

Herein lies a problem. What if the dependency being downloaded from this external source has changed (e.g., maybe it’s been patched!) vs. the same dependency downloaded by another server/computer a week prior?

In this instance, two computers are ultimately relying on different environments to build software, **despite using the same Dockerfile (!)**. Thus, using Dockerfiles != true reproducibility.

This is as close to a mic-drop moment as you get in building software. Take a second to internalize it.

** *Disclaimer: Yes, I know you can technically use strict dependency pinning in Docker* **

** *This still doesn’t entirely solve the problem* **

Ok, 6,917 characters later, and Nix’s “Why” is partially clear. Let’s peek under the hood.

— A big thanks to [Burke Libbey](https://www.youtube.com/watch?v=6iVXaqUfHi4&list=PLRGI9KQ3_HP_OFRG6R-p4iFgMSK1t5BHs&index=15) who has done a bunch of the heavy lifting here! —

Nix’s core belief is that the dependencies that a piece of software relies upon should be explicitly stored within a graph database. A simplified version of my blog’s “dependency graph” would look like this:

![image](https://user-images.githubusercontent.com/44316926/198900257-bfeb1263-48b9-4cb9-82e9-589b819df793.png)

Why? Because without Nix’s explicit graph (dubbed the “Nix Store”!), my blog may be ~unintentionally reliant on unknown dependencies that exist within my system. Given these dependencies are unknown, I wouldn’t include them in a Dockerfile, and hence, my environment wouldn’t be accurately reproduced elsewhere.

** *We are running out of mics to drop* **

The Nix Store is created with three building blocks: 1) Derivations, 2) Sandboxing, and 3), the Nix language.

**1. Derivations:** similar in principle to a Dockerfile. Derivations are files that contain build steps and are used to add a node to the Nix Store. For our “main.ts” node above, the build steps (conceptually!) would be:

- Point “ga” and “redirects” to “blog”.
- Point “blog” to a new node called “main.ts”.
- Build the “main.ts” node.

**2. Sandbox:** how derivations are “enforced”. Nix creates an isolated environment within your system (limiting network/file access, etc) in order to ensure that when you’re building a node, you only have access to the dependencies declared in the derivations. No more unintentional dependencies!

>**Technical Detail:** Nix goes as far as using patched versions of compilers and linkers that don't look in default locations (/usr/lib, and so on) for >dependencies. Thus creating a truly isolated environment. Pretty cool!

**Nix language:** is the language used to write these derivation files. Comparable (although considerably more powerful!) to the commands (“COPY” / “RUN”) used to structure a Dockerfile.

Let’s tie this all together:

![image](https://user-images.githubusercontent.com/44316926/198900329-a4e5d6ca-8098-4ebf-8457-d0bf77de865e.png)

If I’ve done my job correctly (?), the core tenets + components of Nix should be clear. Now, in order for someone to accurately reproduce your software, all they have to do is install the package from the [Nix Packages](https://github.com/NixOS/nixpkgs) registry.

I’m a selfish writer however, so there’s a little more [%magic](https://towardsdatascience.com/top-8-magic-commands-in-jupyter-notebook-c1582e813560) (niche reference v3) I want to linger on.

Firstly, each node is added as a unique filepath within the Nix Store. Examples:

- `/nix/store/bv6znzsv2qkbcwwa251dx7n5dshz3nr3-zlib-1.2.11/lib/libz.so.1`
- `/nix/store/fg4yq8i8wd08xg3fy58l6q73cjy8hjr2-glibc-2.27/lib/libc.so.6`
- `/nix/store/fg4yq8i8wd08xg3fy58l6q73cjy8hjr2-glibc-2.27/lib/ld-linux-x86-64.so.2`

The hash (e.g., `bv6znzsv2qkbcwwa251dx7n5dshz3nr3`) is derived from the derivation file. Remember, the derivation file contains the specific build steps required to build a node.

[Here’s](https://github.com/alexmackenzie-wx/drv_example/blob/main/.drv) an example derivation file. Warning — they’re rather gnarly. You don’t need to understand the contents but you do need to understand that any changes to the derivation file (perhaps an updated dependency?) will result in a different hash.

This derived hash allows developers to cross-reference with one another whether or not they’re building a given piece of software (ie a node) within the exact same environment.

Par example — two developers may both have Python 3.2.1 installed. However, if one developer’s Python node’s path in the Nix Store is:

» `/nix/store/bv6znzsv2qkbcwwa251dx7n5dshz3nr3-python—3.2.1`

and the other’s is:

» `/nix/store/fg4yq8i8wd08xg3fy58l6q73cjy8hjr2-python-3.2.1`

Then it’s pretty clear that they’re building Python differently to one another, despite having the same version installed. Smart!

** *Nix — fin* **

---

To the handful of you likely left, nice work! Hopefully, it’s clear that the explicitness + strictness of Nix allows you to create truly reproducible build environments. Fancy programming the global computer anyone?

As always, I’m at alex@tapestry.vc should you ever wish to chat about Nix — or perhaps grab a well-pulled pint of Guinness if ever in London!

PS - have a look into building Docker images with Nix 🫳🏻🎤
