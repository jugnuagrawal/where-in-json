function addQuotes(hasQuotes, value) {
    if (hasQuotes) {
        return `'${value}'`;
    }
    return value;
}

/**
 * 
 * @param {[*]} filters 
 */
function computeAnd(filters) {
    const andQuery = [];
    filters.forEach(block => {
        andQuery.push(`${toWhereClause(block)}`);
    });
    return andQuery.join(' AND ');
}

/**
 * 
 * @param {[*]} filters 
 */
function computeOr(filters) {
    const orQuery = [];
    filters.forEach(block => {
        orQuery.push(`${toWhereClause(block)}`);
    });
    return orQuery.join(' OR ');
}

function computeCondition(dataKey, condition) {
    const andQuery = [];
    Object.keys(condition).forEach(key => {
        let hasQuotes = false;
        if (typeof condition[key] === 'string') {
            hasQuotes = true;
        }
        if (key == '$lt') {
            andQuery.push(`${dataKey} < ${addQuotes(hasQuotes, condition[key])}`);
        } else if (key == '$lte') {
            andQuery.push(`${dataKey} <= ${addQuotes(hasQuotes, condition[key])}`);
        } else if (key == '$gt') {
            andQuery.push(`${dataKey} > ${addQuotes(hasQuotes, condition[key])}`);
        } else if (key == '$gte') {
            andQuery.push(`${dataKey} >= ${addQuotes(hasQuotes, condition[key])}`);
        } else if (key == '$ne') {
            andQuery.push(`${dataKey} <> ${addQuotes(hasQuotes, condition[key])}`);
        } else if (key == '$in') {
            andQuery.push(`${dataKey} IN (${condition[key].map(e => "'" + e + "'").join(', ')})`);
        } else if (key == '$regex') {
            andQuery.push(`${dataKey} LIKE '%${condition[key]}%'`);
        } else if (key == '$and') {
            const tempAnd = [];
            condition[key].forEach(item => {
                tempAnd.push(computeCondition(dataKey, item));
            });
            andQuery.push(`(${tempAnd.join(' AND ')})`);
        } else if (key == '$or') {
            const tempOr = [];
            condition[key].forEach(item => {
                tempOr.push(computeCondition(dataKey, item));
            });
            andQuery.push(`(${tempOr.join(' OR ')})`);
        }
    });
    return andQuery.join(' AND ');
}


function toWhereClause(filter) {
    const andQuery = [];
    Object.keys(filter).forEach(key => {
        if (key === '$and') {
            andQuery.push(`(${computeAnd(filter[key])})`);
        } else if (key === '$or') {
            andQuery.push(`(${computeOr(filter[key])})`);
        } else {
            if (typeof filter[key] === 'object') {
                andQuery.push(computeCondition(key, filter[key]));
            } else if (typeof filter[key] === 'string') {
                andQuery.push(`${key}='${filter[key]}'`)
            } else if (typeof filter[key] === 'number') {
                andQuery.push(`${key}=${filter[key]}`)
            }
        }
    });
    return andQuery.join(' AND ');
}


module.exports.toWhereClause = toWhereClause;