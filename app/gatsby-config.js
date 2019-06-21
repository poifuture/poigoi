/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-styled-components`,
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-source-filesystem`,
      options: { name: `articles`, path: `${__dirname}/src/articles/` },
    },
  ],
}
