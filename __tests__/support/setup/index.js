import gql from '../gql';
import fetch from '../fetch';
import storeFile from '../store-file';
import parseToGqlFragment from '../parse-to-gql-fragment';

global.gql = gql;
global.fetch = fetch;
global.storeFile = storeFile;
global.parseToGqlFragment = parseToGqlFragment;
