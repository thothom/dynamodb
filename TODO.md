# To Do

- [x] At "find" and "findOne" methods, if the user DOESN'T use the primary keys to search, use the ScanCommand, but if he uses it, use QueryCommand
- [x] Add support for find operators
- [ ] Automatically add index if user uses index to query
  - Add an error if more than one compatible index is found
- [ ] Add Index validation on querying by index
  - verify if the user used the columns that the index needs, he can use more columns too
- [ ] Add ordering support for `findOne`
  - https://stackoverflow.com/questions/9297326/is-it-possible-to-order-results-with-query-or-scan-in-dynamodb#answer-36883510
- [ ] Add ordering support for `find`
  - https://stackoverflow.com/questions/9297326/is-it-possible-to-order-results-with-query-or-scan-in-dynamodb#answer-36883510
- [ ] Remove block of "must have at least one property in common"
  - It will add support for find with OR condition
  - Study about queries with OR operator (ConditionalOperator is DEPRECATED, use FilterExpression instead)
- [ ] Fix bug: When ScanCommand, do NOT use KeyConditionExpression, only FilterExpression
- [ ] Improve error handling
  - Custom error when missing index
