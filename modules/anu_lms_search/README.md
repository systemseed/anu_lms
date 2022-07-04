## ANU LMS Search

## Introduction

ANU LMS Search contains default configuration for search functionality.

## Requirements

The ANU LMS Search requires these contrib modules:

 * Anu LMS
 * [Search API](https://www.drupal.org/project/search_api) 
 * Database Search (Search API submodule)

## Installation

Install as you would normally install a contributed Drupal module.

If you have Search module from Drupal Core enabled, it is recommended to
uninstall this module due to using Search API module. 

Note: if you have Anu LMS v 2.5 and lower previously installed, or performed
manual installation of requirements for Anu, you have to manually apply this
[patch](https://www.drupal.org/files/issues/2022-01-19/2761273-41.patch) for
Drupal Core.

## Configuration

 * Visit the block configuration page at Administration » Structure » Block
   Layout and add a block `anu_lms_search-search_results_page` to some 
   region for displaying the search form on the needed pages.
