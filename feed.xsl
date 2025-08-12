<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  exclude-result-prefixes="atom">
  <xsl:output method="html" indent="yes"/>

  <xsl:template match="/">
    <html>
      <head>
        <title>
          <xsl:value-of select="atom:feed/atom:title"/>
        </title>
        <style>
          body { font-family: sans-serif; margin: 2em; }
          h1 { margin-top: 0; }
          .entry { margin-bottom: 2em; }
          .entry-title { font-size: 1.2em; font-weight: bold; }
          .entry-summary { margin: 0.5em 0; }
        </style>
      </head>
      <body>
        <h1>
          <xsl:value-of select="atom:feed/atom:title"/>
        </h1>
        <p>
          <xsl:value-of select="atom:feed/atom:subtitle"/>
        </p>
        <xsl:for-each select="atom:feed/atom:entry">
          <div class="entry">
            <div class="entry-title">
              <a href="{atom:link/@href}">
                <xsl:value-of select="atom:title"/>
              </a>
            </div>
            <div class="entry-summary">
              <xsl:value-of select="atom:summary"/>
            </div>
            <div class="entry-date">
              <xsl:value-of select="atom:updated"/>
            </div>
          </div>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
