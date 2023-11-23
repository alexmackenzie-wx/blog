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

With what we know now (recall, “accidents of history”), it’s clear that this is an incredibly rigid, and rather abstruse data model to grok at scale. Imagine attempting to parse Zomato’s [150M logs p/m](https://blog.zomato.com/building-a-cost-effective-logging-platform-using-clickhouse-for-petabyte-scale#:~:text=At%20Zomato%2C%20our%20internal%20microservices%20and%20monolithic%20applications%20collectively%20produce%20a%20significant%20amount%20of%20logs%20each%20day.%20With%20a%20maximum%20production%20rate%20of%20150%20million%20logs%20per%20minute%2C%20this%20leads%20to%20the%20production%20of%20over%2050%20TB%20of%20uncompressed%20logs%20per%20day.%C2%A0) if represented this way (!).

IBs rejoice, Edgar Codd came along in 1970 with the paper: “[A Relational Model of Data for Large Shared Data Banks](https://www.seas.upenn.edu/~zives/03f/cis550/codd.pdf)”. Edgar proposed that data should be presented to end-users as “relations”, which are the database “tables” (yes, like Excel) that we’re all too familiar with today.

Edgar stated that each row of a table should represent an instance of data (ie a “record”) and each column, an attribute (ie a “property”). To avoid duplicates, each record should contain a unique identifier, known as a “primary key” (e.g., “student_id” below).

```


| student_id | name | age | major           |
|------------|------|-----|-----------------|
| 1          | John | 21  | Computer Science|
| 2          | Jane | 22  | Mathematics     |
| 3          | Mike | 20  | Physics         |


```

Edgar also equipped us with a set of operations that could be used to manipulate these “relations” (remember, tables) in order to retrieve & modify data. Operations such as: selection, projection, union, set difference, Cartesian product, and join. Hmm. Familiar?

What rhymes here, is that Edgar advocated for the separation of database schema & physical storage. Many years later in 2012, Snowflake would pioneer the [separation of storage and compute](https://www.snowflake.com/product/architecture/#:~:text=It%20features%20storage%2C%20compute%2C%20and%20global%20services%20layers%20that%20are%20physically%20separated%20but%20logically%20integrated), and more recently, Firebolt has [separated indices](https://docs.firebolt.io/using-indexes/using-indexes.html) also.

As Josh Wolfe would instruct, [pay attention to directions of progress](https://podcasts.apple.com/us/podcast/josh-wolfe-the-tech-imperative/id1154105909?i=1000436137469). Accordingly, what are we separating next?

Whilst Edgar’s seminal work precipitated the modern relational database industry, he is in fact, not the creator of SQL himself. This kinda all balances out. As, as already alluded to: “[SQL has no real right to be called relational at all](https://www.red-gate.com/simple-talk/opinion/opinion-pieces/chris-date-and-the-relational-model/#:~:text=relational%20at%20all-,I%20honestly%20believe%20SQL%20has%20no%20real%20right%20to%20be%20called%20relational%20at%20all,-There%E2%80%99s%20something%20else)”. It’s implausible that the father of relational algebra would make such a series of blunders.

Rather, [Big Blue’s](https://en.wikipedia.org/wiki/Big_Blue_(disambiguation)) Chamberlin & Boyce developed what was originally dubbed “Structured English Query Language” in 1974. Yes folks, it is See-quill vs. es-que-el. ...Clearly.

IBM’s “System R” was one of the first RDMSs & implementations of SQL (following the University of Michigan’s “Micro DBMS”). However, by 1979, the fledgling [Relational Software Inc](https://en.wikipedia.org/wiki/Oracle_Corporation) released the first commercially available implementation of SQL. Bravo, Larry.

Ok, so what’s so wrong with Chamberlin & Boyce’s [Modern Prometheus](https://en.wikipedia.org/wiki/Frankenstein#:~:text=Frankenstein%3B%20or%2C%20The%20Modern%20Prometheus,by%20English%20author%20Mary%20Shelley.)?

---

**Section 2 - SQL & Its Issues**

Good news folk. Whilst [Nix expressions](https://whynowtech.substack.com/p/nix) or [Zig’s syntax](https://whynowtech.substack.com/p/zig) might’ve required some labour to wield, SQL is, frankly, très facile. This was very much intended by Chamberlin & Boyce who [designed the language](https://s3.us.cloud-object-storage.appdomain.cloud/res-files/2705-sequel-1974.pdf) for “ad-hoc” queries, often made by “non-professional” users.

Note the misplaced design decision? Herein lies a derivative of [Jevon’s Paradox](https://en.wikipedia.org/wiki/Jevons_paradox) at play. Lowering the barrier of entry to “data programming”, increased the number of sophisticated “data programmers” over time. Unsurprisingly, these sophisticated users aren’t too content with SQL — it wasn’t designed for them, after all.

Ok, moving swiftly on from economic theory to programming reality. Welcome, class, to SQL 101.

SQL’s functionality is essentially GROUP’d into 3 components: 1) Data Definition (ie describe my data), 2) Data Manipulation (ie change my data) & 3) Data Querying (ie get my data).

Defining our data could look something like this:

```

CREATE TABLE table_name (
    column1 datatype,
    column2 datatype,
    ...
);

```

Here, we have created a table called “table_name” with two columns: “column1” & “column2”. We can specify the data types (recall “types” from our [Deno primer](https://whynowtech.substack.com/p/deno)) that should be inserted into each column (e.g., dates, integers, strings).

Next, we manipulate our data like so:

```

INSERT INTO table_name (column1, column2,...)
VALUES (value1, value2,...);

```

Here, we’re _manipulating_ the data structure that we originally _defined_ by inserting “values” (ie data) that, all going well, conform to the data types we specified above.

Great. Now we have data stored in our relational database (think PostgreSQL or BigQuery). In order to actually use this data, be it to power our application or, better yet, [strike fear into](https://stackoverflow.com/questions/68898451/sql-get-number-of-items-with-sales-over-certain-quantity) unsuspecting sales reps, we need to query it. A la:

```

SELECT column1, column2, ...
FROM table_name
WHERE condition;

```

All pretty straightforward, right? Things get a little more.. complicated when you realise that, despite adhering to a [standards body](https://blog.ansi.org/sql-standard-iso-iec-9075-2023-ansi-x3-135/), the SQL you write that works for PostgreSQL, may not work for MySQL.

For example, if you want to concatenate strings in PostgreSQL you can use the “concat()” function or use the following “pipe” (ie ||) operator:

```

postgres_example.sql

SELECT 'Hello' || ' ' || 'World';

```

Whereas MySQL doesn’t use the pipe operator by default (it can be enabled):

```

mysql_example.sql

SELECT CONCAT('Hello', ' ', 'World');

```

[Countless examples exist](https://news.ycombinator.com/item?id=28058329#:~:text=should%20learn%20SQL-,There's%20a%20lot%20wrong%20with%20SQL.,for%20future%20growth%20and%20development.) to enumerate my point. Database vendors claim that these differences are due to “optimisations” for their DBMS. Sure, but do you think they’re mad about simultaneously [creating switching costs](https://stackoverflow.com/questions/772111/switching-from-mysql-to-postgresql-tips-tricks-and-gotchas#:~:text=It%20is%20going,continue%20regular%20development.)? That sweet, sweet [158%](https://blog.publiccomps.com/snowflake-s1-ipo-teardown/#:~:text=Pretty%20incredible%20Snowflake%20has%20158%25%20net%20dollar%20retention.%20SNOW%20is%20growing%20121%25%20YoY%20so%20half%20of%20revenue%20growth%20is%20from%20getting%20existing%20customers%20to%20expand%20their%20data%20usage.) NDR.

Fortunately for SQL, its soft-underbelly is often shielded by object-relational mapping (or “ORMs”) tools like [SQLAlchemy](https://www.sqlalchemy.org/) or [Prisma](https://www.prisma.io/). These tools enable developers to write Python, etc., vs. raw SQL (hence, the “mapping”), whilst also acting as database abstraction layers.

See the “calcification” now? Or as Paolo Atzeni puts it: SQL is [an elephant on clay feet](https://dl.acm.org/doi/10.1145/2503792.2503808).

See below a SQL “upsert” (portmanteau of update & insert) I recently wrote using SQLAlchemy. Note I’m using the “Pythonic” function text() vs. writing raw SQL.

```

neon_conn.execute(
                text(
                "INSERT INTO nix_tweets_two (id, tweetid, tweettext, userurl) VALUES (:id, :tweetid, :tweettext, :userurl) ON CONFLICT (tweetid) DO NOTHING"
                ),
                [{"id":nix_tweets_uuid, "tweetid": int(tweet_id), "tweettext": tweet_text, "userurl": user_url}]
                )
        neon_conn.commit()

```

Next, we get onto the subject of “nested queries” (I’m a hit at dinner parties). As any of you who’ve waded through my [Zig primer](https://whynowtech.substack.com/p/zig) will know, I’m a sucker for eloquent programming syntaxes. SQL’s “non-professional” syntax is.. proficiently offensive.

Have a look at how SQL formats nested queries:

```

SELECT name, salary 
FROM employees 
WHERE salary > (SELECT AVG(salary) FROM employees);

```

Perhaps I’m being a little pedantic, but parsing this query certainly isn’t intuitive. For a start, what should I (or the “parser” itself) compute first? Also, whilst I’m on this brazen crusade, shouldn’t we start the query with the FROM clause?

However, things can get much more convoluted:

```

SELECT customer_name, total_order_value
FROM (
    SELECT o.customer_name, 
           SUM(oi.price * oi.quantity) AS total_order_value
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    GROUP BY o.customer_name
) AS customer_orders
WHERE total_order_value > (
    SELECT AVG(total_order_value) 
    FROM (
        SELECT o.order_id, 
               SUM(oi.price * oi.quantity) AS total_order_value
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        GROUP BY o.order_id
    ) AS order_values
);

```

Anyone else feel a sense of malaise? Don’t worry, my head is pounding too. On a positive note, even dedicated SQL parsing algorithms struggle to comprehend walls of SQL like this.

Perhaps it’s increasingly clear why we should DROP this language? (sorry, couldn’t resist)

---

Let’s scratch off some of our newfound understanding from our original definition:

As mentioned, Malloy is a language for describing ~~data relationships~~ and ~~transformations~~ within ~~SQL databases~~. It:

* - Compiles to SQL ~~optimised for your database~~.

* - Has both a semantic data model and ~~query language~~.

* - Excels at reading and writing ~~nested data sets~~.

* - Seamlessly handles what are ~~complex/error-prone~~ queries in SQL.

---

**Section 3 - Introducing the Semantic Layer**

Let’s begin by unpacking the “semantic data model”.

We’ll get into the nitty-gritty, but “semantic” is the key word here. Ever squinted at thousands of table rows & struggled to understand the “meaning” of the data? Don’t fret, this is a safe space, I have too.

Let’s continue our therapy session. Perhaps you’ve also felt the anxiety of wondering if the SQL you’ve written is calculating subjective metrics like: “[a magic number](https://review.firstround.com/From-0-to-1B-Slacks-Founder-Shares-Their-Epic-Launch-Strategy#:~:text=For%20Slack%2C%20the%20number%20is,tried%20it%2C%E2%80%9D%20Butterfield%20says.)” or “MAUs”, correctly? Rather stressful.

Ideally, we’d make our data easy to grok. We can do this by translating abstruse data schemas and walls of SQL into intuitive natural language concepts and instructions. Hence, “semantic model” (or “[semantic layer](https://www.getdbt.com/product/semantic-layer)”). Ok, nice, but how does this all work?

Brace yourselves for another layer of “calcification”.

Many credit BusinessObjects ([acquired for ~$6B by SAP in 2007](https://www.computerworld.com/article/2539248/update--sap-to-buy-business-objects-in--6-8b-deal.html)) for creating the original semantic layer, called “Universe”. However, I think Looker’s “LookML” (created in 2012) demonstrates its ideals best.

LookML is essentially a SQL abstraction. Folk using Looker for BI purposes can write the language vs. writing [sushi-grade](https://www.kobejones.com.au/how-to-choose-sushi-grade-seafood/#:~:text='Sushi%2Dgrade'%20fish%20is,%C2%B0F%20for%2015%20hours.) SQL. Nice lock-in by Looker, huh? As discussed, this is common in database land: Elastic’s Query DSL, Neo4j’s Cypher, CQL, et cetera.

Anyway, LookML exposes many core concepts that bestow semantic meaning upon raw SQL. We’ll focus on LookML’s “measures” (ie data calculations) as but one example. Let’s begin:

```

sales.view.lkml

view: sales {
  measure: total_sales {
    type: sum
    sql: ${TABLE}.sale_price ;;
  }


```

Here we have a LookML file (hence “.lkml”) that stores a “view” (ie a table) called sales that’s derived from another table’s sales_price column.

Within this view, we have a “measure” called total_sales. Note the metadata within the “measure” that makes it quite intuitive to understand what’s happening here (e.g., type: sum).

This metadata also reduces the length & complexity of the raw SQL that would be written otherwise:

```

SELECT SUM(sale_price) AS total_sales
FROM sales;


```

Hmm. Nice… maybe? To close the loop, more recently, dbt [inherited semantic layer capabilities](https://www.getdbt.com/product/semantic-layer) via its [acquisition of Transform](https://www.getdbt.com/blog/dbt-acquisition-transform). Much like Looker, dbt also encourages the extension of SQL via the Python-based templating engine, [Jinja](https://jinja.palletsprojects.com/).

Super. With LookML it.. looks-ml.. like we have solved many of SQL’s shortcomings, right? Well, no. Firstly, as belaboured at this point, we’re not fixing the root cause of our woes: SQL itself.

Secondly, the issue with many of these SQL extensions & abstractions is that they’re tethered to specific vendors. If I’m the de novo database on the block, do I really want to create dependency on a future competitor? Nope. As a result, our efforts don’t yield standardisation around a better way of doing things.

It’s clear that we need a new, open, standard.

---

---

Ok, one final scratching-off exercise below. Seems like we’re now ready to tackle Malloy?

As mentioned, Malloy is a language for describing ~~data relationships~~ and ~~transformations~~ within ~~SQL databases~~. It:

* - Compiles to SQL ~~optimised for your database~~.

* - Has both a ~~semantic data model~~ and ~~query language~~.

* - Excels at reading and writing ~~nested data sets~~.

* - Seamlessly handles what are ~~complex/error-prone~~ queries in SQL.

---

**Section 4 - Malloy**

I’ll be honest, I didn’t think I’d get this excited about a query language. That said, I should know better at this point: [Zig](https://whynowtech.substack.com/p/zig), Godot’s [GDScript](https://whynowtech.substack.com/p/bonus-remaking-pokemon-yellow-in), & [Deno](https://whynowtech.substack.com/p/deno) (well, [Fresh](https://fresh.deno.dev/)) have all played lead roles in Why Now.

The world runs on software, but software runs in the direction that it’s guided towards. Minimise bugs and you’ll create [mission critical applications](https://youtu.be/YXrb-DqsBNU), [enforce type safety](https://medium.com/@ohermans1/the-importance-of-typescript-a-closer-look-at-type-safety-and-error-handling-85a3e4b4280b) and you’ll build a whole lotta enterprise SaaS.

Languages shape software, making them rather fascinating. This impact, served with [comparisons of magic](https://sites.google.com/view/malloydata/home?authuser=0&pli=1), made Malloy rather difficult to resist. To be fair, I think Lloyd may be onto something. Let’s delve a little deeper.

Ok, so, firstly.. Malloy starts with a run clause, which essentially serves the same purpose as (although is more “powerful” than) SQL’s FROM clause. As mentioned already, this just makes logical sense:

```

run: duckdb.table('../data/airports.parquet') -> {
  select:
    id
    code
    city
  limit: 10
}


```

Technical Detail: Don’t worry about the “duckdb” reference ([thanks Hannes](https://hannes.muehleisen.org/)), this is “just” a database that’s embedded locally on your device (laptop, phone, etc).

So, all we’re doing here is accessing an airports table that’s stored as a Parquet file. Parquet files are columnar file formats which we won’t get into now, but you really should [read up on them](https://www.databricks.com/glossary/what-is-parquet) if unfamiliar.

Let’s continue examining the “scaffolding” of Malloy for a tad longer before we delve into the meatier stuff.

As I’ve [alluded to previously](https://whynowtech.substack.com/p/zig), language ambiguity creates bugs and hinders readability. How so? Well, if multiple ways of achieving the same outcome exist, the “reader” of a particular piece of code has to do a little more grease-work to understand it.

For example, in SQL, the SELECT clause can be used for two distinct use cases. When married with the GROUP BY clause, SELECT is used for aggregation purposes (note the “SUM(sales) as total_sales” below). If the GROUP BY clause isn’t present, then SELECT is used for plain ole data retrieval.

Par example, imagine we have a table like so:

```

+---------+-------+
| country | sales |
+---------+-------+
| USA     | 100   |
| USA     | 50    |
| Canada  | 70    |
| UK      | 30    |
+---------+-------+


```

If we query this table with the following SQL (note the SELECT & GROUP BY) like so:


```


SELECT country, SUM(sales) as total_sales
FROM data_table
GROUP BY country;


```

We end up aggregating (in this case, SUM-ming) the USA rows. Why? Because they’re present more than once (hence the 150 total sales):


```


+---------+-------------+
| country | total_sales |
+---------+-------------+
| USA     | 150         |
| Canada  | 70          |
| UK      | 30          |
+---------+-------------+


```

Accordingly, notice that the SELECT statement has a lack of “identity” to some degree here? It serves a couple of purposes. This tends to occur when a programming language is essentially developed in tandem with its own use case.

My-guy-Malloy, on the other hand, has the benefit of hindsight. Thus, Malloy is a little more.. explicit with aggregates:


```


run: duckdb.table('../data/airports.parquet') -> {
  group_by:
    state
    county
  aggregate:
    airport_count is count()
    average_elevation is avg(elevation)
}


```

Comparatively, this statement is easier to build an intuition for, despite many of you likely dabbling with a SELECT clause or two in your time? Kinda cool.

---

No doubt some of you think I’m being pedantic thus far, perhaps that’s fair. We’ll inch towards Malloy’s more poignant features.

Recall from my opening preamble this sub-point: “about programming languages in general”?

There’s a lot we do syntactically in general-purpose programming languages that, for whatever reason, haven’t found their way into SQL. Par example, in Python, Go, JavaScript, Rust, Kotlin, etc., we define variables like so: variable name = value.

In SQL, unfortunately, we invert this when creating column aliases (ie “max elevation” below):

```

waitbutwhy.sql

SELECT 
   max(base."elevation") as "max_elevation"
FROM '../data/airports.parquet' as base
ORDER BY 1 desc NULLS LAST


```

Why create this overhead? Again, think about it. If a software engineer was creating SQL from scratch today, this naming pattern wouldn’t fly. In Malloy, aliases are defined like variables are in programming languages:

```

run: duckdb.table('../data/airports.parquet') -> {
  aggregate: max_elevation is max(elevation)
}


```

Nice, progress. What else can we glean from programming languages?

Well, recall that “nested datasets” (ie datasets derived from other datasets) in SQL can become a bit of a mess:

```

example.sql

SELECT customer_name, total_order_value
FROM (
    SELECT o.customer_name, 
           SUM(oi.price * oi.quantity) AS total_order_value
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    GROUP BY o.customer_name
) AS customer_orders


```

But why are they particularly unwieldy in SQL? Nested calculations aren’t unique to data queries. In programming languages, like Python for example, you’ll often “nest” a function within another function (often called a “callback function”).

To make these nested functions more legible, it’s very much common practice to assign a variable name to the “callback” like so:

```

example.py

def callback_function():
    print("Callback executed!")

def main_function(callback):
    # Do something...
    callback()  # Execute the callback function

main_function(callback_function)  # Outputs: "Callback executed!"


```

Notice how using named expressions makes the “nested function” (ie main_function()), easier to wade through? The same is true for SQL.

Whilst you certainly can [assign names to expressions](https://stackoverflow.com/questions/32522742/how-to-use-an-alias-name-for-a-calculated-expression-in-sql#:~:text=You%20can%20give%20an%20alias%20for%20the%20calculated%20field%20and%20use%20that%20alias%20in%20your%20outer%20query.%20For%20example%3B) in SQL, they’re not required. People are some confluence of busy & lazy; if you don’t encourage a desired action, you may not see it. Malloy, on the other hand, mandates named expressions.

The below code literally won’t run if the output of its “aggregate” calculation isn’t named (ie “max_elevation”):

```

# This code works:

run: duckdb.table('../data/airports.parquet') -> {
  aggregate: max_elevation is max(elevation)
}

# This code doesn't work:

run: duckdb.table('../data/airports.parquet') -> {
  aggregate: max(elevation)
}


```

Perhaps these examples still seem like small wins, but they embody how historical decisions benefit from present context. In tandem, these wins inculcate a broader point: Malloy has rethought SQL to the nth degree. No suboptimal clause or pattern is safe.

---

Whilst I tend to feel the magnetic pull of micro-optimisations (the trade-offs are fascinating); Malloy also introduces new functionality that we should make time to appreciate. Namely, a semantic layer.

Recall, SQL doesn’t have a semantic layer itself. It outsources this work to companies that build ([& often monetise](https://www.getdbt.com/pricing#:~:text=All%20features%20in%20Developer,Layer%2C%20powered%20by%20MetricFlow)) semantic layers. Nothing wrong with this per se, but it can precipitate the dreaded “vendor lock-in”.

Unsurprisingly, Malloy’s semantic layer rhymes with Looker’s. When you want to save common calculations (remember “measures” in LookML), you can do so, along with “dimensions”, “joins”, etc.

Let’s ‘av a look:

```

source: airports is duckdb.table('../data/airports.parquet') extend {
  dimension: county_and_state is concat(county, ', ', state)
  measure: airport_count is count()
  measure: average_elevation is avg(elevation)
}


```

We initialise semantic layers in Malloy with the source keyword. No ambiguity here, if you spot source, you know some sweet, sweet, semantic meaning is going down.

Note that, again, much like in LookML, our semantic layer is derived from some original table (ie duckdb.table('../data/airports.parquet')).

We then “extend” this table with one “dimension” (county_and_state), and two “measures” (airport_count, average_elevation).

Good news is, we’ve already done the work to know what measures are. They are simply instructions for how to calculate subjective metrics (remember, “MAUs” for example).

We can then use these saved “measures” in future Malloy queries like so:

```


run: airports -> { 
  group_by: county_and_state
  aggregate: airport_count
}


```

Dimensions are new to this primer, but common in semantic layers more generally. They’re used to further describe and transform your data. More good news. They’re quite simple to grok once placed under the lens of our example code:

```

source: airports is duckdb.table('../data/airports.parquet') extend {
  dimension: county_and_state is concat(county, ', ', state)
  measure: airport_count is count()
  measure: average_elevation is avg(elevation)
}


```

Here, the “dimension” (think new column) country_and_state, is the concatenation of two separate columns in our airports table (country and state). The resulting column, or “dimension”, of this column will look like so:

```

+---------------------+
|  county_and_state   |
+---------------------+
|  Santa A, CA        |
|  Santa B, CA        |
|  York, NY           |
+---------------------+


```

All quite simple, but some powerful & convenient functionality to have embedded in a query language directly. Nice work, Malloy.

---

No doubt some of you have picked up on the, ? subtle ?, irony present within this primer. A primer lambasting an unwieldy query language has become.. unwieldy.

There is, _so_ much more for us to dig into re. Malloy. The language’s approach towards query pipelines is particularly cool; the fact that you can structure your queries with freedom is too; and you’re all lucky I omitted several other micro-optimisations.

I’d encourage you to [walkthrough Malloy’s quickstart](https://malloydata.github.io/documentation/user_guides/basic.html) at your leisure.

Lloyd, Michael, Carlin & the team are breaking rules in a way that would make Pablo himself proud. Art has a plethora of forms.
