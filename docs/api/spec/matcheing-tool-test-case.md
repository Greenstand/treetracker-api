# Test Cases for Matching Tool

This article describes the test cases for the matching tool on admin panel and how to do the test and how the workflow works.

# The tool to generate test data for matching tool

We use Github Action to generate test data for matching tool, about getting a basic idea of this, check out the [Test case for earnings](https://github.com/Greenstand/treetracker-earnings-api/blob/main/docs/test/testCases.md#how-to-generate-new-earnings)

To generate new captures, run this [Github Action](xxxx)

To generate a single capture, we need to fill fields:

- `capture_date`

  The date of the creation of this capture.

  The format is `YYYY-MM-DD HH:mm`. For example: `2020-01-01 00:00`

- `capture_time`

  The time of the creation of this capture.

