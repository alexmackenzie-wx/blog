import blog, { ga, redirects } from "https://deno.land/x/blog@0.4.0/blog.tsx";

blog({
  title: "Alex Mackenzie",
  description: "Hello! - I'm Alex Mackenzie, a dev & partner @ Tapestry. Below you'll find breakdowns of technical topics, research & pontifications.",
  avatar: "alex.png",
  avatarClass: "rounded-full",
  links: [
    { title: "Email", url: "mailto:alex@tapestry.vc" },
    { title: "GitHub", url: "https://github.com/alexmackenzie-wx" },
    { title: "Twitter", url: "https://twitter.com/alex__mackenzie" },
    { title: "Keybase", url: "https://keybase.io/alexmackenzie"},
  ],
  author: "Alex Mackenzie",
  background: "#f9f9f9",
  favicon: "gengar.ico",

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

