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

---

Hyena is defined as: a **sub-quadratic** drop-in replacement for **attention** constructed by interleaving **implicitly parametrised long-convolutions** and **data-controlled gating**.

Oh boy…

Don’t worry, as always in Why Now, we’ll build towards an understanding of the (rather abstruse) definition above via breaking it into its components.

---

Before we dig in here, it’s worth remembering that machine learning may be full of complex math, but all of this math is ultimately _attempting_ to recreate how we as humans, rather effortlessly, make predictions:

![image](https://github.com/alexmackenzie-wx/blog/assets/44316926/334ecb61-1a30-42bd-afb3-4e4a97cf2dff)

So, throughout this primer, I’ll push you to think about how you yourself, very naturally, make specific predictions, before I reveal how a given model does so. If you listen to Deepmind’s [podcast](https://www.deepmind.com/the-podcast), you’ll notice that much of the team’s time is spent ultimately running the same exercise.

---

Conveniently, the “attention mechanism” present in Transformers is a good opportunity to begin this exercise. For example, in the sentence: _“hello, please subscribe to my…”_, if you were to predict the next word in this sentence, I suspect (or hope!) some of you may predict “newsletter”.

Analyse this sentence, what about it would increase your likelihood of making this prediction? Do genuinely give this a go.

Well, you may pay heed (or, _attention_) to the word “subscribe”, and if you do, you would likely ask yourself… what’s possible to subscribe to? [SaaS products, Dollar Shave Club, …newsletters].

In tandem, you might pay attention to the word “my” given its relation to, or influence on, the word “subscribe”. If you have context (ie you’ve been “trained”) on who I am, you may pick the word “newsletter” from your word list. Why? Because you know that I’m the author of Why Now, not the founder of DSC.

Similarly, words like “please”, “hello” or “to” should have less attention placed on them. They don’t exactly contribute here.

I suspect that for most of you this invention doesn’t exactly feel, groundbreaking? Good, in many ways the idea itself isn’t. However, it’s important to understand on a technical level how we got here, so that we can then better predict what comes after Transformers.

We’ll do this first by studying Recurrent Neural Networks (RNNs), and then by delving into the actual architecture of a Transformer.

RNNs are often the architecture of choice for making predictions based on sequential data (e.g., sentences, audio, time-series, etc), because, unlike traditional “feed forward neural networks” (your run-of-the-mill neural net), they’re ~capable of preserving an intermediary state (known as a “hidden state”):

![image](https://github.com/alexmackenzie-wx/blog/assets/44316926/fef81674-b6f4-4fbe-a90d-e3a6739fc2df)

Let’s go back to our _“hello, please subscribe to my..”_ example, to demonstrate (on an admittedly theoretically level), why this state maintenance matters.

If our RNN “remembers” that it’s already processed the word “subscribe”, then when it later processes the word “my”, this new word has a little more context. Ie, the model may (theoretically) ask itself: _what does Alex own that people could subscribe to?_

Without this context (or memory), our model would more generally just try to predict the most likely word to follow “my”; errors can occur here as there may be words closer to “my” in vector space than “newsletter”.

---

Cool, it sounds like due to RNNs’ “memory” we can make accurate predictions. Why do we need Transformers at all then? Well, it turns out that RNNs are a tad forgetful — they suffer from “memory loss”.

>**Key Point:** “Memory loss” is what it says on the tin. An input (think a given word in a sentence) your neural network has received, is forgotten over time. This is as a result of both the “vanishing gradient” and “exploding gradient” problems (we’ll spend time on the vanishing gradient).

If you’re familiar with how neural networks learn (or Vercel’s [style guide](https://vercel.com/design)..), then the word “gradient” likely isn’t new to you.

A loss function, gradient descent, and backpropagation underpin how model parameters (weights and biases) are updated:

![image](https://github.com/alexmackenzie-wx/blog/assets/44316926/cf16b3ca-4071-4412-9c42-5c6fd0810c16)

Quick level-setter:

1. Our loss function determines how (in)accurate our model is — the model’s “loss”.
2. Backpropagation determines the gradient of the loss function with respect to a given weight/bias (ie how “responsible” each weight/bias is for the overall loss).
3. Gradient descent is the formula above, it calculates the weights/biases to minimise this loss based on a configured leaning rate. Et voilà! We have learning.

>**Technical Detail:** As some of you may recall from differential calculus, if we want to solve the following equation: _y = f(u) and u = f(x)_, which can also be rewritten as _y = f(u(x))_, we can leverage the “chain rule”. It’s this very rule that backpropagation is built upon.
>
>In neural networks, backpropagation calculates the gradients (remember, “loss responsibility”), for the outermost layer’s weights/biases, and then, we use these gradients to help determine the gradients of previous layers, and so on so forth.
>
>Remember, in neural networks, each neuron is actually function: σ(w1*a1 + w2*a2, w3*a2….+ bias), whose inputs (specifically the “a” which = “activation”) is derived from another function. Sounds kind of similar to y = _f(u(x))_, right?

Alas, whilst backpropagation (thanks [Yann](https://www.dataversity.net/brief-history-deep-learning/#:~:text=The%201980s%20and,of%20handwritten%20checks.)), was a key innovation for making training scale, it’s not perfect. Enter vanishing gradients!

Remember, neural networks consist of many “hidden layers” (ie the layers between the input & output layers). So, when applying the chain rule to neural networks our equation may essentially look like, brace yourselves…

_y = f(a(b(c(d(e(f(g(h(i)))))))))_.. you get me? _(this isn’t the actual formula, but gets the point across)_

What essentially happens here is that we use the gradients of the previous neuron (the gradient of the weight and gradient of the bias), to help calculate the gradients of the current neuron. We do so _aaaaall_ the way to the very first hidden layer.

The “vanishing” happens if the gradients across layers are consistently small, as if you multiply say, 0.05 x 0.02, you get 0.001, now imagine taking this 0.001 gradient, and doing the same again & again. Eventually the gradient values get infinitesimally small. Some might even say that they “vanish”!

Why is this an issue? Well, per the gradient descent formula, if we calculate our weights/biases via the gradient value, if the gradient value itself is minuscule, the resulting change in the weight/bias will be too. Hence, our network’s learning adopts the pace of a [Gastropoda](https://en.wikipedia.org/wiki/Gastropoda#:~:text=The%20gastropods%20(%2F%CB%88%C9%A1%C3%A6,p%C9%99d%C9%99%2F).) (keeping the animal kingdom theme alive here).

>**Key Point:** To make matters worse, this problem is exacerbated in RNNs by what’s known as backpropagation through time (or “BPTT”). We don’t have to get into the weeds on this. Instead, I’d rather you have a think about why this may be the case? (psst, focus on time). [Here’s](https://youtu.be/nFTQ7kHQWtc?t=2324) the answer courtesy of Lex. Thanks Lex.

~~RNNs, Backpropagation, Vanishing Gradients~~ - nice work!

---

