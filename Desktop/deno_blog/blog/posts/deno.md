---
title: Deno Primer & Isolate Clouds
publish_date: 2022-09-20
---

*"node_modules, the heaviest object in the universe"*

*Should you wish to stay updated on future posts, subscribe to receive carrier pigeons at my [substack](https://whynowtech.substack.com/).*

![image](https://user-images.githubusercontent.com/44316926/191210633-737b29d2-187a-4ac6-9b9a-f40ba8baaa8f.png)

The theoretical physicist, [Wolfgang Pauli](https://en.wikipedia.org/wiki/Wolfgang_Pauli), is widely attributed for the counter-intuitive critique: “it’s not even wrong”. 

By this, Pauli means that ideas devoid of strong opinions are categorically worse than those ideas that are deemed to be incorrect, or perhaps even offensive, by some. 

I’ve found this same sentiment to be true for developer tools — which I’m sure is exactly what Pauli was indirectly referring to. 

The “Developer Community” is known for being particularly opinionated. Make an explicit product decision and you will be simultaneously worshipped and chastised for it. This was perhaps most evident in Python’s addition of the [Walrus Operator](https://realpython.com/python-walrus-operator/), whose reception led to the benevolent dictator for life himself stepping down. Team [Guido](https://en.wikipedia.org/wiki/Guido_van_Rossum) over here!

Arguably one of the most opinionated — particularly due to its lineage — developer tools of late is a runtime called Deno. This emerging runtime is important not only because I built this very blog on top of it, but also because it (along with Cloudflare Workers) represents a new paradigm in cloud computing. Deno [Deploy] is an [“Isolate Cloud”](https://deno.com/blog/series-a#:~:text=Deno%20Deploy%20is%20an%20Isolate%20Cloud). 

If the *Isolate Cloud* really is akin to its predecessors, virtual machines & containers, ~VMware & ~Docker, then it’s likely worth paying some attention to. Let’s see what the cloud v3.0.0 is all about.  

--- 

[Deno](https://deno.land/) (Dee-no) is defined as a **{batteries included}**, **simple**, **modern**, and **secure** **runtime** **{based on web standards}** for **JavaScript**, **TypeScript**, and **WebAssembly** that uses **V8** and is built in **Rust**. 

There’s a medley of terms and foundational technologies here that we’re going to need to unpack. But first, one explanation and then some history.

A “runtime” is a piece of software that helps developers create, compile and execute programs. To grossly oversimplify, execute = make a program do what it’s supposed to do.

So, let’s say I’ve written a JavaScript program called “grossly.js” that calculates 1+1 and returns the answer. 

To execute this program I would open up my terminal, type “deno run grossly.js”, et voilà, my program will compile, execute and then return 2 ([quick mafs](https://www.reddit.com/r/memes/comments/jgaou1/quick_mafs/))

![image](https://user-images.githubusercontent.com/44316926/191208979-05713191-60eb-4d2f-a889-4f01be46c450.png)

---

** *A brief history of JavaScript runtimes* ** 

Initially, JavaScript was really only executed by web browsers. It was a language invented by Brendan Eich — who also founded Mozilla & Brave! — to make webpages served by Netscape Navigator “dynamic” (ie the webpage changes based on some logic such as a mouse click). 

This was kind of a painintheass.js though as it meant developers had to write their frontend code in JavaScript and their backend (aka server-side) code in another language (PHP, etc). Put simply, it’s lessofapainintheass.js for developers to reason about their code if it’s written in one consistent language.

So, sure enough, server-side runtimes for JavaScript such as the OG Netscape LiveWire Pro emerged to address (and monetize!) this issue. However, these early server-side runtimes were lacking in what many developers considered to be essential features/characteristics such as:

- Standard libraries

- Non-blocking execution

- Utilizing V8 vs. JVM

Enter our protagonist, *Ryan Dahl*. 

During JSConf 2009, Dahl [shared](https://www.slideshare.net/AartiParikh/original-slides-from-ryan-dahls-nodejs-intro-talk) a new server-side runtime called [Node.js](https://nodejs.org/en/about/). It touted itself as a “purely evented, **non-blocking** infrastructure to script highly **concurrent** programs”. 

> **Technical Detail:** “Non-blocking” means that whilst some code - perhaps a database query - is waiting for a response (ie still being executed), subsequent code is executed in the meantime. Thus, your program is “concurrent” because it’s executing multiple lines of code at once! 

Fast-forward to 2022 — I promised this would be brief! — and Node.js is ubiquitous. As a consumer, you likely used a web application built on top of Node.js today (a la Uber). With 11m+ developers using Node.js & its concurrent comrades, it’s hard to miss.

However, on May 13, 2018 Node.js saw some developer churn in the shape of our protagonist, Ryan Dahl, who had a new [PowerPoint](https://www.youtube.com/watch?v=M3BM9TB-8yA&feature=youtu.be) and new idea. 

** *A new runtime has entered the groupchat* **

Yes, the creator of the Node.js runtime is now building its ~adversary, Deno. This is about as Hollywood as developer tools get & I’m here for it. Let’s pick back up our definition, now armed with some history and new domain knowledge. 

--- 

[Deno](https://deno.land/) (Dee-no) is defined as a **{batteries included}**, **simple**, **modern**, and **secure** **~~runtime~~** **{based on web standards}** for **~~JavaScript~~**, **TypeScript**, and **WebAssembly** that uses **V8** and is built in **Rust**. 

Unlike my publishing cadence, I’m going to stay consistent here and keep tackling the foundational technologies before we delve into the *simple*, *modern*, and *secure* characteristics of Deno. Next candidate, TypeScript.

TypeScript is what’s known as a “superset” of JavaScript. This means that the language is derived from, but extends JavaScript. 

Without getting too into the weeds here, JavaScript is a “dynamically typed” language, whereas TypeScript — thank you $MSFT! — is “statically typed”. 

In programming languages, “types” are a set of categories that describe what a value in a program is (ie is it a number, a string, a boolean etc.), and as a result, what operations can be taken on the value. 

For example, it doesn’t make sense to multiply (an operation!) two values that are strings (e.g., “subscribe” * “to-my-newsletter”), but multiplying numbers does. 

Let’s see what happens when we try to perform a multiplication operation on strings.

![image](https://user-images.githubusercontent.com/44316926/191208864-4f7173c2-b3dd-4103-bcae-4fef7c58c6bf.png)

That’s a lotta “red” + “technical jargon”. What’s happening here is we’re running into what’s known as a *TypeError*. Our code isn’t being successfully executed, as string *types* can’t be multiplied by one another. 

Remember, JavaScript code is “dynamically typed”. This means that developers aren’t required to explicitly declare the type of a variable (e.g., that “hello” is a string) in their code. Why? Because the types of variables in JavaScript are inferred upon execution (hence, dynamic!) by a runtime. 

Whereas in TypeScript, variables lack imagination. A variable needs to be told that it should be a string. *Par example:*

![image](https://user-images.githubusercontent.com/44316926/191209293-dba77a27-b798-4e51-8654-75a0cbfa888b.png)

Why go through the additional effort? Usability. Being explicit about what your code should consist of, and hence, do, ensures it’s used by you, and others, as intended.

Back to Deno. 

Deno supports TypeScript “out of the box” (ie it just works). Whereas if you want to execute TypeScript with Node.js you have to install a specific software library & do a little more grease work.   

** ~~TypeScript~~ **  

---

[Deno](https://deno.land/) (Dee-no) is defined as a **{batteries included}**, **simple**, **modern**, and **secure** **~~runtime~~** **{based on web standards}** for **~~JavaScript~~**, **~~TypeScript~~**, and **WebAssembly** that uses **V8** and is built in **Rust**.

Ah, WebAssembly, Wasm, the ordained cool kid on the proverbial block. As I *very briefly* [helped](https://byrnemluke.com/posts/webassembly) lay out in Luke Byrne’s canonical [post](https://byrnemluke.com/posts/webassembly), Wasm is a compilation target. What this means is, that a higher-level language (e.g., Go) gets compiled (ie turned into) a format that more closely resembles “machine code”. 

** *Wasm savants lay down your weapons I'm not finished* **

Naturally, for a technology to receive this much fanfare, there’s much more to it. However, this is a rabbit hole for another day. What’s important to know is that Deno exposes utilities (e.g., a WebAssembly class) that developers can use to execute WebAssembly code.

To Node.js’ credit, their support for Wasm seems pretty good too.  

 ** *~~WebAssembly~~ (kinda)(you’ll thank me)* **

---

[Deno](https://deno.land/) (Dee-no) is defined as a **{batteries included}**, **simple**, **modern**, and **secure** **~~runtime~~** **{based on web standards}** for **~~JavaScript~~**, **~~TypeScript~~**, and **~~WebAssembly~~** that uses **V8** and is built in **Rust**.

V8, as you motor aficionados might expect, is an “engine”. You likely benefit from its labor every day when you use web browsers such as Chrome, Brave, Edge (really?), etc. It was released in 2008 with Chrome in order to compile and execute the JavaScript code present in Chrome-served webpages. 

Astute readers — yes, this engine handles the “compilation” and “execution” part of our initial runtime definition. 

The compilation step is easy to understand in principle; turn high-level (JavaScript, TypeScript, WebAssembly) code into *optimized* 1s and 0s. Whilst a crude synopsis, this is all the detail required regarding Deno.

Execution is due a little more time. Sure, you now have 1s and 0s that your computer understands, but your computer requires some additional help to ensure these 1s and 0s are *understood* and *dealt* with (ie executed) in the best way possible.

Let’s unpack execution a little further. 

** *Notably simplistic analogy inbound* ** 

Imagine opening whatever book you’re currently reading on its current page. 

You’ll likely read the text on the page in some order (remember, “call stack”), know who the characters mentioned are based on prior pages (remember, “memory heap”) and perhaps change your view on how the plot will pan out (remember, “garbage collection”).

How V8 “executes” machine code is ..um.. no different. Ok, again, a stretch, but stay with me here and replace your book’s “page” with a compiled JavaScript program (ie some lines of machine code). 

V8 uses a “call stack” to prioritize what lines of code are executed when, a “memory heap” to store information that can be used subsequently, and a “garbage collector” to delete information that’s no longer relevant/useful.

Again, the details as they pertain to Deno aren’t super important here at a first glance, so don’t stress. All you need to know is that a program (V8) is used to compile JavaScript, TypeScript, and WebAssembly to machine code, and that this same program is then used to ensure the appropriate execution of said machine code.

We’ll return to V8 when we delve into the “Isolate Cloud”.

** *~~V8~~ ..fait accompli..* **

---

[Deno](https://deno.land/) (Dee-no) is defined as a **{batteries included}**, **simple**, **modern**, and **secure** **~~runtime~~** **{based on web standards}** for **~~JavaScript~~**, **~~TypeScript~~**, and **~~WebAssembly~~** that uses ~~**V8**~~ and is built in **Rust**.

If you’ve frequented the vestibules of the WebAssembly FC (football reference not a technical acronym) then there’s no doubt you’ve stumbled into the compilation target’s comrade, Rust. 

Rust, per [Stack Overflow](https://insights.stackoverflow.com/survey/2021#technology-most-loved-dreaded-and-wanted), has been the most popular programming language for 6 years straight. So, we’ll linger a little here.

Rust is a statically typed (like TypeScript!) **“systems”** programming language. It’s comparable to lower-level languages such as C++ or Go vs. higher-level abstractions like JavaScript or Python. 

Systems languages (C, C++, Go, Rust, etc.) are generally used to write programs / utilities that will be used by developers to interact with some underlying piece of hardware (think a CPU).  

For example, V8 itself is written in C++, the Mac operating system is primarily composed of C code, the Python language is written in C *(ooh, meta)*, and the Deno runtime is.. “built in Rust”.

![image](https://user-images.githubusercontent.com/44316926/191212480-3bec6a04-1253-49f8-b4d4-f9cd584d601e.png)

The big difference vs. languages such C++ (aside from its preferential ergonomics!) is that Rust is “memory safe”.

> **Technical Detail:** “memory safe” means that information your programs store (e.g., a name in an array) can’t be improperly accessed or changed. Your stored information (ie memory) is.. safe. With C++ this isn’t the case.

To put the importance of memory safety into perspective: in 2019 Microsoft [estimated](https://msrc-blog.microsoft.com/2019/07/18/we-need-a-safer-systems-programming-language/) that 70% (!) of all security vulnerabilities in their products over the last decade have been due to memory safety issues. 

As it relates to Deno, Rust is a modern language used to build system-level utilities (such as a runtime!) due to its memory safety et al. It’s the best tool for the job — you don’t need to know anything else. 

** *~~Rust~~ has been electrolysis’d!! ha* **

---

[Deno](https://deno.land/) (Dee-no) is defined as a **{batteries included}**, **simple**, **modern**, and **secure** **~~runtime~~** **{based on web standards}** for **~~JavaScript~~**, **~~TypeScript~~**, and **~~WebAssembly~~** that uses ~~**V8**~~ and is built in ~~**Rust**~~.

I salute you if you’ve made it this far. Now that we’ve laid the technical foundations, let’s dig into our rather opinionated runtime, Deno.

What makes Deno “simple” is a subjective matter. I would sum up its simplicity as a collection of characteristics:

1. **Web Compatability:** Deno comes packaged with existing “web standards” — ie the same APIs that the browser exposes to frontend developers. Whereas Node.js doesn’t.

2. **Single Executable:** You can build complex websites and contain them within a single file of JavaScript.

3. **“Batteries Included”:** Deno comes bundled with a number of useful utilities. Want to build a web app? Use their web framework, Fresh. Want to format your Fresh code? Use deno fmt. Want to deploy said web app? Use Deno Deploy. Want me to stop? … fair.

4. **Dependency Management:** Deno imports dependencies (ie other people’s code you’re using) via a URL import vs. a “package registry” like npm. No more node modules / package.json / the “require()” syntax 🥲 (those who know, know).

** *~~simplicity~~ + ~~web standards~~ + ~~batteries included~~ in one fell swoop* **

“Modern” is easy. As mentioned already, Deno is unshackled by the technical inertia of Node.js — the runtime uses/supports new kid on the block technologies: Rust, TypeScript, and WebAssembly.

** ~~*modern*~~ **

“Secure” is deserving of a little more attention. I suspect Pauli would speculate that this is where Deno could.. *be wrong*. 

Deno is secure by default. The runtime requires you to explicitly state what a program’s allowed to do/access.

For example, if you have a JavaScript program that wants to use Deno’s fetch API to make a request over a network, you have to explicitly state that this is allowed. 

For an example of the above example: 

``` deno run --allow-net fetch.ts ```

tells Deno to compile and execute the file “fetch.ts” and allows (--allow) the file to access the computer’s network (-net).

** ~~*secure~~ --is scratched off the list.ts!* ** 

---

[Deno](https://deno.land/) (Dee-no) is defined as a **{batteries included}**, ~~**simple**~~, ~~**modern**~~, and ~~**secure**~~ **~~runtime~~** **{based on web standards}** for **~~JavaScript~~**, **~~TypeScript~~**, and **~~WebAssembly~~** that uses ~~**V8**~~ and is built in ~~**Rust**~~.

Scratching those definitions felt good. You did it, you know what Deno is + a host of some of the most important technologies of the modern web.

However, those of you with no garbage collection (..good memory..)(..I’m sorry..) may remember at the beginning of this primer I mentioned that **Deno Deploy** is an “Isolate Cloud”.

In [Cloud Computing Without Containers](https://blog.cloudflare.com/cloud-computing-without-containers/), Zack Bloom of Cloudflare fame explains that Cloudflare [“Workers”](https://workers.cloudflare.com/) (their Serverless product) don’t rely on virtual machines or containers. At the time this was unique vs. serverless competitors such as AWS Lambda. This was kinda a cloud infra equivalent of the proverbial mic drop.

> **Technical Detail:** “Serverless” doesn’t actually mean no-servers. It’s really a business model. With serverless, developers don’t have to rent a specified amount of backend services (ie servers) from their cloud provider. Instead, they dynamically (ie automatically) rent based on their usage.  

Instead, Cloudflare Workers rely on a little something called **V8** (!!) **Isolates** — a particular ~feature of Chrome’s V8 engine. It’s this same technology that Deno Deploy uses to make application deployment an absolute breeze. It nearly feels.. wrong.

*..How so?*

Isolates allow disparate cloud computing users (ie “tenants”) to not only share an operating system (this is what containers enable), but to inherit the same *runtime environment* (yes, e.g., Deno!) too. 

*Why does this matter?..*

Well, firstly, developers get to think about the cloud infrastructure their code runs on even less than when they use containers. With isolates, ~all they have to think about is writing their application code. 

For context, managing infrastructure is analogous to “admin”, y’don’t want to do it, you just want to play rugby outside (write code).

Secondly, isolates are incredibly “lightweight”, meaning they take up very little "space” on a given server. Why? Again, because isolates solely contain application code vs. a bunch of other contexts needed when deploying to containers.

More space unlocks some rather interesting features for the users of isolate clouds. In Deno Deploy’s case, every time you deploy some code, Deno Deploy provides an entirely new server to host that code. Then, when you commit some changes to your code and deploy those changes, Deno will persist the old code on the original server and “spin up” a new server to host your updated code. 

This makes “rolling back” to previous versions of your application (as well as testing) a walk in the park.

In Cloudflare’s case, more space™ means that it’s economical (among other things) for them to make copies of your application code and deploy these copies across their global mesh of servers. As a result, you have a truly global, low latency, application.

*! How cool !*

So yeah, when someone’s inevitably bloviating about the “future of cloud” think (but never say out loud) “more space” and you’ll likely be able to wade through the technical jargon and land on the same endpoint. Nice work!

** isolate cloud fin **

--- 

Enjoyed reading / have thoughts? Feel free to [reach out](https://twitter.com/alex__mackenzie) 👋🏻 
