---
title: "DevNexus 2026: Supercharge Your Applications with Java, Graphs, and a Touch of AI"
tags:
  - ai
  - conference
  - devnexus
  - java
  - neo4j
  - quarkus
---

Jennifer Reif and I gave a talk about going beyond the chatbot: building a solo tabletop RPG with an AI narrator, using Quarkus, LangChain4j, and Neo4j.

We built two apps with very different approaches to the same problem — one using upfront RAG ingestion of Spelljammer lore, the other incrementally indexing a player's own journal as they play Ironsworn. Same database, two flavors of retrieval, and a lot of lessons learned about keeping the LLM out of your state machine.

{{< gh_card "ebullient/quarkus-soloplay" >}}

{{< gh_card "ebullient/quarkus-ironsworn" >}}
