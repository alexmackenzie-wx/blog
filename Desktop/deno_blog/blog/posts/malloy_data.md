---
title: Malloy Primer
publish_date: 2023-11-23
---
_"An elephant on clay feet"_ 

![image](https://github.com/alexmackenzie-wx/blog/assets/44316926/0e8bf670-2c0b-4f8f-911d-8b160494a5be)

I don’t mean to alarm you but, “accidents of history” are among us.

Countless decisions make sense when tethered to a particular moment in time. However, if we were to rethink them today from, dare I say it, first principles, we would conclude that we have been subject to one calcified ruse after another.

Par example, that QWERTY keyboard of yours. It was originally designed to prevent the jamming of mechanical keys in typewriters. I know it’s fundamentally flawed, but good luck coercing me into switching to DVORAK.

What else? We created legal tender to facilitate a double coincidence of wants, with internet-scale liquidity, we have this. We’ve developed modern algorithms to replace [antiquated IPOs](https://abovethecrowd.com/2021/06/03/customers-love-free-stuff-but-thats-not-your-problem/#:~:text=Regardless%20of%20whether,to%20your%20customers.), but all the best convincing your resident Lead Left to change their ways. Don’t [get me started](https://whynowtech.substack.com/p/nix) on Dockerfiles or, better yet, the imperial system.

Whilst perhaps not quite as existential as ~~Dockerfiles~~ legal tender, I view SQL as comparably archaic. ORMs, SQL supersets, semantic layers and query engines all feel like calcification to me. Band-Aids vs. MMR II.

Instead of relying on Trino to rewrite our SQL for us, what if we rewrote the language itself? Thankfully, [Lloyd Tabb](https://twitter.com/lloydtabb?lang=en) (of Looker fame), [Michael Toy](https://www.linkedin.com/in/michael-toy-27b3407/), [Carlin Eng](https://carlineng.com/), and the team at GCP asked themselves a similar question:

_“If we knew all the things we know about data, and about programming with data, and about programming languages in general, and we were designing a query language today, what would it look like?”._

More broadly, this line of questioning is one that we as investors should stuff into our back pockets. Lodge it right next to Charlie’s [boiling frog](https://www.safalniveshak.com/are-you-a-frog-in-boiling-water/#:~:text=In%20this%20speech%2C%20Munger%20cited,given%20way%20back%20in%201995.). In this instance, the result of Lloyd’s question is [Malloy](https://www.malloydata.dev/home) — a language for describing data relationships & transformations. Sounds.. familiar?

Sit tight, there’s more. Malloy:

* - Compiles to SQL optimised for your database.

* - Has both a semantic data model and query language.

* - Excels at reading and writing nested data sets.

* - Seamlessly handles what are complex/error-prone queries in SQL.

Interesting. It’s no secret that the proverbial: “[modern data stack](https://mozartdata.com/what-is-the-modern-data-platform/)” has been in vogue within venture. Rightly so. However, since stumbling upon Malloy, I’ve wondered how much of this stack can be obviated by swapping out SQL itself?

Furthermore, why has SQL endured as the incumbent query language since the 1970s? New programming languages spring up often. What’s unique here? Let’s dig in.

---

As mentioned, Malloy is a language for describing **data relationships** and **transformations** within **SQL databases**. It:

* - Compiles to SQL **optimised for your database**.

* - Has both a **semantic data model** and **query language**.

* - Excels at reading and writing **nested data sets**.

* - Seamlessly handles what are **complex/error-prone** queries in SQL.

As always within Why Now, we’ll build towards an understanding of the definition above via breaking it into its **components**.

---

**Section 1 - History of SQL & RDMS**

As Pablo Picasso (“founding eng” at IBM, I think) once opined: “learn the rules like a pro, so you can break them like an artist”. Similarly, we must first understand [SQL & the “relational model”](https://www.red-gate.com/simple-talk/opinion/opinion-pieces/chris-date-and-the-relational-model/) writ large if we are to challenge it.

Up until 1970, database management systems (DBMSs) such as IBM’s Information Management System (IMS) organised data using “hierarchical” (think tree structures) or “network” models:

```

Organization
|
|-- Department: IT
|   |-- Employee: John Doe
|   |   |-- Task: Develop Software
|   |   |-- Task: Maintain Systems
|   |-- Employee: Jane Smith
|       |-- Task: Network Management
|
|-- Department: HR
    |-- Employee: Mike Johnson
    |   |-- Task: Recruitment
    |-- Employee: Sarah Lee
        |-- Task: Employee Relations 

```
