# {short title of solved problem and solution}

- Status: accepted
- Deciders: Daniel, Zaven
- Date: 2022-03-22

Technical Story: https://github.com/Greenstand/treetracker-api/issues/69

## Context and Problem Statement

Currently we only provide organization_id in the grower_account record, but in fact because we allow organization to be specified per tracking session in the app, a grower account can become associated with multiple organizations.

## Considered Options

- {option 1} Using a cross table to cater for the multiple organizations.

## Decision Outcome

Chosen option: "{option 1}", because it is a simple solution that effectively takes care of the problem.
