import blog, { ga, redirects } from "https://deno.land/x/blog@0.4.0/blog.tsx";

blog({
  title: "Alex Mackenzie",
  description: `
  Hello. I'm Alex, a developer & partner at Tapestry VC where, quite simply, I try to invest in the world's most important companies. Below you'll find breakdowns of technical topics, pontifications & the occasional on-job aggregations.`,
  avatar: "alex.png",
  avatarClass: "rounded-full",
  links: [
    { title: "Email", url: "mailto:alex@tapestry.vc" },
    { title: "GitHub", url: "https://github.com/alexmackenzie-wx" },
    { title: "Twitter", url: "https://twitter.com/alex__mackenzie" },
  ],
  author: "Alex Mackenzie",
  background: "#f9f9f9",

  // middlewares: [

    // If you want to set up Google Analytics, paste your GA key here.
    // ga("UA-XXXXXXXX-X"),

    // If you want to provide some redirections, you can specify them here,
    // pathname specified in a key will redirect to pathname in the value.
    // redirects({
    //  "/hello_world.html": "/hello_world",
    // }),

  // ]
});

