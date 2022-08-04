# ANU LMS Search

## Introduction

ANU LMS Search contains default configuration for search functionality powered by Search API module.

## Requirements

The ANU LMS Search requires the following contrib modules:

 * Anu LMS
 * [Search API](https://www.drupal.org/project/search_api)
 * Database Search (submodule of Search API)

## Installation

Install as you would usually install a Drupal module.

If you have Search module from Drupal Core enabled, it is recommended to
uninstall this module due to using Search API module.

## Configuration

Visit the block configuration page at Administration » Structure » Block
Layout and add a block `anu_lms_search-search_results_page` to some
region for displaying the search form on the pages.
