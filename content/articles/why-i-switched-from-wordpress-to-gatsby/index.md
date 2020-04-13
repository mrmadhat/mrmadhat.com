---
slug: why-i-switched-from-wordpress-to-gatsby
date: '2020-04-13'
title: 'Why I switched from WordPress to Gatsby'
description: "I finally made the decision to move my website away from WordPress in favour
of Gatsby. This article explains the motivation behind my decision and why I feel it's the best move for me."
categories: ['development', 'wordpress', 'updates']
keywords: ['wordpress vs gatsby']
timeWriting: [3.5] 
---

## Performance

Gatsby is a static site generator based on React, meaning it turns your website
built with React into a collection of html documents that displays the same
information to each user. Because of this sites built with gatsby are extremely
fast to load. This is the first reason driving my decision, in most cases
WordPress simply cannot compare to gatsby on speed.

When someone visits a WP site it has to communicate with the database to
retrieve the data for the post or page that has been requested so there is
always some amount processing that has to happen before a server can send a
response to a request.

WordPress sites are split into different files which have to be 'put together'
to produce the final html document that gets returned. The same is also true for
Gatsby, however, gatsby does this 'putting together' ahead of time and is only
done once, when the developer builds the site for deployment. Out of the box
WordPress has to put everything together each and every time someone requests
the site, this processing takes time. Obviously caching can play a big role in
speeding up a wordpress site and can get around some of the limitations however
there's a lot of work involved to
[match the speed of a static site](https://www.wpbeginner.com/opinion/how-we-made-wordpress-faster-than-static-site-generators-case-study-speeding-up-wpbeginner).

## Cost

Cost wasn't a big factor in switching but it was a small factor. WordPress.org
sites need to be hosted and that hosting costs money. The amount for small sites
is minimal but still it's a fee that you have to pay each month. By choosing
Gatsby I could gain the benefits offered by companies such as netlify who offer
free deployment and hosting of static sites.

Another cost benefit is that I don't need to worry about constant updates and
maintenance to the site, yes there's going to be updates but I'm expecting a lot
less than with WordPress.

## Deployment

Leading on from cost is another benefit, the deployment process is easy. I
simply commit my code to the master branch and netlify automatically builds and
deploys my site.

In my experience the deployment process with wordpress is a lot more painful. I
confess, I haven't ever set up automatic deployments for a WordPress site. I
usually make a change to a theme or plugin, commit the change then ssh to the
live server and pull the latest changes 😳. I've attempted to set automated
deployments up in the past but found it to be painful and error prone.

Whilst writing this post I wanted to see if there was an equivalent to netlify
for wordpress. I came across a paid service called
[deployHQ](https://www.deployhq.com/) who state they offer easy wordpress
deployment but I haven't tried this service so I'm not sure how good it is.

## Simplicity

Above all the biggest reason behind the move is simplicity. WordPress just isn't
required for my particular needs. I don't need a fancy editor, I'm happy writing
my posts inside vscode in markdown. Yes, Gutenberg supports markdown but that
isn't the point. The point is that Gutenberg and WordPress add additional
complexity, it's another thing to work with, another thing I need to take care
of.

### More is not always better

Look at the screen you're taken to after updating to WordPress 5.4 the main
heading says...

> "Say hello to more and better"

followed shortly by a paragraph

> "Every major release adds more to the block editor."

Maybe I don't want more, maybe I want less. Maybe, I just want a place where I
can express myself without having to adapt to an ever changing medium. I want my
writing experience to be as close to paper as possible, everything else is just
noise. The current direction of WordPress seems to be to add noise in an attempt
to keep up with the likes of Wix.

## What about client sites?

This is the one sticking point which I hope to overcome soon, I'm happy with
writing in markdown but that doesn't mean my clients should have to or that they
want to.

I know that I can use wordpress in conjunction with Gatsby but this raises other
problems, the big one being how quickly a client can preview/see a post live on
their site after writing or editing a piece of content. I've done a little
research to try and figure this out and I think
[Gatsby preview](https://www.gatsbyjs.com/preview) may be the solution to the
problem. As the name suggests, Gatsby Preview allows you to see content changes
as soon as they are made which is exactly what I'm looking for. I'm really
excited about Gatsby Preview and hopefully, after trying it out I'll be able to
fully move away from WordPress.

## Final thoughts

It's been surprisingly difficult for me to make the move away from WordPress, I
really do owe WordPress and the wider community a lot. They've taught me lots
and helped me grow into the developer I am today and I will be eternally
grateful for that but for me it's sadly time to move on.
