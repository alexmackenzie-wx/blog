---
title: eBPF Primer
publish_date: 2022-06-17
---

*“Some say software is eating the world, I would say that: BPF is eating software”*

*Should you wish to stay updated on future posts, subscribe to receive carrier pidgeons at my [substack](https://whynowtech.substack.com/).*

To paraphrase [Brad Gerstner](https://www.acquired.fm/episodes/altimeter-with-brad-gerstner), there are two broad approaches to investing: “working the cocktail circuit” or being an “anthropologist”. At the cocktail parties I’ve attended of late, touting ~new ways to program the Linux kernel isn’t always a surefire way to make friends, so anthropology it is. Like many emerging technologies (a la WebAssembly), it isn’t exclusively eBPF itself that represents a direct opportunity, but also the potential second-order solutions that the technology enables.

The market adjacent to eBPF is easy to get excited about. Linux is the world’s [most used](https://frameboxxindore.com/other/what-percentage-of-servers-are-linux.html#:~:text=90%25%20of%20all%20cloud%20infrastructure%20operates%20on%20Linux) operating system — the trillion-dollar cloud runs on Linux. Yet despite its popularity, [Brendan Gregg](https://www.brendangregg.com/) has famously likened the Linux kernel to HTML — a non-programmable file.

** *Adds calling people “HTML” to insult list* **

The programmability of the web is what led to the proliferation of web-based applications vs. pages. Similarly, eBPF facilitates the building of kernel-based applications. At this point at the cocktail party, I’m duly asked “why would I want to build kernel-based applications?”, to which I retort back “why would I want to build web-based applications?”. The web and the kernel have/are both software interfaces with assigned roles, which means that they receive specific inputs (data) and permissions (functions) that adjacent applications can use to conduct certain tasks.

Anyway, enough preambling. There are plenty of deeply technical posts elaborating on eBPF and pontificating on its future — this post will do the same, but (hopefully) in a more approachable and actionable way.

If you’re building eBPF developer tooling or solving problems with eBPF generally I’d love to talk to you / grab coffee if you’re in London >> alex at tapestry dot vc

---

### eBPF Primer

[eBPF](https://ebpf.io/what-is-ebpf/) (Extended Berkeley Packet Filters) is a method of programming the Linux kernel. For the uninitiated (the lucky ones) the kernel is the piece of software within the Linux operating system that enables applications in *userspace* (e.g., Slack) to interact with a computer's underlying hardware (e.g., memory). The kernel’s intermediary role means that it is incredibly *privileged* — it “sees” all information communicated and decides what to relay/execute.

So, “programming” the kernel means providing this privileged software with additional functionality and context, and hence, utility via code written by developers. Much like adding JavaScript to a webpage to enable computation or statefulness.

The kernel has historically been difficult to program due to its central role and high requirement for stability and security. The rate of innovation at the operating system level has thus traditionally been lower compared to functionality implemented outside of the operating system. Prior to eBPF, the kernel was ~safely programmed via: 1) changing the kernel’s source code (which can take years) or 2) loading “kernel modules” (which aren’t backward compatible).

> **Key Point:** Alternative methods of programming the kernel are slow to implement or error-prone.

*So, how does eBPF enable the kernel to be programmed in a way that is expedient, performant, and less prone to failure?*

At a high-level, eBPF programs go through a series of steps to ensure that they’re insusceptible to the issues loadable kernel modules create. These steps are encapsulated under the process known as the “eBPF runtime”.

This “eBPF runtime” consists of 3 core processes:

1. Program Development.
2. Program Verification.
3. Program Attachment.

**1) Program Development**

Firstly, developers write the code that will program the kernel. Developers will often write eBPF programs via higher-level languages like Python/C because it’s easier to write programs in these languages vs. writing eBPF bytecode.

** *We’re going to jump into the deep end a little now but stay with me* **

Within these programs, developers will specify a “program type” and “hook point”.

- **Program types** are a finite set of options that specify what an eBPF program is allowed to do. For example, if you select the BPF_PROG_TYPE_SOCKET_FILTER program type your program can only filter network packets. It can’t, for example, determine if a device operation should be permitted or not.

- **Hook points** are events that happen within the kernel. Events provide your eBPF programs with data. So, you will “hook” your eBPF program to a hook point in order to gain access to kernel-specific data that you may want to do something with. Much like JavaScript programs can react to events like a user clicking a button, eBPF reacts to kernel events. An example of a hook point is a system call (will define this later).

What’s most important to note here is that eBPF requires this detail given how privileged the kernel is. It would be a significant security risk to give a single eBPF program unnecessary access to all kernel functionality and/or events.

Additionally, much like any development environment, eBPF provides developers with a series of utilities that enable developers to complete programming tasks more effectively. To keep the JavaScript example alive and well, Node.js provides developers with utilities such as modules. In eBPF’s case these utilities are: maps, helper functions and tail/function calls.

- **Maps** are key-value data structures. They’re used to pass data between eBPF programs and between userspace and the kernel.

- **Helper Functions** are stable kernel APIs used within eBPF programs to interact with the system they’re running on. They dictate what your program can do with the context it receives from a map or due to being attached to a given hook point.

- **Function Calls** are used to define and call functions within an eBPF program.

- **Tail Calls** are used to call and execute another eBPF program and replace the execution context. Similar to how Node’s module.exports and require() work.

** *Let’s walk through an example eBPF program courtesy of [Liz Rice](https://www.lizrice.com/) with comments par moi* **

```python

# Here we will define a simple eBPF program that prints Hello World every time a process is created

# Importing bcc (bpf compiler collection) - makes writing eBPF programs much easier

from bcc import BPF 

# Defining my C program (the ebpf program) within a multi-line string

# Note "bpf_trace_printk" is a helper function 

ebpf_program = """ 
	int = hello(void *ctx) {
		bpf_trace_printk("Hello World"\\n);
			return 0;	
  }
"""

# Telling bcc that this is the code we want to compile to our bytecode target

b = BPF(text=ebpf_program) 

# Attaching the C program to a particular event in the kernel

b.attach_kprobe(event="sys_clone", fn_name="hello") 

# Taking our trace output from the kernel and displaying it in userspace

b.trace_print() 

# What's important to highlight here is that we're writing the eBPF program code as well as the userspace code that will interact with the outputs of our eBPF program


```

This code is then compiled to a specific bytecode format - eBPF bytecode. Post being compiled, the eBPF bytecode is then sent to the kernel via the bpf() system call. System calls or “syscalls” are the APIs exposed by the kernel which allow userspace applications to communicate with the kernel.

> **Technical Detail:** Bytecodes are numeric representations of your human-readable code (e.g., Python). They’re an intermediate state between your human-readable code and “machine code”. To avoid getting into the weeds here, just ask yourself what could code that’s more similar (remember, it’s an intermediate state) to machine code (ie a binary language that can command hardware) enable? One answer is a more performant interpretation / subsequent compilation of this code. This is all you need to know for now as bytecode relates to eBPF.

**2) Program Verification**

Now that the bytecode is sent into the kernel, the kernel passes this bytecode through the “eBPF verifier”. The eBPF verifier can be thought of as a function that receives the bytecode as an argument and runs a series of tests to make sure that the bytecode is “safe” to run.

*Safe* means that a user has permission to load eBPF bytecode and that running this eBPF bytecode won’t crash the kernel, expose arbitrary kernel memory, and much more. Again, note the checks and balances that are taken by eBPF to ensure that the kernel is protected from these programs.

Once the bytecode runs through the eBPF verifier it is either approved or rejected.

**3) Program Attachment**

Now that this intermediate bytecode has been verified as safe to run, the program is attached to the developer’s pre-defined hook point. Remember, the hook point is specified in your code. In our sample code above, the specified hook point is the `sys_clone` system call which is called every time a new process starts.

The kernel then compiles the bytecode further to “native code” via a JIT (just-in-time) compiler.

> **Technical Detail x2 (I’m sorry):**
>
> **JIT Compiler:** JIT compilers compile code during runtime (when the code is being executed) vs. before runtime.
>
> **Native Code:** Machine code. More technically known as a CPU’s Instruction Set Architecture (e.g., x86 or ARM).

So, as some of you may already be thinking, eBPF is ultimately a virtual machine within the kernel. It executes sandboxed programs at near-native speeds.

> **Key Point:** Our initial question asked: how does eBPF help program the kernel in a way that is expedient, performant, and fail-proof? Via the eBPF runtime.

** *If you’ve followed along this far (and if I’ve done my job correctly) you now understand how eBPF works* **

---

### eBPF In Production

To bring this post to life, let’s look at some examples of eBPF being used in production.

- Meta created [Katran](https://github.com/facebookincubator/katran), an eBPF program used to optimize their network load balancing efforts. With Katran, Meta can colocate their load balancer with backend applications, thus increasing Meta’s general load balancer capacity. Prior to eBPF, Meta used the IVPS kernel module to conduct layer four load balancing (L4LB). Whilst this was a software approach, it still required dedicated servers (remember, kernel modules are fragile!).

- [Isovalent](https://isovalent.com/) is kind of the eBPF company, so they do a lot with it. For example, they use eBPF to enable granular and dynamic identity-aware observability into container workloads. This granularity is achieved thanks to being able to pass kernel events via maps to userspace.

- [Sysdig](https://sysdig.com/) is most known for its runtime observability solutions. They [switched](https://sysdig.com/blog/sysdig-and-falco-now-powered-by-ebpf/#:~:text=this%20means%20that%20it%20will%20never%20lead%20to%20a%20kernel%20crash%20or%20kernel%20instability) from a kernel module-based architecture to an eBPF architecture due to stability, security, and compatibility issues they faced / customer feedback they received.

- [Cloudflare](https://www.cloudflare.com/) is another company that uses eBPF prolifically. Within their edge servers, they run 6 layers of eBPF programs. One of their coolest use cases is leveraging eBPF to do programmable packet filtering within [Magic Firewall](https://www.cloudflare.com/magic-firewall/).

- New Relic, Aqua Security, Tigera, AccuKnox and Seekret also leverage eBPF.

You may be noticing some common use cases of eBPF here. Namely, observability, security, and networking.

It’s important to note however that eBPF isn’t always a superior method for programming the kernel. Like all technologies, using eBPF comes with its own set of trade-offs. Potential challenges faced using eBPF include:

- You can’t avail of certain high-level programming constructs such as loops. If you want more control over how the programs are executed, writing a kernel module might be a better choice.

- Many useful helper functions (such as `perf_event_output`) are exported as GPL-only. If you want your program to do anything useful, you're going to have to license it under GPL. That makes it hard to make proprietary programs based on BPF.

- Using eBPF instead of built-in tools like iptables might result in a comparatively high CPU usage. Although this one is very much up for debate!

---

### eBPF History

Extended 🤔 - Berkeley 🤔 - Packet Filter 🤔 

eBPF gets its [fair share](https://www.ferrisellis.com/content/ebpf_past_present_future/#:~:text=I%E2%80%99d%20argue%20that%20a%20more%20fitting%20name%20for%20eBPF%20would%20be%20the%20Functional%20Virtual%20Machine%2C%20or%20FVM%20for%20short.) of flak for its name, and arguably rightly so. However, if you trace back the technology’s history there’s some romance to be found in the four-letter acronym. To me, it captures the technology’s lineage rather perfectly.

**1) Packet Filter**

In 1993 the paper “The BSD Packet Filter - A New Architecture for User-level Packet Capture” was presented by Steven McCanne and Van Jacobson at the 1993 Winter USENIX conference.

In the paper, McCanne and Jacobson described the BSD (**B**) Packet (**P**) Filter (**F**). This packet filter leveraged a highly-efficient kernel-based virtual machine to solely do traffic filtering in a performant manner while still preserving a boundary between the filter code and the kernel.

** *Sounds familiar to one of Cloudflare’s use cases?* **

What was truly prescient by the duo however was how they designed the virtual machine for generality. They specified:

- “It must be protocol independent. The kernel should not have to be modified to add new protocol support.”

- “It must be general. The instruction set should be rich enough to handle unforeseen uses.”

- “Packet data references should be minimized.”

- “Decoding an instruction should consist of a single C switch statement.”

- “The abstract machine registers should reside in physical registers.”

**2) Berkeley**

There were predecessors to BPF such as the CMU/Stanford Packet Filter. Steve & Van (we’re on a first-name basis now) worked at Lawrence Berkeley Laboratory.

**3) Extended**

In 2014 (same year as Kubernetes!) Linux 3.18 was released which contained the first implementation of an extended (ie more usable) BPF. This release, and subsequent releases, consisted of many improvements to BPF:

- eBPF programs are JIT-compiled which leads to performance improvements vs. BPF (up to [4x faster](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=bd4cf0ed331a275e9bf5a49e6d0fd55dffc551b8)).

- eBPF programs can be hooked into a wide range of kernel events vs. solely being used for packet filtering. Thus unlocking observability and security use cases.

- eBPF programs can be loaded from userspace via our friend the `bpf()` syscall. Thus enabling developers to use Python, Rust, and Go as valid frontends.

- eBPF programs can now leverage maps. Thus creating notably more stateful programs.

- Continues to be extended in many other ways to this day.

** *Know the acronym and you know the history* **

---

### The Future of eBPF

Perhaps the most salient point here is that we’re witnessing a step-change in the rate of innovation within the kernel as developers are markedly less constrained by the kernel as a development environment. This rate of innovation will inevitably create new breaking points for the technology which I’ll be keeping an eye on. An emerging example here is the lifecycle management of numerous eBPF programs across multiple nodes - [l3af](https://l3af.io/) is setting out to solve this problem in a user-friendly way.

Additional eBPF developer tools I’m excited to see emerge include:

- Package registry for eBPF programs.

- Additional state tooling.

- New development frameworks.

As eBPF continues to proliferate, Linux source code maintainers are also increasingly incentivized to add additional support for eBPF. For example, in this Linux v5.7 [patch](https://lwn.net/ml/linux-kernel/20200220175250.10795-1-kpsingh@chromium.org/), support was added for Linux Security Modules as hook points. LSMs are deserving of a post of their own — the main point to note here is that as eBPF programs gain access to new hook points, kernel functions, and other development utilities, new applications of the technology will crop up.

** *As a selfish aside, I’m interested in projects reducing the complexity of runtime enforcement - if you’re working on this say hello >> alex at tapestry dot vc* **

Aware I may very much sound like a man with a hammer at this point. However, as the aforementioned eBPF support continues, I believe we’ll see a gradual shift towards more traditionally userspace-bound programs being executed within the kernel instead. Why? Because unlike eBPF programs, userspace programs are completely isolated from the hardware that they ultimately rely on — this means that they incur a drop in performance between ~25-30% (!).

Whilst innovation within the kernel across networking, observability, and security will likely continue to be eBPF’s core commercial use case, it’s worth doing some blue-sky thinking too. As a technology, eBPF is an incredibly simple instruction set when compared to an ISA like x86. This makes the eBPF virtual machine far more portable (more complexity = more that can go wrong) than its peers. Thus, [many](https://www.ferrisellis.com/content/ebpf_past_present_future/) — h/t to Ferris Ellis — have speculated on the virtual machine’s usage in entirely new systems beyond the kernel such as in “smart NICs.”

> **Technical Detail:** Technical Detail: Smart Network Interface Cards (NICS) allow the processing of network traffic, to varying degrees, to be offloaded to the NICs themselves (vs. the CPU).

New systems present new constraints. Fortunately for eBPF, constraints are what led to its creation. I’m looking forward to seeing if the technology becomes the standard development environment across increasingly powerful hardware. If so, it may very well have software for **breakfast**.
