---
title: Deno Primer [soon]
publish_date: 2022-01-01
---

WIP - Expect beginning of Aug. 

The theoretical physicist, Wolfgang Pauli, is widely attributed for the counter-intuitive critique: “it’s not even wrong”. 

By this, Pauli means that ideas devoid of strong opinions are categorically worse than those ideas that are deemed to be incorrect, or perhaps even offensive, by some. 

I’ve found this same sentiment to be true for developer tools — which I’m sure is exactly what Pauli was indirectly referring to. 

The “Developer Community” is known for being particularly opinionated. Make an explicit product decision and you will be simultaneously worshipped and chastised for it. This was perhaps most evident in Python’s addition of the Walrus Operator, whose reception led to the benevolent dictator for life himself stepping down. Team Guido over here!

Arguably one of the most opinionated — particularly due to its lineage — developer tools of late is a runtime called Deno. This emerging runtime is important not only because I built my personal blog on top of it, but also because it (along with Cloudflare Workers) represents a new paradigm in cloud computing. Deno [Deploy] is an “Isolate Cloud”. 

If the Isolate Cloud really is akin to its predecessors, virtual machines & containers, ~VMware & ~Docker, then it’s likely worth paying some attention to. Let’s see what the cloud v3.0.0 is all about.  

As Pauli also once said, it’s not even wrong for you to subscribe below 

Deno (Dee-no) is defined as a [batteries included], simple, modern, and secure runtime [based on web standards] for JavaScript, TypeScript, and WebAssembly that uses V8 and is built in Rust. 

There’s a medley of terms and foundational technologies here that we’re going to need to unpack. But first, one explanation and then some history.

A “runtime” is a piece of software that helps developers create, compile and execute programs. To grossly oversimplify, execute = make a program do what it’s supposed to do.

So, let’s say I’ve written a JavaScript program called “grossly.js” that calculates 1+1 and returns the answer. 

To execute this program I would open up my terminal, type “deno run grossly.js”, et voilà, my program would execute and return 2 (quick mafs).

1+1 program on the left, deno executing the program on the right.

** A brief history of JavaScript runtimes ** 

Initially, JavaScript was really only executed by web browsers. It was a language invented by Brendan Eich — who also founded Mozilla & Brave! — to make webpages served by Netscape Navigator “dynamic” (ie the webpage changes based on some logic such as a mouse click). 

This was kind of a painintheass.js though as it meant developers had to write their frontend code in JavaScript and their backend (aka server-side) code in another language (PHP, etc). Put simply, it’s lessofapainintheass.js for developers to reason about their code if it’s written in one consistent language.

So, sure enough, server-side runtimes for JavaScript such as the OG Netscape LiveWire Pro emerged to address (and monetize!) this issue. However, these early server-side runtimes were lacking in what many developers considered to be essential features/characteristics such as:

Standard libraries

Non-blocking execution

Utilizing V8 vs. JVM

Enter our protagonist, Ryan Dahl. 

During JSConf 2009, Dahl shared a new server-side runtime called Node.js. It touted itself as a “purely evented, non-blocking infrastructure to script highly concurrent programs”. 

Technical Detail: “Non-blocking” means that whilst some code - perhaps a database query - is waiting for a response (ie still being executed), subsequent code is executed in the meantime. Thus, your program is “concurrent” because it’s executing multiple lines of code at once! 

Fast-forward to 2022 — I promised this would be brief! — and Node.js is ubiquitous. As a consumer, you likely used a web application built on top of Node.js today (a la Uber). With 11m+ developers using Node.js & its concurrent comrades, it’s hard to miss.

However, on May 13, 2018 Node.js saw some developer churn in the shape of our protagonist, Ryan Dahl, who had a new PowerPoint and new idea. 

** A new runtime has entered the groupchat **

Yes, the creator of the Node.js runtime is now building its ~adversary, Deno. This is about as Hollywood as developer tools get & I’m here for it. Let’s pick back up our definition, now armed with some history and new domain knowledge. 

Deno (Dee-no) is defined as a [batteries included], simple, modern, and secure runtime [based on web standards] for JavaScript, TypeScript, and WebAssembly that uses V8 and is built in Rust. 

Unlike my publishing cadence, I’m going to stay consistent here and keep tackling the foundational technologies before we delve into the simple, modern, and secure characteristics of Deno. Next candidate, TypeScript.

TypeScript is what’s known as a “superset” of JavaScript. This means that the language is derived from, but extends JavaScript. 

Without getting too into the weeds here, JavaScript is a “dynamically typed” language, whereas TypeScript — thank you $MSFT! — is “statically typed”. 

In programming languages, “types” are a set of categories that describe what a value in a program is (ie is it a number, a string, a boolean etc.), and as a result, what operations can be taken on the value. 

For example, it doesn’t make sense to multiply (an operation!) two values that are strings (e.g., “subscribe” * “to-my-newsletter”), but multiplying numbers does. 

Let’s see what happens when we try to perform a multiplication operation on strings.  

That’s a lotta “red” + “technical jargon”. What’s happening here is we’re running into what’s known as a TypeError. Our code isn’t being successfully executed, as strings can’t be multiplied by one another. 

Remember, JavaScript code is “dynamically typed”. This means that developers aren’t required to explicitly declare the type of a variable (e.g., that “hello” is a string) in their code. Why? Because the types of variables in JavaScript are inferred upon execution (hence, dynamic!) by a runtime. 

Whereas in TypeScript, variables lack imagination. A variable needs to be told that it should be a string. Par example: 

Why go through the additional effort? Usability. Being explicit about what your code should consist of, and hence, do, ensures it’s used by you, and others, as intended.

Back to Deno. 

Deno supports TypeScript “out of the box” (ie it just works). Whereas if you want to execute TypeScript with Node.js you have to install a specific software library & do a little more grease work.   

** TypeScript **  

Deno (Dee-no) is defined as a [batteries included], simple, modern, and secure runtime [based on web standards] for JavaScript, TypeScript, and WebAssembly that uses V8 and is built in Rust. 

Ah, WebAssembly, Wasm, the ordained cool kid on the proverbial block. As I helped lay out in Luke Byrne’s canonical post, Wasm is a compilation target. What this means is, that a higher-level language (e.g., Go) gets compiled (ie turned into) a format that more closely resembles “machine code”. 

** Wasm savants lay down your weapons **

Naturally, for a technology to receive this much fanfare, there’s much more to it. However, this is a rabbit hole for another day. What’s important to know is that Deno exposes utilities (e.g., a WebAssembly class) that developers can use to execute WebAssembly code.

To Node.js’ credit, their support for Wasm seems pretty good too.  

 ** WebAssembly (kinda)(you’ll thank me) **

Wasyouremail.wasm?

Deno (Dee-no) is defined as a [batteries included], simple, modern, and secure runtime [based on web standards] for JavaScript, TypeScript, and WebAssembly that uses V8 and is built in Rust.

V8, as you motor aficionados might expect, is an “engine”. You likely benefit from its labor every day when you use web browsers such as Chrome, Brave, Edge (really?), etc. It was released in 2008 with Chrome in order to compile and execute the JavaScript code present in Chrome-served webpages. 

Astute readers — yes, this engine handles the “compilation” and “execution” part of our initial runtime definition. 

The compilation step is easy to understand in principle; turn high-level code into optimized 1s and 0s. Whilst a crude synopsis, this is all the detail required on optimization until we return to Deno’s “Isolate Cloud”. 

