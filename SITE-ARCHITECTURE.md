---
layout: layout.liquid
title: Site Architecture & Workflow Diagrams
description: Visual diagrams showing how the site works, from local development to deployment
permalink: /site-architecture/
---

# Site Architecture & Workflow Diagrams

This document uses Mermaid.js diagrams to visualize how the site works, from local development to deployment.

> **Note:** These diagrams render automatically in GitHub, VS Code (with Mermaid extension), and many Markdown viewers. For other tools, use [Mermaid Live Editor](https://mermaid.live/).

---

## 1. Overall Deployment Flow

This diagram shows the complete flow from local development to production deployment.

```mermaid
flowchart LR
  subgraph LocalDev["Local Development"]
    Dev[Developer] -->|Edit files| Files[Source Files]
    Files -->|npm start| DevServer["Eleventy Dev Server"]
    DevServer -->|localhost:8080| Preview["Browser Preview"]
    Preview -- "Live Reload" --> DevServer
  end

  subgraph VersionControl["Version Control"]
    Files -. "git commit" .-> Git["Git"]
    Git -- "git push" --> GH[GitHub Repository]
  end

  subgraph Deploy["Deployment"]
    GH -- Webhook --> Netlify[Netlify]
    Netlify --> Install["npm install<br><b>Install Dependencies</b>"]
    Install --> Build["npm run build<br><b>Eleventy Build</b>"]
    Build --> Static["Generate<br><b>Static HTML/CSS/JS</b>"]
    Static --> CDN["Deploy<br><b>Netlify CDN</b>"]
    CDN -- "Live Site" --> Users[Users]
  end

  style Dev fill:#e1f5ff
  style GH fill:#24292e,color:#fff
  style Netlify fill:#00ad9f,color:#fff
  style CDN fill:#00ad9f,color:#fff
  style Users fill:#4caf50,color:#fff
```

---

## 2. Eleventy Build Process

This diagram details how Eleventy transforms source files into a static site.

```mermaid
flowchart TD
    subgraph "Source Files"
        A[Markdown Files<br/>blog/*.md]
        B[Liquid Templates<br/>_includes/*.liquid]
        C[Data Files<br/>_data/*.json]
        D[Assets<br/>css/, js/, img/, fonts/]
        E[Config Files<br/>.eleventy.js<br/>src/taxonomy.js]
    end
    
    subgraph "Eleventy Processing"
        F[Read Source Files]
        G[Process Front Matter]
        H[Generate Collections]
        I[Apply Templates]
        J[Process Markdown]
        K[Apply Filters]
        L[Generate Taxonomies]
        M[Optimize Images]
        N[Minify HTML]
    end
    
    subgraph "Output"
        O[Static HTML Files]
        P[CSS Files]
        Q[JavaScript Files]
        R[Images]
        S[Fonts]
        T[_site/ Directory]
    end
    
    A --> F
    B --> F
    C --> F
    E --> F
    
    F --> G
    G --> H
    H --> L
    L --> I
    I --> J
    J --> K
    K --> M
    M --> N
    
    D -->|Passthrough| T
    
    N --> O
    O --> T
    P --> T
    Q --> T
    R --> T
    S --> T
    
    style F fill:#ff6b6b,color:#fff
    style T fill:#4caf50,color:#fff
```

---

## 3. Site Structure & Collections

This diagram shows how content is organized and how collections are generated.

```mermaid
flowchart TB
    subgraph "Content Sources"
        A[Blog Posts<br/>blog/*/index.md]
        B[Pages<br/>*.html, *.md]
        C[Data Files<br/>_data/*.json]
    end
    
    subgraph "Eleventy Collections"
        D[collections.all<br/>All content]
        E[collections.post<br/>Tagged 'post']
        F[collections.artists<br/>From concerts.artist]
        G[collections.venues<br/>From concerts.venue]
        H[collections.peaks<br/>From trips.peaks]
        I[collections.states<br/>From location.state]
        J[collections.towns<br/>From location.town]
    end
    
    subgraph "Generated Pages"
        K[Blog Posts<br/>/blog/*/]
        L[Tag Pages<br/>/blog/tag/*/]
        M[Artist Pages<br/>/artist/*/]
        N[Venue Pages<br/>/venue/*/]
        O[Peak Pages<br/>/peak/*/]
        P[State Pages<br/>/state/*/]
        Q[Town Pages<br/>/town/*/]
    end
    
    A --> D
    B --> D
    C --> D
    
    D --> E
    D --> F
    D --> G
    D --> H
    D --> I
    D --> J
    
    E --> K
    E --> L
    F --> M
    G --> N
    H --> O
    I --> P
    J --> Q
    
    style D fill:#ff6b6b,color:#fff
    style K fill:#4caf50,color:#fff
    style L fill:#4caf50,color:#fff
    style M fill:#4caf50,color:#fff
    style N fill:#4caf50,color:#fff
    style O fill:#4caf50,color:#fff
    style P fill:#4caf50,color:#fff
    style Q fill:#4caf50,color:#fff
```

---

## 4. Development Workflow

This diagram shows the typical development cycle.

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Local as Local Machine
    participant Eleventy as Eleventy Dev Server
    participant Browser as Browser
    participant Git as Git
    participant GitHub as GitHub
    participant Netlify as Netlify
    participant Users as Users
    
    Dev->>Local: Edit source files
    Dev->>Local: npm start
    Local->>Eleventy: Start dev server
    Eleventy->>Browser: Serve on localhost:8080
    Browser->>Eleventy: Request page
    Eleventy->>Browser: Return HTML (live reload)
    
    loop Development
        Dev->>Local: Make changes
        Eleventy->>Browser: Auto-reload
    end
    
    Dev->>Git: git add, commit
    Dev->>GitHub: git push
    GitHub->>Netlify: Webhook trigger
    Netlify->>Netlify: npm install
    Netlify->>Netlify: npm run build
    Netlify->>Netlify: Deploy to CDN
    Netlify->>Users: Live site updated
```

---

## 5. File Processing Pipeline

This diagram shows how different file types are processed.

```mermaid
flowchart LR
    subgraph "Input"
        A[.md files]
        B[.liquid files]
        C[.html files]
        D[.json files]
        E[.css, .js, .jpg, etc.]
    end
    
    subgraph "Processing"
        F[Markdown Parser]
        G[Liquid Engine]
        H[Data Loader]
        I[Image Optimizer]
        J[HTML Minifier]
    end
    
    subgraph "Output"
        K[HTML]
        L[CSS]
        M[JS]
        N[Images]
    end
    
    A --> F
    B --> G
    C --> G
    D --> H
    E -->|Passthrough| L
    E -->|Passthrough| M
    E --> I
    
    F --> G
    H --> G
    G --> J
    I --> N
    
    J --> K
    
    style F fill:#ff6b6b,color:#fff
    style G fill:#ff6b6b,color:#fff
    style I fill:#ff6b6b,color:#fff
    style K fill:#4caf50,color:#fff
```

---

## 6. Taxonomy Generation Flow

This diagram shows how taxonomies (artists, venues, peaks, etc.) are generated from content.

```mermaid
flowchart TD
    A[Blog Posts with Front Matter] --> B[Eleventy Reads All Content]
    
    B --> C{Extract Taxonomy Data}
    
    C -->|concerts.artist| D[collections.artists]
    C -->|concerts.venue| E[collections.venues]
    C -->|trips.peaks| F[collections.peaks]
    C -->|location.state| G[collections.states]
    C -->|location.town| H[collections.towns]
    C -->|tags| I[collections.{tag}]
    
    D --> J[src/artist.liquid]
    E --> K[src/venue.liquid]
    F --> L[src/peak.liquid]
    G --> M[src/state.liquid]
    H --> N[src/town.liquid]
    I --> O[blog/tags.html]
    
    J --> P[/artist/*/ pages]
    K --> Q[/venue/*/ pages]
    L --> R[/peak/*/ pages]
    M --> S[/state/*/ pages]
    N --> T[/town/*/ pages]
    O --> U[/blog/tag/*/ pages]
    
    style C fill:#ff6b6b,color:#fff
    style P fill:#4caf50,color:#fff
    style Q fill:#4caf50,color:#fff
    style R fill:#4caf50,color:#fff
    style S fill:#4caf50,color:#fff
    style T fill:#4caf50,color:#fff
    style U fill:#4caf50,color:#fff
```

---

## 7. Environment Comparison

This diagram compares the three environments: localhost, GitHub, and Netlify.

```mermaid
flowchart TB
    subgraph "Localhost (Development)"
        A1[npm start]
        A2[Eleventy --serve]
        A3[Watch Mode]
        A4[Live Reload]
        A5[localhost:8080]
        A1 --> A2
        A2 --> A3
        A3 --> A4
        A4 --> A5
    end
    
    subgraph "GitHub (Repository)"
        B1[Source Code]
        B2[Version Control]
        B3[Git History]
        B4[Branch Management]
        B1 --> B2
        B2 --> B3
        B2 --> B4
    end
    
    subgraph "Netlify (Production)"
        C1[Auto Deploy on Push]
        C2[npm install]
        C3[npm run build]
        C4[Generate _site/]
        C5[Deploy to CDN]
        C6[Live Site]
        C1 --> C2
        C2 --> C3
        C3 --> C4
        C4 --> C5
        C5 --> C6
    end
    
    B1 -.->|git push| C1
    
    style A5 fill:#2196f3,color:#fff
    style B1 fill:#24292e,color:#fff
    style C6 fill:#00ad9f,color:#fff
```

---

## Key Concepts

### Build Command
- **Local:** `npm start` → `npx eleventy --serve` (development server with watch mode)
- **Production:** `npm run build` → `NODE_ENV=production eleventy` (static site generation)

### Output Directory
- All generated files go to `_site/` directory
- This directory is what gets deployed to Netlify

### Collections
- Collections are dynamically generated from content
- Taxonomies (artists, venues, peaks, etc.) are created by scanning all content
- Each collection generates multiple pages via pagination templates

### Deployment
- GitHub stores the source code
- Netlify watches for pushes and automatically rebuilds
- Netlify serves the static `_site/` directory via CDN

---

## Viewing These Diagrams

- **GitHub:** Renders automatically in Markdown files
- **VS Code:** Install the "Markdown Preview Mermaid Support" extension
- **Online:** Copy diagram code to [Mermaid Live Editor](https://mermaid.live/)
- **Documentation Sites:** Most modern documentation platforms support Mermaid

---

## Related Documentation

- [Taxonomy Map](TAXONOMY-MAP.md) - Detailed breakdown of all site taxonomies
- [Third-Party Libraries](THIRD-PARTY-LIBRARIES.md) - Complete list of dependencies and external libraries
- [README](README.md) - Project overview

