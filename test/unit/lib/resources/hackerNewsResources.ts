import type { HackerNewsSearchResult } from '@src/lib/hackerNewsProvider';

// 'node.js' 를 검색어로 정상적인 검색 결과를 반환받을때의 데이터
export const NodeJSQueriedResults: HackerNewsSearchResult = {
  hits: [
    {
      created_at: '2016-01-11T19:22:55.000Z',
      title: 'TrendMicro Node.js HTTP server listening on localhost can execute commands',
      url: 'https://code.google.com/p/google-security-research/issues/detail?id=693',
      author: 'tptacek',
      points: 1030,
      story_text: null,
      comment_text: null,
      num_comments: 229,
      story_id: null,
      story_title: null,
      story_url: null,
      parent_id: null,
      created_at_i: 1452540175,
      relevancy_score: 6493,
      _tags: ['story', 'author_tptacek', 'story_10882563'],
      objectID: '10882563',
      _highlightResult: {
        title: {
          value: 'TrendMicro <em>Node.js</em> HTTP server listening on localhost can execute commands',
          matchLevel: 'full',
          fullyHighlighted: false,
          matchedWords: ['node', '.', 'js'],
        },
        url: {
          value: 'https://code.google.com/p/google-security-research/issues/detail?id=693',
          matchLevel: 'none',
          matchedWords: [],
        },
        author: {
          value: 'tptacek',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
    },
    {
      created_at: '2018-06-06T13:53:49.000Z',
      title: 'Things I Regret About Node.js [video]',
      url: 'https://www.youtube.com/watch?v=M3BM9TB-8yA',
      author: 'dazhbog',
      points: 994,
      story_text: null,
      comment_text: null,
      num_comments: 491,
      story_id: null,
      story_title: null,
      story_url: null,
      parent_id: null,
      created_at_i: 1528293229,
      relevancy_score: 8173,
      _tags: ['story', 'author_dazhbog', 'story_17247135'],
      objectID: '17247135',
      _highlightResult: {
        title: {
          value: 'Things I Regret About <em>Node.js</em> [video]',
          matchLevel: 'full',
          fullyHighlighted: false,
          matchedWords: ['node', '.', 'js'],
        },
        url: {
          value: 'https://www.youtube.com/watch?v=M3BM9TB-8yA',
          matchLevel: 'none',
          matchedWords: [],
        },
        author: {
          value: 'dazhbog',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
    },
    {
      created_at: '2015-05-13T22:04:23.000Z',
      title: 'Node.js and io.js are merging under the Node Foundation',
      url: 'https://github.com/iojs/io.js/issues/1664#issuecomment-101828384',
      author: 'onestone',
      points: 794,
      story_text: null,
      comment_text: null,
      num_comments: 81,
      story_id: null,
      story_title: null,
      story_url: null,
      parent_id: null,
      created_at_i: 1431554663,
      relevancy_score: 6022,
      _tags: ['story', 'author_onestone', 'story_9542267'],
      objectID: '9542267',
      _highlightResult: {
        title: {
          value: '<em>Node.js</em> and io.js are merging under the Node Foundation',
          matchLevel: 'full',
          fullyHighlighted: false,
          matchedWords: ['node', '.', 'js'],
        },
        url: {
          value: 'https://github.com/iojs/io.js/issues/1664#issuecomment-101828384',
          matchLevel: 'none',
          matchedWords: [],
        },
        author: {
          value: 'onestone',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
    },
    {
      created_at: '2014-11-19T16:44:31.000Z',
      title: 'Node.js in Flame Graphs',
      url: 'http://techblog.netflix.com/2014/11/nodejs-in-flames.html',
      author: 'stoey',
      points: 778,
      story_text: '',
      comment_text: null,
      num_comments: 240,
      story_id: null,
      story_title: null,
      story_url: null,
      parent_id: null,
      created_at_i: 1416415471,
      relevancy_score: 5686,
      _tags: ['story', 'author_stoey', 'story_8631022'],
      objectID: '8631022',
      _highlightResult: {
        title: {
          value: '<em>Node.js</em> in Flame Graphs',
          matchLevel: 'full',
          fullyHighlighted: false,
          matchedWords: ['node', '.', 'js'],
        },
        url: {
          value: 'http://techblog.netflix.com/2014/11/nodejs-in-flames.html',
          matchLevel: 'none',
          matchedWords: [],
        },
        author: {
          value: 'stoey',
          matchLevel: 'none',
          matchedWords: [],
        },
        story_text: {
          value: '',
          matchLevel: 'none',
          matchedWords: [],
        },
      },
    },
  ],
  nbHits: 10473,
  page: 0,
  nbPages: 250,
  hitsPerPage: 4,
  exhaustiveNbHits: true,
  exhaustiveTypo: true,
  exhaustive: {
    nbHits: true,
    typo: true,
  },
  query: 'node.js',
  params: 'advancedSyntax=true&analytics=true&analyticsTags=backend&hitsPerPage=4&query=node.js&tags=story',
  processingTimeMS: 11,
  processingTimingsMS: {
    afterFetch: {
      total: 1,
    },
    fetch: {
      scanning: 8,
      total: 10,
    },
    request: {
      roundTrip: 13,
    },
    total: 11,
  },
  serverTimeMS: 12,
};