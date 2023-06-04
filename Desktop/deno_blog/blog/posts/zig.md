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

