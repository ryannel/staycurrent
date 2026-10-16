---
layout: ../../../../layouts/ObjectArticle.astro
title: Vector storage and retrieval with S3
description: Understand vector records, filtered nearest-neighbour queries and source synchronization before choosing S3 Vectors for an application.
lesson: vectors
---
A vector is a list of numbers. An embedding model can turn text, images or other content into vectors arranged so that related inputs tend to be near one another. A vector search compares a query vector with stored vectors and returns nearby candidates.

Putting a file of numbers in an ordinary S3 bucket does not create that search operation. S3 Vectors supplies a specialised vector bucket and index with APIs for writing and querying vectors. The application still chooses the embedding model, manages source documents and decides whether returned candidates are useful and authorised.

## What an index holds

Imagine four support passages. Each has a stable passage ID, a source revision, an embedding and metadata such as product category. A vector record's key identifies that record within the index. Its numerical data supports similarity search; metadata can help restrict candidates or locate the original text.

The index fixes properties including vector dimension and distance metric at creation. If the model produces 768 numbers, a two-dimensional teaching vector cannot be inserted as though it were another valid record. More subtly, two models can produce the same number of dimensions while assigning entirely different meanings to those coordinates. Matching length alone does not make their vectors comparable.

Changing the embedding model is therefore a migration. Create and populate a compatible index, evaluate it, then switch queries and source references deliberately. Mixing old and new spaces can return plausible-looking but meaningless neighbours. The [index guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-indexes.html) describes the service's index configuration.

## Derive a small result

Our sandbox uses invented two-dimensional coordinates and squared Euclidean distance so you can inspect every calculation. It does not use a real embedding model or reproduce S3's managed search algorithm. The query is `[1,0]`:

| Passage | Vector | Category | Squared distance to query |
| --- | --- | --- | --- |
| A | [1,0] | billing | 0 |
| B | [0.8,0.2] | storage | 0.08 |
| C | [0,1] | storage | 2 |
| D | [-1,0] | billing | 4 |

For B, subtract each coordinate from the query: 0.2 and −0.2. Squaring and adding gives 0.04 + 0.04 = 0.08. Without a filter, the nearest two are A and B. Restrict candidates to category storage before ranking, and the nearest two are B and C.

Fetching the global top two and then discarding non-storage results returns only B. That is a different operation. The [vector lesson](/learn/databases/object-storage/sandbox/?lesson=vectors) makes the candidate set visible before ranking so you can change the filter and predict the result.

Distance does not establish relevance by itself. A nearby passage may mention the right words while failing to answer the question.

At larger scales, an approximate index can speed retrieval by avoiding a comparison with every stored vector, but it may miss some exact nearest neighbours.

For an exact baseline on a manageable real dataset, compute distances to every vector that meets the same filter and keep the nearest K. Compare the service's returned IDs with that set: returning eight of the exact top ten gives recall@10 of 0.8. Evaluate answer usefulness separately with representative questions. High recall can faithfully retrieve the embedding model's nearest neighbours while those passages still fail to answer a user. The small coordinates teach ranking and filtering; they cannot establish real-model recall or answer quality.

## The real query contract

An S3 Vectors query identifies an index, supplies a query vector, requests a number of neighbours and may include a metadata filter. It returns record keys, with optional distances and metadata. The application uses those identities to fetch the original passages or other content. The [QueryVectors API](https://docs.aws.amazon.com/AmazonS3/latest/API/API_S3VectorBuckets_QueryVectors.html) defines the request and response fields.

As checked on 16 October 2026, S3 Vectors distinguishes Enhanced and Classic index modes. Their filtering behaviour differs: Enhanced applies the filter before similarity search, while Classic evaluates filtering during candidate search and can return fewer results for selective filters. Read the index mode with `GetIndex`. A Classic index can also request Enhanced behaviour for an individual query through `queryMode`; record both settings when evaluating results. The [metadata filtering guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-metadata-filtering.html) and [index-mode guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-index-mode.html) describe the current behaviour and migration path.

Even a pre-filtered approximate search is not the same implementation as our exact four-row calculation. Measure the result quality and workload latency under the chosen mode, dataset and filters. A published latency claim is not an end-to-end application guarantee that includes embedding generation and source retrieval.

## Metadata and permission are separate

Metadata can include fields the index allows filtering on and fields retained only for retrieval. Querying a non-filterable field as though it were filterable fails; choose this schema from the actual retrieval needs. Avoid loading sensitive source text into metadata merely because it is convenient to return with every match.

Authorization also depends on the request. An unfiltered query returning keys and distances can use `s3vectors:QueryVectors`; filtering or requesting metadata additionally requires `s3vectors:GetVectors`. A caller's simple query succeeding therefore does not prove its richer query has sufficient permission. The [access-management guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-access-management.html) explains these distinctions.

A tenant filter supplied by application code is not automatically an independently enforced security boundary. The backend must derive the permitted tenant and prevent the client from dropping or changing the restriction, or use a resource design that enforces the required separation. Recheck source access before returning protected content. A vector match does not grant permission to read its source object.

## Keep source and index in agreement

S3 Vectors documents strongly consistent writes within its service. That does not create a transaction across a source object, an application database and a vector index. Uploading a new document can succeed while embedding or indexing fails. Deleting the source can leave an old vector until the cleanup job completes. See the [service overview](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors.html).

Give indexing work a stable identity that includes the source revision and model version. Track pending and completed work, and make retries reconcile that identity.

Suppose passage P changes from revision 7 to 8 while the revision-7 embedding job is still running. If both jobs overwrite vector key P, the slow job can replace the newer embedding after it finishes. One application design uses distinct keys such as `P/r7/model-A` and `P/r8/model-A`. The completion handler uses a conditional database update to advance the application's published revision only if that job still belongs to the revision being prepared. The late revision-7 job can leave redundant data to clean up, but cannot overwrite revision 8's vector or move the application back to it.

This design also changes retrieval: a query can find an older revision until it is removed. Check each result against the application's published revision and current access rules, and fetch its matching source revision. Discarding obsolete matches can leave fewer than K usable passages, so measure this loss and reconcile old records. When retiring a source, make the application stop serving it, then durably remove or retire its index records. The [object lifecycle](/learn/databases/object-storage/database-records/) and [event workflow](/learn/databases/object-storage/events/) explain those patterns.

Monitor the age of unfinished indexing jobs and the share of matches discarded as obsolete or unavailable. Both can expose synchronization problems while every vector-query request still succeeds.

## Choosing a retrieval service

S3 Vectors is useful when managed vector storage and its retrieval contract fit the workload. If an existing PostgreSQL database can meet the required scale and latency, keeping embeddings beside transactional metadata may simplify updates and permissions. If the product needs sophisticated text ranking, facets or hybrid retrieval, a search system may provide more of the required query behaviour.

Compare the same representative queries, filters, update rate and source-authorization path. Include the cost of maintaining another copy of the data, not just vector storage. The [PostgreSQL vector assessment](/assessments/postgres-vectors/) offers a deeper discussion of evaluating that alternative. Include source freshness and access checks in the comparison: they contribute to the work the user experiences after the vector query returns.
