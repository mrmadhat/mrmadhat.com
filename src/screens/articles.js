import React from 'react'
import Search from 'components/search'
import {useStaticQuery, graphql} from 'gatsby'

function ArticlesScreen() {
  const result = useStaticQuery(
    graphql`
      query {
        articles: allMdx(
          sort: {fields: frontmatter___date, order: DESC}
          filter: {
            frontmatter: {published: {ne: false}}
            fileAbsolutePath: {regex: "//content/articles//"}
          }
        ) {
          edges {
            node {
              fields {
                id
                slug
                productionUrl
                title
                categories
                keywords
                description: plainTextDescription
                banner {
                  ...bannerImage260
                }
              }
              excerpt(pruneLength: 190)
            }
          }
        }
      }
    `,
  )
  return <Search articles={result.articles} />
}

export default ArticlesScreen
