---
title: WebGPU Primer
publish_date: 2023-02-06
---

Bringing Back "Serious Software"

![image](https://user-images.githubusercontent.com/44316926/216819332-35dd1906-c234-40f5-adbf-3d7de665b814.png)

_Should you wish to stay updated on future posts, [subscribe](https://whynowtech.substack.com/) to receive carrier pigeons via my substack._

I absolutely love it (need to get out more in ‘23) when technologies have uses far-beyond their intended purpose. Niche, I know.

Lest we forget that the [“Slinky”](https://en.wikipedia.org/wiki/Slinky) was a stabilisation spring, Berkeley Packet Filters were for ..filtering.. network packets, and GPUs were solely for rendering computer graphics. Matrix multiplication.. who dis?

This lineage, twinned with the acronym soup (a la GPGPU, WGL, WGSL, SPIR) that, per [Mackenzie’s Law™](https://mack.work/mackenzies_law.html), must accompany anything to do with computer graphics, has tee’d this primer up rather nicely.

Alas, things are going to get worse before they get better.

** _Enter “WebGPU”_ **

There’s, of course, no [#C0C0C0](https://www.canva.com/colors/color-meanings/silver/) bullet.

However — Conflict-Free Replicated Data Types, Operational Transformation, & everyone’s favourite compilation target, WebAssembly certainly aren’t impediments.

Well, we may now soon have another technological arrow in our quiver — WebGPU.

Without revealing too much, let’s just say that up until this point via “WebGL” (we will discuss) the modern GPU has been a second citizen within the browser. WebGPU is changing that.

Within this primer we’ll discuss:

- >> The history of GPUs.

- >> The “graphics pipeline”.

- >> The history of graphics APIs.

- >> WebGPU. You’d hope!

- >> What trends +/ applications WebGPU may unlock +/ promulgate.

---

Web**GPU** is the working name (work harder, please?) for a **Web API** for **accelerated graphics** _and_ **compute**.

As always, let’s first cherry-pick the complexity out of this definition & take it step-by-step.

---

**Act 1, Scene 1 — the Graphics Processing Unit.**

** _If you’re intimately familiar ([weird!](https://whynowtech.substack.com/p/nix#:~:text=If%20you%E2%80%99re%20intimately%20(weird!)%20familiar%20with)) with CPU/GPUs you can skip this section_ **

Central Processing Units are “chips” (ie billions of transistors et al packaged) used for “general purpose” computation; meaning that these chips are “architected” to handle a broad range of, ultimately mathematical (thank you [George Boole](https://en.wikipedia.org/wiki/George_Boole)), operations.

You know when your Salesforce app totals the (de minimis 😢) number of leads in your pipeline? Cool, that mathematical operation is handled by your CPU’s “Arithmetic-Logic Unit”. As is the **bold** toggle when you’re writing a Substack post.

>**Key Point:** CPUs handle (or, “process”) the _general_, often very different, data and actions that your computer takes to run itself and third-party software.

It’s important to note that CPUs are designed to process these disparate operations as quickly as possible — also known as being optimised for “low latency”.

The “why” re. low latency should be clear here — we are modern, entitled computer users that expect almost prescient (thanks [React](https://engineering.surveysparrow.com/the-magic-of-optimistic-ui-updates-311351df28b)) execution (!). However, this demand for low latency is also inextricably linked with _how_ CPUs process instructions.

Each CPU’s (or CPU cores’!) operations are executed serially (ie one at a time). At an _almost offensively_ high-level (ignoring [interrupts](https://www.linkedin.com/pulse/how-interrupts-handled-processor-detailed-view-vasuki-shankar/?trk=public_profile_article_view), etc), revisiting our example, this means that a CPU would execute our Salesforce pipeline arithmetic first, and then once complete, it would execute our **bold** operation in Substack.

>**Technical Detail x2:**
>
>“**Cores**” are essentially mini-CPUs, CPUs within a CPU. They enable(d) some degree of parallel (vs. serial) execution. You may remember how big of a deal the first Intel “**Dual-Core**” processor was when launched in 2006?
>
>CPU performance is often measured by “**clock speed**”. Clock speed == the number of compute cycles a CPU handles per second. Let’s not get into “compute >cycles” in this post — just know that, all else being equal, the more compute cycles a CPU can handle per second, the more “performant” a computer is.

GPUs on the other hand are a little more picky, less.. general purpose.

How so? Broadly speaking, GPUs have a much more narrowly-scoped “instruction set architecture” (or “ISA”).

Without getting into the weeds of ISAs, they basically determine the range of operations a chip can take on the data it receives. I elaborated further on them within the first (🥹) Why Now [post](https://whynowtech.substack.com/p/ebpf#:~:text=Native%20Code%3A%20Machine%20code.%20More%20technically%20known%20as%20a%20CPU%E2%80%99s%20Instruction%20Set%20Architecture%20(e.g.%2C%20x86%20or%20ARM)) on eBPF!

Once upon a time, GPUs were considered “ASICs”, or application specific integrated circuits. Ie chips optimised for a specific task — in GPU’s case, rendering graphics.

In order to grok (spoiler alert!) why GPUs have since become used for matrix multiplication, proof-of-work cryptomining, &, making a [pretty penny](https://stockx.com/en-gb/nvidia) on StockX, we need to go back to their ASIC roots.

---

** _Buckle in, as we’re about to tackle comp graphics, a rather gnarly (but fun!) topic_ **

Your computer screen’s display is made up of minute points of illumination known as “pixels” — aka “picture elements”. Colour, coat & shade these little guys & you “render” graphics. Do so with great detail and dynamism, and you generate something as breathtaking as BOTW.

![image](https://user-images.githubusercontent.com/44316926/216819858-6cd4d177-b96a-4437-a5dc-000efd631765.png)

A copious amount of work goes into designing what you see above. However, at a very high-level: Computer graphics is the process of converting data (e.g., cartesian coordinates) into images on a computer screen.

This conversion gets a whole lot more laborious when converting a 3D “scene” (more on this in a second). Why? Because your computer screen is a 2D environment.

We’ll focus on 3D graphics rendering as I think it better illustrates the “graphics pipeline”. (Also something we’ll be revisiting A$AP).

A “scene” is a foundational concept in 3D whereby each scene consists of:

- >> 3D geometry (ie “vectors”).

- >> Transformations.

- >> Lights.

- >> Material Properties.

- >> ~A Camera / View.

For graphics newcomers I suspect this all seems a little abstruse. To ground what I just said into reality, pick up an object around you.. perhaps a computer mouse?

Yes, really.. pick it up.

Hold the mouse close to your face (the “camera” in this case), then move it away from you. Note how the object inhabits more of your field of view when close? This is the result of an object (ie the mouse) being “**transformed**”.

Notice how **light** sources bounce off of the mouse when you hold it at various angles?

Ok, now pick up something else, perhaps your keyboar..efouvwvrrnibtv (I jest!).

Notice how light sources bounce differently off of your keyboard vs. mouse? This is due to their respective **materials**.

If we want to render images on computer screens that _look_ 3D, these images need comparable properties (light, materials, etc) & to exhibit similar behaviours (shadow casting, light refraction, etc).

For those of you that write code, below is some JavaScript I wrote (TQ three.js) to render [this](https://mack.work/cube.html) cube. Note the creation of a “scene” with some geometric points, a transformation, some lighting, etc.

** _To be very clear — you do not need to understand this code to understand computer graphics!_ **

![image](https://user-images.githubusercontent.com/44316926/216820031-a0aee83b-5ea0-4c6a-be8e-10d3902c3b5e.png)

Ok, so we know what a 3D scene is comprised of & why. How does this scene get converted into the aforementioned 2D image?

** _Yes, that’s right [Jensen](https://www.nvidia.com/en-gb/about-nvidia/board-of-directors/jensen-huang/), via the “graphics pipeline”!_ **

Graphics pipelines vary. However, at a very high-level, what happens here is:

- >> We first create this 3D scene via a 3D creation application such as [Godot](https://mack.work/pokemon_yellow) (my favourite piece of software on this here earth!). We then export this 3D scene in an appropriate file format, e.g., .[glTF](https://www.threekit.com/blog/gltf-everything-you-need-to-know#:~:text=is%20using%20it.-,What%20is%20glTF%3F,-The%20GL%20Transmission).

- >> We then pass this file (ie data) from our CPU to our GPU. This data is an input into the graphics pipeline. This pipeline is a chain of functions (aka “shaders”) that are executed by the GPU.

-  >> These functions ultimately “draw” (ie place, colour and shade) pixels on a screen that represent the supplied 3D scene.

>**Technical Detail:** functions in programming are exactly the same concept that you learned in math. They (typically) receive data (arguments), do something with this data (e.g., add two integers together) and “return” a result.

There are a _[lot](https://www.samsung.com/africa_en/tvs/tv-buying-guide/what-is-8k-tv/#:~:text=An%208K%20TV%20is%20a,resolution%20of%20about%208%2C000%20pixels.)_ of pixels to draw on modern high-resolution screens.

To make things worse, modern content (think a YouTube video) is often rendered at 60 frames per second — meaning all of those pixels have to be re-drawn 60 times a second.

Suddenly, CPUs in all their general-purpose, serialisable goodness seem a little.. inefficient?

**G**raphics **P**rocessing **U**nits were designed to do something about this.

Whilst modern CPUs may have something to the tune of 10 general-purpose cores (remember, mini-CPUs), modern GPUs like Nvidia’s GeForce GTX 1080 have **2560 specialised** cores (!).

>**Technical Detail:** These cores have less general-purpose instruction sets to those present in CPUs. They’re “specialised” for specific, graphics-based, operations.

With this many cores, GPUs can pass many “pieces” of 3D geometry (called “vectors”) and later in the pipeline, pixels, into multiple instances of our beloved graphics pipeline at once.

** _Re-read that previous sentence to make sure it clicks._ **

Meaning that GPUs process data (ie vectors & pixels) in a parallel manner vs. the serial approach taken by CPUs.

>**Key Point:** CPUs are designed for “low-latency” — doing a single computation as quickly as possible. GPUs are designed for “high-throughput” — doing as many computations as possible.

![image](https://user-images.githubusercontent.com/44316926/216820320-81535665-988f-4f5f-b59a-b49de59aab3f.png)

If you’re interested in learning about the history of GPUs I’d highly recommend listening to Acquired’s [episode](https://www.acquired.fm/episodes/nvidia-the-gpu-company-1993-2006)(s) on Nvidia. However, I have taken the liberty of bringing you right to the punchline — high-throughput capabilities are useful for a whole lot more than just graphics rendering 😧:

Proof-of-worked based cryptocurrency mining, matrix multiplication (ie ML), scientific computing, video editing, etc, et al.

This offloading of specific tasks from CPUs to GPUs (or any specialised hardware for that matter!) is known as **hardware acceleration**. GPUs _accelerate_ graphics rendering as well as certain types of computation.

…ok

If I’ve done my “job” here you should have a high-level understanding of CPUs, GPUs & computer graphics. Not bad! All necessary conduits for truly grokking WebGPU.

** _Next up, graphics APIs_ **

**_If you're enjoying this post, consider [subscribing](https://whynowtech.substack.com/)? I will be tackling Zig next._**

---

Web~~**GPU**~~ is the working name for a **Web API** for ~~**accelerated graphics**~~ and ~~**compute**~~.

Cool, we’ve picked off a few items here in our definition. Progress.

We’re at a point now where we know why our applications would want to communicate with GPUs. Hardware acceleration!

But, how does this communication happen?

Graphics APIs, my dear Watson.

** _Proceeds to whip out a history textbook_ **

The history of the modern graphics pipeline starts in a galaxy far, far away (sorry..) at [LucasFilm](https://en.wikipedia.org/wiki/Lucasfilm#:~:text=Lucasfilm%20was%20founded%20by%20filmmaker,the%20Star%20Wars%20Corporation%2C%20Inc.) in 1980. Back then, computer graphics was a particularly onerous process; every GPU model had its own software (!) (ie “drivers”).

>**Technical Detail:** “drivers” expose the GPU’s capabilities to the operating system in a way the OS understands and expects. The operating system in turn can expose it to applications, using various graphics APIs.

This meant that if a developer wanted to get a GPU to execute their graphics pipeline (remember, chain of functions), they would need to know the exact “instruction set” for that particular make of GPU. Talk about _“doing things that don’t scale”_!

Thankfully, the OpenGL (Khronos Group) & DirectX (Microsoft) “Graphics APIs” were released in 1992 + 1995 respectively.

These Graphics APIs provided a common interface for developers, whereby they could learn the API’s specification vs. the specification of a specific GPU driver. The API would then handle an individual GPU’s idiosyncrasies. _C’est simple!_

Alas, the new APIs on the block and their GPU counterparts weren’t perfect. They only ran the “fixed-function pipeline”, or “FFP”. I promised many acronyms!

For once in graphics, the parlance here is semi-informative. “Fixed Function” meant that there was a specific.. fixed.. set of functions (e.g., make these pixels look “foggy”) exposed to the developer (by these APIs) that they could avail of when rendering graphics.

Put another way, during the fixed-function pipeline epoch, we didn’t have truly “programmable GPUs”.

Meaning that developers couldn’t use GPUs to accelerate arbitrary +/ custom graphics functions that they wrote themselves (aka “shaders”). E.g., make these pixels look “foggy” based on my specification (ie my code) of foggy.

>**Technical Detail:** ~Pretty much~ any function that’s executed on a GPU is also considered a “shader”. Common shaders include vertex shaders, geometry shaders, tesselation control/evaluation shaders and fragment shaders — this is a topic for another day!

Then 2002 came along, and with it, Nvidia unveiling the GeForce FX GPU, a “fully programmable” GPU.

Of course, this innovation primarily initially equated to “[faster horses](https://hbr.org/2011/08/henry-ford-never-said-the-fast)”. Ie better graphics.

However, some enterprising folk realised that if they encoded any data they wanted processed as if it was graphics data (remember our 3D scenes?) that they could use these GPUs to accelerate a much broader set of calculations (ie beyond graphics).

_C’est cool, non?_

** _This is a seminal moment in the history of computing, make sure it clicks_ **

Skip forward a wee bit to 2006 and Nvidia released “CUDA”. AKA, the succinct, Compute Unified Device Architecture. This was real hat-tip to those using Nvidia GPUs for general-purpose computing.

Or — GPGPU, if you will.

At an embarrassingly ( ͡° ͜ʖ ͡°) high level, CUDA was released as a new API, for a new set of Nvidia GPUs.

These GPUs had a more general purpose instruction set. Meaning that they could be used for general purpose computing (shocker!), without the complex encoding work I described a few paragraphs back.

Even better, developers could interface with CUDA in higher-level programming languages like CUDA-C / C++ or.. Fortran.. 😷.

Ok — cool, thanks to a spate of innovation in graphics, GPUs were unshackled from their singular use case. Why stop here though?

** _We are nearly at WebGPU itself FYI_ **

Fast-forward to 2011 and Khronos released **“WebGL”** (ie “Web Graphics Library”) a browser-native, JavaScript API. Unsurprisingly, WebGL is really a thin “wrapper” around OpenGL.

This API ultimately runs “on top of” (ie gets converted into) the OpenGL spec when used on macOS / Linus or DirectX on windows.

>**Technical Detail:** “browser-native” just means that the API is part of the standard set of APIs that web browsers (e.g., Google Chrome) expose to web developers.
>
>Meaning that developers don’t have to “install” WebGL like they would install a library like React.

This API enables web developers to perform 2D and 3D rendering (remember, drawing pixels on screens!) within an HTML `<canvas>` element.

If you’re unfamiliar with HTML do not fret, just think of `<canvas>` as a space on a webpage where graphics can be rendered by a GPU. Pretty simple.

[Here’s](https://madebyevan.com/webgl-water/) an illustration by Figma Co-Founder, Evan Wallace, using WebGL in the early 2000s to showcase realtime water rendering. Press the G key on your keyboard when in the demo 😎

![image](https://user-images.githubusercontent.com/44316926/216820902-8f5efadc-3372-40e6-bff7-bf2d593b93cf.png)

Ok — so as of 2011, GPU APIs are also present in web browsers. Rejoice!

However, note that there’s not much chat about WebGL for the “GPGPU” use case. Perhaps there’s room for a new.. **GPU** API for the **Web**..?

** _If you’ve continued reading this far, fair play &.. [subscribe](https://whynowtech.substack.com/)?_ **

---

Web~~**GPU**~~ is the working name for a ~~**Web API**~~ for ~~**accelerated graphics**~~ and ~~**compute**~~.

As one might expect in an industry that lionises being “high-throughput”, further progress wasn’t too far away.

Outside of the web in 2013, [AMD](https://www.amd.com/en) began developing “Mantle”. This graphics API espoused even “lower-level” access to modern GPUs (hence, greater performance).

Unfortunately, to cut a long-story-short, Mantle’s public development was discontinued 2 years after its first breath in 2015. However, they graciously (hmm..) donated the API to the Khronos Group in 2016.

This donation led to the release of “[Vulkan](https://www.vulkan.org/)” by Khronos. As one would expect, Vulkan exposes Mantle’s low-level GPU access, but the API also offers:

- >> A single API for both desktop and mobile graphics devices; whereas previously these platforms were split between the OpenGL and OpenGL ES (“embedded systems”) APIs respectively.

- >> Cross-platform compatibility. Vulkan is available on multiple operating systems and devices; where as Direct3D 12 is, as you might expect, only available on Windows/Xbox (boo).

- >> Reduced CPU load by offloading (to the GPU) computations traditionally handled by the CPU.

- >> A pretty badass, if not a little disconcerting.. new brand identity.

![image](https://user-images.githubusercontent.com/44316926/216821080-20044320-35d6-4b7b-9302-0c34cf1f6c79.png)

In.. parallel.. (ha!) with Vulkan, Microsoft didn’t sit back idly — they released [Direct3D 12](https://learn.microsoft.com/en-us/windows/win32/direct3d12/direct3d-12-graphics) in 2015. Apple, unwilling to be left out, also joined in the modern GPU API fray in 2014 avec “[Metal](https://developer.apple.com/metal/)”.

** _What does this have to do with WebGPU you may be asking yourself? Fair.._ **

Well, as I said, WebGL didn’t exactly orient itself towards the GPGPU use case. Why, [retrophilia](https://www.collinsdictionary.com/dictionary/english/retrophiliac)..? WebGPU on the other hand, has first-class support for performing general purpose computations on the GPU.

WebGL also doesn’t offer many of the modern features that native solutions, a la Vulkan, provide. How so?

Well, WebGL is broadly a thin “wrapper” (ie a similar spec) based on OpenGL 1.0 (released in 1992), which itself, traces back to Silicon Graphics’ “IRIS GL” — released in the 1980s (!). It old.

Meaning that WebGL isn’t really built to match the design of modern GPUs, causing GPU & CPU performance issues. This ageing spec also means it’s difficult to layer WebGL on top of our modern native friends: Vulkan, Direct3D 12, Metal, etc.

Thus, work on a new Web GPU API began! & with it, a modern, bold, provocative, name.. WebGPU..

Whilst WebGPU’s working name is lacking in some imagination, the API’s spec and goals most certainly aren’t.

Firstly — [Surma](https://surma.dev/things/webgpu/index.html#:~:text=to%20both%20feel-,%E2%80%9Cwebby%E2%80%9D,-and%20to%20comfortably) puts it best, WebGPU feels webby ( / wɛbi / ). Whilst I can’t exactly provide you with a technical definition here, I agree. WebGPU works in a familiar manner to its Web API [counterparts](https://developer.mozilla.org/en-US/docs/Web/API).

Generally it’s viewed that WebGPU is a mixture of Direct3D 12, Metal & Vulkan. So, not only is WebGPU ~~ _webby_ ~~ but it also maps well to native APIs, reducing the aforementioned GPU & CPU performance issues.

As mentioned, WebGPU also defies WebGL’s parochialism (bit harsh I know) by exposing two “pipelines” (remember, a chain of functions) to web developers — a “render pipeline” and a “compute pipeline”.

Finally, the web as rolled out the red carpet for GPGPU!

---

At this point, we could go deeper into WebGPU’s spec, tackling its abstractions (logical devices, adapters, etc) but I suspect that this may be overkill for the 3 readers still left… sorry, I know this was a lengther!

** _For those interested in going deeper, [Alain Galvan’s](https://alain.xyz/blog/raw-webgpu) work is the-best-in-the-biz_ **

So instead, I figured we’d move onto some final predictions about what trends and applications WebGPU may unlock and/or promulgate:

- >> **[BOTW](https://www.zelda.com/breath-of-the-wild/)-Esque Graphics:** Ironically, the real magic here is when render and compute pipelines are blended. Leveraging the compute pipeline facilitates modern graphics rendering techniques a la [ray tracing](https://developer.nvidia.com/rtx/ray-tracing) within the web browser. Expect cool new occlusion / refraction-based UIs.

- >> **ML in-Browser:** Tensorflow.js (or ONNX.js) [provides](https://www.tensorflow.org/js/demos) a bunch of great demos on why you may want to train a ML model in a web browser. Again, this isn’t exactly “novel” but WebGPU will make the process more performant +/ specific. There’s also a world where offloading training to your users’ local machine makes sense from a latency, cost + privacy-preserving (long-live [federated learning](https://whynowtech.substack.com/p/federated-learning)) perspective.

- >> **“Serious Software” in-Browser:** Broadly, serious software (think Blender, Unreal, AE, etc) is OS-native vs. web-native due to its performance requirements. Collaboration flows (as Figma has proven) change entirely when you can afford to be “multiplayer-first” (thanks to web browsers). I’m curious if this creates sufficient breathing room to dethrone the likes of Unity or Autodesk.

- >> **“Serious Games” in-Browser:** there have been numerous [false starts](https://stadia.google.com/gg/) in this space and it’s still very much TBD on the local vs. cloud gaming debate — perhaps not mutually exclusive! Either way, with WebGPU it’s far more plausible that there’s a future where I’ll be playing The Elder Scrolls with some mates within a web browser. How cool.

- >> **Browser-OS:** As teased, the browser is increasingly being bestowed with the functionality of native operating systems. Future applications will all be expected to look/work like [Linear](https://linear.app/) — offline mode enabled, multiplayer-first, etc. This trend is being driven by many innovations, WebGPU is a constituent.

** _WebGPU — fin_ **

---

As always, thank you for reading. I genuinely appreciate it! As shamelessly mentioned several times in this post, you can subscribe [here](https://whynowtech.substack.com/) to keep up to date on future technical primers and venture capital musings. 

I’m at alex@tapestry.vc if you feel like saying hello / trading notes!
