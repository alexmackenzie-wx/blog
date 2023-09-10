---
title: Hyena Hierarchy
publish_date: 2023-09-04
---

_Breaking the Quadratic Barrier_

![image](https://github.com/alexmackenzie-wx/blog/assets/44316926/ab66846e-2fb0-4907-8599-b45bf8a0d656)

*Should you wish to stay updated on future posts, subscribe to receive carrier pigeons at my [substack](https://whynowtech.substack.com/).*

Hyena clans are arranged in what’s known as a “linear dominance hierarchy”. This means that there’s a one-to-one chain of command: Hyena 3 reports to Hyena 2, and Hyena 2 reports to, you guessed it, Hyena 1.

This structure is also present in baboons, wolves, and perhaps most notably, chickens.. ever wondered where the phrase “pecking order” came from? (That one’s for free).

Don’t worry, Why Now isn’t expanding it’s purview into primers on the animal kingdom. Although, do expect a foray into some biotech topics soon!

Instead, I’ve been ruminating of late on the logical end state (or as Palmer Luckey [puts it](https://www.youtube.com/watch?v=dMhVrYhQUsk) — the “final platform”) of LLMs. What will this technology look and feel like when it reaches maturity? What does the “iPhone” of Generative AI look like?

Well, for a start, LLM context-limits don’t feel particularly mature to me. Rather, they’re akin to the bandwidth limits that were present in early mobile network generations. Good luck using TikTok, Spotify, Discord, etc., with 2G’s 50 kbps!

So, what’s being done today to loosen this constraint?

Well, for a start, LLM context-limits don’t feel particularly mature to me. Rather, they’re akin to the bandwidth limits that were present in early mobile network generations. Good luck using TikTok, Spotify, Discord, etc., with 2G’s 50 kbps!

So, what’s being done today to loosen this constraint?

Well, it’s fair to say that one solution — vector databases — received its fair share of.. attention (sorry). Given how models du jour [price](https://openai.com/pricing#:~:text=Model,0.12%C2%A0/%201K%20tokens) (ie per [X]K tokens), perhaps vector dbs will remain the most economically viable solution. However, another approach has recently come into play: [Hyena Hierarchy](https://arxiv.org/abs/2302.10866).

Hyena is proposed to be a drop-in replacement (much [like Zig is](https://whynowtech.substack.com/p/zig) for C!) for the Transformer’s key mechanism — the attention operator — which, whilst a seminal innovation, is the source of LLMs’ scaling challenges to date.

Throughout this primer I’ll walk you through:

* - How and why we arrived at the attention mechanism (RNNs, LSTMs, GRUs, etc)
* - How the attention mechanism actually works - step by step
* - Why we need an alternative to attention
* - Said alternative to attention - “Hyena”

If the fastest growing [application](https://chat.openai.com/) of all time was unlocked via “attention”, then it’s incumbent on us (as investors at least) to study where the puck is heading next.

Let’s see if attention, in fact, _isn’t_ all you need?

