/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  /* Your site config here */
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-layout`,
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-source-filesystem`,
      options: { name: `articles`, path: `${__dirname}/src/articles/` },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-material-ui`,
    // Offline support
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `PoiGoi`,
        short_name: `PoiGoi`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#99ccff`,
        // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
        // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
        display: `standalone`,
        icon: `src/images/poifuture-logo-clip.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: "gatsby-plugin-webpack-bundle-analyzer",
      options: {
        disable: true,
        // production: true,
      },
    },
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        globPatterns: [
          "**/*.html",
          "*.js",
          "**/*.json",
          "manifest.webmanifest",
        ],
        ignoreUrlParametersMatching: [/./],
      },
    }, // This plugin must be at the end of the plugin list
  ],
}
