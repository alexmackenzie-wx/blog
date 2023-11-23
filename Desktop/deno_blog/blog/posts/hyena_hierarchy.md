---
title: Hyena Hierarchy Primer
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

Hyena is defined as: a **sub-quadratic** drop-in replacement for ~~**attention**~~ constructed by interleaving **implicitly parametrised long-convolutions** and **data-controlled gating**.

Ok, so we’ve learned that traditional RNNs, whilst directionally correct, suffer from memory loss, due to the vanishing (or exploding) gradient problem. If these models can’t recall “long-term dependencies” (e.g., early words in a paragraph), then they can’t really be used for making predictions based on sequential data. A shame.

Enter “gating” — spot it above? At a high-level, “gates” help RNNs _control_ what data in a sequence to keep (ie remember), and what data to forget. This gets us one step closer to paying “attention”:

Ok, ok, but how do these fabled gates actually work?

Well, it depends, choose your fighter: Long Short-Term Memory (LSTM) networks or Gated Recurrent Units (GRUs). We’ll go with the more modern of the two, GRUs, introduced by Cho et al. in 2014.

As mentioned, in “vanilla” feed-forward neural networks, a neuron is essentially an “activation function” (e.g., tanh⁡, sigmoid or ReLU) that receives a weighted sum and a bias as an input: σ(w1*a1 + w2*a2, w3*a2….+ bias) and produces an “activation” that feeds into the next layer.

>**Technical Detail: **Sigmoid, tanh, etc., functions are known as “squishification” functions as you can pass them an array of numbers (ie a word, ie a vector), and they will “squish” (ie map) these numbers to values between 0 and 1. This is helpful for probability calculus.
>
>For example, if I pass [2.3, 5.1, 8.9] into the sigmoid activation function: “σ(2.3, 5.1, 8.9)” like so:
>![image](https://github.com/alexmackenzie-wx/blog/assets/44316926/9bbeaab6-16e8-4087-b4b4-e62f1cd12c82)
>It’ll return 2.3 = 0.9, 5.1 = 1, 8.9 = 1. Note, the… squishification!

RNNs introduce the concept of “time”, and hence, their activation functions are a little more complex: _σ(w1*a1 + w2*a2… + w1t-1*a1t-1 + w2t-1*a2t-1… + bias)_.

This notation is, frankly, wrong, but what _“w1t-1*a1t-1 + w2t-1*a2t-1”_ is attempting to get across is that our activation functions in RNNs take into account both an _entirely new input_ (e.g., a new word in a paragraph) as well as the activation produced by previous layers (known as the “hidden state”).

Unfortunately for us, GRU neurons (often referred to as “units” or “cells”) make the complexity of an RNN activation look rather… simple:

![image](https://github.com/alexmackenzie-wx/blog/assets/44316926/19c02e35-92cc-4d48-9840-ebde3d547e6b)

Don’t fret. Remember, the above is the equivalent of a neuron (ie a simple activation function) in a feed forward neural network. So, each layer of a GRU will consist of multiple of these units, that all connect to the next layer of the network.

Note the presence of a “Reset Gate” and an “Update Gate” , as well as the specific insertion points of the sigmoid and tanh “squishification” functions. Let’s dig in via an analogy to root this complexity back to “real life”.

Think about the process of learning something new. You often have some base understanding of the topic (a hidden state, if you will), and then you’re gradually exposed to new information during your learning process.

Occasionally, your “hidden state” will be updated, as you realise that your prior understanding was perhaps off-kilter. Similarly, you may disregard some new information as it’s irrelevant or contradicts something you’ve learned that you consider to be true. GRU’s _data-controlling gates_ are the machine equivalent.

Ok, back to our GRU:

Our **Reset Gate** is used to determine how much of the past (ie the “hidden state”) to forget. As shown in the diagram above, the current input value and the hidden state pass through the sigmoid function and produce a “reset gate value”. A value close to 0 means “forget the past”, a value close to 1 means “retain the past”.

Our **Update Gate** dictates how much of the remaining past information (ie the reset gate value) to keep vs. the new information to consider (e.g., a new word in a paragraph). The resulting (intermediary) value is known as the “candidate activation”.

The final hidden state (or “activation” of the unit) is then calculated by combining the past hidden state with the new candidate activation. Et voilà! Our unit is complete.

At this point I’ll (backward)pass (sorry!) this primer to you. What does all of this mean? Why do you think that “gating” helps deal with the vanishing gradient problem? Again, give it a go, it’ll help cement much of what you’ve read so far.

The truth is, gating helps in many ways. However, think about it, if gating reduces what our neural network needs to remember, then there are less available neurons (and hence, gradients) to perpetuate the vanishing gradient problem!

---

Hyena is defined as: a **sub-quadratic** drop-in replacement for ~~**attention**~~ constructed by interleaving **implicitly parametrised long-convolutions** and ~~**data-controlled gating**~~.

Alright folks, it’s time for Transformers. If GRUs are capable of preserving long-term dependencies, why didn’t they unlock this current wave of AI mania? Well, there are a few reasons.

Firstly, GRUs (just like traditional RNNs) process data sequentially (duh, they’re used to process sequential data). The issue with this is that it makes “parallelisation” across time-steps difficult, leading to longer training times. What if we could process an entire body of text at once vs. doing so word-by-word?

Following closely in second, whilst GRUs are notably more performant than RNNs at recalling long-term dependencies, the Transformer’s “attention mechanism” represents relationships between inputs in a more complex and rich manner.

So, we know what “attention” means at a theoretical level, but how is this implemented technically and what is a “Transformer”, really?

Much like the [European Union](https://www.europarl.europa.eu/ftu/pdf/en/FTU_1.1.3.pdf) (news to me), the Transformer consists of three core pillars: positional encodings, self-attention, and an overarching encoder-decoder structure. (We’ll tackle the first two)

Let’s start with positional encodings as they’re reasonably easy to get our heads around. Remember this dream?: _“what if we could process an entire body of text vs. doing so word-by-word?”_, well, it turns out we can do exactly this.

Instead of feeding a sentence (ie sequential data) word-by-word into a neural network to preserve its order, we can encode this positional information into the vector representation of each word.

![image](https://github.com/alexmackenzie-wx/blog/assets/44316926/80e96941-8825-4ebf-8a98-e508be1aae55)

Due to their theoretical simplicity, positional encodings may seem trivial, but they’re a game changer. To contrast, within RNNs, each word is essentially given its own layer. This means that if we want to train on, say, adult fiction novels (70k - 120k avg. word count), our network would need, you guessed it, ~70-120k+ layers (!). Transformers dramatically reduce this “network depth”.

I personally don’t think positional encodings get enough publicity. Perhaps “Positional Encodings are All You Need” is missing the requisite alliteration? Anyhoo, how does the attention-grabbing, “attention mechanism”, work?

Let’s go back to my, incredibly subtle, call to action.. I mean.. example: [ hello, — please — subscribe — to — my — ]

As a reminder, the idea behind attention is that certain words in a sentence have a greater “influence” on (or, relation to) a given word than others.

In our example, we said that “subscribe” (theoretically) would have a greater influence on “my” than “hello,” or “please” would.

Ok, so how is this “influence” actually calculated? Attention begins by deriving three vectors (ie points in space) for _each word_ in a sentence. So, our sentence above would result in 15 vectors (hello x 3, please x 3,… etc) calculated for each “attention head” (ignore for now) within the Transformer.

Let’s stay as consistent as ever and use the word “subscribe” to walkthrough this vector math:

**Query Vector:** This is a representation of what you’re looking for (e.g., something relevant to “subscribe”). It’s calculated by multiplying the original embedding of the word (subscribe=[.25, .17, .3]) by the query vector’s weight.

>**Key Point:** Remember, this “weight” is often “initialised” with ~random values and learned over time through training. Just like any other neural network!

**Key Vector:** This is essentially an “index” or “tag” that makes a given word easier to categorise. It’s calculated by multiplying the original embedding of the word (subscribe=[.25, .17, .3]) by the given key vector’s weight.

**Value Vector:** This is the actual “content” that you end up retrieving (ie a vector representation of “subscribe”). It’s calculated by multiplying the original embedding of the word, you guessed it, (subscribe=[.25, .17, .3]) by the given value vector’s weight.

Don’t worry readers (or,.. Alex), this math class is over shortly. Next, we take the query vector of one word (e.g., “subscribe”) and the key vectors of every word in the given sentence, including “subscribe” itself.

Through doing so, we calculate “attention scores” — ie how relevant a list of words are to our query word (“subscribe”). Note in the example below that we’re doing matrix multiplication here to calculate these scores. The words on the left are the query vectors, and the words on the top are key vectors.

![image](https://github.com/alexmackenzie-wx/blog/assets/44316926/df478dda-c217-4d32-8ad1-2ea7273d9e98)

If we then repeat this process for every word in our sentence, well, our model has stored some form of “memory” or “state” associated with these words, without any need for the recurrence present in RNNs and GRUs. Without recurrence, the vanishing gradient problem literally dissipates!

We then run these scores through a “softmax” function (similar to our friend, the lowly sigmoid) to get these scores into a “normalised probability distribution”, also known as: between 0-1.

& finally, dear readers, we multiply each value from the softmax output with its corresponding value vector and sum them all up. This sum is the context-enriched output for a given set of words.

So, what’s hopefully clear is that Transformers’ adulation is arguably just. Not only are they considerably more efficient to train (thanks positional encodings), but they also store long-term dependencies much more effectively than the next best thing!

Sound too good to be true?…

---

Hyena is defined as: a **sub-quadratic** drop-in replacement for ~~**attention**~~ constructed by interleaving **implicitly parametrised long-convolutions** and ~~**data-controlled gating**~~.

For those of you left, nice work! I’m aware that calling this post a “lengther” (Irish colloquialism) would be an understatement. However, there’s plenty of historical context and other antecedents whose exposure/recall are typically assumed within these ML papers. A pity really!

Alas, I am here to spoil the party slightly. Whilst the attention mechanism is clearly a positive step-change, like many technical decisions, it isn’t immune to trade-offs.

Attention is fundamentally a quadratic operation. Think about it (& revisit our matrix above), to calculate attention scores, you need to compare n number of words by n number of words (ie n x n).

Quadratic operations become inefficient as the size of the input (ie the context we provide a given LLM) grows, because the number of operations grow meaningfully:

![image](https://github.com/alexmackenzie-wx/blog/assets/44316926/02fb5107-cc74-4ae9-a523-534beb47fec7)

This is (primarily) why ChatGPT et al., have context limits!

What if there was a way to resolve the quadratic nature of attention? (you may now strikethrough ~~“sub-quadratic”~~). Can we remove this n x n dynamic whilst maintaining performance?

The answer has been a partial “yes” for some time (thank you [H3](https://arxiv.org/abs/2212.14052), etc). However, Hyena, thanks to some lessons gleaned from signal processing, has made this confirmation rather resounding.

Quick level-setter: signal processing is a field of study that deals with the analysis, manipulation and, ultimately, interpretation, of “signals” (ie time or spatial-varying data like audio). Hmm. This sure sounds akin to sequential data?

Within signal processing, “[convolutions](https://www.youtube.com/watch?v=KuXjwB4LzSA)” (a mathematical operation) are used to calculate how one signal (e.g. your voice) is modified by another signal or system (e.g. a room). Through leveraging convolutions, we can precisely enhance or attenuate a specific signal by adjusting its “filters” accordingly.

_Hmm x 2_. “Enhance or attenuate” — this also sounds a little similar to what the attention mechanism does in Transformers, or perhaps “gates” in GRUs? Both mechanisms amplify or reduce certain inputs (ie data).

So, perhaps these “filters” can similarly preserve long-range dependencies?

The truth is, they’ve already been doing so (albeit inadequately) for some time. I suspect those of you that aren’t entirely new to deep learning have been graced by “CNNs” or _Convolutional Neural Networks_?

Well, within these networks, it’s these “filters” that are tweaked and learned over time. Much like our weights and bias within a traditional neuron! A filter (aka “kernel” or “mask”) in a CNN is typically a matrix like so:

![image](https://github.com/alexmackenzie-wx/blog/assets/44316926/a31e922d-d72c-489d-b8b5-d261ec21a06f)

Specifically, “convolutional layers” (which contain many filters) are often used at the beginning of computer vision tasks to extract key “features” of an image. A very high-level example of an extractable feature may be something like rounded corners.

So, if my CNN has been sufficiently trained (and hence, had its filters tweaked) to identify rounded corners in an image, when it ingests an image whose data overlaps with the above matrix, our model may infer that this image has a rounded corner. A match! Nice.

![image](https://github.com/alexmackenzie-wx/blog/assets/44316926/e93afca7-eb64-4fd1-97f2-7a8c8426528f)

Much like its scavenging counterpart, the Hyena Operator takes what’s good from the “bone” of the CNN. However, it then goes one step further:

Instead of relying on the “short” filters (e.g., a 3x3 matrix) present in CNNs, Hyena leverages “long” convolutions (ie filters that span the entire length of the input sequence). This means that the entire input is a feature! Meaning that each output element depends on all inputs, thus capturing the “global context” of the input image, sentence, etc.

Hyena is defined as: a ~~**sub-quadratic**~~ drop-in replacement for ~~**attention**~~ constructed by interleaving ~~**implicitly parametrised long-convolutions**~~ and ~~**data-controlled gating**~~.

Ok, cool, definition complete, but how does Hyena’s combination of “long-convolutions” and “data-controlled gating” equate to computational complexity that is _O(n log n)_? Or, “sub-quadratic”.

Well, put simply, there’s no n x n calculation present in Hyena. Long-convolutions enable the learning of long-range dependencies (without a n x n attention matrix), and data-controlled gating, much like we’ve seen in GRUs, filters out unnecessary data (and hence, computation).

~~Post-Transformers - Hyena Hierarchy~~ - c’est fini!

---

_If you’ve made it this far, thank you (& fair play!). If you’ve learned something along the way, I’d love it if you share this post with a friend or two. I’m pretty close to an exciting subscriber milestone so it’d help a tonne!

As always, I’m at alex@tapestry.vc - always down to say hello! If you’re wondering where to go next, check out my posts on Nix, Zig, WebGPU or Building Pokemon Yellow in Godot (personal fave)._
