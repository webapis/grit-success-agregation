import fs from 'fs';

function setUnifiedFieldsByPageURLAndLink({ id }) {
    const keywordsObject = JSON.parse(fs.readFileSync(`${process.cwd()}/data/2.step-data/productnames-${id}.json`));

    return {
        $addFields: {
            h1: {
                $let: {
                    vars: {
                        matchResult: getMatchResult('h1', keywordsObject)
                    },
                    in: {
                        $cond: [
                            { $ne: ['$h1', null] },
                            '$h1',
                            '$$matchResult'
                        ]
                    }
                }
            },
            h3: {
                $let: {
                    vars: {
                        matchResult: getMatchResult('h3', keywordsObject)
                    },
                    in: {
                        $cond: [
                            { $ne: ['$h3', null] },
                            '$h3',
                            '$$matchResult'
                        ]
                    }
                }
            },
            h4: {
                $let: {
                    vars: {
                        matchResult: getMatchResult('h4', keywordsObject)
                    },
                    in: {
                        $cond: [
                            { $ne: ['$h4', null] },
                            '$h4',
                            '$$matchResult'
                        ]
                    }
                }
            }
        }
    };
}

function getMatchResult(fieldType, keywordsObject) {
    return {
        $reduce: {
            input: keywordsObject,
            initialValue: null,
            in: {
                $cond: [
                    { $ne: ['$$value', null] },
                    '$$value',
                    {
                        $reduce: {
                            input: { $objectToArray: '$$this' },
                            initialValue: null,
                            in: {
                                $cond: [
                                    { $ne: ['$$value', null] },
                                    '$$value',
                                    {
                                        $reduce: {
                                            input: { $objectToArray: '$$this.v' },
                                            initialValue: null,
                                            in: {
                                                $cond: [
                                                    { $ne: ['$$value', null] },
                                                    '$$value',
                                                    {
                                                        $cond: [
                                                            {
                                                                $or: [
                                                                    { $regexMatch: { input: '$pageURL', regex: { $concat: ['(?i)', '$$this.k'] } } },
                                                                    { $regexMatch: { input: '$link', regex: { $concat: ['(?i)', '$$this.k'] } } }
                                                                ]
                                                            },
                                                            {
                                                                $switch: {
                                                                    branches: [
                                                                        { case: { $in: [fieldType, ['h1', 'h3']] }, then: '$$this.k' },
                                                                        { case: { $eq: [fieldType, 'h4'] }, then: '$$this.v' }
                                                                    ],
                                                                    default: null
                                                                }
                                                            },
                                                            null
                                                        ]
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        }
    };
}

export default setUnifiedFieldsByPageURLAndLink;