# PostService.search() Test Cases

Tests use a mocked repository rather than the real database.

| # | Technique | Input | Expected Outcome |
|---|-----------|-------|------------------|
| 1 | Black-box: valid input | Query "Hello"; pagination omitted | Returns mocked results; uses page 1 and pageSize 10. |
| 2 | Black-box: no results | Query "no-match"; repository returns no posts | Returns an empty posts list and hasMore: false. |
| 3 | Black-box: custom pagination | Query "Hello", page 2, pageSize 5 | Forwards pagination and returns mocked results with hasMore: true. |
| 4 | White-box: error propagation | Query "Hello"; repository rejects with an error | Rejects with the same error. |