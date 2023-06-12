---
title: Zig Primer
publish_date: 2023-06-04
---

_Efficient and portable as C, without the "footguns"_

![image](https://github.com/alexmackenzie-wx/blog/assets/44316926/ac4e6385-d035-4113-ba86-754c2dad5baf)

_Should you wish to stay updated on future posts, subscribe to receive carrier pigeons via my [substack](https://whynowtech.substack.com/)._

Not every technology is capable of direct value capture. This can be perilous as an infra investor, as it’s easy to become enamoured by something that’s innovative, yet devoid of a business model or meaningful market. Guilty. 

Programming languages are a good example here. How Rust handles concurrency is a thing of beauty, [Roc’s](https://www.roc-lang.org/) VM-less memory allocation is pretty cool.. and, well, there’s a lot to like about [Zig](https://ziglang.org/). However, these languages aren’t licensed out, their value capture certainly isn’t tied to usage/utility.

What helps me sleep at night however is that these technologies (think languages, runtimes, protocols, etc) can serve as proxies for sophisticated & opinionated technologists. Dissenters capable of _[being wrong](https://whynowtech.substack.com/p/deno#:~:text=The%20theoretical%20physicist%2C%20Wolfgang%20Pauli%2C%20is%20widely%20attributed%20for%20the%20counter%2Dintuitive%20critique%3A%20%E2%80%9Cit%E2%80%99s%20not%20even%20wrong%E2%80%9D.)_. 

Now this is something that history would tell me capital is worth putting towards.

Take Zig for example. [Bun](https://bun.sh/) is outpacing Node.js and its anagrammatic counterpart, Deno. How so? Well, Bun does a lot of things well, but it does tout Zig’s low-level control of memory and lack of hidden control flow (_so good_) as a key unlock. 

Continuing down this proxy, we find Stephen Gutekanst / [Mach Engine](https://machengine.org/#early-stages) working 24/7 on a game engine to help “upend the gaming industry”. Building a game engine _~from scratch_ is no small feat. 

++ finally, we have [TigerBeetle](https://tigerbeetle.com/). Again, one doesn’t simply build a financial database from the ground up over a leisurely weekend. Zig has served as a beacon, attracting those who’re thinking orthogonally. I’m fond of folk like this.

As you may have guessed from, I don’t know, the title (!) we’re going to dig into Zig.

Selfishly, I want to truly get my head around why companies are opting to build with this nascent language as well as what we should expect next. I figured I’d bring you all along for the ride. 

**If you are building with Zig, I’d love to say hello! alex@tapestry.vc**

[Finally, I’d ask that, if possible, you consider supporting the Zig Software Foundation.](https://github.com/sponsors/ziglang)

---
Zig is many [[1]](https://mitchellh.com/zig/tokenizer)[[2]](https://mitchellh.com/zig/parser)[[3]](https://mitchellh.com/zig/astgen) things [[4]](https://mitchellh.com/zig/sema)[[5]](https://mitchellh.com/zig/build-internals) but at its core it’s: 

1. A general-purpose programming language (think Python or JavaScript).
2. A “toolchain”.  
---

The programming language part here is familiar, and hence, easy to grok. However, it’s worth lingering on. My favourite quality of Zig’s is its _simplicity_. What does this mean?

Well, firstly, the language is _tiny_. 

It’s specified with a [500-line PEG grammar file](https://ziglang.org/documentation/master/#Grammar). For context, a PEG (parsing expression grammar) file is typically used to define the structure and syntax of a programming language.

The tl;dr on this benefit is that a “small” language ultimately means that you have less language-specific keywords, etc., to remember. Hence, the language is “simple”. 

_** As someone that somehow still struggles to recall git flags, I’m --happy about this! **_

Less keywords also means that there’s ideally “only one obvious way to do things.” Why is this good? Well, it becomes much easier to read your/someone else’s code when you know that a specific keyword is typically used for a handful (vs. infinite) number of things.

> **Fun Fact:** Zig's developers took this mandate so much to heart that for a time, Zig [had no for loop](https://github.com/ziglang/zig/issues/8292), which was deemed an unnecessary syntactic elaboration upon the already adequate while loop. “What you do is who you are”.

This goal stands in stark contrast with decisions made within languages like Python, where I’ve truly lost track of the number of keywords that essentially say: “if this happens then do that”. Sorry, I’m ranting. 

Back to Zig. The language doesn’t stop here though, oh no. Zig also has “no hidden control flow”. This essentially means that each line-of-code written in Zig executes sequentially, as you would expect:

![image](https://github.com/alexmackenzie-wx/blog/assets/44316926/b233beb5-d6e0-4751-a6d5-eeb7d093580b)

If you haven’t written code before this is likely confusing: _doesn’t all code execute.. line-by-line (ie sequentially)?_ Nope. Oftentimes languages (e.g., JavaScript) will take ~helpful but “**hidden**” steps for the developer to ~fix/improve the execution order (ie “**control flow**”) of their code.

> **Technical Detail:** Check out variable/function “[hoisting](https://www.digitalocean.com/community/tutorials/understanding-hoisting-in-javascript)” in JavaScript as an example of such hidden magic.

This action is often helpful, as intended. However, because it’s hidden from the developer, it can make their code more difficult to reason about (especially for other developers). 

Make sure this point clicks as it’s important. Think about it, a developer could forget about the hidden control flow rules of a given language; all of a sudden, their code isn’t executing sequentially as expected? This happens, often in subtle ways, and is confusing for all involved.  

As Zig eloquently puts it, you should _“focus on debugging your application, not your programming language knowledge”._

[Bun](https://bun.sh/) provides an equally glowing endorsement: _“low-level control over memory and lack of hidden control flow makes it much **simpler** to write fast software.”_

Alas, we have introduced a new value prop here: “Low-level control over memory”. Que?

Much like [Fall Out Boy](https://genius.com/Fall-out-boy-thnks-fr-th-mmrs-lyrics) (sorry), our computers have “memory” or “[mmrs](https://genius.com/Fall-out-boy-thnks-fr-th-mmrs-lyrics)” (sorry again). ie spaces (e.g., RAM) within the system where they store data or instructions that will ultimately be used/manipulated again. 

For example, in my JavaScript program: `example.js` I might create a variable: `let age = 28`. JavaScript will then pull some Houdini-work once more and _dynamically_ allocate enough space in memory at “[runtime](https://whynowtech.substack.com/p/deno#:~:text=A%20%E2%80%9Cruntime%E2%80%9D%20is%20a%20piece%20of%20software%20that%20helps%20developers%20create%2C%20compile%20and%20execute%20programs.%20To%20grossly%20oversimplify%2C%20execute%20%3D%20make%20a%20program%20do%20what%20it%E2%80%99s%20supposed%20to%20do.)” to store the variable `age` for me. Helpful.

![image](https://github.com/alexmackenzie-wx/blog/assets/44316926/a955d20a-24ec-4b10-a431-6710589ebea9)

Zig, is less.. presumptuous. Within Zig we have to specify what type our variable is, which reveals a tad more information about how much memory our variable requires.

_** If you want to visit / revisit “types” check out my [primer](https://whynowtech.substack.com/p/deno#:~:text=In%20programming%20languages%2C%20%E2%80%9Ctypes%E2%80%9D%20are%20a%20set%20of%20categories%20that%20describe%20what%20a%20value%20in%20a%20program%20is%20(ie%20is%20it%20a%20number%2C%20a%20string%2C%20a%20boolean%2C%20etc.)%2C%20and%20as%20a%20result%2C%20what%20operations%20can%20be%20taken%20on%20the%20value.) on Deno (+ TypeScript)! **_

![image](https://github.com/alexmackenzie-wx/blog/assets/44316926/067ee097-55dc-4a87-b0a7-c75eaa44a044)

Zig doesn’t stop here though, defining your types “statically” is the easy part. 

Zig, much like C and C++, enables developers to allocate memory (remember, a space) manually. This means that Zig developers can ~precisely state how much memory they require for a given variable, function, etc., as well as when this memory should be _freed_, and hence, used elsewhere.

Again, to make the comparison to [Brendan Eich’s](https://en.wikipedia.org/wiki/Brendan_Eich#:~:text=Brendan%20Eich%20(/%CB%88a%C9%AAk/%3B%20born%20July%204%2C%201961)%5B1%5D%20is%20an%20American%20computer%20programmer%20and%20technology%20executive.%20He%20created%20the%20JavaScript%20programming%20language) darling — JavaScript handles this freeing of memory automatically. This process is known as “garbage collection”.

>**Technical Detail:** Unlike C and C++, which use the `malloc` keyword, Zig doesn’t expose memory allocation directly in the language’s syntax. 
>
>Instead, memory access is exposed via Zig’s “standard library”. 
>A standard library is a set of pre-installed functions/objects that are ready to be used with a given language. For example, Python’s standard library comes with the `datetime` object. 
>
>This, again, makes memory allocation in Zig more explicit / clear.

At this point you’re likely thinking, “so what”. Fair. What’s important to know — and what relates back to Bun’s proclamation in our intro — is that this granular control of memory leads to performance gains. Why?

Well, there are a few reasons. I’ll point-er (sorry) out two:

**1. Fragmentation:** As memory is allocated and deallocated dynamically, free memory blocks become scattered across the “heap” (place especially for dynamic memory). This can result in fragmented memory, where there are small gaps between allocated blocks. 

I’ve “[drawn](https://excalidraw.com/)” a diagram that hopefully depicts this issue better than the wall of text above does. The main point being that these fragments, because they’re small, end up being a literal waste of space. (harsh, I know)

![image](https://github.com/alexmackenzie-wx/blog/assets/44316926/5f650510-acee-471b-b90d-8f296bea5171)

**2. Garbage Collection:** Yep, y’boy garbage collection (GC) packs a punch. GC  introduces additional overhead. Why? Well, because it’s ultimately another “program” running in the background of your own.

Andrew Kelley, the creator of Zig, [goes](https://www.youtube.com/watch?v=Gv2I7qTux7g) as far as saying that GC can result in _“stop the world latency glitches”_. When it comes to building critical systems (think aviation software), “latency” doesn’t cut it. 

GC can also result in “non-deterministic” memory deallocation. ie, it may ultimately free memory that you would have ideally still had allocated.

To reiterate, whilst [potentially](https://www.zdnet.com/article/microsoft-70-percent-of-all-security-bugs-are-memory-safety-issues/#:~:text=Microsoft%3A%2070%20percent%20of%20all%20security%20bugs%20are%20memory%20safety%20issues) perilous, software written in C, C++, Zig, etc., can be more performant than software written in dynamically allocated memory (DAM.. Daniel) languages a la Python or JavaScript.

Once again, Zig’s explicitness (in this case, explicit memory allocation) is what makes it _simple_. You, and your rag-and-tag crew of developers, don’t have to figure out how memory’s allocated/freed in your application, you literally state this in your code.

_** Did I mention the word explicit? **_

As hard is it may be to believe, Zig does even more to foster “simple” codebases such as omitting a “preprocessor” and “macros”. Don’t worry, we’ll get into what these terms mean.

---

The meaning of “toolchain” is a little more difficult to accurately scope. However, the word typically means a set of utilities: **libraries**, **compilers**, **build tools**, etc., that the language, or users of the language, can leverage.

**1. Libraries** = code that someone else has written and packaged which can now be used by others to achieve a specific task. E.g., Rust’s [Pola.rs](https://www.pola.rs/) library for data manipulation. 

**2. Compilers** = take your high-level code and convert it to “machine code” (1s and 0s) that corresponds to a specific [instruction set](https://whynowtech.substack.com/p/ebpf#:~:text=Native%20Code%3A%20Machine%20code.%20More%20technically%20known%20as%20a%20CPU%E2%80%99s%20Instruction%20Set%20Architecture%20(e.g.%2C%20x86%20or%20ARM).). Do some other helpful things like optimising your code (e.g., removing “dead code”).

**3. Build Tools** = a build tool manages the entire build process, which includes compilation but also includes dependency management, testing, packaging, etc. I wrote about “building” software in detail on my Nix [primer](https://whynowtech.substack.com/p/nix).

We can use Zig’s stated goals (“maintaining **robust**, **optimal** and **reusable** software”) to fine-tune our definition.

1. **Robust** = software written in Zig works consistently, even during edge-cases. 
2. **Optimal** = software written in Zig can be.. optimised.. for a specific task.   
3. **Reusable** = software written in Zig is simple, scalable & portable.  

With these goals in mind, _I consider_ (go easy HN!) the Zig toolchain’s most notable features to be the following two:

Zig’s “**Comptime**”.

Zig’s 4 **build systems**.

---

Ok, I’m done writing in lists of twos & threes, I promise. Let’s delve into Zig’s “Comptime”.

Zig touts its Comptime as _“A fresh approach to **metaprogramming** based on **compile-time** code execution and **lazy evaluation**.”_ Let’s unpack each word emphasised as per. First, compile-time.  

Software has a “lifecycle” that ultimately results in said software being executed (ie running on a computer): 

Developers write code (think Python), “compile” this code, “link” each compiled file generated (called an “object file”) into a final “executable” and then “run” (ie execute) this.. um.. executable.

![image](https://github.com/alexmackenzie-wx/blog/assets/44316926/da772e09-7ecf-47cf-8c91-ac2638cf5df9)

Programming languages are typically evaluated at either compile-time (e.g., TypeScript) or runtime (JavaScript). “Evaluation” essentially means checking for errors, determining the “type” of a given variable, etc., all with the aim of ultimately executing a program. 

Like any technical decision, there isn’t an objectively “correct” way to evaluate a program. Rather, there are trade-offs.

For example, if you evaluate a language’s “types” at compile-time, then you’ll pick-up the incorrect usage of a “string” in a function that expects an “integer” _before_ you compile said language and run it somewhere. Thus picking up a “bug” before your software is deployed. _Phew_.

The drawback of this compile-time eval is that developers have to specify the exact type of data they expect their function to receive. This can get rather tricky. Why? Well, end-users of software are unpredictable, they may end up inserting valid data types (e.g., an integer in a “[first name](https://www.washingtonpost.com/technology/2020/05/08/musk-grimes-baby-name/#:~:text=new%20baby%20boy%2C-,X%20%C3%86%20A%2D12,-.)” field on a form) that you may not expect.  

Zig takes a more.. democratic, approach. The language enables developers to _explicitly_ state which blocks of their code they’d like “evaluated” at compile-time vs. runtime. This is handled via Zig’s `comptime` keyword:

![image](https://github.com/alexmackenzie-wx/blog/assets/44316926/f6c556b1-bc8f-4af0-acbd-24cb741f2bef)

Taking all that we now know about Zig, we can assume that the primary goal of this explicit statement of compile-time vs. runtime evaluation is.. you guessed it, _explicitness_. 

A developer reading your Zig code doesn’t have to identify/recall what’s being evaluated at compile-time, you literally tell them. Much like Zig’s control flow, nothing is “hidden” from the developer. 

Ok, cool, we like explicitness. However, I want to also point out that Comptime reiterates Zig’s ability to be fine-tuned for performance. 

For example, if we offload type inference to the _developer_ who compiles their software, then the end-user (think a general “consumer”) doesn’t have to handle type inference on their own machine at runtime. Nice.

---

Right, so we know what evaluation is and when it happens (compile-time / runtime). What’s “lazy” evaluation?

Well, thankfully, it’s rather self-explanatory. Lazy evaluation, much like a “lazy person”, isn’t proactive, it only completes a task at the last-minute, when it must.   

I’ll make this more concrete with some (simple!) Zig code which we’ll build on.

![image](https://github.com/alexmackenzie-wx/blog/assets/44316926/dd3911fa-0710-4e5d-9b6e-eda410e33142)

If we were to _lazily evaluate_ this code, we would only check/determine the values of the variables: `first_name` (“Alex”) and `second_name` (“Mackenzie”), when we need them. In this case, we need these values to complete the `first_name ++ second_name` operation.

Why is lazy evaluation helpful you ask? Well, it means you’re not doing any heavy-lifting before you have to, which ultimately results in more-efficient resource allocation. 

Why calculate the value of an expression if you’re only _maybe_ (e.g., in the context of conditional logic) going to use it later? Smart. 

This said, whilst Zig makes this lazy eval.. explicit.. I do personally feel that lazy evaluation goes against Zig’s simplicity / feels a little “hidden”. This is a primer though, so let’s leave my judgement to the side.

---

Well, this is a “lengther”. Sorry, but programming languages are very much the aggregation of minute technical decisions that, in aggregate, support a handful of objectives. If you want to grok a language, you’ve got to appreciate its nuances. 

Next, “Metaprogramming”. Remember our brief mention of “preprocessors” and “macros”? They’re back. Kinda. 

Metaprogramming is common in systems-level programming languages like C, C++, Rust. It’s what you likely expect — a program, “programming” itself. _Woah, meta_.        

In practice, metaprogramming involves leveraging compile-time information (e.g., type declarations like: `var age: i32 = 28;`) to manipulate (e.g., edit/generate code) your program in some way.

For example, with this “type information” our program could automatically edit our variable age’s data type to be “i8” vs. “i32”. i8 is a smaller data type, and hence, takes up less memory. Thus, through metaprogramming, we have optimised our Zig code at compile-time. _C'est très cool!_

> **Technical Detail:** In C/C++ metaprogramming is handled by a “preprocessor” program that uses “macros” (ie specific keywords like: `#define`).
>
>Without getting unnecessarily into the weeds, these macros are complex/error-prone; so much so that they’re considered by some to be a “separate programming language” beyond C/C++.
>Whereas Zig treats metaprogramming as a “first-class citizen”, and hence, tightly integrates the process with the rest of its “toolchain” (via Comptime).

--- 

Alright, we’re nearly wrapped up here with Zig. For those of you still here, nice job, this isn’t an easy read by any means. It certainly wasn’t a walk in the park for my ghost-writer to draft! (joke).

As mentioned, Zig is… supple. It has 4 “build modes”. Again, we discussed what “building software” is at length within my [Nix primer](https://whynowtech.substack.com/p/nix) so I shall point you there if you need a refresher.  

Zig’s 4 build modes are:

1. **Debug** = used during development (ie writing your code) and prioritises ease of debugging over performance. In this mode, code is compiled with additional debugging info.
2. **ReleaseSafe** = used for the final build of an application when performance and optimisation are critical. 
3. **ReleaseSmall** = prioritises generating the smallest possible “executable”. Achieved through techniques such as dead code (ie unused) elimination or “function/data merging” (removing duplicates). This mode’s particularly useful for embedded systems (e.g., a Ring doorbell) that have limited resources (compute/memory).
4. **ReleaseFast** = sits in between debug and release modes. Optimises for performance but still includes some additional debugging info.         

You select one of these build modes via the command line like so: 

![image](https://github.com/alexmackenzie-wx/blog/assets/44316926/f2e2bd6d-1bf8-4bdd-8db9-eec92376a7ce)

In particular, these build modes speak to Zig’s stated goal of producing _optimal_ and _reusable_ software. Wanna run some Zig code on your toaster? Cool, use ReleaseSmall. Fancy building a database? Impressive, but please use ReleaseSafe.

--- 

As hard as it may be to believe, there’s so _much more_ (build.zig, cross-compilation, etc.) that I’d like to take you through re. Zig. However, I feel like the law of diminishing returns is almost certainly kicking in already. 

I suspect you “get it”, you understand the essence and purpose of Zig. I’d encourage you to jump into the following posts/videos if you’re interested in learning more:

Mitchell Hashimoto: [Zig Build Internals](https://mitchellh.com/zig/build-internals).

Fastly: [Build an Efficient & Portable Programming Language with Zig.](https://www.fastly.com/blog/building-an-efficient-and-portable-programming-language-with-zig)

Andrew Kelley: [The Road to Zig 1.0](https://www.youtube.com/watch?v=Gv2I7qTux7g).

As I have espoused many times, I like “[Serious Software](https://whynowtech.substack.com/p/webgpu)”. Think game engines, 3d modelling software, runtimes, etc., as the “real estate” of features that can (and should!) be optimised within them is tremendous. Good luck building [Blender](https://www.blender.org/) over a weekend!

Jarred [puts](https://bun.sh/#:~:text=In%20one%20word%3A%20obsession.%20An%20enormous%20amount%20of%20time%20spent%20profiling%2C%20benchmarking%20and%20optimizing%20things.%20The%20answer%20is%20different%20for%20every%20part%20of%20Bun%2C) it similarly when asked “Why is Bun Fast?”: _“In one word: obsession. An enormous amount of time spent profiling, benchmarking and optimizing things._ **The answer is different for every part of Bun”.**

I suspect Zig will continue to make it easier for more folk like Jarred to lean into their obsessions and take on incumbents through fine-grained tweaks and tuning. If so, I am very excited to see what’s coming around the corner.

**If you are building, or considering building, with Zig, I’d love to say hello! alex@tapestry.vc **

[Finally, I’d ask that, if possible, you consider supporting the Zig Software Foundation.](https://github.com/sponsors/ziglang) 
