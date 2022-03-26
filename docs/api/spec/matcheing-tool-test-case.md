# Test Cases for Matching Tool

This article describes the test cases for the matching tool on admin panel and how to do the test and how the workflow works.

# The tool to generate test data for matching tool

We use Github Action to generate test data for matching tool, the action is here: https://github.com/Greenstand/treetracker-api/actions/workflows/test-tool.yml

Basically, the Action accept a command to generate data, for example: `create-capture -d 2022-03-24 -o ce14d9b7-92c3-450b-9779-2bb731c5aefc -l 23.12040111695386 -n 113.23542764520303`, this command generate a capture, which is taken at 2022-03-24, belongs to an org whose id is `ce14d9b7-92c3-450b-9779-2bb731c5aefc`, and the location is `23.12040111695386, 113.23542764520303`.

When the Action is finished, we can check the command's result, in this case, we can find the id of this capture created, check screenshot below:

![screenshot](https://dadior.s3.ap-northeast-1.amazonaws.com/20220324155749.png)

## Test tool manual

### Create capture

```
Usage: seed-cli create-capture [options]

Create new capture

Options:
  -d, --date <string>          the date of the capture created
  -o, --organization <string>  the organization id of the capture
  -l, --lat <string>           the latitude of the capture
  -n, --lon <string>           the longitude of the capture
  -h, --help                   display help for command
```

### Create tree

```
Usage: seed-cli create-tree [options]

Create new tree from a capture

Options:
  -c, --capture <string>  the capture id for the tree
  -h, --help              display help for command
```

# Test Cases Story (preset data)

# For development environment

- The major organization:

  - Name: FCC
  - ID: ae7faf5d-46e2-4944-a6f9-5e65986b2e03

- The grower accounts 1

  - Grower account name: Chum You
  - ID: 815ae5ed-d81f-4108-b95a-069545c7a2ae

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

TODO

# Test Cases

1. Can match a single capture

   This is about going through the workflow of match and add a single capture to an existing tree.

   1. Create a new capture

      And get the id created for the new capture.

   1. Create a new tree

      Create a new tree with the capture id created in the previous step.

      To make the tree above a candidate of this capture, please set the coordinates of the new capture nearby that tree, for the capture matching tool, the tree should be within 6 meters.

      _Hint:_ We can use google map to do this, find the place by this URL: [https://www.google.com/maps/search/?api=1&query=23.12040111695386,113.23542764520303]
      On the page opened, you can click and choose a place nearby the point, (Right click the point, there are tools like: copy coordinates, measure distance, etc.)

   1. Open matching tool, find the second capture just created

      The previous tree should show up in the list of candidates.
      Accept the tree as the matching tree.

   1. Accept the capture

      By click `Match Tree` button, the tree should be matched with the capture.

1. Tree that is too far away from a capture shouldn't be a candidate.

   1. Repeat case 1.1->1.3, except set the second capture is greater than 6 meters away from the first capture.

      The tree should not be a candidate, can can not be found on the right of the page of matching tool.

1. The filter should work correctly

   1. Can filter by date.

   1. Can filter by organization.

   1. The filter status should be displayed on the panel on the left correctly.

      1. By click the cross icon on the filter status, can clear that filter criteria.

1. The pagination on the capture list works correctly

   1. The count is correct, considering cases of filter by fields.

   1. Can go to pages correctly.

1. The matching tool page is displaying information correctly

   1. Capture panel: the unmatched Capture count is correct.

   1. Capture panel: the capture id is correct.

   1. Capture panel: the date is correct.

   1. Capture panel: the country name is correct.

   1. Capture panel: the grower photo is correct.

   1. Capture panel: the grower name is correct.

   1. Capture panel: by clicking the grower photo, can open the grower profile page.

   1. By clicking `skip` button, the capture should be skipped.

   1. Capture panel: the photo of the capture is correct.

   1. Matching panel: the candidate match count is correct.

   1. Matching panel: the tree id is correct.

   1. Matching panel: the tree capture list is correct, including: every capture's photo, date, distance (can click the location icon to open google map).

   1. By clicking the capture photo, can open the capture profile panel.
