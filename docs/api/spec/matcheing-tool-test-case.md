# Test Cases for Matching Tool

This article describes the test cases for the matching tool on admin panel and how to do the test and how the workflow works.

# The tool to generate test data for matching tool

We use Github Action to generate test data for matching tool, about getting a basic idea of this, check out the [Test case for earnings](https://github.com/Greenstand/treetracker-earnings-api/blob/main/docs/test/testCases.md#how-to-generate-new-earnings)

To generate new captures, run this [Github Action](xxxx)

To generate a single capture, we need to fill fields:

- `capture_date`

  The date of the creation of this capture.

  The format is `YYYY-MM-DD HH:mm`. For example: `2020-01-01 00:00`

- `organization_id`

  The organization id of the capture.

# Test Cases Story (preset data)

# For development environment

- The major organization:

  - Name: FCC
  - ID: ae7faf5d-46e2-4944-a6f9-5e65986b2e03

- The grower accounts 1

  - Grower account name: Grower One
  - ID: 35a23de8-f1ab-4409-be79-3c6a158d5bde

- The grower accounts 2

  - Grower account name: Grower Two
  - ID: 90eef52b-ad55-4953-ace9-6a324ae6cec2

- Sub organization one

  - Organization: FCCABC
  - ID: 8b353fbe-0ad7-46a6-ad43-27e304a95757

- Sub organization two

  - Organization: FCCDEF
  - ID: ce14d9b7-92c3-450b-9779-2bb731c5aefc

# For test environment
