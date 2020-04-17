---
slug: open-links-in-new-tab-gatsby-mdx
date: '2020-04-17'
title: "What's the best way to open links in new tab with gatsby-plugin-mdx?"
description:
  "If you're using Gatsby in combination with `gatsby-plugin-mdx` and would like
  to know the best way to open links in a new tab here's a few methods."
categories: ['development', 'gatsby']
keywords: ['Gatsby mdx plugin basics']
timeWriting: [2.0]
---

## Globally

In this situation you may decide that all external link should open in a new tab
whilst internal links should not. In this situation you can pass the following
`components` object to the `MDXProvider` like so:

```js
const ExternalLink = props => {
	if (props.href.includes('yourwebsite.com') || props.href[0] === '/') {
		return <a href={props.href}>{props.children}</a>
	}
	return (
		<a href={props.href} target="_blank" rel="noopener noreferrer">
			{props.children}
		</a>
	)
}

const components = {
	a: ExternalLink,
}

const ExampleLayout = ({children}) => (
	<>
		<MDXProvider components={components}>{children}</MDXProvider>
	<>
)
```

Now whenever the markdown link syntax is used the above `ExternalLink` component
will control the output. Internal links open within the same tab and external
links open in a new tab.

## Use a component and import it

You can create an external link component and import it whenever you want to use
it:

```js
// /src/components/ExternalLink.js

import React from 'react'

const ExternalLink = ({children, ...props}) => (
  <a target="_blank" rel="noopener noreferrer" {...props}>
    {children}
  </a>
)

export default ExternalLink
```

Then import the component in your md file like you would in a regular javascript
file, just make sure the your markdown extension (e.g .md) has been properly
configured to work with `gatsby-plugin-mdx`

```md
// /content/some-article/index.mdx

import ExternalLink from '../../src/components/ExternalLink'

<ExternalLink href="https://someexample.com">Example link</ExternalLink>
```

## Add a shortcode

If making every external link across your site open in a new tab is too much and
you don't want to have to import an external link everytime you could opt to add
a 'shortcode'. A shortcode is just a component that is available in every
markdown file without being imported each time it is used. It is added to the
`MDXProvider` in a similar way as the global method mentioned earlier:

```js
import ExternalLink from '../components/ExternalLink'

const components = {
	ExternalLink: ({children, href, ...props}) => (
		<ExternalLink href={href} {...props}>
			{children}
		</ExternalLink>
	),
}

const ExampleLayout = ({children}) => (
	<>
		<MDXProvider components={components}>{children}</MDXProvider>
	<>
)
```

Then in your md file use as you would normally without importing:

```md
// /content/some-article/index.mdx

Here is a link: <ExternalLink href="https://someexample.com">Example
link</ExternalLink>
```

## Use html directly in your markdown file

Finally, if it's just a one off you may consider adding an external link by
simply adding the html directly to the markdown file in question like so:

```html
<a target="_blank" rel="noopener noreferrer" href="https://example.com"
  >Example Link</a
>
```
