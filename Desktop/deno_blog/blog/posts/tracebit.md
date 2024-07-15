---
title: Announcing our Investment in Tracebit
publish_date: 2024-07-09
---

_A year since our first meeting, we’re delighted to announce [Tapestry VC’s](https://www.tapestry.vc/) investment in [Tracebit’s](https://tracebit.com/) $5M Seed round alongside Accel and industry luminaries like Mandy Andress (CISO, Elastic), Josh Yavor (CISO, Tessian) and Guy Podjarny (Founder, Snyk).

Tracebit has now deployed close to 2,000 canaries across hundreds of production accounts including those of Riot Games, Docker and Synthesia. A few basis points closer to “100%”.

**Read the announcement from Andy at Tracebit [here](https://www.linkedin.com/posts/andy-m-smith_tracebit-announces-5m-fundraise-to-bring-activity-7216358971501068288-0gYs) and take a glimpse into their research [here](https://tracebit.com/blog).**

Congratulations Andy, Sam and the Tracebit team! 
_

---

Why canaries & what are they? There was once a time when security teams could plausibly focus solely on “prevention” (e.g. stop that employee from clicking that phishing email). However:

1. The stack of technology upon which an organisation is built has become far too complex (hello, [durable execution](https://whynowtech.substack.com/p/restate-and-durable-execution)) and ephemeral (looking at you, [lambdas](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html#:~:text=The%20Lambda%20service%20runs%20your%20function%20only%20when%20needed%20and%20scales%20automatically.)) to properly reason about whether it’s consistently “secure”.

2. Whilst detection engineering is important, if a false positive is a “one in a million event” but there are [billions of events](https://blog.zomato.com/building-a-cost-effective-logging-platform-using-clickhouse-for-petabyte-scale#:~:text=With%20a%20maximum%20production%20rate%20of%20150%20million%20logs%20per%20minute%2C%20this%20leads%20to%20the%20production%20of%20over%2050%20TB%20of%20uncompressed%20logs%20per%20day.%C2%A0), then there’ll actually be a decent number of false positives.

3. The number of security breaches published publicly tells a compelling story that even the best-resourced security teams ([Okta](https://techcrunch.com/2023/11/29/okta-admits-hackers-accessed-data-on-all-customers-during-recent-breach/), [Snowflake](https://www.wired.com/story/snowflake-breach-advanced-auto-parts-lendingtree/), [MongoDB](https://www.threatdown.com/blog/mongodb-warns-customers-about-data-breach-after-cyberattack/)) can and will be compromised.

Canaries flip this problem on its head by [“assuming breach”](https://www.darkreading.com/vulnerabilities-threats/after-the-uber-breach-3-questions-all-cisos-should-ask-themselves-#:~:text=As%20the%20CISO%20for%20a%20security%20vendor%2C%20I%20know%20all%20too%20well%20the%20motivation%20and%20determination%20of%20bad%20actors%20and%20nation%20states.%20I%20also%20understand%20the%20odds%20organizations%20face%20in%20falling%20victim%20to%20an%20attack%20%E2%80%94%20organizations%20must%20assume%20they%27ll%20be%20breached.%20What%20will%20you%20do%20when%20that%20happens%3F). Instead of preventing and/or hunting for the one in a million event that “shouldn’t happen” they instead, create a resource that shouldn’t be interacted with.

Because this resource is wholly created and owned by the person looking to do the detection, they can fully reason about what interactions with it are acceptable and significantly reduce the possibility of misleading false positives creeping in. Same same, but different.

---

Why now? When we first studied canaries and other deception technologies two years ago we noticed something that piques our interest at Tapestry — dogma. During this time, we were hastily told that _“canaries are only for the top 1%”_ or, a personal favourite, _“Atlassian [can scale](https://www.youtube.com/watch?v=sK1vYPbXtfc) a deception program, but you can’t”_.

The convenient thing about dogma is that it can break down rather quickly if you just ask “why” a few times. Answers included: alert imprecision, cumbersome maintenance, untenable costs, et cetera. All seemingly fair points.

However, during our explorations, a duo of founders (who previously helped take Tessian from [seed to exit](https://www.tessian.com/blog/proofpoint-announces-intent-to-acquire-tessian/)) noted that these points are somewhat moot when applied to modern cloud environments. They believed that canaries could go from the top 1% to 100%.

The team has since [jotted down](https://tracebit.com/blog/canary-infra-bringing-honeypots-towards-general-adoption) why the modern cloud is a fundamental unlock: 

1. **Alert Precision:** any interactions with these resources produce a very rich audit trail (in AWS it's CloudTrail) that doesn't just provide an IP address but also session, user, role, user agent and more, making it much more actionable.

2. **Maintenance:** AWS is responsible for operating systems and software patches of these resources, most are completely transparent to us (e.g. when Log4Shell happened - Amazon paged their engineering team, not their customers).

3. **Cost:** These resources are usage based, so either very cost effective (cents a month) or free to deploy.

---

Rarely in cybersecurity do you find a category with so much “space” (thank you, dogma). This admittedly made us apprehensive, but fortunately, we had no shortage of material to keep us busy: Andy has been writing about canaries [since 2010](https://andrewmichaelsmith.com/2010/10/honeypot-hosting/), deception jobs were [cropping up](https://gamejobs.co/Staff-Security-Engineer-Information-Security-Deception-Technology-at-Riot-Games) and [“sludge for good”](https://nsarchive.gwu.edu/sites/default/files/documents/rmsj3h-751x3/2022-11-29-arXiv-Sludge-for-Good-Slowing-and-Imposing-Costs-on-Cyber-Attackers-Cornell%20Tech.pdf) was making the rounds in various forums.

Our intrigue grew into conviction as we spent the year getting to know [Andy](https://www.linkedin.com/in/andy-m-smith?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAC3eNrkBQ5WM_8vlVIk5pHx5rZPkO6Y-Gls&lipi=urn%3Ali%3Apage%3Ad_flagship3_search_srp_all%3BzTw1%2BqlhR5%2Bs2qO6fEtOmQ%3D%3D), [Sam](https://www.linkedin.com/in/sam-j-cox?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAABG4zecBc2mz1ZKKaiwDlfyIFRkQ88j7juU&lipi=urn%3Ali%3Apage%3Ad_flagship3_search_srp_all%3Bow%2F73bHqSpC7vo%2BE1TSxqw%3D%3D) and [Tracebit](https://tracebit.com/). Security Engineers raved about their chats with Tracebit; new product pillars (like [canary infra](https://tracebit.com/blog/canary-infra-bringing-honeypots-towards-general-adoption)) were rolled out at a rapid clip; and Sam’s [research](https://tracebit.com/blog/how-to-find-the-aws-account-id-of-any-s3-bucket) hit the top spot on Hacker News.

This was clearly a product for security engineers, built by security engineers. We couldn’t think of a better pairing and team to bring canaries to “the rest of us”.

---

Thank you once again Andy & Sam for having us at Tapestry VC on this journey with you.
